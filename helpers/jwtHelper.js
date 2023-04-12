import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const generateToken = (payload,secret,expiryTime)=>{
    return jwt.sign({...payload},secret,{expiresIn:`${expiryTime}`})
}

const verify_JWT_Token = (token,secret)=>{
    return new Promise ((resolve,reject)=>{
        jwt.verify(token,secret,async(err,payload)=>{
            if(err){
                reject(err)
            }else{
                resolve(payload)
            }
        })
    })
}
export {generateToken,verify_JWT_Token}