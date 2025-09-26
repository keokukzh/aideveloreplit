import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseStaggerAnimationOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
}

export function useStaggerAnimation(options: UseStaggerAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options.threshold || 0.1,
    once: options.once !== false, // Default to true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: options.delay || 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return {
    ref,
    isInView,
    containerVariants,
    itemVariants,
    animate: isInView ? "visible" : "hidden",
  };
}