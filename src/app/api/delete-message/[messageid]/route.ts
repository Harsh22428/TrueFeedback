import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { UserModal } from "@/model/user";
import { NextResponse } from "next/server";



export async function DELETE(request: Request,
     {params}:{ params :  { messageid: string }} ) {
        const { messageid } = params;

  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "messageid is required" },
      { status: 400 }
    );
  }
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    try {
         const { messageid } = params;
        const updateResult = await UserModal.updateOne({ _id: user._id }, {
            $pull: { messages: { _id: messageid } }
        })
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message Not found are already deleted"
            }, {
                status: 401
            })
        }
         return Response.json({
            success: true,
            message: "Message Deleted Successfully"
        }, {
            status: 200
        })


    } catch (error) {
        console.log("Error in message delete route",error)
         return Response.json({
            success: false,
            message: "Error Deleting Messages"
        }, {
            status: 401
        })

    }
}
