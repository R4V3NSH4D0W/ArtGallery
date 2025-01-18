import { motion, MotionProps, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useInViewport from "../hooks/useInViewport";

interface MotionDivProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className = "",
  initial = { opacity: 0, y: 50 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 1.5 },
  ...props
}) => {
  const { ref, isInView } = useInViewport();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isInView) {
      setIsMounted(true);
    }
  }, [isInView]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={initial}
        animate={isMounted ? animate : initial}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionDiv;
