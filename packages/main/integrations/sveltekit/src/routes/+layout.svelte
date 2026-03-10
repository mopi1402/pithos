<script lang="ts">
  import type { Snippet } from 'svelte'
  import '$lib/styles/variables.css'

  import type { LayoutData } from './$types'

  let { children, data }: { children: Snippet; data: LayoutData } = $props()

  let chaosOverride = $state<boolean | null>(null)
  let chaosEnabled = $derived(chaosOverride ?? data.chaosEnabled)

  async function toggleChaos() {
    const next = !chaosEnabled
    const res = await fetch('/api/books/chaos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })
    if (res.ok) {
      chaosOverride = next
    }
  }
</script>

<nav>
  <div class="nav-inner">
    <a href="/" class="brand">Pithos × SvelteKit</a>
    <div class="nav-links">
      <button class="chaos-btn" onclick={toggleChaos} aria-pressed={chaosEnabled}>
        <span class="chaos-dot" class:active={chaosEnabled}></span>
        {chaosEnabled ? 'Chaos mode ON' : 'Chaos mode'}
      </button>
    </div>
  </div>
</nav>

<main>
  {@render children()}
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: var(--font-family);
    color: var(--color-text);
    -webkit-font-smoothing: antialiased;
  }

  nav {
    border-bottom: 1px solid var(--color-border);
    padding: 0 var(--space-2xl);
  }

  .nav-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--nav-height);
  }

  .brand {
    font-size: var(--font-size-md);
    font-weight: 600;
    letter-spacing: -0.025em;
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
  }

  .chaos-btn {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    background: none;
    cursor: pointer;
    transition: border-color var(--transition-fast), color var(--transition-fast);
  }

  .chaos-btn:hover {
    border-color: var(--color-danger-light);
    color: var(--color-danger-dark);
  }

  .chaos-dot {
    display: inline-block;
    width: var(--space-md);
    height: var(--space-md);
    border-radius: var(--radius-full);
    background: var(--color-bg-muted);
  }

  .chaos-dot.active {
    background: var(--color-danger);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-3xl) var(--space-2xl);
  }
</style>
