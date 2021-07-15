const jwt = require ('jsonwebtoken');

const secret = process.env.KEY;

const expires = 24*60*60;


export const createToken = async function (dataToken:any){
    return await jwt.sign(dataToken,secret,{expiresIn:expires});
}
export const verifyToken = async function (dataVerify:string){
    try{
        return await jwt.verify(dataVerify,secret);
    }catch(err){
        console.log('errorr en helper/librerias/jwt/verifytoken');
        console.log(err);
        return false;
    }
}
