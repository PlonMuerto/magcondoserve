import { IResolvers } from 'apollo-server-express'

//models
import { SectionModel as Sections } from '../../models/sections'

//interfaz 


export const Rsections:IResolvers = {
    Query:{
        async getSections(parent,args,context){
            try{
                let { name } = args;
                
                let busqueda = Sections.find(); 
                
                if(name){
                    busqueda.where('name').regex('.*' + name + '.*');
                }

                let ok = await busqueda;

                console.log(ok[0]);

                return ok;
            }catch(err){
                console.log(err);
                return err;
            }
        }
    }
}