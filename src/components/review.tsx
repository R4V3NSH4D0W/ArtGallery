"use client";
import React from "react";
// import Image from "next/image";
import MotionDiv from "@/components/motiondiv";
import { getColorByFirstLetter } from "@/lib/helper";

interface Review {
  rating: number;
  title: string;
  date: string;
  description: string;
  reviewer: string;
  reviewerImage?: string;
}

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  if (!reviews?.length) return null;

  return (
    <>
      {reviews.map((review, index) => (
        <MotionDiv
          key={index}
          className="mb-6 rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col lg:flex-row">
              {/* Render Star Rating */}
              <div className="flex text-blue-500">
                {Array.from({ length: review.rating }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.335l-6 5.832L19.336 24 12 19.771 4.664 24 6 15.167 0 9.335l8.332-1.317L12 .587z" />
                  </svg>
                ))}
              </div>
              <span className="lg:ml-2 mt-4 lg:mt-0 text-gray-700">
                for <strong className="font-semibold">{review.title}</strong>
              </span>
            </div>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
          <p className="mt-3 text-gray-600">{review.description}</p>
          <div className="mt-4 flex items-center">
            {/* {review.reviewerImage ? (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={review.reviewerImage}
                  alt={review.reviewer}
                  fill
                  className="object-cover"
                />
              </div>
            ) : ( */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium"
              style={{
                backgroundColor: getColorByFirstLetter(
                  review.reviewer.charAt(0).toUpperCase()
                ),
              }}
            >
              {review.reviewer.charAt(0).toUpperCase()}
            </div>
            {/* )} */}
            <p className="ml-3 text-sm font-medium text-gray-700">
              {review.reviewer}
            </p>
          </div>
        </MotionDiv>
      ))}
    </>
  );
};

export default ReviewSection;
