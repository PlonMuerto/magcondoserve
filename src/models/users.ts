import { Schema, model } from 'mongoose'

import { IUserDocument } from '../interface/users/user.data';

const roleType = ['user','creator','admin'];

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxLength:[50,'max length of the name is fifty chars'],
        minLength:[8,'min length of name is eigth chars']
    },
    email:{
        type:String,
        minlength:[10,"email invalid"],
        match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/,
        unique:true,
        required:'email required'
    },
    phone:{
        type:Number,
        required:true,
        minlength:[10,'number fake'],
        maxlength:[10,'number fake']
    },
    password:{
        type:String,
        required:'password required'
    },
    role:{
        type:String,
        enum:roleType,
        required:true
    },
    favorites:[{
        type:Schema.Types.ObjectId,
        ref:'notice'
    }],
    country:{
        type:String,
        required:'country is required'
    },
    emailConfirm:{
        type:Boolean,
        default:false
    },
    phoneConfirm:{
        type:Boolean,
        default:false
    },
    subscribed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

export const UserModel = model<IUserDocument>("User", UserSchema);

