"use client";
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
// import { useSession,signIn,signOut } from "next-auth/react";

// export default function Component(){
//     const {data:session}=useSession()
//     if(session){
//         return(
//             <>
//             Signed in as {session.us er?.email}
//             <br/>
//             <button onClick={()=>signOut()}>Sign out</button>
//             </>
//         )
//     }
//     return (
//         <>
//         Not signed in <br/>
//         <button className="bg-orange-600 px-3 py-1  m-4 rounded-2xl" onClick={()=>signIn()}>Sign in</button>
//         </>
//     )
// }
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { useState } from 'react';
import axios from 'axios';
import {toast} from "sonner"
import { ApiResponse } from '../../../../types/ApiResponse';
import { signIn } from 'next-auth/react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderOne } from '@/components/ui/loader';
import Link from 'next/link';


function SigninPage() {
  const router=useRouter();
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })

  const onsubmit=async (data:z.infer<typeof signInSchema>)=>{
    const result=await signIn("credentials",{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    console.log(result)
    if(result?.error){
      if(result.error=='CrendentialsSignIn'){
        toast.message("Login Failed",{
          description:"Incorrect Password and Email"
        })
      }
      else{
        toast.message("Error",{
          description:result.error
        })
      }
    }
    if(result?.url){
      router.replace('/dashboard')
    }

  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Truefeedback message app
        </h1>
        <p className="mb-4 ">Sign up to start your anoymous adventure</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
              
                  <Input placeholder="email/username" {...field} />
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                
                  <Input type="password" placeholder="password" {...field} />
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer" >
            SignIn
          </Button>
        </form>
      </Form>
      <div>
        <p>
          Create New Account {""}
          <Link href={"/sign-up"} className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}

export default SigninPage;

