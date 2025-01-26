import React from "react";
import Image from "next/image";
import MotionDiv from "./motiondiv";

const reviews = [
  {
    rating: 5,
    title: "Artistic Quality",
    description:
      "The string art pieces are truly mesmerizing and add a unique touch to my home decor.",
    reviewer: "Emily Johnson",
    reviewerImage: "https://w.wallhaven.cc/full/vq/wallhaven-vq6x28.jpg",
    date: "September 10, 2024",
  },
  {
    rating: 5,
    title: "Customer Service",
    description:
      "Exceptional customer service and stunning artwork. Highly recommend Artful Threads!",
    reviewer: "Michael Smith",
    reviewerImage: "https://w.wallhaven.cc/full/1p/wallhaven-1pv19v.png",
    date: "August 22, 2024",
  },
  {
    rating: 5,
    title: "Design Innovation",
    description:
      "The creativity and innovation in their designs are simply unparalleled.",
    reviewer: "Sophia Brown",
    reviewerImage: "https://w.wallhaven.cc/full/kx/wallhaven-kx5v57.jpg",
    date: "July 15, 2024",
  },
];

const ReviewSection = () => {
  return (
    <>
      {reviews.map((review, index) => (
        <MotionDiv
          key={index}
          className="mb-6 rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
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
              <span className="ml-2 text-gray-700">
                for <strong className="font-semibold">{review.title}</strong>
              </span>
            </div>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
          <p className="mt-3 text-gray-600">{review.description}</p>
          <div className="mt-4 flex items-center">
            <div className=" relative h-10 w-10 rounded-full overflow-hidden">
              <Image src={review.reviewerImage} alt={review.reviewer} fill />
            </div>
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
