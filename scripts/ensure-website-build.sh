#!/usr/bin/env bash
# Ensures the website build directory exists before running a command.
# - No build → asks to build (default Y)
# - Build exists → asks to rebuild (default N)
# Usage: ./scripts/ensure-website-build.sh && <your-command>

BUILD_DIR="packages/main/website/build"

if [ -d "$BUILD_DIR" ]; then
  read -r -p "🔄 Build already exists. Rebuild? [y/N] " answer
  case "$answer" in
    [yY]) pnpm doc:build || exit 1 ;;
    *) echo "→ Using existing build." ;;
  esac
else
  read -r -p "📦 No build found. Build now? [Y/n] " answer
  case "$answer" in
    [nN]) echo "❌ Aborted." && exit 1 ;;
    *) pnpm doc:build || exit 1 ;;
  esac
fi
