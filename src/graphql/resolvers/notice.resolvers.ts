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
            try{
                
                
                let title:paramsFilter = args.title  ? args.title : false;
                let tags:arrayFilter = (args.tags && args.tags.length)  ? args.tags : false;
                let section: paramsFilter = args.section  ? args.section : false;
                let subsection: paramsFilter = args.subsection  ? args.subsection : false;
                

                let page = (args.page  || 1)-1;
                
                let perPages = args.pages || 12;

                let calcPage = (page*perPages);

            
                let QueryNotices = Notices.find({}, null, {sort: {"createdAt": -1}});
                
                let lengthNotices = Notices.countDocuments();    
                

                //filter created for mongoose
                if(title){
                    QueryNotices.where('name').regex('.*' + title + '.*');
                    lengthNotices.where('name').regex('.*' + title + '.*');
                }
        
                if(tags){
                    QueryNotices.where('tags').all(tags);
                    lengthNotices.where('tags').all(tags);
                }

                if(section){
                    QueryNotices.where('section').all([section]);
                    lengthNotices.where('section').all([section]);
                }

                if(subsection){
                    QueryNotices.where('subsection').all([subsection]);
                    lengthNotices.where('subsection').all([subsection]);
                }


                let length = await lengthNotices;                

                let notices = QueryNotices.skip(calcPage).limit(perPages).populate("section").populate("creator");//.populate("");

                let pages = length ? Math.ceil(length/perPages) : 0;

                console.log(args);

                return {
                    page,
                    pages,
                    notices
                }
            }catch(err){
                console.log(err);
            }
        }   
    }
}