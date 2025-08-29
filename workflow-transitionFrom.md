# Workflow de la fonction `transitionFrom`

## Vue d'ensemble

La fonction `transitionFrom` permet de supprimer des styles (classes CSS ou styles inline) avec une transition fluide et d'attendre la fin de l'animation.

## Schéma du workflow

```mermaid
flowchart TD
    A[Appel: transitionFrom(element, styles, config)] --> B[Extraction de la config]
    B --> C{défaut: duration=300ms, easing='ease-in-out', property='all'}

    C --> D{Transition nécessaire ?}
    D -->|Non| E[Suppression immédiate des styles]
    E --> F[Promise.resolve() - Fin immédiate]

    D -->|Oui| G[Sauvegarde de la transition originale]
    G --> H[Application de la nouvelle transition CSS]
    H --> I[Suppression des styles avec removeStyles]

    I --> J[Force reflow du navigateur]
    J --> K{Transitions actives ?}

    K -->|Non| L[Restauration de la transition originale]
    L --> M[Promise.resolve() - Fin immédiate]

    K -->|Oui| N[Création d'une Promise]
    N --> O[Configuration du nettoyage avec createTransitionCleanup]
    O --> P[Calcul de la durée réelle + marge de sécurité]
    P --> Q[Démarrage du timeout]
    Q --> R[Promise se résout à la fin de la transition]
```

## Détail des étapes

### 1. **Vérification préliminaire**

```typescript
if (!isString(styles) && !needsTransition(element, styles)) {
  removeStyles(element, styles);
  return Promise.resolve();
}
```

- **Classes CSS** : Toujours traitées (pas de vérification de transition)
- **Styles inline** : Vérification si une transition est nécessaire

### 2. **Configuration de la transition**

```typescript
const originalTransition = element.style.transition;
element.style.transition = `${property} ${duration}ms ${easing}`;
```

- Sauvegarde de l'état original
- Application de la nouvelle transition

### 3. **Suppression des styles**

```typescript
removeStyles(element, styles);
```

- **Classes** : Suppression via `classList.remove()`
- **Styles inline** : Suppression via `removeCSSProperties()`

### 4. **Forçage du reflow**

```typescript
forceReflow(element);
```

- Déclenche le recalcul du layout
- Assure que la transition démarre

### 5. **Vérification des transitions actives**

```typescript
if (!hasActiveTransitions(element)) {
  element.style.transition = originalTransition;
  return Promise.resolve();
}
```

- Si aucune transition n'est active, fin immédiate

### 6. **Gestion de la transition**

```typescript
return new Promise<void>((resolve) => {
  const { startTimeout } = createTransitionCleanup(
    element,
    originalTransition,
    resolve
  );

  const realDuration = getTransitionInfo(element) || duration;
  const safetyMargin = calculateSafetyMargin(realDuration);
  startTimeout(realDuration + safetyMargin);
});
```

- Création d'une Promise
- Configuration du nettoyage automatique
- Timeout avec marge de sécurité

## Cas d'usage

### **Classes CSS**

```typescript
await transitionFrom(element, "fade-in active", { duration: 300 });
```

- Suppression des classes `fade-in` et `active`
- Transition de 300ms

### **Styles inline**

```typescript
await transitionFrom(element, { opacity: "", transform: "" });
```

- Suppression des propriétés `opacity` et `transform`
- Retour aux valeurs par défaut avec transition

## Gestion des erreurs et optimisations

- **Early exit** : Sortie immédiate si pas de transition nécessaire
- **Nettoyage automatique** : Restauration de l'état original
- **Marge de sécurité** : Évite les timeouts trop courts
- **Gestion des types** : Support unifié des classes et styles inline
