import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

const hashPassword = async password => {
    const hashedPassword = await hash(password , 12)
    return hashedPassword
}

const verifyPassword = async (password , hashedPassword)  => {
    let isEqual = await compare(password , hashedPassword)
    return isEqual
}

const generateAccessToken = data => {
    const refreshToken = sign({...data} , process.env.ACCESS_TOKEN_SECRET , {
        expiresIn : '15m'
    })
    return refreshToken
}

const generateRefreshToken = data => {
    const refreshToken = sign({...data} , process.env.REFRESH_TOKEN_SECRET , {
        expiresIn : '7D'
    })
    return refreshToken
}

export {hashPassword , generateRefreshToken , generateAccessToken , verifyPassword}