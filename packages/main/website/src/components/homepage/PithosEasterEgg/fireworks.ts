/**
 * Firework effect using the Web Animations API.
 *
 * 1. A rocket trail launches upward from (x, y)
 * 2. At the apex, it explodes into Greek letters radiating outward
 * 3. Letters fall with gravity and fade out progressively
 */

const PARTICLE_COUNT = 40;

const LETTERS = ["P", "I", "T", "H", "O", "S"];

const COLORS = [
  "#3b82f6", // bleu
  "#ef4444", // rouge
  "#22c55e", // vert
  "#ec4899", // rose
  "#a855f7", // violet
  "#eab308", // jaune
  "#f97316", // orange
  "#06b6d4", // cyan
  "#f26f17", // pithos orange
];

function createDot(size: number, color: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.style.position = "fixed";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.pointerEvents = "none";
  el.style.zIndex = "10000";
  el.style.background = color;
  el.style.opacity = "0";
  return el;
}

function createLetter(color: string, fontSize: number): HTMLSpanElement {
  const el = document.createElement("span");
  el.textContent = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  el.style.position = "fixed";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.pointerEvents = "none";
  el.style.zIndex = "10000";
  el.style.color = color;
  el.style.fontSize = `${fontSize}px`;
  el.style.fontWeight = "bold";
  el.style.lineHeight = "1";
  el.style.opacity = "0";
  el.style.userSelect = "none";
  el.style.textShadow = `0 0 6px ${color}`;
  return el;
}

export interface ExplosionEvent {
  x: number;
  y: number;
  color: string;
}

export type OnExplodeCallback = (event: ExplosionEvent) => void;

export function spawnFirework(
  startX: number,
  startY: number,
  onExplode?: OnExplodeCallback,
): void {
  const apexX = startX + (Math.random() - 0.5) * 500;
  const apexY = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.05;

  // --- Phase 1: Rocket trail ---
  const rocketSize = 4;
  const trailCount = 8;
  const rocketDuration = 500 + Math.random() * 300;

  for (let i = 0; i < trailCount; i++) {
    const dot = createDot(rocketSize - i * 0.3, "#ffd166");
    document.body.appendChild(dot);

    const wobbleX = (Math.random() - 0.5) * 6;
    const anim = dot.animate(
      [
        {
          transform: `translate(${startX - rocketSize / 2}px, ${startY - rocketSize / 2}px)`,
          opacity: 0.9,
        },
        {
          transform: `translate(${apexX - rocketSize / 2 + wobbleX}px, ${apexY - rocketSize / 2}px)`,
          opacity: 0,
        },
      ],
      {
        duration: rocketDuration,
        easing: "cubic-bezier(0.2, 0.8, 0.4, 1)",
        delay: i * 30,
        fill: "forwards",
      },
    );
    anim.onfinish = () => dot.remove();
  }

  // --- Phase 2: Explosion of Greek letters ---
  setTimeout(() => {
    // Flash
    const flash = createDot(12, "#fff");
    document.body.appendChild(flash);
    const flashAnim = flash.animate(
      [
        { transform: `translate(${apexX - 6}px, ${apexY - 6}px) scale(1)`, opacity: 1 },
        { transform: `translate(${apexX - 6}px, ${apexY - 6}px) scale(3)`, opacity: 0 },
      ],
      { duration: 300, easing: "ease-out", fill: "forwards" },
    );
    flashAnim.onfinish = () => flash.remove();

    const mainColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    onExplode?.({ x: apexX, y: apexY, color: mainColor });

    // Halo: large radial glow that lights up the background
    const haloSize = 300;
    const halo = document.createElement("span");
    halo.style.position = "fixed";
    halo.style.left = "0px";
    halo.style.top = "0px";
    halo.style.width = `${haloSize}px`;
    halo.style.height = `${haloSize}px`;
    halo.style.borderRadius = "50%";
    halo.style.pointerEvents = "none";
    halo.style.zIndex = "9999";
    halo.style.background = `radial-gradient(circle, ${mainColor}88 0%, ${mainColor}44 30%, transparent 70%)`;
    halo.style.opacity = "0";
    halo.style.mixBlendMode = "screen";
    document.body.appendChild(halo);

    const haloAnim = halo.animate(
      [
        {
          transform: `translate(${apexX - haloSize / 2}px, ${apexY - haloSize / 2}px) scale(0.5)`,
          opacity: 0.9,
          offset: 0,
        },
        {
          transform: `translate(${apexX - haloSize / 2}px, ${apexY - haloSize / 2}px) scale(1.5)`,
          opacity: 0.6,
          offset: 0.3,
        },
        {
          transform: `translate(${apexX - haloSize / 2}px, ${apexY - haloSize / 2}px) scale(2)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: 1200,
        easing: "ease-out",
        fill: "forwards",
      },
    );
    haloAnim.onfinish = () => halo.remove();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const fontSize = Math.floor(Math.random() * 16 + 10);
      const color = mainColor;
      const letter = createLetter(color, fontSize);
      document.body.appendChild(letter);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 30;
      const burstX = apexX + Math.cos(angle) * speed;
      const burstY = apexY + Math.sin(angle) * speed;
      const fallY = burstY + Math.random() * 80 + 40;
      const rotation = (Math.random() - 0.5) * 360;

      const duration = 800 + Math.random() * 1000;

      const anim = letter.animate(
        [
          {
            transform: `translate(${apexX}px, ${apexY}px) scale(1) rotate(0deg)`,
            opacity: 1,
            offset: 0,
          },
          {
            transform: `translate(${burstX}px, ${burstY}px) scale(0.9) rotate(${rotation * 0.5}deg)`,
            opacity: 0.85,
            offset: 0.3,
          },
          {
            transform: `translate(${burstX}px, ${fallY}px) scale(0.3) rotate(${rotation}deg)`,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.2, 0.6, 0.4, 1)",
          delay: Math.random() * 100,
          fill: "forwards",
        },
      );

      anim.onfinish = () => letter.remove();
    }
  }, rocketDuration);
}
