import { Schema, model } from 'mongoose'

import { INewDocument } from '../interface/news/new.data';

const NewsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    section:{
        type:Schema.Types.ObjectId,
        ref:"sections",
        required:true
    },
    subsection:{
        type:Schema.Types.ObjectId,
        required:true
    },
    tags:[{
        type:String,
        required:true
    }],
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
    },
    subsneed:{
        type:Boolean,
        default:false
    }
    
},{
    timestamps:true
});

export const NoticeModel = model<INewDocument>("News", NewsSchema);


