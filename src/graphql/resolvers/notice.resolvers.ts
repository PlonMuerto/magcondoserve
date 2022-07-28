import { IResolvers } from 'apollo-server-express'

//import model
import { NoticeModel as Notices } from '../../models/news'

//interfaz params
import { NoticesParams } from '../../interface/news/new.params'

//types 
type paramsFilter = string | boolean;

export const Rnotices:IResolvers = {
    Query:{
        hellon() {
            console.log("daniel se pudo");
            return "mundo"
        },
        async getNotices(root:void,args:NoticesParams,context:any){
            ///params filters
            try{

                let title:paramsFilter = args.title  ? args.title : false;
                let tag:paramsFilter = args.tag ? args.tag : false;
                let section: paramsFilter = args.section  ? args.section : false;
                let subsection: paramsFilter = args.subsection  ? args.subsection : false;
                

                let page = args.page;
                
                let perPages = args.pages || 12;

                let calcPage = (page*perPages);

            
                let QueryNotices = Notices.find({}, null, {sort: {"createdAt": -1}});
                
                let lengthNotices = Notices.countDocuments();    
                

                //filter created for mongoose
                if(title){
                    QueryNotices.where('title').regex('.*' + title + '.*');
                    lengthNotices.where('title').regex('.*' + title + '.*');
                }
        
                if(tag){
                    
                    QueryNotices.where('tags').all([tag]);
                    lengthNotices.where('tags').all([tag]);
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