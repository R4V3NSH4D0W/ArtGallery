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
        className={cn(
          "flex flex-col sm:flex-row gap-3 items-start w-full",
          className
        )}
      >
        <Avatar className="w-8 h-8 hidden sm:block">
          <AvatarFallback className="bg-blue-500 text-white">
            {user?.name?.[0] || "Y"}
          </AvatarFallback>
        </Avatar>

        <div className="w-full  flex flex-col gap-5">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={isEdit ? "" : "Write your reply..."}
                    className="min-h-[80px] sm:min-h-[40px] text-sm sm:text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? "Posting..." : isEdit ? "Save" : "Post"}
            </Button>
            {!isEdit && (
              <Button
                type="button"
                variant="ghost"
                className="text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
                onClick={onSuccess}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
