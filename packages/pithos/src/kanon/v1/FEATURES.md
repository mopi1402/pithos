# Kanon V1 - Fonctionnalités complètes

## Vue d'ensemble

Kanon V1 est une bibliothèque de validation TypeScript avec une architecture class-based et un système de chaînage de méthodes, similaire à Zod mais optimisée pour la performance.

## Types primitifs

### Types de base

- **`string()`** - Validation de chaînes de caractères
- **`number()`** - Validation de nombres
- **`int()`** - Validation d'entiers
- **`boolean()`** - Validation de booléens
- **`null()`** - Validation de la valeur `null`
- **`undefined()`** - Validation de la valeur `undefined`
- **`bigint()`** - Validation de BigInt
- **`date()`** - Validation de dates
- **`symbol()`** - Validation de Symbol
- **`any()`** - Accepte n'importe quel type
- **`unknown()`** - Type inconnu (sécurisé)
- **`never()`** - Type qui n'accepte jamais de valeur
- **`void()`** - Type void

## Contraintes sur les strings

### Validations de format

- **`.min(minLength, message?)`** - Longueur minimale
- **`.max(maxLength, message?)`** - Longueur maximale
- **`.length(length, message?)`** - Longueur exacte
- **`.email(message?)`** - Validation d'email (regex)
- **`.url(message?)`** - Validation d'URL (via URL constructor)
- **`.uuid(message?)`** - Validation d'UUID (regex)
- **`.regex(pattern, message?)`** - Validation par expression régulière
- **`.nonempty(message?)`** - Chaîne non vide

### Transformations

- **`.toLowerCase()`** - Convertit en minuscules
- **`.toUpperCase()`** - Convertit en majuscules
- **`.trim()`** - Supprime les espaces en début/fin

## Contraintes sur les numbers

- **`.min(minValue, message?)`** - Valeur minimale
- **`.max(maxValue, message?)`** - Valeur maximale
- **`.positive(message?)`** - Nombre strictement positif
- **`.negative(message?)`** - Nombre strictement négatif
- **`.int(message?)`** - Nombre entier

## Types composites

### Collections

- **`array(itemSchema)`** - Tableau d'éléments validés

  - **`.min(length, message?)`** - Longueur minimale
  - **`.max(length, message?)`** - Longueur maximale
  - **`.length(length, message?)`** - Longueur exacte

- **`tuple(schemas, restSchema?)`** - Tuple typé avec schémas pour chaque position

  - Support de rest schema pour tuples variadiques

- **`record(keySchema, valueSchema)`** - Objet avec clés et valeurs validées

- **`map(keySchema, valueSchema)`** - Map avec clés et valeurs validées

- **`set(itemSchema)`** - Set avec éléments validés

### Objets

- **`object(shape)`** - Objet avec schéma défini

  - Validation de chaque propriété selon son schéma
  - Support des propriétés optionnelles via `optional()`

- **`strictObject(shape)`** - Objet strict (rejette les propriétés supplémentaires)

- **`looseObject(shape)`** - Objet permissif (accepte les propriétés supplémentaires)

### Manipulation d'objets

- **`partial(shape)`** - Rend toutes les propriétés optionnelles

- **`required(shape)`** - Rend toutes les propriétés requises

- **`pick(shape, keys)`** - Sélectionne certaines propriétés

- **`omit(shape, keys)`** - Exclut certaines propriétés

### Unions et intersections

- **`union(schemas)`** - Union de plusieurs schémas (OR)

- **`intersection(schema1, schema2)`** - Intersection de deux schémas (AND)

### Types spéciaux

- **`literal(value)`** - Valeur littérale exacte (string, number, boolean, null)

- **`enum(values)`** - Enum de strings

- **`nativeEnum(enumObj)`** - Enum TypeScript natif

- **`keyof(schema)`** - Clés d'un schéma objet

## Wrappers

### Modificateurs de nullabilité

- **`optional(schema)`** - Rend le schéma optionnel (accepte `undefined`)

- **`nullable(schema)`** - Rend le schéma nullable (accepte `null`)

- **`default(schema, defaultValue)`** - Valeur par défaut si manquante
  - Support de fonction pour valeur par défaut dynamique

### Autres wrappers

- **`readonly(schema)`** - Marque comme readonly (TODO: non implémenté)

- **`catch(schema, fallback)`** - Gestion d'erreur avec fallback (TODO: non implémenté)

## Refinements

- **`.refine(check, options?)`** - Validation personnalisée

  - Support de fonctions synchrones et asynchrones
  - Message d'erreur personnalisable
  - Chaînable

- **`.check(...checks)`** - Méthode générique pour appliquer des contraintes
  - Ajoutée automatiquement via `addCheckMethod()`
  - Support des fonctions de validation (retournent `boolean`)
  - Support des fonctions de transformation (retournent une valeur transformée)
  - Support des fonctions retournées par `refine()` avec option `abort`
  - Chaînable

## Contraintes génériques

### Comparaisons numériques

- **`lt(value)`** - Less than
- **`lte(value)`** - Less than or equal
- **`gt(value)`** - Greater than
- **`gte(value)`** - Greater than or equal
- **`minimum(value)`** - Alias de `gte`
- **`maximum(value)`** - Alias de `lte`

### Contraintes sur les arrays

- **`minLength(value)`** - Longueur minimale
- **`maxLength(value)`** - Longueur maximale
- **`length(value)`** - Longueur exacte

### Contraintes sur les strings

- **`regex(pattern)`** - Expression régulière
- **`includes(value)`** - Contient une sous-chaîne
- **`startsWith(value)`** - Commence par
- **`endsWith(value)`** - Se termine par
- **`lowercase()`** - En minuscules
- **`uppercase()`** - En majuscules

