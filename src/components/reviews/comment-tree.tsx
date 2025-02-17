"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash, Reply } from "lucide-react";
import { CommentForm } from "./comment-form";
import { DeleteButton } from "./delete-button";
import { toast } from "react-toastify";
import { deleteComment } from "@/app/actions/review";
import { ICommentWithUser } from "@/lib/types";

export function CommentTree({
  comment,
  currentUserId,
}: {
  comment: ICommentWithUser;
  currentUserId?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, startDeleting] = useTransition();

  const handleDelete = () => {
    startDeleting(async () => {
      if (!currentUserId) return;
      const result = await deleteComment(comment.id, currentUserId);
      if (result?.success) {
        toast.success(result.success);
      } else {
        toast.error(result?.error);
      }
    });
  };

  return (
    <div className="relative group">
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1">
          <AvatarFallback className="bg-green-500 text-white text-xs sm:text-sm">
            {comment.user?.name?.[0] || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-gray-900">
              {comment.user?.name || "Anonymous"}
            </h4>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {currentUserId === comment.userId && (
              <div className="flex gap-1 sm:gap-2 ml-auto">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-blue-600 p-1 sm:p-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <DeleteButton
                  title="Delete Comment?"
                  description="This action cannot be undone."
                  onConfirm={handleDelete}
                >
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-red-600 p-1 sm:p-2"
                    disabled={isDeleting}
                  >
                    <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DeleteButton>
              </div>
            )}
          </div>

          {isEditing ? (
            <CommentForm
              reviewId={comment.reviewId}
              parentId={comment.id}
              initialContent={comment.content}
              onSuccess={() => setIsEditing(false)}
              className="mt-2"
            />
          ) : (
            <p className="mt-1 text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 sm:mt-2 text-gray-600 hover:text-blue-600 text-xs sm:text-sm"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Reply
            </Button>
          )}

          {isReplying && (
            <CommentForm
              reviewId={comment.reviewId}
              parentId={comment.id}
              onSuccess={() => setIsReplying(false)}
              className="mt-2 sm:mt-4"
            />
          )}

          {comment.replies.length > 0 && (
            <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4 pl-4 sm:pl-6 border-l-2 border-gray-100">
              {comment.replies.map((reply) => (
                <CommentTree
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
