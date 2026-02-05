import { type ReactNode, useCallback, useRef, useLayoutEffect, useState, useEffect } from "react";
import { Picture } from "@site/src/components/shared/Picture";
import { FireworkEngine, type ExplosionEvent } from "./fireworksCanvas";

import styles from "./styles.module.css";

interface PithosEasterEggProps {
  startRect: DOMRect;
  titleRect: DOMRect | null;
  taglineRect: DOMRect | null;
  heroTitleRef: React.RefObject<HTMLElement | null>;
  heroTaglineRef: React.RefObject<HTMLElement | null>;
  heroJarRef: React.RefObject<HTMLElement | null>;
  animating: boolean;
  onClose: () => void;
  onReady: () => void;
  onReturnDone: () => void;
}

const DURATION = 800;
const STEPS = 20;

function sampleBezier(
  p0x: number, p0y: number,
  cx: number, cy: number,
  p1x: number, p1y: number,
  steps: number,
  zPeak = 0,
): Keyframe[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * p0x + 2 * u * t * cx + t * t * p1x;
    const y = u * u * p0y + 2 * u * t * cy + t * t * p1y;
    const z = zPeak * Math.sin(t * Math.PI);
    return { transform: `translate3d(${x}px, ${y}px, ${z}px)`, opacity: 1, offset: t };
  });
}

