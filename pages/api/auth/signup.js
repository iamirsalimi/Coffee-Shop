import connectToDB from '@/src/configs/db'
import usersModel from '@/src/Models/User'
import { hashPassword, generateRefreshToken, generateAccessToken } from '@/src/utils/auth'
import { serialize } from 'cookie'


const handler = async (req, res) => {
    if (req.method != 'POST') return false

    try {
        await connectToDB()


        let { firstname, lastname, username, email, password } = req.body

        if (!firstname.trim() || !lastname.trim() || !username.trim() || !email.trim() || !password.trim()) {
            return res.status(422).json({ message: 'Data is not Valid !!' })
        }

        let isUserExist = await usersModel.findOne({ $or: [{ username }, { email }] })

        if (isUserExist) {
            return res.status(422).json({ message: 'this username or email is already exist !!' })
        }

        const hashedPassword = await hashPassword(password)

        const users = await usersModel.find({})

        const user = await usersModel.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            role: users.length === 0 ? 'ADMIN' : 'USER'
        })

        const accessToken = generateAccessToken({
            userId: user._id,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            userId: user._id
        });

        return res.setHeader('Set-Cookie', serialize('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 day
        })).status(201).json({
            accessToken,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role
            }
        })
    } catch (err) {
        // return res.status(500).json('Unknown Internal Server Err !!')
        return res.status(500).json({message : err})
    }
}

export default handler