import { Response,Request } from "express"

//notices
    //interfaz
import {INew} from '../interface/news/new.data';
    //model
import { NoticeModel  } from "../models/news";

//contents
    //interfaz
import { IContent } from "../interface/contents/content.data";
    //model
import { ContentModel } from "../models/contents";

//helpers
import {deleteImage} from '../helpers/digitaloceanSpaces/configMulter'

import { ObjectId } from "mongoose";


export default {
    filedNew:async function(req:Request,res:Response){
        const id = req.body.id;
        try{
            let archived = await NoticeModel.findById(id);

            let change= await NoticeModel.updateOne({_id:id},{$set:{archived:!archived?.archived}});

            console.log();

            if(archived?.archived){
                return res.status(200).send("noticia online");
            }else{
                return res.status(200).send("noticia archivada");
            }

        }catch(err){
            console.log(err);
            return res.status(500).send({message:"error en sistema de archivado"});
        }
    },
    createNotice:async function (req:Request,res:Response){
        
        try{
            //alistamos los archivos para ser leidos
            const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };

            //separamos los archivos 
            const { files,head } = archivos; 

            //deconstruimos los datos de la noticia
            const {
                title,
                section,
                subsection,
                description,
                tags,
                subsneed,
                headDescription,
                locale,
                contents
            }=req.body;

            console.log(req.body)

            //mapeamos los contenidos para colocar el correspondiente link a los contenidos que son archivos
            const contenidosListos = contents.map((content:IContent)=>{
                
                if(content.type==="file"){

                    let index=content.file  as number;
                    
                    let direccion =files[index- 1] as any;
                    
                    let contentLinked = {
                        ...content,
                        file:direccion.key
                    } as IContent;
                    
                    return contentLinked
                }else{
                    return content;
                }
            });

            //preparamos la imagen de cabezera para ser usada
            let linkImagenHeader = head[0] as any;

            //instanciamos modelo de la noticia
            const NewNotice = new NoticeModel({
                title,
                section,
                subsection,
                description,
                tags,
                headDescription,
                locale,
                subsneed,
                imagehead:linkImagenHeader.key,
                creator:res.locals.user.id
            });

            //array de ids de los contenidos
            let contenidosIDS:Array<ObjectId> = [];

            //recorremos en un for el contenido tratado y creaos los contents y guardamos la id
            for(let content of contenidosListos){
                if(content.type === "referencia"){
                    console.log(content);
                    contenidosIDS = [...contenidosIDS,content.ID];
                }else{ 
                    let contenido = new ContentModel({
                        ...content,
                        notice:NewNotice._id,
                        creator:res.locals.user.id
                    }).save();

                    const promesa = await contenido; 

                    contenidosIDS = [...contenidosIDS,promesa._id];
                }
            }
            
            //guardamos array de ids
            NewNotice.contents=contenidosIDS;

            //creamos la noticia
            await NewNotice.save();

            return res.status(200).send("ok");
        }catch(err){
            console.log(err);
            return res.status(500).send({message:'error creando la noticia'});
        }
    },
    changeTitle:async function (req:Request,res:Response){
        const {title,id} = req.body;


        if(res.locals.user.role === "admin"){
            console.log('ok')
            try{ 

                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        title
                    }
                })
                console.log(change);
                return res.status(200).send("nuevo titulo ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });


            if(validCreator){
                try{ 
                    const change = await  NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            title
                        }
                    })
                    return res.status(200).send("nuevo titulo ya en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeSection:async function (req:Request,res:Response){
        const {section,subsection,id} = req.body;

        if(res.locals.user.role === "admin"){
            
            try{ 

                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        section,
                        subsection
                    }
                })

                return res.status(200).send("nueva seccion ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });
            

            if(validCreator){
                try{ 
                    const change = await  NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            subsection,
                            section
                        }
                    })
                    return res.status(200).send("nueva subseccion lista en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeSubsection:async function (req:Request,res:Response){
        const {subsection,id} = req.body;

        if(res.locals.user.role === "admin"){
            
            try{ 
                
                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        subsection
                    }
                })
                return res.status(200).send("nueva seccion ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });
            if(validCreator){
                try{ 
                    const change = await  NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            subsection
                        }
                    })
                    return res.status(200).send("nueva seccion lista en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeDescription:async function(req:Request,res:Response){
        const {description,id} = req.body;

        if(res.locals.user.role === "admin"){
            console.log('ok')
            try{ 

                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        description
                    }
                })
                return res.status(200).send("nueva descripcion ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });

            if(validCreator){
                try{ 
                    const change = await  NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            description
                        }
                    })
                    return res.status(200).send("nueva descripcion ya en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeTags:async function(req:Request,res:Response){
        const {tags,id} = req.body;

        if(res.locals.user.role === "admin"){
            
            try{ 

                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        tags
                    }
                })
                return res.status(200).send("nuevas tags ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });

            if(validCreator){
                try{ 
                    const change = await  NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            tags
                        }
                    })
                    return res.status(200).send("nuevas tags ya en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeImagehead:async function (req:Request,res:Response){
        if(res.locals.user.role === "admin"){
            
            const {link,id} = req.body;

            //alistamos archivo para ser leidos
            const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };
    
            //separamos los archivos 
            const { head } = archivos;

            //link imagen
            const imagehead =head[0] as any;

            deleteImage(link,(error:any)=>{
                if(error){
                    console.log(error)
                    return res.status(503).send("error en subida de imagen");
                }
            });

            try{ 

                const change = await NoticeModel.findByIdAndUpdate(id,{
                    $set:{
                        imagehead:imagehead.key
                    }
                })
                return res.status(200).send("nuevas tags ya en linea")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{
            const {link,id} = req.body;
            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:id                
            });

            //alistamos archivo para ser leidos
            const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };
    
            //separamos los archivos 
            const { head } = archivos; 

            //link imagen
            const imagehead =head[0] as any;
            console.log(imagehead.key)

            if(validCreator){
            
                deleteImage(link,(error:any)=>{
                    if(error){
                        console.log(error)
                        return res.status(503).send("error en subida de imagen");
                    }
                });

                try{ 

                    const change = await NoticeModel.findByIdAndUpdate(id,{
                        $set:{
                            imagehead:imagehead.key
                        }
                    })
                    return res.status(200).send("nuevas tags ya en linea")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeDescImage:async function (req:Request,res:Response){
        if(res.locals.user.role === "admin"){
            
            try{     
                let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{headDescription:req.body.description}});
                return res.status(200).send("actualizado el requerimiento para visualizar")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:req.body.id                
            });
            if(validCreator){
                try{ 
                    let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{headDescription:req.body}});
                    return res.status(200).send("actualizado el requerimiento para visualizar")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    changeLocale: async function (req:Request,res:Response){
        if(res.locals.user.role === "admin"){
            
            try{     
                let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{locale:req.body.locale}});
                return res.status(200).send("actualizado el requerimiento para visualizar")
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:req.body.id                
            });
            if(validCreator){
                try{ 
                    let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{locale:req.body.locale}});
                    return res.status(200).send("actualizado el requerimiento para visualizar")
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
    },
    toggleSubsneed: async function (req:Request,res:Response){
        if(res.locals.user.role === "admin"){
            
            try{ 
                let notice = await NoticeModel.findById(req.body.id,{subsneed:1});
                let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{subsneed:!notice?.subsneed}});
                return res.status(200).send("actualizado el requerimiento para visualizar");
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{

            
            const validCreator = await NoticeModel.findOne({
                creator:res.locals.user.id,
                _id:req.body.id                
            });
            if(validCreator){
                try{ 
                    let notice = await NoticeModel.findById(req.body.id,{subsneed:1});
                    let change = await NoticeModel.updateOne({_id:req.body.id},{$set:{subsneed:!notice?.subsneed}});
                    return res.status(200).send("actualizado el requerimiento para visualizar");
                }catch(err){
                    console.log(err)
                    return res.status(500).send("error en cambios por medio de un administrador")
                }
            }else{
                return res.status(401).send("no estas autorizado");
            }
        }
        
    }
}