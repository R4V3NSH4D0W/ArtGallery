"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reply, Star } from "lucide-react";
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
    <Card className="mt-4 sm:mt-8 lg:px-[10rem] border-none bg-slate-100">
      <CardHeader className="bg-gradient-to-r p-4 sm:p-6 rounded-t-lg">
        <CardTitle className="text-xl  text-gray-900">
          <label className=" font-normal">Descriptions | </label>
          <label>Reviews</label>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {user && !userReview && (
          <Form {...reviewForm}>
            <form
              onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}
              className="space-y-4 mb-6 sm:mb-8"
            >
              <FormField
                control={reviewForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your experience..."
                        className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base border-2 border-gray-200 rounded-xl p-3 sm:p-4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <div className=" flex flex-row items-center justify-between">
                <div className=" flex flex-row items-center gap-2">
                  <label>Your Rating:</label>
                  <div className="flex gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        type="button"
                        key={rating}
                        onClick={() => reviewForm.setValue("rating", rating)}
                        className="transition-transform hover:scale-110"
                      >
                        <MdStar
                          className={`w-6 h-6 sm:w-8 sm:h-8 cursor-pointer transition-colors ${
                            reviewForm.watch("rating") >= rating
                              ? "fill-yellow-400 stroke-yellow-500"
                              : "stroke-gray-300 fill-gray-100"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-[8rem] lg:w-[10rem] text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : `Post Review `}
                  <MdKeyboardArrowRight />
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className=" border-2 rounded-lg border-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className=" p-4 sm:p-6 rounded-xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-100">
                  <AvatarFallback className="bg-blue-500 text-white text-sm sm:text-base">
                    {review.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                      {review.user?.name || "Anonymous"}
                    </h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 stroke-yellow-500"
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 text-xs sm:text-sm"
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
                      <div className="flex gap-0">
                        <DeleteButton
                          title="Delete Review?"
                          description="This will permanently delete your review and all its comments."
                          onConfirm={() => handleDeleteReview(review.id)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            Delete
                          </Button>
                        </DeleteButton>
                      </div>
                    )}
                  </div>

                  {activeReply === review.id && (
                    <CommentForm
                      reviewId={review.id}
                      onSuccess={() => setActiveReply(null)}
                      className="mt-2 sm:mt-4"
                    />
                  )}

                  <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 pl-4 sm:pl-8 border-l-2 border-blue-50">
                    {review.comments.map((comment) => (
                      <CommentTree
                        key={comment.id}
                        comment={comment}
                        currentUserId={user?.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
