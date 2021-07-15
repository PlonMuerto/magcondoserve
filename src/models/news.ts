import { Schema, model } from 'mongoose'

import { INewDocument } from '../interface/news/new.data';

const NewsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    contents:[{
        type:Schema.Types.ObjectId,
        ref:'contents'
    }],
    imagehead:{
        type:String,
        required:true
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

export const NoticeModel = model<INewDocument>("News", NewsSchema);

