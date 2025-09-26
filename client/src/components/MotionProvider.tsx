import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export default function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        type: "tween",
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      }}
    >
      {children}
    </MotionConfig>
  );
}