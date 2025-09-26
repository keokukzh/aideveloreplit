import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import futuristicLogo from "@assets/Gemini_Generated_Image_1zudlk1zudlk1zud_1758862154117.png";

interface IntroOverlayProps {
  onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  // Precompute particle properties to avoid re-randomization on re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
    }));
  }, []);

  useEffect(() => {
    // Check if user has seen intro before in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (hasSeenIntro || prefersReducedMotion) {
      // Skip intro animation
      setIsVisible(false);
      onComplete();
      return;
    }

    // Start animation sequence
    const timers = [
      // Stage 1: Particles fade in (400ms)
      setTimeout(() => setAnimationStage(1), 100),
      
      // Stage 2: Logo reveal (800ms)
      setTimeout(() => setAnimationStage(2), 400),
      
      // Stage 3: Logo glow and scale (600ms)
      setTimeout(() => setAnimationStage(3), 1200),
      
      // Stage 4: Transition to page (400ms)
      setTimeout(() => {
        setAnimationStage(4);
        sessionStorage.setItem('hasSeenIntro', 'true');
      }, 1800),
      
      // Complete and hide overlay
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 2200)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        data-testid="intro-overlay"
      >
        {/* Futuristic Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Radial gradient nebula */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle, rgba(0, 207, 255, 0.2) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)"
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: animationStage >= 1 ? 0.6 : 0, 
              scale: animationStage >= 1 ? 1.2 : 0.8 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: animationStage >= 1 ? [0, 1, 0.5] : 0,
                scale: animationStage >= 1 ? [0, 1.5, 1] : 0,
                y: animationStage >= 1 ? [0, -20, -40] : 0,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          ))}
        </div>

        {/* Main Logo */}
        <motion.div
          className="relative z-10"
          layoutId="brand-logo" // This enables the morph transition to header
        >
          <motion.img
            src={futuristicLogo}
            alt="AIDevelo.AI"
            className="h-32 w-auto"
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            }}
            animate={{
              opacity: animationStage >= 2 ? 1 : 0,
              scale: animationStage >= 3 ? [1, 1.06, 1] : (animationStage >= 2 ? 1 : 0.8),
              clipPath: animationStage >= 2 
                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.6, ease: "easeInOut" },
              clipPath: { duration: 0.8, ease: "easeOut" },
            }}
            style={{
              filter: animationStage >= 3 
                ? "drop-shadow(0 0 20px rgba(0, 207, 255, 0.5)) drop-shadow(0 0 40px rgba(161, 0, 255, 0.3))"
                : "none",
              textShadow: animationStage >= 3 
                ? "2px 0 0 #00cfff, -2px 0 0 #a100ff" 
                : "none",
            }}
            data-testid="intro-logo"
          />
        </motion.div>

        {/* Chromatic aberration overlay for glitch effect */}
        {animationStage >= 3 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.4, times: [0, 0.5, 1] }}
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(0, 207, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(161, 0, 255, 0.1) 0%, transparent 50%)
              `,
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}