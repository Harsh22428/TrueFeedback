"use client";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { ApiResponse } from "../../../../types/ApiResponse";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
const specialChar = "||";
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((msg) => msg.trim());
};
export default function sendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<string []>([]);
  const [messageLoading, setMessageLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        ...data,
      });
      toast.message("Message Sent Sucessfully", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error", {
        description:
          axiosError.response?.data.message ?? "failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSuggestMessages = async () => {
    try {
      setMessageLoading(true);
      const response = await axios.post("/api/suggest-messages");
      const messageString = response.data.message;
      const parsedMessages = parseStringMessages(messageString);
      setAiMessages(parsedMessages);
      setMessageLoading(false);
    } catch (error) {
      console.error("Error fectching messages");
      toast.message("Error while suggesting Message");
    }
  };
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="flex-col justify-center p-10">
      <div className="flex justify-center p-10">Public Profile Link</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to {username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            {isLoading ? (
              <Button className="w-full cursor-pointer" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                className="w-full cursor-pointer"
                type="submit"
                // disabled={isLoading || !messageContent}
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8 mt-10">
                <Card className="dark:bg-black border-none">
                    <CardHeader className="text-center text-2xl font-semibold">
                        Click on any message below to select it.
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2 max-sm:space-y-4">

                        {aiMessages.length > 0 ? (
                            aiMessages.map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className='w-full text-wrap cursor-pointer max-sm:h-16'
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        ) : (
                            <p className="text-gray-500">No messages available. Try suggesting some!</p>
                        )}
                    </CardContent>
                </Card>
                <div className="space-y-2 w-full">
                    {isLoading ? (
                        <Button disabled className="my-4 w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suggesting
                        </Button>
                    ) : (
                        <Button
                            onClick={fetchSuggestMessages}
                            className="my-4 w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800"
                            disabled={isLoading}
                        >
                            Suggest Messages
                        </Button>
                    )}
                </div>
            </div>


    </div>
  );
}
