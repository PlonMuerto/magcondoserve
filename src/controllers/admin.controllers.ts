import {Request,Response} from 'express';

//models mongoose
import { UserModel as Users } from "../models/users"
import { SectionModel as Sections } from '../models/sections';

//interfaz

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.KEY as string,
      ENCRIPT = process.env.ENCRIPT as string;

const expiresIn  = 1*60*60;

export default {
    createSection:async function (req:Request,res:Response){
        try{
            const {name,color,secundary,description} = req.body;

            console.log(req.body);

            const sectionmodel = {
                name,color,secundary,description
            };

            let newSection = await new Sections(sectionmodel).save();

            return res.status(200).send(newSection);
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
        
    },
    filedSection:async function(req:Request,res:Response){

        try{
            const { id } = req.body;

            let archived = await Sections.findById(id);

            let change = await Sections.updateOne({_id:id},{$set:{filed:!archived?.filed}});
            
            if(archived?.filed){
                return res.status(200).send("seccion online");
            }else{
                return res.status(200).send("seccion archivada");
            }
        }catch(err){
            console.log(err);
            return res.status(500).send("error al archivar seccion");
        }
    },
    addSubSection:async function(req:Request,res:Response){
        try{
            const {title,id} = req.body;

            const sectionmodel = {
                title
            };

            let update = await  Sections.findByIdAndUpdate(id,{$push:{subsection:sectionmodel}});

            return res.status(200).send(update);
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    },
    pullSubsection:async function (req:Request,res:Response){
        try{   
            const {id,idSub} = req.body;

            let updateSection = await Sections.findByIdAndUpdate(id,{$pull:{subsection:{_id:idSub}}});
            
            return res.status(200).send(updateSection);
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    },
    updateSection:async function(req:Request,res:Response){
        
        try{
            
            let update = await Sections.findByIdAndUpdate(req.body.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                color:req.body.color,
                secundary:req.body.secundary
            }});

            res.status(200).send('ok');
        }catch(err){
            return res.status(500).send(err);
        }
    },
    deleteUser:async function (req:Request,res:Response){
        try{
            let { id } = req.body;
            let usuarioComp = await Users.findById(id);
            if(usuarioComp){
                let deleter = await Users.findByIdAndRemove(id); 
                return res.status(200).send(true);
            }else{
                console.log('no existe este usuario');
                return res.status(200).send(false);
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    },
    upgradeRole:async function (req:Request,res:Response){
        try{
            const { id } = req.body;
            let usuarioComp = await Users.findById(id);
            if(usuarioComp){
                let role;
                if(usuarioComp.role === "user"){
                    role = "creator";
                }
                if(usuarioComp.role === "creator" || usuarioComp.role === "admin"){
                    role = "user";
                }
                console.log(role)
                let userUpdate = await Users.findByIdAndUpdate(id,{
                    $set:{
                        role
                    }
                });
                return res.status(200).send(true);
                
            }else{
                return res.status(205).send(false);
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    },
    deleteNotice:async function (req:Request,res:Response){
        
    },
    subscribedUser:async function (req:Request,res:Response) {
        
        try{
            const { id } = req.body;
            let usuarioComp = await Users.findById(id,{subscribed:1});
            if(usuarioComp){
                
                let userUpdate = await Users.findByIdAndUpdate(id,{
                    $set:{
                        subscribed:!usuarioComp.subscribed
                    }
                });
                return res.status(200).send(true);
                
            }else{
                return res.status(205).send(false);
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    },
    lockedUser: async function (req:Request,res:Response){
        
        try{
            const { id } = req.body;
            let usuarioComp = await Users.findById(id,{locked:1});
            
            if(usuarioComp){
                
                let userUpdate = await Users.findByIdAndUpdate(id,{
                    $set:{
                        locked:!usuarioComp.locked
                    }
                });
                return res.status(200).send(true);
                
            }else{
                return res.status(205).send(false);
            }
        }catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    }
    
}