import { IResolvers } from 'apollo-server-express'

//models
import { SectionModel as Sections } from '../../models/sections'

//interfaz 


export const Rsections:IResolvers = {
    Query:{
        async getSections(parent,args,context){
            try{
                let { name, filed } = args;
                
                let busqueda = Sections.find();;
                
                
                if(filed){
                    busqueda.where("filed").equals(false); 
                }
                
                if(name){
    
                    busqueda.where('name').regex('.*' + name + '.*');
                }
    
                let ok = await busqueda;
    
                return ok;
            }catch(err:any){
                console.log(err);
                return err;
            }
        }
    }
}