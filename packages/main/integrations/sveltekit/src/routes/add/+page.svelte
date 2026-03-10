<script lang="ts">
  import { enhance } from '$app/forms'
  import { GENRES } from '$lib/constants'
  import { ensure } from '@pithos/core/bridges/ensure'
  import { bookFields } from '$lib/schemas/book'

  let { form } = $props()

  let errors = $state<Partial<Record<string, string>>>({})
  let touched = $state<Partial<Record<string, boolean>>>({})

  type FieldName = keyof typeof bookFields

  function validateField(name: FieldName, value: unknown) {
    touched = { ...touched, [name]: true }
    if (name === 'addedAt' && !value) {
      const { [name]: _, ...rest } = errors
      errors = rest
      return
    }
    const result = ensure(bookFields[name], value)
    if (result.isErr()) {
      errors = { ...errors, [name]: result.error }
    } else {
      const { [name]: _, ...rest } = errors
      errors = rest
    }
  }

  function clearField(name: FieldName) {
    const { [name]: _, ...rest } = errors
    errors = rest
  }

  function hasError(name: FieldName): boolean {
    return !!touched[name] && !!errors[name]
  }

  function getError(name: FieldName): string | undefined {
    return touched[name] ? errors[name] : undefined
  }
</script>

<div class="page-header">
  <h1>Add a book</h1>
  <a href="/collection" class="back-link">← Back to collection</a>
</div>

{#if form?.success && form.book}
  <p class="alert success">"{form.book.title}" has been added successfully.</p>
{/if}

{#if form?.errors}
  <ul class="alert error" role="alert">
    {#each form.errors as error}
      <li>{error}</li>
    {/each}
  </ul>
{/if}

<form method="POST" use:enhance={() => {
  return async ({ update }) => {
    await update()
    if (form?.success) {
      errors = {}
      touched = {}
    }
  }
}}>
  <div class="field">
    <label for="title">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      required
      aria-describedby={hasError('title') ? 'title-error' : undefined}
      aria-invalid={hasError('title')}
      class:has-error={hasError('title')}
      onblur={(e) => validateField('title', e.currentTarget.value)}
      oninput={() => clearField('title')}
    />
    {#if getError('title')}
      <p id="title-error" class="field-error">{getError('title')}</p>
    {/if}
  </div>

  <div class="field">
    <label for="author">Author</label>
    <input
      id="author"
      name="author"
      type="text"
      required
      aria-describedby={hasError('author') ? 'author-error' : undefined}
      aria-invalid={hasError('author')}
      class:has-error={hasError('author')}
      onblur={(e) => validateField('author', e.currentTarget.value)}
      oninput={() => clearField('author')}
    />
    {#if getError('author')}
      <p id="author-error" class="field-error">{getError('author')}</p>
    {/if}
  </div>

  <div class="field">
    <label for="isbn">ISBN</label>
    <input
      id="isbn"
      name="isbn"
      type="text"
      required
      aria-describedby={hasError('isbn') ? 'isbn-error' : undefined}
      aria-invalid={hasError('isbn')}
      class:has-error={hasError('isbn')}
      onblur={(e) => validateField('isbn', e.currentTarget.value)}
      oninput={() => clearField('isbn')}
    />
    {#if getError('isbn')}
      <p id="isbn-error" class="field-error">{getError('isbn')}</p>
    {/if}
  </div>

  <div class="field">
    <label for="genre">Genre</label>
    <select
      id="genre"
      name="genre"
      required
      aria-describedby={hasError('genre') ? 'genre-error' : undefined}
      aria-invalid={hasError('genre')}
      class:has-error={hasError('genre')}
      onblur={(e) => validateField('genre', e.currentTarget.value)}
      onchange={() => clearField('genre')}
    >
      <option value="">Select a genre</option>
      {#each GENRES as genre}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
    {#if getError('genre')}
      <p id="genre-error" class="field-error">{getError('genre')}</p>
    {/if}
  </div>

  <div class="field">
    <label for="addedAt">Date added (optional)</label>
    <input
      id="addedAt"
      name="addedAt"
      type="date"
      onblur={(e) => validateField('addedAt', e.currentTarget.value || undefined)}
    />
  </div>

  <button type="submit" class="btn-submit">Add book</button>
</form>

<style>
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-2xl);
  }

  h1 {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  .back-link {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-text-subtle);
  }

  .alert {
    border-radius: var(--radius);
    padding: var(--space-lg);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-xl);
  }

  .alert.success {
    background: var(--color-success-bg);
    color: var(--color-success-text);
  }

  .alert.error {
    background: var(--color-danger-bg);
    color: var(--color-danger-text);
    list-style: none;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    max-width: var(--max-width-form);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-subtle);
  }

  input, select {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-md) var(--space-lg);
    font-size: var(--font-size-sm);
    color: var(--color-text);
    outline: none;
    transition: border-color var(--transition-fast);
  }

  input:focus, select:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-ring);
  }

  input.has-error, select.has-error {
    border-color: var(--color-danger-border);
  }

  .field-error {
    font-size: var(--font-size-xs);
    color: var(--color-danger);
  }

  .btn-submit {
    background: var(--color-primary);
    color: white;
    font-size: var(--font-size-sm);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
  }

  .btn-submit:hover {
    background: var(--color-primary-hover);
  }

  .btn-submit:disabled {
    opacity: 0.5;
  }
</style>
