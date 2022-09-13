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
import { IContentModel } from "../interface/contents/content.data";

//helpers
import {deleteImage} from '../helpers/digitaloceanSpaces/configMulter'

import { ObjectId } from "mongoose";
import noticesControllers from "./notices.controllers";


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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
            
        }else if(res.locals.user.role==="creator"){

            
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
        
    },
    changeContents:async function (req:Request,res:Response){
        if(res.locals.user.role === "admin" || (res.locals.user.role==="creator" && res.locals.user.id===req.body.content?.creator)){
            try{
                if(req.body.type==="text"){
                    let content = await ContentModel.updateOne({_id:req.body.id},{$set:{text:req.body.text}})
                    return res.status(200).send("cambio hecho correctamente");
                }else if(req.body.type==="file"){
                    //alistamos los archivos para ser leidos
                    const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };

                    //separamos los archivos 
                    const { image } = archivos;
                    
                    if(!image){
                        let content = await ContentModel.updateOne({_id:req.body.id},{$set:{description:req.body.description}})    
                        return res.status(200).send("actualizado el contenido");
                    }
                            
                    //preparamos la imagen para ser usada
                    let linkImagen = image[0] as any;

                    deleteImage(req.body.link,(error:any)=>{
                        if(error){
                            console.log(error)
                            return res.status(503).send("error en subida de imagen");
                        }
                    });
                    
                    let content = await ContentModel.updateOne({_id:req.body.id},{$set:{description:req.body.description,file:linkImagen.key}})

                    return res.status(200).send("cambio hecho correctamente");
                }else if(req.body.type==="citar"){
                    let content = await ContentModel.updateOne({_id:req.body.id},{$set:{by:req.body.by,text:req.body.text,link:req.body.link}});
                    return res.status(200).send("cambio hecho correctamente");
                }else if(req.body.type==="link"){
                    let content = await ContentModel.updateOne({_id:req.body.id},{$set:{pretext:req.body.pretext,text:req.body.text,link:req.body.link}});
                    return res.status(200).send("cambio hecho correctamente");
                }else if(req.body.type==="referencia"){
                    let content = await ContentModel.updateOne({_id:req.body.id},{$set:{ID:req.body.ID}});
                    return res.status(200).send("cambio hecho correctamente");
                }else{
                    return res.status(402).send("fallo cambiando el contenido")
                }
            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else{
            return res.status(500).send("error en el server: error en cambio de contenido. informar a mantenimiento")
        }
    },
    deleteContents:async function(req:Request,res:Response){
        if(res.locals.user.role === "admin" || (res.locals.user.role==="creator" && res.locals.user.id===req.body.content.creator)){
            try{ 
                console.log(req.body)
                if(req.body.type==="file"){
                   deleteImage(req.body.file,(error:any)=>{
                        if(error){
                            console.log(error)
                            return res.status(503).send("error en subida de imagen");
                        }
                    });
                    
                    let updateNotice = await NoticeModel.findByIdAndUpdate(req.body.notice,{$pull:{contents:{$eq:req.body._id}}});
                    let deleteContent = await ContentModel.findByIdAndDelete(req.body._id);
                    return res.status(200).send("contenido eliminado con exito");
                }else{
                    let updateNotice = await NoticeModel.findByIdAndUpdate(req.body.notice,{$pull:{contents:{$eq:req.body._id}}});
                    let deleteContent = await ContentModel.findByIdAndDelete(req.body._id);
                    return res.status(200).send("contenido eliminado con exito");
                } 

            }catch(err){
                console.log(err)
                return res.status(500).send("error en cambios por medio de un administrador")
            }
            
        }else {
            return res.status(401).send("no estas autorizado")
        }
        
    },
    addContent:async function(req:Request,res:Response){
        if(res.locals.user.role === "admin" || (res.locals.user.role==="creator" && res.locals.user.id===req.body.content?.creator)){
            if(req.body.type==="file"){

                console.log(req.body)
                const {index,position} = req.body as any;
                try{
                    //alistamos archivo para ser leidos
                    const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };
            
                    //separamos los archivos 
                    const { image } = archivos;
        
                    //link imagen
                    const imageobject =image[0] as any;
        
                    //create content
                    const content = new ContentModel({
                        type:req.body.type,
                        file:imageobject.key,
                        notice:req.body.notice,
                        creator:res.locals.user.id,
                        description:req.body.description
                    });

                    await content.save();

                    //update notice
                    let notice = await NoticeModel.findById(req.body.notice,{contents:1});

                    let contents =notice?.contents as any;
                     
                    contents.splice(index+Number(position),0,content._id)

                    let update = await NoticeModel.findByIdAndUpdate(req.body.notice,{$set:{contents}});
                    
                    return res.status(200).send("agregado el nuevo contenido")
            
                }catch(err){
                    console.log(err);
                    return res.status(500).send("error en el servidor agregando contenido")
                }
            
            }else {
                console.log(req.body)
                const {index,position} = req.body as any;
                
                try{
                    //create content
                    let content = {} as any;

                    switch(req.body.type){
                        case "texto":
                            content = new ContentModel({
                                text:req.body.text,
                                type:req.body.type,
                                notice:req.body.notice,
                                creator:res.locals.user.id,
                            })
                        case "citar":
                            content = new ContentModel({
                                by:req.body.by,
                                text:req.body.text,
                                type:req.body.type,
                                link:req.body.link,
                                notice:req.body.notice,
                                creator:res.locals.user.id,
                            });
                        break;
                        case "link":
                            content =  new ContentModel({
                                pretext:req.body.pretext,
                                text:req.body.text,
                                type:req.body.type,
                                link:req.body.link,
                                notice:req.body.notice,
                                creator:res.locals.user.id,
                            })
                        break;
                        case "referencia":
                            content =  new ContentModel({
                                ID:req.body.ID,
                                type:req.body.type,
                                notice:req.body.notice,
                                creator:res.locals.user.id,
                            });                        
                        break;

                        default:
                            return res.status(305).send("tipo de contenido erroneo")
                    } 
                    
                    await content.save();

                    //update notice
                    let notice = await NoticeModel.findById(req.body.notice,{contents:1});

                    let contents =notice?.contents as any;

                    contents.splice(position ? index+1 : index,0,content._id)

                    let update = await NoticeModel.findByIdAndUpdate(req.body.notice,{$set:{contents}});
                    
                    return res.status(200).send("agregado el nuevo contenido")
                }catch(err){
                    console.log(err);
                    return res.status(500).send("error en el servidor agregando contenido")
                }
            }

        }else {
            return res.status(401).send("no estas autorizado")
        }
    },
    /*
    en desarrollo
    deleteNotice:async function(req:Request,res:Response){
        if(res.locals.user.role === "admin" || (res.locals.user.role==="creator" && res.locals.user.id===req.body.content.creator)){
            const {id} = req.body;
            const notice = NoticeModel.findById(id,{contents:1})
        }else{
            return res.status(401).send("no estas autorizado")
        }

    }*/
}