import { useState, useEffect, useRef } from "react";

const useInViewport = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const { top, bottom } = ref.current.getBoundingClientRect();
      const isVisible =
        top < window.innerHeight * (1 + threshold) && bottom > 0;
      setIsInView(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return { ref, isInView };
};

export default useInViewport;
