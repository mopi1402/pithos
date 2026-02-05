/**
 * Canvas-based firework engine — optimized.
 * Sprites pre-rendered, particles pooled, draw calls batched.
 * Text reflections handled by DOM (notified via onExplode callback).
 */

const COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#ec4899",
  "#a855f7", "#eab308", "#f97316", "#06b6d4", "#f26f17",
];
const LETTERS = ["P", "I", "T", "H", "O", "S"];
const PARTICLE_COUNT = 40;

export interface ExplosionEvent { x: number; y: number; color: string }

const enum PType { Trail, Letter, Flash, Halo }

type SpriteCanvas = OffscreenCanvas | HTMLCanvasElement;

const hasOffscreen = typeof OffscreenCanvas !== "undefined";

function createCanvas(w: number, h: number): SpriteCanvas {
  if (hasOffscreen) return new OffscreenCanvas(w, h);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

interface Particle {
  type: PType;
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  startX: number; startY: number;
  endX: number; endY: number;
  sprite: SpriteCanvas | null;
  haloSprite: SpriteCanvas | null;
  alive: boolean;
}

/** Sprite cache */
const spriteCache = new Map<string, SpriteCanvas>();

function getSprite(letter: string, size: number, color: string): SpriteCanvas {
  const key = `${letter}|${size}|${color}`;
  let c = spriteCache.get(key);
  if (c) return c;
  const pad = 4;
  const dim = size + pad * 2;
  c = createCanvas(dim, dim);
  const cx = c.getContext("2d")! as CanvasRenderingContext2D;
  cx.font = `bold ${size}px sans-serif`;
  cx.textAlign = "center";
  cx.textBaseline = "middle";
  cx.fillStyle = color;
  cx.fillText(letter, dim / 2, dim / 2);
  spriteCache.set(key, c);
  return c;
}

/** Pre-rendered halo sprite: soft radial gradient, cached per color */
const haloCache = new Map<string, SpriteCanvas>();
const HALO_SPRITE_SIZE = 256;

function getHaloSprite(color: string): SpriteCanvas {
  let c = haloCache.get(color);
  if (c) return c;
  const s = HALO_SPRITE_SIZE;
  c = createCanvas(s, s);
  const cx = c.getContext("2d")! as CanvasRenderingContext2D;
  const half = s / 2;
  const grad = cx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, color + "cc");
  grad.addColorStop(0.25, color + "66");
  grad.addColorStop(0.6, color + "22");
  grad.addColorStop(1, "transparent");
  cx.fillStyle = grad;
  cx.fillRect(0, 0, s, s);
  haloCache.set(color, c);
  return c;
}

/** Object pool to avoid GC pressure */
const pool: Particle[] = [];

function acquire(): Particle {
  const p = pool.pop();
  if (p) { p.alive = true; return p; }
  return {
    type: PType.Trail, x: 0, y: 0, vx: 0, vy: 0,
    life: 0, maxLife: 0, size: 0, color: "",
    rotation: 0, rotationSpeed: 0,
    startX: 0, startY: 0, endX: 0, endY: 0,
    sprite: null, haloSprite: null, alive: true,
  };
}

function release(p: Particle): void {
  p.alive = false;
  p.sprite = null;
  p.haloSprite = null;
  pool.push(p);
}

