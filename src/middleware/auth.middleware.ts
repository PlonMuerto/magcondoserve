import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";

const Secret = process.env.KEY as string;

export default async function auth_user(req:Request,res:Response,next:NextFunction){
    if(!req.headers.authorization) return res.status(401).send('you are not registered');


    let token = req.headers.authorization.split(' ')[1];
    if(token === null) return res.status(403).send('no estas autorizado');
    try{
        let valid = await jwt.verify(token,Secret);
        if(!valid){ 
            return res.status(403).send('seccion invalida');
        }else{  
            res.locals.user=valid;
            next();
        }
    }catch(err){
        console.log(err);
        //malformed jwt
        if(err.message === 'jwt malformed') return res.status(503).send('your session is corrupted, enter again');
        //jwt expired
        if(err.message === 'jwt expired') return res.status(503).send('your session expired, enter again');
        //other error
        if(err) return res.status(503).send(err.message);
    }

}