import {Request,Response} from 'express'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserModel as User } from '../models/users';

const SECRET = process.env.KEY as string,
      ENCRIPT = process.env.ENCRIPT as string;


const expiresIn  = 24*60*60;

export default {
    login:async function (req:Request,res:Response){
        let dataAuth = req.body;

        let send;

        try{
            let user = await User.findOne({ email:dataAuth.email });

            if(user && !user.locked && (user.role === "admin" || user.role === "creator")) {
                let compare = await bcrypt.compare(dataAuth.password,user.password);
                 
                if(compare){
                    send = await jwt.sign({
                        id:user._id,
                        role:user.role
                    },SECRET,{expiresIn});

                    console.log(send);
                    
                    return res.status(200).send({token:send});
                }
                else{
                    return res.status(403).send('no tienes acceso');
                }
            }else{
                return res.status(403).send('no tienes Acceso');
            }
        }catch(err:any){ 
            console.log(err);
                
            //errores del nombre
            if (err && err.message) return res.status(400).send("credenciales equivocadas");

            //errores no reconocidos
            if (err) return res.status(500).send('server problems in ingress');
        };
    
       
    }
}