export class FireworkEngine {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private w = 0;
  private h = 0;
  private onExplode?: (e: ExplosionEvent) => void;
  private pendingTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(canvas: HTMLCanvasElement, onExplode?: (e: ExplosionEvent) => void) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.onExplode = onExplode;
    this.resize();
  }

  resize(): void {
    const dpr = devicePixelRatio || 1;
    const canvas = this.ctx.canvas;
    this.w = innerWidth;
    this.h = innerHeight;
    canvas.width = this.w * dpr;
    canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  spawnFirework(startX: number, startY: number): void {
    const color = COLORS[(Math.random() * COLORS.length) | 0];
    const apexX = startX + (Math.random() - 0.5) * 500;
    const apexY = Math.random() * this.h * 0.4 + this.h * 0.05;
    const dur = 250 + Math.random() * 150;

    for (let i = 0; i < 8; i++) {
      const p = acquire();
      p.type = PType.Trail;
      p.x = startX; p.y = startY;
      p.vx = 0; p.vy = 0;
      p.life = 0; p.maxLife = dur + i * 30;
      p.size = 3 - i * 0.3; p.color = "#ffd166";
      p.rotation = 0; p.rotationSpeed = 0;
      p.startX = startX; p.startY = startY;
      p.endX = apexX; p.endY = apexY;
      p.sprite = null;
      this.particles.push(p);
    }

    const timer = setTimeout(() => {
      this.explode(apexX, apexY, color);
      const idx = this.pendingTimers.indexOf(timer);
      if (idx !== -1) this.pendingTimers.splice(idx, 1);
    }, dur);
    this.pendingTimers.push(timer);
  }

  private explode(x: number, y: number, color: string): void {
    this.onExplode?.({ x, y, color });

    // Flash
    const f = acquire();
    f.type = PType.Flash; f.x = x; f.y = y;
    f.life = 0; f.maxLife = 300; f.size = 12; f.color = "#ffffff";
    f.vx = 0; f.vy = 0; f.rotation = 0; f.rotationSpeed = 0;
    f.sprite = null;
    this.particles.push(f);

    // Halo
    const hl = acquire();
    hl.type = PType.Halo; hl.x = x; hl.y = y;
    hl.life = 0; hl.maxLife = 1200; hl.size = 150; hl.color = color;
    hl.vx = 0; hl.vy = 0; hl.rotation = 0; hl.rotationSpeed = 0;
    hl.sprite = null; hl.haloSprite = getHaloSprite(color);
    this.particles.push(hl);

    // Letters
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const size = (Math.random() * 16 + 10) | 0;
      const letter = LETTERS[(Math.random() * 6) | 0];
      const p = acquire();
      p.type = PType.Letter; p.x = x; p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.5;
      p.life = 0; p.maxLife = 800 + Math.random() * 1000;
      p.size = size; p.color = color;
      p.sprite = getSprite(letter, size, color);
      p.rotation = 0;
      p.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.particles.push(p);
    }
  }

  private tick = (): void => {
    if (!this.running) return;
    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    if (dt < 100) {
      this.update(dt);
      this.draw();
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private update(dt: number): void {
    const ps = this.particles;
    let write = 0;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      p.life += dt;
      if (p.life >= p.maxLife) { release(p); continue; }

      if (p.type === PType.Letter) {
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
      } else if (p.type === PType.Trail) {
        const t = p.life / p.maxLife;
        const ease = 1 - (1 - t) * (1 - t);
        p.x = p.startX + (p.endX - p.startX) * ease;
        p.y = p.startY + (p.endY - p.startY) * ease;
      }
      ps[write++] = p;
    }
    ps.length = write;
  }

  private draw(): void {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    ctx.clearRect(0, 0, w, h);

    const ps = this.particles;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const t = p.life / p.maxLife;
      const alpha = 1 - t;

      switch (p.type) {
        case PType.Trail:
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size > 0.5 ? p.size : 0.5, 0, 6.2832);
          ctx.fill();
          break;

        case PType.Flash: {
          const s = 1 + t * 2;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * s, 0, 6.2832);
          ctx.fill();
          break;
        }

        case PType.Halo: {
          if (p.haloSprite) {
            const scale = 0.5 + t * 1.5;
            const drawSize = p.size * scale * 2;
            ctx.globalAlpha = alpha * 0.6;
            ctx.drawImage(p.haloSprite, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
          }
          break;
        }

        case PType.Letter:
          if (p.sprite) {
            ctx.globalAlpha = alpha;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            const half = p.sprite.width / 2;
            ctx.drawImage(p.sprite, -half, -half);
            ctx.restore();
          }
          break;
      }
    }
    ctx.globalAlpha = 1;
  }

  destroy(): void {
    this.stop();
    for (const t of this.pendingTimers) clearTimeout(t);
    this.pendingTimers.length = 0;
    for (const p of this.particles) release(p);
    this.particles.length = 0;
  }
}
