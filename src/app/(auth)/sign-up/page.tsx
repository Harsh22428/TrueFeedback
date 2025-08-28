"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderOne } from "@/components/ui/loader";

import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { toast, useSonner, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../../../types/ApiResponse";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  //   const { sonner } = useSonner();
  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
        //   console.log(response.data.message)
          let message=response.data.message
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  const onsubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(data);
      toast.message("Success", {
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errMessage = axiosError.response?.data.message;
      console.error("Error in signup of user", error);
      toast.message("sign up failed", {
        description: errMessage,
      });
      setIsSubmitting(false);
    }
  };

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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                {
                    isCheckingUsername&& <LoaderOne />
                }
               {(<p className={`text-sm ${usernameMessage==="Username is unique"?'text-green-500':'text-red-500'}`}>
                     {usernameMessage}
                </p>)}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
              
                  <Input placeholder="email" {...field} />
                
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderOne /> Please Wait
              </>
            ) : (
              "Signup"
            )}
          </Button>
        </form>
      </Form>
      <div>
        <p>
          Already a member?{""}
          <Link href={"/sign-in"} className="text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default page;
