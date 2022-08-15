import { Schema, model } from 'mongoose'

import { INewDocument } from '../interface/news/new.data';


const localeZones = ['en','es'];

const NewsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    section:{
        type:Schema.Types.ObjectId,
        ref:"Section",
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
        ref:'Content'
    }],
    imagehead:{
        type:String,
        required:true
    },
    headDescription:{
        type:String,
        required:true
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    description:{
        type:String,
        required:true
    },
    subsneed:{
        type:Boolean,
        default:false
    },
    archived:{
        type:Boolean,
        default:false
    },
    locale:{
        type:String,
        enum:localeZones,
        required:true,
        default:"en"
    }
    
},{
    timestamps:true
});

export const NoticeModel = model<INewDocument>("New", NewsSchema);


