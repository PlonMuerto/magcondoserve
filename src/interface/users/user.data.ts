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
    locked:boolean;
    emailConfirm:boolean;
    phoneConfirm:boolean;
    resetToken:string;
}
export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}