### Transformations

- **`overwrite(transform)`** - Transforme la valeur

### Refinements génériques

- **`refine(check, options?)`** - Validation personnalisée avec option `abort`

## Coercion (conversion automatique)

- **`coerce.string()`** - Coerce vers string
- **`coerce.number()`** - Coerce vers number
- **`coerce.boolean()`** - Coerce vers boolean
- **`coerce.bigint()`** - Coerce vers bigint
- **`coerce.date()`** - Coerce vers date

## Concepts avancés

- **`lazy(factory)`** - Schéma paresseux (lazy evaluation) pour références circulaires

## Parsing

### Méthodes synchrones

- **`parse(schema, data)`** - Parse et lance une exception en cas d'erreur
- **`safeParse(schema, data)`** - Parse et retourne un résultat avec `success`

### Méthodes asynchrones

- **`parseAsync(schema, data)`** - Parse asynchrone avec exception
- **`safeParseAsync(schema, data)`** - Parse asynchrone avec résultat

### Méthodes sur les schémas

Tous les schémas implémentent :

- **`.parse(data)`** - Parse avec exception
- **`.safeParse(data)`** - Parse avec résultat
- **`.parseAsync(data)`** - Parse async avec exception
- **`.safeParseAsync(data)`** - Parse async avec résultat

## Gestion des erreurs

### Types d'erreurs

- **`PithosError`** - Classe d'erreur principale

  - Contient un tableau d'`issues`
  - Message agrégé de toutes les issues

- **`ZodError`** - Alias pour compatibilité Zod

### Structure d'une issue

```typescript
interface PithosIssue {
  code: string;           // Code d'erreur (ex: "invalid_type", "too_small")
  message?: string;       // Message d'erreur
  path: (string | number)[]; // Chemin vers la propriété en erreur
  [key: string]: unknown; // Propriétés additionnelles
```

### Codes d'erreur courants

- `"invalid_type"` - Type invalide
- `"too_small"` - Valeur trop petite
- `"too_big"` - Valeur trop grande
- `"invalid_string"` - Format de string invalide
- `"invalid_format"` - Format invalide (email, URL, UUID)
- `"custom"` - Erreur personnalisée (refinement)

## Type inference

### Types utilitaires

- **`infer<T>`** - Infère le type de sortie d'un schéma
- **`output<T>`** - Extrait le type de sortie
- **`input<T>`** - Extrait le type d'entrée

## Fonctionnalités non implémentées (TODO)

Les fonctionnalités suivantes sont déclarées mais non implémentées :

### ISO Date/Time

- `iso.datetime(options?)`
- `iso.date()`
- `iso.time(options?)`
- `iso.duration()`

### Transformations

- `transform(transformFn)`
- `pipe(...schemas)`
- `preprocess(preprocessFn, schema)`

### Types spéciaux

- `file()`
- `nan()`
- `custom(validator)`
- `instanceof(constructor)`
- `json()`
- `stringbool(options?)`
- `promise(schema)`

### Wrappers

- `readonly(schema)` - Retourne le schéma original
- `catch(schema, fallback)` - Retourne le schéma original

## API de chaînage

Tous les schémas supportent le chaînage de méthodes :

```typescript
const schema = validation
  .string()
  .min(5)
  .max(100)
  .email()
  .toLowerCase()
  .trim()
  .optional()
  .default("default@example.com");
```

## Exemples d'utilisation

### Schéma simple

```typescript
const userSchema = validation.object({
  name: validation.string().min(1),
  age: validation.number().min(0).int(),
  email: validation.string().email(),
});
```

### Schéma complexe

```typescript
const complexSchema = validation.object({
  id: validation.string().uuid(),
  profile: validation.object({
    firstName: validation.string().min(1),
    lastName: validation.string().min(1),
  }),
  tags: validation.array(validation.string()).min(1),
  metadata: validation.record(
    validation.string(),
    validation.union([validation.string(), validation.number()])
  ),
});
```

### Union et intersection

```typescript
const stringOrNumber = validation.union([
  validation.string(),
  validation.number(),
]);

const userWithId = validation.intersection(
  validation.object({ id: validation.string() }),
  validation.object({ name: validation.string() })
);
```

### Lazy evaluation

```typescript
type Node = {
  value: string;
  children: Node[];
};

const nodeSchema: validation.PithosType<Node> = validation.lazy(() =>
  validation.object({
    value: validation.string(),
    children: validation.array(nodeSchema),
  })
);
```

## Architecture

### Pattern class-based

V1 utilise des classes pour chaque type de schéma :

- `PithosString`
- `PithosNumber`
- `PithosArray`
- `PithosObject`
- etc.

### Accumulation de validations

Les validations sont accumulées dans un tableau interne et appliquées séquentiellement lors du parsing.

### Méthode `addCheckMethod`

Tous les schémas passent par `addCheckMethod()` qui :

- Ajoute la méthode `.check()` pour les contraintes génériques
- Ajoute des métadonnées (`def.type`, `def.values`, `type`)
- Permet l'application de contraintes génériques via `.check()`

### Métadonnées des schémas

Chaque schéma expose des métadonnées :

- `def.type` - Type du schéma (ex: "string", "array", "object")
- `def.values` - Valeurs possibles (pour `literal` et `enum`)
- `type` - Alias de `def.type`

### Lazy evaluation

Les schémas lazy (`PithosLazy`) évaluent le schéma uniquement lors du premier accès, permettant les références circulaires.

## Compatibilité Zod

V1 fournit une compatibilité partielle avec Zod via :

- `ZodError` (alias de `PithosError`)
- Structure similaire des issues
- API de chaînage similaire
