import { useEffect, useRef, useState } from "preact/hooks";
import FpsCounter from "./FpsCounter";
import VortexCanvas from "./VortexCanvas";
import RisingLetter from "./RisingLetter";
import { VORTEX_CONFIGS } from "../data/vortex";
import { RISING_LETTERS_CONFIG } from "../data/risingLetters";
import { RisingLetter as RisingLetterType } from "../types/risingLetters";
import { createRisingLetters } from "../helpers/risingLetters";
import "./landing.css";

function Landing() {
  const centerPieceRef = useRef<HTMLDivElement>(null);
  const [shouldShowRisingLetters, setShouldShowRisingLetters] = useState(false);
  const [risingLetters, setRisingLetters] = useState<RisingLetterType[]>([]);
  const [risingLettersKey, setRisingLettersKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const risingLettersTimeoutRef = useRef<number>();
  const isHoveringRef = useRef(false);

  const triggerRisingLetters = () => {
    if (isHoveringRef.current) return;
    isHoveringRef.current = true;

    if (risingLettersTimeoutRef.current) {
      clearTimeout(risingLettersTimeoutRef.current);
      risingLettersTimeoutRef.current = undefined;
    }

    const newLetters = createRisingLetters(
      RISING_LETTERS_CONFIG.minLetters,
      RISING_LETTERS_CONFIG.maxLetters
    );
    setRisingLettersKey((prev) => prev + 1);
    setRisingLetters(newLetters);
    requestAnimationFrame(() => {
      setShouldShowRisingLetters(true);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      targetRotationRef.current = {
        x: -deltaY * 15,
        y: deltaX * 15,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!centerPieceRef.current) return;

    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const targetX = targetRotationRef.current.x;
      const targetY = targetRotationRef.current.y;

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (centerPieceRef.current) {
        centerPieceRef.current.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (risingLettersTimeoutRef.current) {
        clearTimeout(risingLettersTimeoutRef.current);
      }
    };
  }, []);

  const isDebugMode =
    import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true";

  return (
    <div className={`landing-scene ${isLoaded ? "loaded" : ""}`} id="scene">
      <h1 className="landing-title">Pithos</h1>

      {isDebugMode && <FpsCounter />}
      <div className="grain"></div>

      <VortexCanvas
        configs={VORTEX_CONFIGS}
        className="landing-vortex-container"
      />

      <div className="ambient-glow"></div>

      <div className="landing-center-piece">
        <div
          className="landing-jar-wrapper"
          ref={centerPieceRef}
          onMouseEnter={triggerRisingLetters}
          onMouseLeave={() => {
            isHoveringRef.current = false;
          }}
        >
          <picture>
            <source srcSet="/pithos.webp" type="image/webp" />
            <img
              src="/pithos.png"
              alt="Pithos"
              className="landing-jar"
              onTouchStart={(e) => {
                e.preventDefault();
                triggerRisingLetters();
              }}
            />
          </picture>
        </div>
        {shouldShowRisingLetters && risingLetters.length > 0 && (
          <div key={risingLettersKey} className="rising-letters-container">
            {risingLetters.map((letter, index) => (
              <RisingLetter
                key={`rising-${risingLettersKey}-${index}`}
                letter={letter}
              />
            ))}
          </div>
        )}
      </div>
      <span className="reveal-text">
        <span className="reveal-text-line">Pithos</span>
        <span className="reveal-text-line">is coming...</span>
      </span>
      <span className="landing-credit">2025, by Pierre MOATI</span>
    </div>
  );
}

export default Landing;
