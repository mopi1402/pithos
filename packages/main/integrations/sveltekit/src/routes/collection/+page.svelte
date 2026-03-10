<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

{#if form?.error}
  <p class="alert error" role="alert">{form.error}</p>
{/if}

{#if data.total === 0}
  <div class="empty">
    <p class="empty-icon">📚</p>
    <h1 class="empty-title">Your collection is empty</h1>
    <p class="empty-sub">Add your first book to get started.</p>
    <a href="/add" class="btn-primary">Add a book</a>
    <form method="POST" action="?/seed" use:enhance>
      <button type="submit" class="btn-outline">Load sample books</button>
    </form>
  </div>
{:else}
  <div class="header">
    <h1 class="title">
      My collection
      <span class="count">{data.total} {data.total === 1 ? 'book' : 'books'}</span>
    </h1>
    <div class="header-actions">
      <form method="POST" action="?/seed" use:enhance>
        <button type="submit" class="btn-outline">Load sample books</button>
      </form>
      <form method="POST" action="?/clear" use:enhance>
        <button type="submit" class="btn-clear">Clear all</button>
      </form>
      <a href="/add" class="btn-primary">Add a book</a>
    </div>
  </div>

  {#each Object.entries(data.groups) as [genre, books] (genre)}
    <section class="genre-section">
      <h2 class="genre-title">{genre}</h2>
      <ul class="book-list">
        {#each books as book (book.id)}
          <li class="book-item">
            <span>
              <strong>{book.title}</strong> · {book.author}
              <span class="isbn">ISBN {book.isbn}</span>
            </span>
            <form method="POST" action="?/remove" use:enhance>
              <input type="hidden" name="id" value={book.id} />
              <button type="submit" class="btn-remove" aria-label="Remove book">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M1 1l8 8M9 1l-8 8" />
                </svg>
              </button>
            </form>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
{/if}

<style>
  /* ── Empty state ─────────────────────────────── */
  .alert {
    border-radius: var(--radius);
    padding: var(--space-lg);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-xl);
  }

  .alert.error {
    background: var(--color-danger-bg);
    color: var(--color-danger-text);
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 0;
    text-align: center;
  }

  .empty-icon {
    font-size: 2.5rem;
  }

  .empty-title {
    margin-top: var(--space-xl);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .empty-sub {
    margin-top: var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .empty .btn-primary {
    margin-top: var(--space-2xl);
  }

  .empty form {
    margin-top: var(--space-lg);
  }

  /* ── Header ──────────────────────────────────── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-2xl);
  }

  .title {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .count {
    margin-left: var(--space-md);
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--color-text-muted);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
  }

  /* ── Buttons ─────────────────────────────────── */
  .btn-primary {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    font-size: var(--font-size-sm);
    padding: var(--space-sm) var(--space-xl);
    border-radius: var(--radius);
    text-decoration: none;
    border: none;
    cursor: pointer;
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
  }

  .btn-outline {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-sm) var(--space-xl);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
  }

  .btn-outline:hover {
    border-color: var(--color-border-hover);
    color: var(--color-text-subtle);
  }

  .btn-clear {
    background: none;
    border: none;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
  }

  .btn-clear:hover {
    color: var(--color-danger);
  }

  .btn-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--radius-full);
    border: none;
    background: none;
    color: var(--color-bg-muted);
    cursor: pointer;
    margin-left: var(--space-md);
    flex-shrink: 0;
  }

  .btn-remove:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  /* ── Genre sections ──────────────────────────── */
  .genre-section {
    margin-bottom: var(--space-2xl);
  }

  .genre-title {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-bottom: var(--space-md);
  }

  .book-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .book-item {
    display: flex;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .book-item span {
    flex: 1;
  }

  .isbn {
    margin-left: var(--space-md);
    color: var(--color-text-muted);
  }
</style>
