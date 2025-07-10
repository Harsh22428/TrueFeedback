import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModal } from "@/model/user";
import { use } from "react";
import { error } from "console";
import bcrypt from "bcryptjs";
import { Session } from "inspector/promises";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'Crendentials',
            credentials:{
                email:{label:'Email',type:'text'},
                password:{label:'Password',type:'password'}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user=await UserModal.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account befor login")
                    }
                   const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect){
                        throw new Error("Password is not valid or wrong")

                    }
                } catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
    async jwt ({token,user}){
        if(user){
            token._id=user._id?.toString()
            token.isVerified=user.isVerified,
            token.isAcceptingMessages=user.isAcceptingMessages,
            token.username=user.username

        }
     return token
    },
    async session({session,token}){
        if(token){
            // session.user._id=token._id
            // session.user._id=token._id;
            // session.user.isVerified=token.isVerified;
            // session.user.isAcceptingMessages=token.isAcceptingMessages;
            // session.user.username=token.username;
        }
        return session
    }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}