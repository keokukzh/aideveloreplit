import { useState, useEffect, useRef, ReactNode } from 'react';

interface HolographicUIProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  'data-testid'?: string;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function HolographicUI({ 
  children, 
  intensity = 1, 
  className = '', 
  'data-testid': testId 
}: HolographicUIProps) {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMouse({
        x: (e.clientX - centerX) / (rect.width / 2),
        y: (e.clientY - centerY) / (rect.height / 2)
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMouse({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const rotateX = mouse.y * 10 * intensity;
  const rotateY = -mouse.x * 10 * intensity;
  const translateZ = isHovered ? 20 * intensity : 0;

  return (
    <div
      ref={elementRef}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        transformStyle: 'preserve-3d',
      }}
      data-testid={testId}
    >
      {/* Holographic glow effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `
            radial-gradient(
              circle at ${50 + mouse.x * 20}% ${50 + mouse.y * 20}%, 
              rgba(0, 207, 255, 0.3) 0%, 
              rgba(161, 0, 255, 0.2) 40%, 
              transparent 70%
            )
          `,
          borderRadius: 'inherit',
          filter: 'blur(10px)',
          transform: 'translateZ(-10px)',
        }}
      />

      {/* Refraction overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.4 : 0,
          background: `
            linear-gradient(
              ${45 + mouse.x * 30}deg,
              rgba(0, 207, 255, 0.1) 0%,
              transparent 30%,
              transparent 70%,
              rgba(161, 0, 255, 0.1) 100%
            )
          `,
          borderRadius: 'inherit',
          transform: 'translateZ(5px)',
        }}
      />

      {/* Content with 3D positioning */}
      <div
        className="relative z-10 transition-transform duration-300"
        style={{
          transform: `translateZ(${isHovered ? 10 * intensity : 0}px)`,
        }}
      >
        {children}
      </div>

      {/* Floating elements */}
      {isHovered && (
        <>
          {/* Top left floating orb */}
          <div
            className="absolute w-2 h-2 bg-primary rounded-full opacity-80 pointer-events-none"
            style={{
              top: '10%',
              left: '10%',
              transform: `
                translateZ(30px) 
                translateX(${mouse.x * 15}px) 
                translateY(${mouse.y * 10}px)
                scale(${1 + Math.abs(mouse.x) * 0.3})
              `,
              boxShadow: '0 0 20px rgba(0, 207, 255, 0.8)',
              animation: 'pulse 2s infinite ease-in-out',
            }}
          />

          {/* Top right floating orb */}
          <div
            className="absolute w-1.5 h-1.5 bg-chart-2 rounded-full opacity-70 pointer-events-none"
            style={{
              top: '20%',
              right: '15%',
              transform: `
                translateZ(25px) 
                translateX(${mouse.x * -10}px) 
                translateY(${mouse.y * 15}px)
                scale(${1 + Math.abs(mouse.y) * 0.2})
              `,
              boxShadow: '0 0 15px rgba(161, 0, 255, 0.6)',
              animation: 'pulse 2.5s infinite ease-in-out',
            }}
          />

          {/* Bottom floating orb */}
          <div
            className="absolute w-1 h-1 bg-green-500 rounded-full opacity-60 pointer-events-none"
            style={{
              bottom: '15%',
              left: '70%',
              transform: `
                translateZ(20px) 
                translateX(${mouse.x * 8}px) 
                translateY(${mouse.y * -12}px)
                scale(${1 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.1})
              `,
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.7)',
              animation: 'pulse 3s infinite ease-in-out',
            }}
          />
        </>
      )}

      {/* Edge glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.3 : 0,
          background: 'transparent',
          border: '1px solid transparent',
          borderImage: `linear-gradient(
            ${90 + mouse.x * 45}deg,
            rgba(0, 207, 255, 0.5) 0%,
            rgba(161, 0, 255, 0.3) 50%,
            rgba(0, 207, 255, 0.5) 100%
          ) 1`,
          borderRadius: 'inherit',
          transform: 'translateZ(2px)',
        }}
      />
    </div>
  );
}

// Specialized holographic components
export function HolographicCard({ children, className = '', ...props }: HolographicUIProps) {
  return (
    <HolographicUI
      className={`glass-intense border border-primary/20 rounded-lg p-6 ${className}`}
      intensity={0.8}
      {...props}
    >
      {children}
    </HolographicUI>
  );
}

export function HolographicButton({ children, className = '', onClick, ...props }: HolographicUIProps & { onClick?: () => void }) {
  return (
    <HolographicUI
      className={`inline-block ${className}`}
      intensity={1.2}
      {...props}
    >
      <button
        onClick={onClick}
        className="relative px-6 py-3 bg-gradient-to-r from-primary to-chart-2 text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
      >
        {children}
      </button>
    </HolographicUI>
  );
}

export function HolographicBadge({ children, className = '', ...props }: HolographicUIProps) {
  return (
    <HolographicUI
      className={`inline-block ${className}`}
      intensity={0.6}
      {...props}
    >
      <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
        {children}
      </div>
    </HolographicUI>
  );
}