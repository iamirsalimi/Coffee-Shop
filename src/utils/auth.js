import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

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

const verifyRefreshToken = token => {
    try {
        let tokenPayload = verify(token, process.env.REFRESH_TOKEN_SECRET)
        return tokenPayload
    } catch (err) {
        return null
    }
}

const verifyAccessToken = token => {
    // try{
        let accessToken = typeof token == 'string' ? token : token.headers.authorization.split(' ')[1]
        console.log(token , accessToken)

        let tokenPayload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return tokenPayload
    // } catch(err){
    //     return err
    // }
}

const requireRole = (user, roles) => {
    // if (!roles.includes(user.role)) {
    //     throw new Error("Forbidden");
    // }

    return true
}


export { hashPassword, generateRefreshToken, generateAccessToken, verifyPassword, verifyRefreshToken, verifyAccessToken, requireRole }