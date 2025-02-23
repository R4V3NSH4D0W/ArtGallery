"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  src: string;
}

// Image data array
const images: ImageData[] = [
  { src: "/gallary_static/eye.png" },
  { src: "/gallary_static/puran.png" },
  { src: "/gallary_static/samibhatta.png" },
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Function to go to the next slide
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Automatic slide transition
  useEffect(() => {
    if (!isHovered && !isDragging) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered, isDragging]);

  // Handle touch/mouse start
  const handleStart = (position: number): void => {
    setStartPos(position);
    setIsDragging(true);
  };

  // Handle touch/mouse end
  const handleEnd = (position: number): void => {
    if (startPos === null) return;

    const diff = startPos - position;

    if (diff > 50) {
      nextSlide(); // Swipe left
    } else if (diff < -50) {
      prevSlide(); // Swipe right
    }

    setStartPos(null);
    setIsDragging(false);
  };

  // Handle touch/mouse events
  const handleTouchStart = (e: React.TouchEvent): void =>
    handleStart(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent): void =>
    handleEnd(e.changedTouches[0].clientX);

  const handleMouseDown = (e: React.MouseEvent): void => handleStart(e.clientX);

  const handleMouseUp = (e: React.MouseEvent): void => handleEnd(e.clientX);

  return (
    <div
      className="relative w-full mx-auto mt-4"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Image Container */}
      <div className="relative h-[20rem] lg:h-[40rem] lg:mx-12 group">
        <Image
          src={images[currentIndex].src}
          alt={`Slider Image ${currentIndex + 1}`}
          fill
          objectFit="cover"
          className="rounded-xl transition-all duration-500 ease-in-out cursor-pointer"
        />
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${
              index === currentIndex
                ? "bg-gray-600 rounded-xl"
                : "bg-gray-300 rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
}
