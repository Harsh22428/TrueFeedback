import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



export interface User extends Document{
    username: string;
    password: string;
    email: string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages: Message[];
    createdAt: Date;
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        trim:true,
        unique:true,
    },
    email:{ 
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/.+\@.+\..+/ ,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],

    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verify code expiry is required'],
    },
    isVerified:{
     type:Boolean,
     default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema],
})

export  const UserModal=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)