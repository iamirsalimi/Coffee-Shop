import connectToDB from '@/src/configs/db'
import { serialize } from 'cookie'

const handler = async (req, res) => {
    if (req.method != 'GET') return false

    try {
        await connectToDB()

        return res.setHeader('Set-Cookie', serialize('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: 0
        }))
    } catch (err) {
        return res.status(500).json('Unknown Internal Server Err !!')
    }
}

export default handler