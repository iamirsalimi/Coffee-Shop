import connectToDB from '@/src/configs/db'
import { serialize } from 'cookie'

const handler = async (req, res) => {
    if (req.method != 'GET') return false

    try {
        await connectToDB()
        
        return res.setHeader('Set-Cookie', serialize('refreshToken', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0 
        })).json({message : 'user logged out successfully :))'})
    } catch (err) {
        return res.status(500).json({ message: 'Unknown Internal Server Err !!', err })
    }
}

export default handler