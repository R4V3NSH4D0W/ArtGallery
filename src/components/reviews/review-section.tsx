"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reply } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { createReview, deleteReview } from "@/app/actions/review";
import { toast } from "react-toastify";
import { DeleteButton } from "../reviews/delete-button";
import { CommentForm } from "../reviews/comment-form";
import { CommentTree } from "../reviews/comment-tree";
import { IReviewWithComments } from "@/lib/types";
import { MdKeyboardArrowRight, MdStar } from "react-icons/md";
import { formatDate } from "@/lib/utils";

const reviewSchema = z.object({
  comment: z.string().min(1, "Review is required"),
  rating: z.number().min(1).max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewSection({
  productId,
  reviews,
}: {
  productId: string;
  reviews: IReviewWithComments[];
}) {
  const { user } = useAuthContext();
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { comment: "", rating: 5 },
  });

  const handleReviewSubmit = (values: ReviewFormValues) => {
    startTransition(async () => {
      if (!user?.id) return;
      const result = await createReview({
        ...values,
        productId,
        userId: user.id,
      });
      if (result.success) {
        reviewForm.reset();
        toast.success(result.success);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    startTransition(async () => {
      if (!user?.id) return;
      const result = await deleteReview(reviewId, user.id);
      if (result?.success) {
        toast.success(result.success);
      } else {
        toast.error(result?.error);
      }
    });
  };

  const userReview = reviews.find(
    (review) => review.userId === user?.id && review.productId === productId
  );

  return (
    <Card className="mt-4 border-none bg-white shadow-lg lg:px-[12rem]">
      <CardHeader className="bg-white px-4 py-6">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Customer Reviews
          <span className="block text-lg font-normal text-gray-600 mt-1">
            {reviews.length} reviews
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-6">
        {/* Review Form */}
        {user && !userReview && (
          <Form {...reviewForm}>
            <form
              onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}
              className="mb-8 space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <label className="text-gray-700">Your Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() => reviewForm.setValue("rating", rating)}
                      className="transition-transform hover:scale-110"
                    >
                      <MdStar
                        className={`w-8 h-8 cursor-pointer ${
                          reviewForm.watch("rating") >= rating
                            ? "text-blue-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                control={reviewForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your thoughts about this product..."
                        className="min-h-[120px] text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Post Review"}
                  <MdKeyboardArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 border-2 border-blue-100">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {review.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {review.user?.name || "Anonymous"}
                    </h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <MdStar key={i} className="w-6 h-6 text-blue-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Actions */}
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() =>
                        setActiveReply(
                          activeReply === review.id ? null : review.id
                        )
                      }
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    {user?.id === review.userId && (
                      <DeleteButton
                        title="Delete Review?"
                        description="This will permanently delete your review and all its comments."
                        onConfirm={() => handleDeleteReview(review.id)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </DeleteButton>
                    )}
                  </div>

                  {/* Reply Form */}
                  {activeReply === review.id && (
                    <div className="mt-4 pl-14">
                      <CommentForm
                        reviewId={review.id}
                        onSuccess={() => setActiveReply(null)}
                      />
                    </div>
                  )}

                  {/* Nested Comments */}
                  {review.comments.length > 0 && (
                    <div className="mt-6 pl-4 sm:pl-8 border-l-2 border-gray-100 space-y-6">
                      {review.comments.map((comment) => (
                        <CommentTree
                          key={comment.id}
                          comment={comment}
                          currentUserId={user?.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
