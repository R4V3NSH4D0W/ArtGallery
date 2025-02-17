"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { createComment, updateComment } from "@/app/actions/review";
import { useTransition } from "react";

const commentSchema = z.object({
  content: z.string().min(1, "Comment is required"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export function CommentForm({
  reviewId,
  parentId,
  onSuccess,
  className,
  initialContent = "",
}: {
  reviewId: string;
  parentId?: string;
  onSuccess: () => void;
  className?: string;
  initialContent?: string;
}) {
  const { user } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!initialContent;

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialContent },
  });

  const onSubmit = (values: CommentFormValues) => {
    startTransition(async () => {
      if (!user?.id) return;

      let result;
      if (isEdit && parentId) {
        result = await updateComment({
          commentId: parentId,
          content: values.content,
          userId: user.id,
        });
      } else {
        result = await createComment({
          content: values.content,
          reviewId,
          parentId,
          userId: user.id,
        });
      }

      if (result?.success) {
        form.reset();
        onSuccess();
        toast.success(result.success);
      } else {
        toast.error(result?.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex gap-2 sm:gap-4 items-start w-full", className)}
      >
        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 sm:mt-2">
          <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm">
            {user?.name?.[0] || "Y"}
          </AvatarFallback>
        </Avatar>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={isEdit ? "" : "Write your reply..."}
                  className="min-h-[40px] text-sm sm:text-base border-2 border-gray-200 rounded-xl p-2 sm:p-3 focus-visible:ring-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <div className="flex gap-1 sm:gap-2">
          <Button
            type="submit"
            size="sm"
            className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 sm:px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : isEdit ? "Save" : "Post"}
          </Button>
          {!isEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSuccess}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
