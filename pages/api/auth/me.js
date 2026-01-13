import connectToDB from '@/src/configs/db'
import usersModel from '@/src/Models/User'
import { verifyRefreshToken } from '@/src/utils/auth'

const handler = async (req, res) => {
    if (req.method != 'GET') return false

    try {
        await connectToDB()

        let { refreshToken } = req.cookies
        // console.log('refresh Token : ', refreshToken)

        if (!refreshToken) return res.status(401).json({ message: "you're not logged in !!" }) // unauthorized

        const tokenPayload = verifyRefreshToken(refreshToken)
        // console.log('token payload : ', tokenPayload)

        if (!tokenPayload) return res.status(422).json({ message: "token is not valid !!" })

        let user = await usersModel.findOne({ _id: tokenPayload.userId }, '-__v -password -updatedAt').populate({
            path: "cart.items.product",
        }).populate({
            path: "comments",
        }).populate({
            path: "bookings",
        }).populate({
            path: "orders",
        }).lean()

        // console.log('user : ', user)

        return res.status(201).json({ data: user })
    } catch (err) {
        return res.status(500).json({ message: 'Unknown Internal Server Err !!', err })
    }
}

export default handler