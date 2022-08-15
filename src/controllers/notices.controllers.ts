import {Response,Request} from 'express';

//models
import {NoticeModel as Notices} from '../models/news';

export default{
    async getNotice(req:Request,res:Response){
        const id = req.params.id;
        
        let notice = await Notices.findById(id).populate("contents").populate("creator","name").populate("section");
        
        if(notice){
            return res.status(200).send(notice);
        }else{
            return res.status(401).send(false);
        }
        
    }
}