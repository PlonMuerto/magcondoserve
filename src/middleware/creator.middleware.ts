import { Request,Response,NextFunction } from "express";

import {UserModel as User} from '../models/users';

export default async function auth_creator(req:Request,res:Response,next:NextFunction){
    if(res.locals.user.role === 'creator'){
        try{
            let user = await User.findById(res.locals.user.id);
             if(user?.role === res.locals.user.role){
                res.locals.admin = true;
                next();
            }
            else{
                res.status(403).send('no estas autorizado');
            }
        }catch(err){
            res.status(500).send('error del server');
        }
             
    }
    else{
        res.status(403).send('error del server');
    }

}