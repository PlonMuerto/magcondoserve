import { ObjectId, Model  } from "mongoose";

export interface IUser {
    name:string;
    email:string;
    phone:number;
    password:string;
    role:string;
    favorites:Array<ObjectId>;
    country:string;
    subscribed:boolean;
}
export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}