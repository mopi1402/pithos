#!/usr/bin/env bash
# Wrapper for Lighthouse CI that supports preset selection.
# Usage: ./scripts/run-lighthouse.sh [desktop|perf|experimental|mobile]
# Default: desktop

MODE="${1:-desktop}"
LHCI="pnpm dlx @lhci/cli@0.14.x"

case "$MODE" in
  desktop)
    $LHCI autorun --collect.settings.preset=desktop
    ;;
  perf)
    $LHCI autorun --collect.settings.preset=perf
    ;;
  experimental)
    $LHCI autorun --collect.settings.preset=experimental
    ;;
  mobile)
    $LHCI autorun --collect.settings.formFactor=mobile --collect.settings.throttling.cpuSlowdownMultiplier=4 --collect.settings.screenEmulation.mobile=true
    ;;
  *)
    echo "❌ Unknown mode: $MODE. Use: desktop, perf, experimental, mobile"
    exit 1
    ;;
esac
