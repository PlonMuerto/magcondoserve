import { Schema, model } from 'mongoose'

import { IContentDocument } from '../interface/contents/content.data';

const ContentType = ['texto','parrafo','link','file','lista','lista ordenada','referencia','citar'];

const ContentSchema = new Schema({
    type:{
        type:String,
        enum:ContentType,
        required:true
    },
    description:{
        type:String
    },
    file:{
        type:String,
    },
    pretext:{
        type:String
    },
    link:{
        type:String
    },
    text:{
        type:String
    },
    list:[{
        type:String
    }],
    content:{
        type:String
    },
    paragraph:{
        type:String
    },
    subtitle:{
        type:String
    },
    by:{
        type:String
    },
    ID:{
        type:Schema.Types.ObjectId,
        ref:'contents'
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    notice:{
        type:Schema.Types.ObjectId,
        ref:'notice'
    }
},{
    timestamps:true
});

export const ContentModel = model<IContentDocument>("Content", ContentSchema);

