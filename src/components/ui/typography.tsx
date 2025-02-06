import React from "react";
import { cn } from "@/lib/utils";

type TypographyProps = {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "span"
    | "small"
    | "large"
    | "medium";
  className?: string;
  children: React.ReactNode;
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  className = "",
  children,
}) => {
  const baseStyles = "text-gray-900 dark:text-gray-100";
  const variants: Record<NonNullable<TypographyProps["variant"]>, string> = {
    h1: "text-3xl sm:text-4xl md:text-5xl font-bold",
    h2: "text-2xl sm:text-3xl md:text-4xl font-semibold",
    h3: "text-xl sm:text-2xl md:text-3xl font-semibold",
    h4: "text-lg sm:text-xl md:text-2xl font-medium",
    h5: "text-md sm:text-lg md:text-xl font-medium",
    h6: "text-sm sm:text-base md:text-lg font-medium",
    p: "text-base sm:text-lg md:text-xl",
    span: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
    large: "text-4xl sm:text-5xl font-bold",
    medium: "text-lg sm:text-xl font-medium",
  };

  return React.createElement(
    variant,
    { className: cn(baseStyles, variants[variant], className) },
    children
  );
};
