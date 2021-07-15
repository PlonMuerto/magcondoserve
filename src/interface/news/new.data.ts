import { ObjectId, Model  } from "mongoose";

export interface INew {
    title:string;
    imagehead:string;
    contents:Array<ObjectId>;
    creator:ObjectId;
    description:string;
}

export interface INewDocument extends INew, Document {}

export interface INewModel extends Model<INewDocument> {}