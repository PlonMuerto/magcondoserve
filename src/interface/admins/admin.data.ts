import { ObjectId, Model } from "mongoose";

export interface IAdmin {
    nick:string;
    user:ObjectId;
}

export interface IAdminDocument extends IAdmin, Document {}

export interface IAdminModel extends Model<IAdminDocument> {}