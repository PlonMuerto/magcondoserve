import { ObjectId, Model  } from "mongoose";

export interface INew {
    _id:ObjectId;
    title:string;
    section:ObjectId;
    subsection:ObjectId;
    tags:Array<string>;
    description:string;
    imagehead:string;
    contents:Array<ObjectId>;
    creator:ObjectId;
    subsneed:boolean;
    create:Date;   
    archived:boolean;
}

export interface INewDocument extends INew, Document {}

export interface INewModel extends Model<INewDocument> {}