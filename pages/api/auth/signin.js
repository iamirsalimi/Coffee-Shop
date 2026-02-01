import connectToDB from '@/src/configs/db'
import usersModel from '@/src/Models/User'
import { verifyPassword , generateRefreshToken , generateAccessToken } from '@/src/utils/auth'
import { serialize } from 'cookie'

const handler = async (req, res) => {
    if (req.method != 'POST') return false

    try {
        await connectToDB()

        let { identifier, password } = req.body

        if (!identifier.trim() || !password.trim()) {
            return res.status(422).json({ message: 'Data is inValid !!' })
        }

        let user = await usersModel.findOne({ $or: [{ username: identifier }, { email: identifier }] })
        if (!user) {
            return res.status(422).json({ message: 'username or password is incorrect !!' })
        }
        const arePasswordsEqual = await verifyPassword(password, user?.password)
        
        if (!arePasswordsEqual) {
            return res.status(422).json({ message: 'username or password is incorrect !!' })
        }
        
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
            data: user
        })
    } catch (err) {
        return res.status(500).json({message : err , data : 'unknown err'})
    }
}

export default handler