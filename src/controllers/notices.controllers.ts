import {Response,Request} from 'express';

//models
import {NoticeModel as Notices} from '../models/news';

export default{
    async getNotice(req:Request,res:Response){
        const id = req.params.id;
        
        let notice = await Notices.findById(id,{
            "title":1,
            "description":1,
            "imagehead":1,
            "subsection":1,
            "subsneed":1,
            "tags":1,
            "_id":1,
            "createdAt":1
        }).populate("contents").populate("creator","name").populate("section");
        console.log(notice);
        
        if(notice){
            return res.status(200).send(notice);
        }else{
            return res.status(401).send(false);
        }
        
    }
}