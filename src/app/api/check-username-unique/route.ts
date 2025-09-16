// export const dyamic='force-dyamic';
import dbConnect from "@/lib/dbConnect";
import { UserModal } from "@/model/user";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
const UsernameQuerySchema=z.object({
    username:usernameValidation,
})
export async function GET(request:Request){
    // ab ya par manlo kisi ne post request ki to vo sahi nhi hai isiliye hab hum request methods check karenge
    // if(request.method!=='GET'){
    //     return Response.json({
    //         success:false,
    //         message:'Method not allowed',
    //     },{status:400})
    // }

    // ye code pahele ke next js ke version me tha ab nhi hai to hum next js khud hi handle kar leta hai
    await dbConnect();
    // localhost:3000/api/cuu?username=harsh?phone=android
    try{
        const {searchParams}=new URL (request.url);
        const queryParams={username:searchParams.get("username")}
        // validate with zod
        const result=UsernameQuerySchema.safeParse(queryParams);
        console.log(result) //TODO: 
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            return Response.json(
                {
                    success:false,
                    message:usernameErrors?.length>0? usernameErrors.join(', '):'Invalid query parameters',
                },{status:400}
            )
        }
        const {username}=result.data;
        const existingVerifiedUser=await UserModal.findOne({
            username,
            isVerified:true,
        })
        if(existingVerifiedUser){
            return Response.json({
                 success:false,
                message:'Username is already taken'
            },{
                status:400
            })
        }
        
        return Response.json({
                success:true,
                message:"Username is unique"
            },{
                status:200
            })
    }
    catch(error){
        console.error("Error Checking username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{
            status:500
        })
    }
}