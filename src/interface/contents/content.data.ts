import { ObjectId, Model  } from "mongoose";

export interface IContent {
    type:string;
    description:string;
    file:string | number;
    pretext:string;
    link:string;
    text:string;
    list:Array<string>;
    content:string;
    paragraph:string;
    subtitle:string;
    creator:ObjectId;
    notice:ObjectId;
    by:string;
    ID:ObjectId;
}

export interface IContentDocument extends IContent, Document {}

export interface IContentModel extends Model<IContentDocument> {}