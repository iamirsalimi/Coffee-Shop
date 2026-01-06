import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { generateAccessToken, generateRefreshToken } from '@/src/utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get refresh token from cookies (secure way)
    const cookies = cookie.parse(req.headers.cookie || '');
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const userId = decoded.userId;
        const userRole = decoded.role;

        // Generate new access token
        const newAccessToken = generateAccessToken({ userId, role: userRole });
        const newRefreshToken = generateRefreshToken({ userId, role: userRole });

        return res
            .setHeader('Set-Cookie', cookie.serialize('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            }))
            .status(200)
            .json({ message: 'Tokens refreshed', token: newAccessToken });
    } catch (error) {
        // Invalid/expired refresh → clear cookies and force logout
        return res
            .setHeader('Set-Cookie', cookie.serialize('refreshToken', '', { maxAge: -1, path: '/' }))
            .status(403)
            .json({ message: 'Invalid refresh token' });
    }
}