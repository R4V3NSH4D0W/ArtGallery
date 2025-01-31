"use client";

import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";

function ChatBot() {
  return (
    <div className="fixed z-50 bottom-5 right-5">
      <a
        href="https://m.me/594688667388632"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className="h-[4rem] w-[4rem] bg-white flex items-center justify-center rounded-full shadow-md 
                      animate-bounce cursor-pointer"
        >
          <FaFacebookMessenger
            size={40}
            className="text-blue-500 hover:text-blue-700"
          />
        </div>
      </a>
    </div>
  );
}

export default ChatBot;
