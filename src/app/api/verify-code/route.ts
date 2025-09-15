import dbConnect from "@/lib/dbConnect";
import { UserModal } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        // decodeURIComponet is used for decode the value from the url because when url is created then space and other special letter takes the some values like single space take %20
        const user = await UserModal.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false, message: 'User Not Found'
            }, { status: 404 })
        }
        //    check if the code is correct and not expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"Account verified Successfully"
            },{status:200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification code is expired, Please signup again to get a new code "
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Incorrect Verification code"
            },{status:400})
        }

    }
    catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error Verifying user"
        }, {
            status: 500
        })
    }
}