import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

import { UserModal } from "@/model/user";
import { NextRequest, NextResponse } from "next/server";



type RouteParams = {
    messageid: string;
}
export async function DELETE(request: NextRequest,
    // context: { params: Record<string,string> }
) {

    // const { messageid } = context.params;
    const url=new URL(request.url);
    const messageid=url.pathname.split('/').pop();
    if (!messageid) {
        return NextResponse.json({
            success: false,
            message: "Message ID is required"
        }, { status: 400 });
    }

    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        // const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, {
                status: 401
            })
        }
        const userEmail=session.user.email;
        const user=await UserModal.findOne({email:userEmail})
      if(!user){
        return NextResponse.json({
            success:false,message:'USer not found'
        },{status:400})
      }
        const updateResult = await UserModal.updateOne({ _id: user._id }, {
            $pull: { messages: { _id: messageid } }
        })
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message Not found are already deleted"
            }, {
                status: 401
            })
        }
        return NextResponse.json({
            success: true,
            message: "Message Deleted Successfully"
        }, {
            status: 200
        })


    } catch (error) {
        console.log("Error in message delete route", error)
        return Response.json({
            success: false,
            message: "Error Deleting Messages"
        }, {
            status: 401
        })

    }

}
