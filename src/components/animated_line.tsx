import React from "react";
import { motion } from "framer-motion";

const AnimatedLine = ({
  color = "#3498db",
  duration = 2,
  height = "2px",
  width = "100%",
  initialWidth = "0%",
  ease = "easeInOut",
}) => {
  return (
    <motion.div
      style={{
        height: height,
        backgroundColor: color,
        width: initialWidth,
      }}
      animate={{
        width: width,
      }}
      transition={{
        duration: duration,
        ease: ease,
      }}
    />
  );
};

export default AnimatedLine;
