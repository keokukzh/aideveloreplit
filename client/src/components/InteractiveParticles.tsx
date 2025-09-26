import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: 'node' | 'connection';
  connected: number[];
}

interface MousePosition {
  x: number;
  y: number;
}

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width / window.devicePixelRatio,
          y: Math.random() * canvas.height / window.devicePixelRatio,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100,
          size: Math.random() * 2 + 1,
          type: 'node',
          connected: []
        });
      }
    };

    initParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsMouseActive(true);
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      particles.forEach((particle, i) => {
        // Apply mouse attraction
        if (isMouseActive) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Boundary bounce
        if (particle.x < 0 || particle.x > rect.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > rect.height) particle.vy *= -0.8;
        
        // Keep in bounds
        particle.x = Math.max(0, Math.min(rect.width, particle.x));
        particle.y = Math.max(0, Math.min(rect.height, particle.y));

        // Update life
        particle.life += 0.5;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
        }

        // Find connections
        particle.connected = [];
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              particle.connected.push(j);
            }
          }
        });
      });

      // Render connections
      particles.forEach((particle, i) => {
        particle.connected.forEach(connectedIndex => {
          if (connectedIndex > i) { // Avoid duplicate lines
            const other = particles[connectedIndex];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const opacity = Math.max(0, (120 - distance) / 120) * 0.3;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            
            // Gradient line
            const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
            gradient.addColorStop(0, `rgba(0, 207, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(161, 0, 255, ${opacity * 0.8})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Render particles
      particles.forEach(particle => {
        const lifeRatio = particle.life / particle.maxLife;
        const opacity = Math.sin(lifeRatio * Math.PI) * 0.8 + 0.2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(0, 207, 255, ${opacity})`);
        gradient.addColorStop(0.7, `rgba(161, 0, 255, ${opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(161, 0, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow effect
        if (isMouseActive) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const glowIntensity = (100 - distance) / 100;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * (1 + glowIntensity), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 207, 255, ${glowIntensity * 0.3})`;
            ctx.fill();
          }
        }
      });

      // Mouse interaction indicator
      if (isMouseActive) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 207, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(161, 0, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMouseActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-10"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
      data-testid="interactive-particles"
    />
  );
}