export default function PithosEasterEgg({
  startRect, titleRect: initialTitleRect, taglineRect: initialTaglineRect,
  heroTitleRef, heroTaglineRef, heroJarRef,
  animating, onClose, onReady, onReturnDone,
}: PithosEasterEggProps): ReactNode {
  const jarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FireworkEngine | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineCloneRef = useRef<HTMLDivElement>(null);
  const readyFired = useRef(false);
  const [arrived, setArrived] = useState(false);
  const arrivedRef = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const [textRects, setTextRects] = useState<{ title: DOMRect | null; tagline: DOMRect | null }>({
    title: initialTitleRect,
    tagline: initialTaglineRect,
  });
  const [landscape, setLandscape] = useState(
    () => window.innerWidth <= 900 && window.innerWidth > window.innerHeight,
  );

  // Gradient-based text lighting (DOM)
  const explosionsRef = useRef<{ x: number; color: string; startTime: number }[]>([]);
  const gradientRafRef = useRef<number>(0);
  const cachedRectsRef = useRef<{ title: DOMRect | null; tagline: DOMRect | null }>({ title: null, tagline: null });

  const updateTitleGradient = useCallback(() => {
    const titleEl = titleRef.current;
    const taglineEl = taglineCloneRef.current;
    const els = [titleEl, taglineEl].filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const now = performance.now();
    const FADE = 1500;
    explosionsRef.current = explosionsRef.current.filter((e) => now - e.startTime < FADE);

    if (explosionsRef.current.length === 0) {
      for (const el of els) {
        el.style.backgroundImage = "none";
        el.style.color = "transparent";
      }
      return;
    }

    // Cache rects once (they don't move)
    const rects = cachedRectsRef.current;
    if (!rects.title && titleEl) rects.title = titleEl.getBoundingClientRect();
    if (!rects.tagline && taglineEl) rects.tagline = taglineEl.getBoundingClientRect();

    for (const el of els) {
      const rect = el === titleEl ? rects.title : rects.tagline;
      if (!rect) continue;

      const gradients = explosionsRef.current.map((e) => {
        const t = (now - e.startTime) / FADE;
        const opacity = Math.max(0, 1 - t);
        const relX = ((e.x - rect.left) / rect.width) * 100;
        const hex = Math.round(opacity * 180).toString(16).padStart(2, "0");
        return `radial-gradient(circle 300px at ${relX}% 50%, ${e.color}${hex} 0%, transparent 100%)`;
      });

      el.style.backgroundImage = gradients.join(", ");
      el.style.color = "transparent";
    }

    gradientRafRef.current = requestAnimationFrame(updateTitleGradient);
  }, []);

  const handleExplode = useCallback((event: ExplosionEvent) => {
    explosionsRef.current.push({ x: event.x, color: event.color, startTime: performance.now() });
    cancelAnimationFrame(gradientRafRef.current);
    gradientRafRef.current = requestAnimationFrame(updateTitleGradient);
  }, [updateTitleGradient]);

  const fromX = startRect.left;
  const fromY = startRect.top;

  // Jar target position — recalculated on resize
  const computeTarget = useCallback(() => ({
    x: window.innerWidth / 2 - startRect.width / 2,
    y: window.innerHeight * 0.95 - startRect.height,
  }), [startRect.width, startRect.height]);

  const targetRef = useRef(computeTarget());
  const targetX = targetRef.current.x;
  const targetY = targetRef.current.y;
  const ctrlX = (fromX + targetX) / 2;
  const ctrlY = Math.min(fromY, targetY) - 200;

  // Init canvas engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new FireworkEngine(canvas, handleExplode);
    engineRef.current = engine;
    engine.start();
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleExplode]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [onClose]);

  // Recalculate positions on resize
  useEffect(() => {
    const handleResize = () => {
      // Landscape detection
      const isLandscape = window.innerWidth <= 900 && window.innerWidth > window.innerHeight;
      setLandscape(isLandscape);

      // Jar: reposition and resize
      const heroRect = heroJarRef.current?.getBoundingClientRect();
      const jarW = heroRect ? heroRect.width : startRect.width;
      const jarH = heroRect ? heroRect.height : startRect.height;
      const newTarget = {
        x: window.innerWidth / 2 - jarW / 2,
        y: window.innerHeight * 0.95 - jarH,
      };
      targetRef.current = newTarget;
      const el = jarRef.current;
      if (el && arrivedRef.current) {
        el.style.width = `${jarW}px`;
        el.style.height = `${jarH}px`;
        el.style.transform = `translate3d(${newTarget.x}px, ${newTarget.y}px, 0px)`;
        el.style.opacity = "1";
      }

      // Text: reposition
      cachedRectsRef.current = { title: null, tagline: null };
      setTextRects({
        title: heroTitleRef.current?.getBoundingClientRect() ?? null,
        tagline: heroTaglineRef.current?.getBoundingClientRect() ?? null,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [startRect, heroJarRef, heroTitleRef, heroTaglineRef]);

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Cleanup gradient RAF
  useEffect(() => () => cancelAnimationFrame(gradientRafRef.current), []);

  // Forward animation
  useLayoutEffect(() => {
    const el = jarRef.current;
    if (!el || readyFired.current) return;
    readyFired.current = true;

    // Wait one frame so the GPU layer (will-change) is promoted before animating
    requestAnimationFrame(() => {
      const frames = sampleBezier(fromX, fromY, ctrlX, ctrlY, targetX, targetY, STEPS, 250);
      const anim = el.animate(frames, { duration: DURATION, easing: "linear" });
      onReady();
      const overlayAnim = overlayRef.current?.animate(
        [{ backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "rgba(0,0,0,0.92)" }],
        { duration: DURATION, easing: "ease-out" },
      );
      anim.onfinish = () => {
        el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0px)`;
        el.style.opacity = "1";
        if (overlayRef.current) overlayRef.current.style.backgroundColor = "rgba(0,0,0,0.92)";
        requestAnimationFrame(() => requestAnimationFrame(() => { arrivedRef.current = true; setArrived(true); }));
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reverse animation (only when animating goes from true → false)
  useLayoutEffect(() => {
    if (animating) return;          // only act on close (false)
    const el = jarRef.current;
    if (!el || !arrived) return;
    setLeaving(true);
    arrivedRef.current = false;
    setArrived(false);
    // Recalculate return position (hero jar may have moved after resize)
    const heroRect = heroJarRef.current?.getBoundingClientRect();
    const retX = heroRect ? heroRect.left : fromX;
    const retY = heroRect ? heroRect.top : fromY;
    const curTarget = targetRef.current;
    const retCtrlX = (curTarget.x + retX) / 2;
    const retCtrlY = Math.min(curTarget.y, retY) - 200;
    const frames = sampleBezier(curTarget.x, curTarget.y, retCtrlX, retCtrlY, retX, retY, STEPS, 250);
    const anim = el.animate(frames, { duration: DURATION, easing: "linear" });
    overlayRef.current?.animate(
      [{ backgroundColor: "rgba(0,0,0,0.92)" }, { backgroundColor: "rgba(0,0,0,0)" }],
      { duration: DURATION, easing: "ease-in" },
    );
    anim.onfinish = () => {
      el.style.transform = `translate3d(${retX}px, ${retY}px, 0px)`;
      el.style.opacity = "1";
      if (overlayRef.current) overlayRef.current.style.backgroundColor = "rgba(0,0,0,0)";
      onReturnDone();
    };
  }, [animating]); // eslint-disable-line react-hooks/exhaustive-deps

  const fireFromJar = useCallback(() => {
    if (landscape) return;
    if (arrived && jarRef.current && engineRef.current) {
      const rect = jarRef.current.getBoundingClientRect();
      engineRef.current.spawnFirework(rect.left + rect.width / 2, rect.top + rect.height * 0.05);
    }
  }, [arrived, landscape]);

  const handleJarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    fireFromJar();
  }, [fireFromJar]);

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={arrived ? onClose : undefined} role="presentation">
      <canvas ref={canvasRef} className={styles.fireworkCanvas} aria-hidden="true" />
      {(arrived || leaving) && (
        <button
          className={`${styles.closeButton} ${leaving ? styles.closeButtonLeaving : ""}`}
          onClick={onClose}
          aria-label="Close easter egg"
        >
          ✕
        </button>
      )}
      {arrived && (
        <div className={styles.backdropTextGroup}>
          <div
            ref={titleRef}
            className={styles.backdropTitle}
            aria-hidden="true"
            style={textRects.title ? {
              top: `${textRects.title.top}px`,
              left: `${textRects.title.left}px`,
              width: `${textRects.title.width}px`,
              height: `${textRects.title.height}px`,
            } : undefined}
          >
            Pithos
          </div>
          <div
            ref={taglineCloneRef}
            className={styles.backdropTagline}
            aria-hidden="true"
            style={textRects.tagline ? {
              top: `${textRects.tagline.top}px`,
              left: `${textRects.tagline.left}px`,
              width: `${textRects.tagline.width}px`,
              height: `${textRects.tagline.height}px`,
            } : undefined}
          >
            <span style={{ whiteSpace: "nowrap" }}>Everything you need.</span>{" "}
            <span style={{ whiteSpace: "nowrap" }}>Nothing you don&apos;t.</span>
            <br />
            <span style={{ whiteSpace: "nowrap" }}>Zero dependencies.</span>{" "}
            <span style={{ whiteSpace: "nowrap" }}>100%&nbsp;TypeScript.</span>
          </div>
        </div>
      )}
      {landscape && arrived && (
        <div className={styles.landscapeNotice} role="status">
          <span className={styles.rotateIcon} aria-hidden="true">📱</span>
          Tournez votre téléphone en mode portrait
        </div>
      )}
      <div
        ref={jarRef}
        className={styles.jar}
        style={{
          position: "fixed", top: 0, left: 0,
          width: `${startRect.width}px`, height: `${startRect.height}px`,
          opacity: 0,
          visibility: landscape && arrived ? "hidden" : "visible",
        }}
        onClick={handleJarClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fireFromJar();
        }}
      >
        <Picture
          src="/img/generated/logos/pithos"
          alt="Pithos Easter Egg"
          widths={[120, 180, 360]}
          sizes="360px"
        />
      </div>
    </div>
  );
}
