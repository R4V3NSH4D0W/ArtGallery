// CommentTree.tsx
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
import { formatDate } from "@/lib/utils";

const MAX_DEPTH = 1;

export function CommentTree({
  comment,
  currentUserId,
  depth = 1,
}: {
  comment: ICommentWithUser;
  currentUserId?: string;
  depth?: number;
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
    <div className="group relative">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-blue-500 text-white">
            {comment.user?.name?.[0] || "A"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-baseline flex-wrap gap-2">
            <h4 className="text-base font-medium text-gray-900">
              {comment.user?.name || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>

            {currentUserId === comment.userId && (
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-blue-600 p-1.5"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <DeleteButton
                  title="Delete Comment?"
                  description="This action cannot be undone."
                  onConfirm={handleDelete}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 p-1.5"
                    disabled={isDeleting}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </DeleteButton>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                reviewId={comment.reviewId}
                parentId={comment.id}
                initialContent={comment.content}
                onSuccess={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <p className="mt-1 text-gray-700 text-sm sm:text-base">
              {comment.content}
            </p>
          )}

          {!isEditing && depth < MAX_DEPTH && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
            </div>
          )}

          {isReplying && depth < MAX_DEPTH && (
            <div className="mt-3">
              <CommentForm
                reviewId={comment.reviewId}
                parentId={comment.id}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}

          {depth < MAX_DEPTH && comment.replies?.length > 0 && (
            <div
              className={`mt-4 space-y-4 pl-2 sm:pl-4 border-l border-gray-100`}
            >
              {comment.replies.map((reply) => (
                <CommentTree
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
