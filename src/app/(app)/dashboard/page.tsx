"use client";
import { Message } from "@/model/user";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiResponse } from "../../../../types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  ClipboardCopy,
  Loader2,
  MessageSquare,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import MessageCard from "@/components/messageCard";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";

function UserDashboard() {
 
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {

    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.message("Refreshed Messages", {
            description: "Showing Latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.message("Error", {
          description:
            axiosError.response?.data.message ??
            "Failed to fetch message settings",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  // fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
     
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.message("Success", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
      });
    }
    if (!session || !session.user) {
      return;
    }
  };
  if (status === "loading") {
    return <p>Loading...</p>; // show loader until session resolves
  }

  if (!session?.user) {
    return <p>Not authenticated</p>; // or redirect to sign-in
  }
  const { username } = session?.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.message("URL Copied", {
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen min-w-screen ">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your feedback and messages
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            {/* User Info */}
            <div className="text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="User"
                />
                <AvatarFallback className="text-xl">{username}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-semibold">{username}</h3>
              <p className="text-sm text-muted-foreground">Feedback Manager</p>
            </div>

            <Separator />

            {/* Accept Messages Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Accept Messages</span>
              <Switch
             
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="bg-slate-900"
              />
             
            </div>

            <Separator />

            {/* Unique Link */}
            <div className="space-y-2">
              <h3 className="font-semibold">Your Unique Link</h3>
              <div className="space-y-2">
                <div className="overflow-hidden rounded-md border bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="input input-bordered w-full p-2 mr-2"
                  />
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="default"
                  className="w-full bg-slate-900"
                >
                  <ClipboardCopy className="mr-2 h-4 w-4 cursor-pointer" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b p-4 dark:border-slate-800">
              <h3 className="text-xl font-semibold">Messages</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            <div className="p-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={message._id as string}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground">
                    Share your link to receive feedback
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserDashboard;
