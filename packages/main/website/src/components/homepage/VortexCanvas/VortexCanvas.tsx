import { useEffect, useRef, useCallback, useState } from "react";
import { GREEK_LETTERS } from "@site/src/data/homepage/greekLetters";
import { VortexConfig } from "@site/src/types/vortex";
import styles from "./VortexCanvas.module.css";

interface VortexParticle {
  letter: string;
  radius: number;
  angle: number;
  speed: number;
  opacity: number;
  maxOpacity: number;
  phase: number;
  isInner: boolean;
}

interface VortexCanvasProps {
  configs: VortexConfig[];
  className?: string;
  paused?: boolean;
}

function VortexCanvas({ configs, className, paused = false }: VortexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<VortexParticle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const createParticles = useCallback(
    (configs: VortexConfig[]): VortexParticle[] => {
      const particles: VortexParticle[] = [];

      configs.forEach((config, configIndex) => {
        const isInner = configIndex === 3;

        for (let i = 0; i < config.numLetters; i++) {
          const radiusVariation =
            (Math.random() - 0.5) * config.radiusVariation;
          const radius = config.baseRadius + radiusVariation;
          const angle =
            (i / config.numLetters) * Math.PI * 2 + Math.random() * 0.5;
          const durationVariation =
            (Math.random() - 0.5) * config.durationVariation;
          const duration = config.baseDuration + durationVariation;
          const speed = (Math.PI * 2) / (duration * 60);
          const opacityVariation =
            (Math.random() - 0.5) * config.opacityVariation;
          const maxOpacity = Math.max(
            0.05,
            Math.min(0.7, config.baseOpacity + opacityVariation)
          );
          const phase = Math.random() * Math.PI * 2;

          particles.push({
            letter:
              GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)],
            radius,
            angle,
            speed,
            opacity: 0,
            maxOpacity,
            phase,
            isInner,
          });
        }
      });

      return particles;
    },
    []
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      const fontSize = Math.max(14, Math.min(24, width * 0.02));
      ctx.font = `300 ${fontSize}px "Cormorant Garamond", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.angle += p.speed;
        if (p.angle > Math.PI * 2) {
          p.angle -= Math.PI * 2;
        }

        const cyclePosition = (p.angle + p.phase) % (Math.PI * 2);
        const normalizedPosition = cyclePosition / (Math.PI * 2);

        let opacity: number;
        if (normalizedPosition < 0.1) {
          opacity = (normalizedPosition / 0.1) * p.maxOpacity;
        } else if (normalizedPosition > 0.9) {
          opacity = ((1 - normalizedPosition) / 0.1) * p.maxOpacity;
        } else {
          opacity = p.maxOpacity;
        }

        p.opacity = opacity;

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        if (p.isInner) {
          ctx.shadowColor = "rgba(201, 169, 98, 0.5)";
          ctx.shadowBlur = 30;
        } else {
          ctx.shadowColor = "rgba(201, 169, 98, 0.3)";
          ctx.shadowBlur = 20;
        }
        ctx.fillStyle = `rgba(201, 169, 98, ${opacity})`;

        ctx.fillText(p.letter, x, y);
      }

      ctx.shadowBlur = 0;
    },
    []
  );

  useEffect(() => {
    particlesRef.current = createParticles(configs);
  }, [configs, createParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.scale(dpr, dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateCanvasSize();

    const animate = () => {
      if (!pausedRef.current) {
        draw(ctx, window.innerWidth, window.innerHeight);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.vortexCanvas} ${
        isReady ? styles.vortexCanvasLoaded : ""
      } ${className || ""}`.trim()}
    />
  );
}

export default VortexCanvas;
