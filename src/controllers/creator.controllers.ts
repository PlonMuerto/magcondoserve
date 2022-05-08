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
import { ObjectId } from "mongoose";


export default {
    loginCreator:async function (){
        console.log("santiago");
    },
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
        console.log("creando papi");
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
                contents
            }=req.body;

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
    }
}