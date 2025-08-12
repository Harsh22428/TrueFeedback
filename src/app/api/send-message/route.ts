import dbConnect from "@/lib/dbConnect";
import { Message, UserModal } from "@/model/user";
import { use } from "react";
export async function POST(request:Request){
    await dbConnect();
    const {username,content}=await request.json();
    try {
        const user=await UserModal.findOne({username})
        if(!user){
           return Response.json({
            message:'User Not Found',
            success:false
        },{status:404})
        }
        // it user accepting the messages
        if(!user.isAcceptingMessages){
          return  Response.json({
            message:'User is not accepting the messages',
            success:false
        },{status:403})
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
       return  Response.json({
            message:'Message sent successfully',
            success:true
        },{status:200})
    } catch (error) {
        console.log("Error adding message:",error)
       return Response.json({
            message:'Internal server Error',
            success:false
        },{status:500})
    }
}