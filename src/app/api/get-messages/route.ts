import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModal } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth"
import mongoose from "mongoose";
export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    console.log("user in session ",user)
    console.log("full in session ",session)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
     const userAgg =await UserModal.aggregate([
        {$match:{_id:userId}},
        {$unwind:'$messages'},
        {$sort:{'messages.createdAt':-1}},
        {$group:{_id:'$_id',messages:{$push:'$messages'}}},
     ])
    //  .exec();
     if(!userAgg || userAgg.length===0){
        return Response.json({
            message:'User message Not Found',
            success:false
        },{status:404})
     }
     return Response.json({
            messages:userAgg[0].messages,
            success:true
        },{status:200})
    } catch (error) {
     console.error('An unexpected error occured:',error)
     return Response.json({
        message:'Internal server error',
        success:false
     },{status:500})
    }
}