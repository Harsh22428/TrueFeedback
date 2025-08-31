import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { string, success } from "zod/v4";
import { UserModal } from "@/model/user";



export async function DELETE(request: Request, { params }: { params: { messageId: String } }) {
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
        const updateResult = await UserModal.updateOne({ _id: user._id }, {
            $pull: { messages: { _id: params.messageId } }
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
