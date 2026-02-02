import { useEffect, useState, useRef } from "preact/hooks";
import "./fps-counter.css";

function FpsCounter() {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const measureFps = () => {
      frameCountRef.current += 1;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(measureFps);
    };

    animationFrameRef.current = requestAnimationFrame(measureFps);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getFpsColor = () => {
    if (fps >= 55) return "fps-excellent";
    if (fps >= 30) return "fps-good";
    if (fps >= 20) return "fps-warning";
    return "fps-poor";
  };

  return (
    <div className="fps-counter">
      <div className="fps-label">FPS</div>
      <div className={`fps-value ${getFpsColor()}`}>{fps}</div>
    </div>
  );
}

export default FpsCounter;

