import React from "react";
import { Trash2, X } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import dayjs from "dayjs";
import { Button } from "./ui/button";
import { Message } from "@/model/user";
import { toast } from "sonner";
import axios from "axios";

type messageProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
function MessageCard({ message, onMessageDelete }: messageProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast.message("Successfully Deleted", {
      description: response.data.message,
    });
    onMessageDelete(String(message._id));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex justify-end items-center">
            <Button className="cursor-pointer" variant="destructive">
              <Trash2 className="size-5" />
            </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
