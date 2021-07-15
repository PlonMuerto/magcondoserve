import { Schema, model } from 'mongoose'

import { IContentDocument } from '../interface/contents/content.data';

const ContentType = ['image','video','text'];

const ContentSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:ContentType,
        required:true
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

