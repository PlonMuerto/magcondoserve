import { ObjectId, Model  } from "mongoose";

interface ISubSection{
    title:string;
    _id:ObjectId;
}

export interface ISection {
    name:string;
    color:string;
    secundary:string;
    description:string;
    subsections:Array<ISubSection>;
    filed:boolean;
}
export interface ISectionDocument extends ISection, Document {}
export interface ISectionModel extends Model<ISectionDocument> {}