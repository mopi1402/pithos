import { colors } from './common/colors.js';
import { isQuit } from './common/keyboard.js';
import { loadPackageJson, loadHelpData, getCategories, buildMenuItems } from './cli/data.js';
import { printMainMenu, printCategoryMenu } from './cli/menus.js';
import { SHIMMER_WIDTH } from './cli/logo.js';
import { createInitialState, getCurrentCommand, getOrCreateFlagState, type CliContext } from './cli/state.js';
import { getVisibleFlags, isOnCustomOption, isCustomSelected } from './cli/utils.js';
import { SelectionAnimator } from './cli/animations.js';
import {
  handleMainMenu,
  handleCommandList,
  handleOptionsMode,
  handleTextEditMode,
  executeCommand,
  type HandlerResult
} from './cli/handlers.js';

const c = colors;
const CARET_BLINK_INTERVAL = 530;
const SHIMMER_INTERVAL = 10000;
const SHIMMER_FIRST_DELAY = 1000;
const SHIMMER_FRAME_MS = 15;

async function interactiveMenu(): Promise<void> {
  const packageJson = loadPackageJson();
  const helpData = loadHelpData();
  const scripts = packageJson.scripts ?? {};
  const byCategory = getCategories(scripts, helpData);
  const categories = Array.from(byCategory.keys()).sort();
  const menuItems = buildMenuItems(categories, helpData);
  const selectableItems = menuItems.filter(i => i.type === 'category');

  const ctx: CliContext = { menuItems, selectableItems, byCategory, helpData };
  const state = createInitialState();
  
  let caretInterval: ReturnType<typeof setInterval> | null = null;
  let selectionAnimator: SelectionAnimator | null = null;
  let shimmerPos = -10;
  let shimmerInterval: ReturnType<typeof setInterval> | null = null;
  let shimmerAnimInterval: ReturnType<typeof setInterval> | null = null;

  const shouldShowCaret = (): boolean => {
    if (!state.inOptionsMode || !state.currentCategory) return false;
    const { cmd, flags } = getCurrentCommand(state, ctx);
    if (!cmd) return false;
    const visibleFlags = getVisibleFlags(flags);
    const currentFlag = visibleFlags[state.flagIndex];
    if (!currentFlag) return false;
    if (currentFlag.type === 'text') return true;
    const flagState = getOrCreateFlagState(state, cmd.name);
    return isOnCustomOption(currentFlag, state.subOptionIndex) && isCustomSelected(currentFlag, flagState);
  };

  const getSelectedLabelLength = (): number => {
    if (state.currentCategory === null) {
      const item = ctx.selectableItems[state.selectedIndex];
      return item?.label.length ?? 0;
    } else {
      const commands = ctx.byCategory.get(state.currentCategory) ?? [];
      const cmd = commands[state.commandIndex];
      if (cmd) return `pnpm ${cmd.name}`.length;
    }
    return 0;
  };

  const render = () => {
    const animProgress = selectionAnimator?.getSelectionProgress() ?? 999;
    const arrowFrame = selectionAnimator?.getArrowFrame() ?? 0;
    
    if (state.currentCategory === null) {
      printMainMenu(ctx.menuItems, state.selectedIndex, ctx.helpData, animProgress, arrowFrame, shimmerPos);
    } else {
      const commands = ctx.byCategory.get(state.currentCategory) ?? [];
      printCategoryMenu(
        state.currentCategory, commands, state.commandIndex, state.inOptionsMode,
        state.flagIndex, state.subOptionIndex, state.flagStates, state.textEditMode,
        state.caretVisible, animProgress, arrowFrame, shimmerPos
      );
    }
    
    if (shouldShowCaret()) {
      if (!caretInterval) {
        caretInterval = setInterval(() => {
          state.caretVisible = !state.caretVisible;
          render();
        }, CARET_BLINK_INTERVAL);
      }
    } else if (caretInterval) {
      clearInterval(caretInterval);
      caretInterval = null;
      state.caretVisible = true;
    }
  };

  const startSelectionAnimation = () => {
    selectionAnimator?.stop();
    selectionAnimator = new SelectionAnimator(render);
    selectionAnimator.start(getSelectedLabelLength());
  };

  const stopAllAnimations = () => {
    if (caretInterval) { clearInterval(caretInterval); caretInterval = null; }
    if (shimmerAnimInterval) { clearInterval(shimmerAnimInterval); shimmerAnimInterval = null; }
    if (shimmerInterval) { clearInterval(shimmerInterval); shimmerInterval = null; }
    selectionAnimator?.stop();
  };

  const startShimmer = () => {
    if (state.runningCommand) return;
    shimmerPos = -10;
    if (shimmerAnimInterval) clearInterval(shimmerAnimInterval);
    shimmerAnimInterval = setInterval(() => {
      if (state.runningCommand) {
        if (shimmerAnimInterval) { clearInterval(shimmerAnimInterval); shimmerAnimInterval = null; }
        return;
      }
      shimmerPos++;
      if (shimmerPos > SHIMMER_WIDTH) {
        shimmerPos = -10;
        if (shimmerAnimInterval) { clearInterval(shimmerAnimInterval); shimmerAnimInterval = null; }
      }
      render();
    }, SHIMMER_FRAME_MS);
  };

  const onResize = () => {
    if (!state.runningCommand) render();
  };

  // Wait for a fresh keypress
  // Strategy: pause stdin, drain buffer synchronously, then wait for new data
  const waitForFreshKey = (): Promise<void> => {
    return new Promise((resolve) => {
      // Pause to switch to "paused mode" where we can use read()
      process.stdin.pause();
      
      // Drain any buffered data synchronously
      while (process.stdin.read() !== null) {
        // Discard
      }
      
      // Now resume and wait for ONE fresh keypress
      process.stdin.resume();
      process.stdin.once('data', () => resolve());
    });
  };

  // Setup
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdout.write(c.hideCursor);
  process.stdout.write(c.enterAltScreen);
  process.stdout.on('resize', onResize);

  setTimeout(() => {
    startShimmer();
    shimmerInterval = setInterval(startShimmer, SHIMMER_INTERVAL);
  }, SHIMMER_FIRST_DELAY);

  selectionAnimator = new SelectionAnimator(render);
  selectionAnimator.start(getSelectedLabelLength());
  render();

  // Main loop - using readable events instead of for-await
  const processKey = async (key: Buffer): Promise<boolean> => {
    if (isQuit(key)) {
      stopAllAnimations();
      process.stdout.removeListener('resize', onResize);
      process.stdout.write(c.exitAltScreen);
      process.stdout.write(c.showCursor);
      return false; // exit
    }

    let result: HandlerResult = 'none';

    if (state.currentCategory === null) {
      result = handleMainMenu(key, state, ctx);
    } else if (state.textEditMode) {
      result = handleTextEditMode(key, state, ctx);
    } else if (state.inOptionsMode) {
      result = handleOptionsMode(key, state, ctx);
    } else {
      result = handleCommandList(key, state, ctx);
    }

    if (result === 'render') {
      state.caretVisible = true;
      startSelectionAnimation();
      render();
    } else if (result === 'run') {
      // === BEFORE CHILD ===
      // Stop everything and release ALL listeners
      stopAllAnimations();
      process.stdout.removeListener('resize', onResize);
      process.stdin.removeListener('data', onData);
      process.stdout.write(c.exitAltScreen);
      process.stdout.write(c.showCursor);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      
      // Run child - it has full control now
      state.runningCommand = true;
      await executeCommand(state, ctx);
      state.runningCommand = false;
      
      // === AFTER CHILD ===
      // Show message, then wait for a FRESH keypress
      console.log(`\n${c.dim}Press any key to return...${c.reset}`);
      if (process.stdin.isTTY) process.stdin.setRawMode(true);
      process.stdin.resume();
      await waitForFreshKey();
      
      // === NOW restore everything ===
      process.stdout.write(c.hideCursor);
      process.stdout.write(c.enterAltScreen);
      process.stdout.on('resize', onResize);
      process.stdin.on('data', onData);
      shimmerInterval = setInterval(startShimmer, SHIMMER_INTERVAL);
      selectionAnimator = new SelectionAnimator(render);
      selectionAnimator.start(getSelectedLabelLength());
      render();
    }
    
    return true; // continue
  };

  // Event-driven main loop
  const onData = async (key: Buffer) => {
    const shouldContinue = await processKey(key);
    if (!shouldContinue) {
      process.exit(0);
    }
  };
  
  process.stdin.on('data', onData);
}

interactiveMenu().catch(console.error);
