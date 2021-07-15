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
        console.log(req.body)
        try{
            let user = await User.findOne({ email:dataAuth.email });
            if(user) { 
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
                    console.log(403);
                    return res.status(403).send('no tienes acceso');
                }
            }else{
                console.log(403);
                return res.status(403).send('no tienes Acceso');
            }
        }catch(err){ 
            console.log(err);
                
            //errores del nombre
            if (err && err.message) return res.status(400).send("credenciales equivocadas");

            //errores no reconocidos
            if (err) return res.status(500).send('server problems in ingress');
        };
    
       
    },
    register:async function (req:Request,res:Response){
        try{
            let token;
            console.log(req.body.data);
            console.log('demonios wump');
            let {names,country,email,phone,password} = req.body.data;
            
    
                let newUser =  {
                    names,
                    country,
                    email,
                    password:await bcrypt.hash(password,ENCRIPT),
                    phone,
                    favorites:[],
                };
            
                let user = await new User(newUser).save();
                console.log(user);
                token = await jwt.sign({
                            id:user._id,
                            role:user.role,
                            subscribed:user.subscribed
                        },SECRET,{expiresIn});
                        return res.status(200).send({token:token});
                        
            }catch(err){
                console.log(err);
                if(err.errors){
                    let errors:any;
                    console.log(JSON.stringify(err.errors));
                    for (let e in err.errors){
                        console.log(e);
    
                        errors =+ errors + err?.errors[e]?.message + '--' as string;
                    }
                    console.log(errors);
                    
                    return res.json({errors});
                }
                
                //error email ya usado (Nice)
                if (err && err.code === 11000) {
                    let errors = {email:'Email ya esta registrado'}
                    return res.json({errors});
                }
                    
                //errores del nombre
                if (err && err.message) return res.status(400).send(JSON.stringify(err.message));
    
                //errores no reconocidos
                if (err) return res.status(500).send('server problems in ingress');
            }
    }
}