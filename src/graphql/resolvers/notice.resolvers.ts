import { IResolvers } from 'apollo-server-express'

//import model
import { NoticeModel as Notices } from '../../models/news'

//interfaz params
import { NoticesParams } from '../../interface/news/new.params'

//types 
type paramsFilter = string | boolean;
type arrayFilter = Array<string> | boolean;

export const Rnotices:IResolvers = {
    Query:{
        hellon() {
            return "mundo"
        },
        async getNotices(root:void,args:NoticesParams,context:any){

            ///params filters
            let title:paramsFilter = args.title  ? args.title : false;
            let tags:arrayFilter = args.tags  ? args.tags : false;
            let section: paramsFilter = args.section  ? args.section : false;

            let page = (args.page  || 1)-1;
            
            let perPages = args.pages || 12;

            let calcPage = (page*perPages);

            let favoritesNotices = Notices.find();

            //filter created for mongoose
            if(title){
                favoritesNotices.where('name').regex('.*' + title + '.*');
            }
    
            if(tags){
                favoritesNotices.where('tags').all(tags);
            }

            if(section){
                favoritesNotices.where('section').all([section]);
            }

            let lengthComp = await favoritesNotices;
            

            let notices = favoritesNotices.skip(calcPage).limit(perPages);

            let pages = Math.ceil(lengthComp.length/perPages);

            return {
                page,
                pages,
                notices
            }
        }   
    }
}