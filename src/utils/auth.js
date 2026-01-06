import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

const hashPassword = async password => {
    const hashedPassword = await hash(password, 12)
    return hashedPassword
}

const verifyPassword = async (password, hashedPassword) => {
    let isEqual = await compare(password, hashedPassword)
    return isEqual
}

const generateAccessToken = data => {
    const refreshToken = sign({ ...data }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    })
    return refreshToken
}

const generateRefreshToken = data => {
    const refreshToken = sign({ ...data }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7D'
    })
    return refreshToken
}

const verifyAccessToken = (req, res) => {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) return null;

    // const token = authHeader.split(" ")[1];

    // try {
    //     return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // } catch {
    //     return null;
    // }

    return true
}

const requireRole = (user , roles) => {
    // if (!roles.includes(user.role)) {
    //     throw new Error("Forbidden");
    // }
    
    return true
}


export { hashPassword, generateRefreshToken, generateAccessToken, verifyPassword, verifyAccessToken , requireRole}