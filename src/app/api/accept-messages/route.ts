import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModal } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth"
export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModal.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: " failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated Successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.error(" console errr failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }
}
export async function GET(request: Request) {
    await dbConnect()
    // get the user session
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    try {
        const foundUser = await UserModal.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not Found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
           isAcceptingMessages:foundUser.isAcceptingMessages   // yaha par UserModal me isAcceptingMessages deafault true that mean If user is found then he accepts the messages
        }, { status: 200 })
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Error is getting message acceptance status"
        }, { status: 500 })
    }
}




