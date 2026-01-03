import connectToDB from '@/src/configs/db'
import usersModel from '@/src/Models/User'

const handler = async (req, res) => {
    if (req.method != 'GET') return false

    try {
        await connectToDB()

        let { refreshToken } = req.cookies

        if (!refreshToken) return res.status(401).json({ message: "you're not logged in !!" }) // unauthorized

        const tokenPayload = await verifyToken(refreshToken)

        if (!tokenPayload) return res.status(422).json({ message: "token is not valid !!" })

        let user = await usersModel.findOne({ email : tokenPayload.email })

        return res.status(201).json({ data: user })
    } catch (err) {
        return res.status(500).json('Unknown Internal Server Err !!')
    }
}



export default handler