import dotenv from 'dotenv';
dotenv.config();
import { generateToken, verify_JWT_Token } from '../helpers/jwtHelper.js'
const maxAge = 24 * 60 * 60;


const verify = async (req, res, next) => {
    const authHeader = req.headers["Authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        if (token == null) {
            res.redirect("/login")
        }
        await verify_JWT_Token(token, process.env.secret).then((response) => {
            next()
        }).catch((err) => {
            if (err.message == "jwt expired") {
                const refreshToken = req.cookies.refreshToken
                if (refreshToken) {
                    verify_JWT_Token(refreshToken, process.env.refresh_secret).then((response) => {
                        const accessToken = generateToken(refreshToken, process.env.secret, "15m")
                        res.cookie("accessToken", accessToken, { httpOnly: true, maxage: maxAge * 1000, withCredentials: true })
                        next()
                    }).catch((err) => {
                        next(err)
                        res.redirect('/login')
                    })
                } else {
                    next(err)
                    res.redirect('/login')
                }
            }
        })
    } else {
        res.status(401).json({ msg: "you are not authenticated" })

    }

}

export default verify;