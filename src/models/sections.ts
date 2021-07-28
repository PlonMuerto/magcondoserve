import { Schema, model } from 'mongoose'

import { ISectionDocument } from '../interface/section/section.data';



const SectionSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true
    },
    secundary:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    subsection:[{
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
});

export const SectionModel = model<ISectionDocument>("Section", SectionSchema);

