import { colors } from '../common/colors.js';

const c = colors;

// ============================================
// Animation Config
// ============================================

const SELECTION_ANIMATION_DURATION_MS = 150;
const ANIMATION_FRAME_MS = 16; // ~60fps

// Arrow bounce animation (fixed width, small bounce)
const ARROW_BOUNCE_FRAMES = ['▸ ', ' ▸', ' ▸', '▸ '];
const ARROW_BOUNCE_FRAME_MS = 50;

// ============================================
// Animation State
// ============================================

export interface AnimationState {
  // Selection highlight
  selectionProgress: number;
  selectionTarget: number;
  
  // Arrow bounce
  arrowFrame: number;
  arrowBouncing: boolean;
}

export function createAnimationState(): AnimationState {
  return {
    selectionProgress: 999,
    selectionTarget: 0,
    arrowFrame: 0,
    arrowBouncing: false,
  };
}

// ============================================
// Animated Label Renderer
// ============================================

/**
 * Render a label with animated selection highlight
 */
export function renderAnimatedLabel(
  text: string,
  progress: number,
  isFullySelected: boolean
): string {
  if (!isFullySelected) {
    return `${c.bold}${text}${c.reset}`;
  }
  
  const visibleChars = Math.min(Math.floor(progress), text.length);
  
  if (visibleChars >= text.length) {
    return `${c.bgOrange}${c.black} ${text} ${c.reset}`;
  }
  
  if (visibleChars <= 0) {
    return `${c.bold}${text}${c.reset}`;
  }
  
  const highlighted = text.slice(0, visibleChars);
  const remaining = text.slice(visibleChars);
  
  return `${c.bgOrange}${c.black} ${highlighted}${c.reset}${c.bold}${remaining} ${c.reset}`;
}

/**
 * Render the animated arrow prefix (fixed width)
 */
export function renderAnimatedArrow(arrowFrame: number, isSelected: boolean): string {
  if (!isSelected) return '  '; // Same width as animated frames
  const arrow = ARROW_BOUNCE_FRAMES[arrowFrame] ?? '▸ ';
  return `${c.cyan}${arrow}${c.reset}`;
}

// ============================================
// Selection Animator
// ============================================

export type AnimationCallback = () => void;

export class SelectionAnimator {
  private state: AnimationState;
  private selectionInterval: ReturnType<typeof setInterval> | null = null;
  private arrowInterval: ReturnType<typeof setInterval> | null = null;
  private onFrame: AnimationCallback;
  
  constructor(onFrame: AnimationCallback) {
    this.state = createAnimationState();
    this.onFrame = onFrame;
  }
  
  /**
   * Start animation for a new selection
   */
  start(targetLength: number): void {
    this.stop();
    
    this.state.selectionProgress = 0;
    this.state.selectionTarget = targetLength + 2;
    this.state.arrowFrame = 0;
    this.state.arrowBouncing = true;
    
    const step = this.state.selectionTarget / (SELECTION_ANIMATION_DURATION_MS / ANIMATION_FRAME_MS);
    
    // Selection highlight animation
    this.selectionInterval = setInterval(() => {
      this.state.selectionProgress += step;
      
      if (this.state.selectionProgress >= this.state.selectionTarget) {
        this.state.selectionProgress = this.state.selectionTarget;
        if (this.selectionInterval) {
          clearInterval(this.selectionInterval);
          this.selectionInterval = null;
        }
      }
      
      this.onFrame();
    }, ANIMATION_FRAME_MS);
    
    // Arrow bounce animation
    this.arrowInterval = setInterval(() => {
      this.state.arrowFrame++;
      
      if (this.state.arrowFrame >= ARROW_BOUNCE_FRAMES.length) {
        this.state.arrowFrame = 0;
        this.state.arrowBouncing = false;
        if (this.arrowInterval) {
          clearInterval(this.arrowInterval);
          this.arrowInterval = null;
        }
      }
      
      this.onFrame();
    }, ARROW_BOUNCE_FRAME_MS);
  }
  
  /**
   * Stop all animations
   */
  stop(): void {
    if (this.selectionInterval) {
      clearInterval(this.selectionInterval);
      this.selectionInterval = null;
    }
    if (this.arrowInterval) {
      clearInterval(this.arrowInterval);
      this.arrowInterval = null;
    }
  }
  
  /**
   * Get current selection progress
   */
  getSelectionProgress(): number {
    return this.state.selectionProgress;
  }
  
  /**
   * Get current arrow frame
   */
  getArrowFrame(): number {
    return this.state.arrowFrame;
  }
  
  /**
   * Check if any animation is active
   */
  isActive(): boolean {
    return this.selectionInterval !== null || this.arrowInterval !== null;
  }
}
