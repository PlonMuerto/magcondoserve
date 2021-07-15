import { ObjectId, Model  } from "mongoose";

export interface IContent {
    type:string;
    content:string;
    creator:ObjectId;
    new:ObjectId;
}

export interface IContentDocument extends IContent, Document {}

export interface IContentModel extends Model<IContentDocument> {}