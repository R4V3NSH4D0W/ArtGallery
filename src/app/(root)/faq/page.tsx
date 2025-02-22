"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "How do I place a custom order?",
    answer:
      "To request a custom string art piece, please send a direct message to the owner via the Messenger chat icon on our website.",
  },
  {
    question: "What payment options are available?",
    answer:
      "Currently, we only support Cash on Delivery (COD) as the payment method.",
  },
  {
    question: "Can I cancel my purchase?",
    answer:
      "Yes, you can cancel your order. Please copy your Product ID and send it to us via Messenger to request a cancellation.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "At the moment, we only ship within Nepal. We are working on expanding our shipping options in the future.",
  },
  {
    question: "What materials are used in your string art pieces?",
    answer:
      "We use high-quality nails, string, and wood to ensure durability and an elegant finish.",
  },
  {
    question: "How long does it take to complete a custom order?",
    answer:
      "Custom orders typically take 5-10 days to complete, depending on the complexity of the design. We will keep you updated on the progress.",
  },
  {
    question: "Can I request a specific size for my artwork?",
    answer:
      "Yes! You can specify your preferred size when requesting a custom order. We will do our best to accommodate your request.",
  },
  {
    question: "How do I take care of my string art piece?",
    answer:
      "To maintain your artwork: Keep it in a dry, cool place away from direct sunlight. Use a soft cloth to remove dust gently. Avoid heavy impacts or bending the nails and strings.",
  },
  {
    question: "Do you offer refunds or exchanges?",
    answer:
      "Since each piece is handcrafted, we do not offer refunds or exchanges unless the item arrives damaged. If you receive a damaged item, please contact us immediately.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is placed, we will send you an email and update your order status each time it changes. You can also check your product status via your profile under 'Order History'.",
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 lg:px-20 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h1>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                aria-expanded={activeIndex === index}
                aria-controls={`answer-${index}`}
              >
                <h2 className="flex-1 text-left text-base md:text-lg font-semibold text-gray-800 pr-4">
                  <span className="mr-2">{index + 1}.</span>
                  {faq.question}
                </h2>
                <svg
                  className={`w-5 h-5 shrink-0 transform transition-transform duration-300 ${
                    activeIndex === index
                      ? "rotate-180 text-blue-600"
                      : "text-black"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`answer-${index}`}
                className={`px-5 overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? "max-h-96 opacity-100 pb-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-700 text-base leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
