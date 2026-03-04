---
sidebar_position: 4
title: "Fonctionnalités & API"
description: "Référence complète des fonctionnalités et de l'API de Kanon V3. Validation fonctionnelle pure, fast paths, singleton pattern et optimisation early abort."
slug: "features"
---

# Kanon V3 - Fonctionnalités complètes

## Vue d'ensemble

Kanon V3 est une bibliothèque de validation TypeScript avec une architecture fonctionnelle pure, optimisée pour la performance grâce aux fast paths, au singleton pattern et à l'early abort.

### Principe fondamental : Validation pure, pas de transformation

**Kanon V3 valide les données mais ne les transforme pas.** Après une validation réussie, les données sont retournées telles quelles, sans modification. Les fonctions de « transformation » (`partial`, `pick`, `omit`, `required`, `keyof`) transforment la structure du schéma de validation, pas les données elles-mêmes.

- ✅ **Validation** : Vérifie que les données correspondent au schéma
- ❌ **Transformation** : Ne modifie pas les données (pas de `.transform()`, `.preprocess()`, `.trim()`, `.toLowerCase()`, etc.)
- 📝 **Coercition** : Les fonctions `coerce*` convertissent le type avant la validation, mais ne modifient pas la structure des données validées

:::info Pourquoi pas de transformations ?
C'est un choix architectural délibéré. La validation et la transformation sont des préoccupations différentes qui doivent être gérées séparément. Voir [Pourquoi pas de transformations ?](./no-transformations.md) pour la justification complète.
:::

## Types primitifs

### Types de base

- **`string(message?)`** - Validation de chaîne de caractères
- **`number(message?)`** - Validation de nombre
- **`int(message?)`** - Validation d'entier
- **`boolean(message?)`** - Validation de booléen
- **`null_(message?)`** - Validation de valeur null
- **`undefined_(message?)`** - Validation de valeur undefined
- **`bigint(message?)`** - Validation de BigInt
- **`date(message?)`** - Validation de Date
- **`symbol(message?)`** - Validation de Symbol
- **`any(message?)`** - Accepte tout type (message ignoré mais accepté pour la cohérence de l'API)
- **`unknown(message?)`** - Type inconnu (sûr, message ignoré mais accepté pour la cohérence de l'API)
- **`never(message?)`** - Type qui n'accepte jamais de valeur
- **`void_(message?)`** - Type void

## Contraintes String

### Validations de format

- **`.minLength(min, errorMessage?)`** - Longueur minimale
- **`.maxLength(max, errorMessage?)`** - Longueur maximale
- **`.length(length, errorMessage?)`** - Longueur exacte
- **`.email(errorMessage?)`** - Validation d'email (regex)
- **`.url(errorMessage?)`** - Validation d'URL (regex)
- **`.uuid(errorMessage?)`** - Validation d'UUID (regex)
- **`.pattern(regex, errorMessage?)`** - Validation par expression régulière
- **`.includes(substring, errorMessage?)`** - Contient une sous-chaîne
- **`.startsWith(prefix, errorMessage?)`** - Commence par un préfixe
- **`.endsWith(suffix, errorMessage?)`** - Se termine par un suffixe

## Contraintes Number

- **`.min(minValue, errorMessage?)`** - Valeur minimale
- **`.max(maxValue, errorMessage?)`** - Valeur maximale
- **`.int(errorMessage?)`** - Nombre entier
- **`.positive(errorMessage?)`** - Nombre strictement positif
- **`.negative(errorMessage?)`** - Nombre strictement négatif
- **`.lt(lessThan, errorMessage?)`** - Inférieur à (strict)
- **`.lte(lessThanOrEqual, errorMessage?)`** - Inférieur ou égal
- **`.gt(greaterThan, errorMessage?)`** - Supérieur à (strict)
- **`.gte(greaterThanOrEqual, errorMessage?)`** - Supérieur ou égal
- **`.multipleOf(multiple, errorMessage?)`** - Multiple d'un nombre

## Contraintes Array

- **`.minLength(min, errorMessage?)`** - Longueur minimale
- **`.maxLength(max, errorMessage?)`** - Longueur maximale
- **`.length(length, errorMessage?)`** - Longueur exacte
- **`.unique(errorMessage?)`** - Éléments uniques (pas de doublons)

## Contraintes Date

- **`.min(minDate, errorMessage?)`** - Date minimale
- **`.max(maxDate, errorMessage?)`** - Date maximale
- **`.before(beforeDate, errorMessage?)`** - Avant une date
- **`.after(afterDate, errorMessage?)`** - Après une date

## Contraintes BigInt

- **`.min(minValue, errorMessage?)`** - Valeur minimale
- **`.max(maxValue, errorMessage?)`** - Valeur maximale
- **`.positive(errorMessage?)`** - BigInt strictement positif
- **`.negative(errorMessage?)`** - BigInt strictement négatif

## Contraintes Object

- **`.minKeys(min, errorMessage?)`** - Nombre minimum de clés
- **`.maxKeys(max, errorMessage?)`** - Nombre maximum de clés
- **`.strict(errorMessage?)`** - Valide que l'objet ne contient que les propriétés définies dans le schéma (rejette les propriétés supplémentaires)

## Types composites

### Collections

- **`array(itemSchema, message?)`** - Tableau d'éléments validés

  - **`.minLength(min, errorMessage?)`** - Longueur minimale
  - **`.maxLength(max, errorMessage?)`** - Longueur maximale
  - **`.length(length, errorMessage?)`** - Longueur exacte
  - **`.unique(errorMessage?)`** - Éléments uniques

- **`tuple(schemas, message?)`** - Tuple typé avec des schémas pour chaque position

  - Variantes : `tupleOf(schema1, schema2, message?)`, `tupleOf3(schema1, schema2, schema3, message?)`, `tupleOf4(schema1, schema2, schema3, schema4, message?)`
  - **`tupleWithRest(schemas, restSchema, message?)`** - Tuple avec schéma rest pour les tuples variadiques

- **`record(keySchema, valueSchema, message?)`** - Objet avec clés et valeurs validées

- **`map(keySchema, valueSchema, message?)`** - Map avec clés et valeurs validées
  
  - **`.minSize(min, errorMessage?)`** - Taille minimale
  - **`.maxSize(max, errorMessage?)`** - Taille maximale

- **`set(itemSchema, message?)`** - Set avec éléments validés
  
  - **`.minSize(min, errorMessage?)`** - Taille minimale
  - **`.maxSize(max, errorMessage?)`** - Taille maximale

### Objets

- **`object(shape, message?)`** - Objet avec schéma défini

  - Valide chaque propriété selon son schéma
  - Support des propriétés optionnelles via `optional(schema)` sur le schéma de la propriété

- **`strictObject(shape, message?)`** - Objet strict (rejette les propriétés supplémentaires)
  
  **Note** : `strictObject()` et `object().strict()` produisent le même comportement. Utilisez `strictObject()` pour créer directement un objet strict, ou `object().strict()` pour le chaînage de méthodes.

- **`looseObject(shape, message?)`** - Objet permissif (accepte les propriétés supplémentaires)

### Manipulation d'objets (Transformations de schéma)

Ces fonctions transforment la **structure du schéma de validation**, pas les données elles-mêmes. Elles permettent de créer de nouveaux schémas à partir de schémas existants. Les données validées sont retournées telles quelles, sans transformation.

**Important** : Ces fonctions transforment le schéma, pas les données. Par exemple, `pick(schema, ['name'])` valide uniquement la propriété `name`, mais retourne l'objet complet avec toutes ses propriétés si la validation réussit.

- **`partial(objectSchema, message?)`** - Rend toutes les propriétés optionnelles

- **`required(objectSchema, message?)`** - Rend toutes les propriétés requises

- **`pick(objectSchema, keys, message?)`** - Sélectionne certaines propriétés

- **`omit(objectSchema, keys, message?)`** - Exclut certaines propriétés

- **`keyof(objectSchema, message?)`** - Clés d'un schéma d'objet

  - Extrait automatiquement les clés du schéma d'objet passé en paramètre
  - Type-safe : préserve le type des clés de l'objet (`keyof T & string`)

### Unions et intersections

- **`unionOf(schema1, schema2, message?)`** - Union de deux schémas (OU)

  - Variantes : `unionOf3(schema1, schema2, schema3, message?)`, `unionOf4(schema1, schema2, schema3, schema4, message?)`
  - **Note** : Pour plus de deux schémas, utilisez les variantes typées ou créez plusieurs unions imbriquées

- **`intersection(schema1, schema2, message?)`** - Intersection de deux schémas (ET)

  - Variante : `intersection3(schema1, schema2, schema3, message?)` pour trois schémas

### Types spéciaux

- **`literal(value, message?)`** - Valeur littérale exacte (string, number, boolean, null)

- **`enum_(values, message?)`** - Enum de chaînes

  - Variantes : `numberEnum(values, message?)`, `booleanEnum(values, message?)`, `mixedEnum(values, message?)`

- **`nativeEnum(enumObj, message?)`** - Enum TypeScript natif

### Avantages par rapport à Zod

Kanon offre des fonctions spécialisées pour les enums de nombres, booléens et mixtes, ce qui est **plus concis et performant** que Zod :

**Avec Zod** (plus verbeux) :

```typescript
// Enum de nombres
const status = z.union([z.literal(100), z.literal(200), z.literal(300)]);

// Enum de booléens
const flag = z.union([z.literal(true), z.literal(false)]);

// Enum mixte
const value = z.union([z.literal("red"), z.literal(42), z.literal(true)]);
```

**Avec Kanon** (plus concis et expressif) :

```typescript
// Enum de nombres - Plus concis !
const status = numberEnum([100, 200, 300] as const);

// Enum de booléens - Plus concis !
const flag = booleanEnum([true, false] as const);

// Enum mixte - Plus concis !
const value = mixedEnum(["red", 42, true] as const);
```

**Avantages de Kanon** :

- ✅ **Plus concis** : `numberEnum([1, 2, 3])` vs `z.union([z.literal(1), z.literal(2), z.literal(3)])`
- ✅ **Meilleure inférence de type** : TypeScript infère directement `1 | 2 | 3` sans passer par `z.infer`
- ✅ **API dédiée** : Fonctions spécialisées au lieu de composition générique
- ✅ **Performance optimisée** : Implémentation via `createEnumSchema()` partagé et optimisé

## Wrappers

### Modificateurs de nullabilité

- **`optional(schema)`** - Rend le schéma optionnel (accepte `undefined`)

- **`nullable(schema, message?)`** - Rend le schéma nullable (accepte `null`)

- **`default_(schema, defaultValue, message?)`** - Valeur par défaut si manquante

  - Support de fonction pour valeur par défaut dynamique
  - Helper : `DefaultValues` pour les valeurs par défaut courantes

### Autres wrappers

- **`readonly(schema, message?)`** - Marque comme readonly

- **`lazy(factory, message?)`** - Schéma paresseux (évaluation différée) pour les références circulaires

## Refinements

Les refinements sont utilisés en interne par les contraintes (`.minLength()`, `.email()`, etc.). Les contraintes ajoutent automatiquement des refinements au schéma via les fonctions `refineString()`, `refineNumber()`, `refineArray()`, `refineObject()`, `refineDate()`, `refineBigInt()`.

Les schémas supportent une propriété `refinements` qui stocke les validations personnalisées, mais il n'y a pas de méthode publique `.refine()` pour le chaînage direct.

## Coercition (Conversion automatique)

Les fonctions de coercition convertissent le type d'entrée avant la validation, mais ne modifient pas la structure des données validées. Elles sont utiles pour accepter des formats flexibles (ex : chaîne "123" → nombre 123).

- **`coerceString(message?)`** - Coercition vers string
- **`coerceNumber(message?)`** - Coercition vers number
- **`coerceBoolean()`** - Coercition vers boolean (pas de paramètre message)
- **`coerceBigInt(message?)`** - Coercition vers bigint
- **`coerceDate(message?)`** - Coercition vers date

**Note** : La coercition convertit le type, mais les données retournées après validation sont les données converties, pas transformées (pas de modification de structure, pas de normalisation).

## Parsing

### Méthodes synchrones

- **`parse(schema, input)`** - Parse et retourne `{ success: true, data: T } | { success: false, error: string }`

### Validation en masse

- **`parseBulk(schema, values, options?)`** - Validation en masse

  - Option `earlyAbort` : s'arrête à la première erreur (mode rapide)
  - Sans `earlyAbort` : collecte toutes les erreurs (mode complet)
  - Retourne `{ success: true, data: T[] } | { success: false, errors: string[] | string }`

## Gestion des erreurs

### Structure des erreurs

V3 utilise un système d'erreurs simplifié :

- Messages d'erreur sous forme de `string` (pas d'objets complexes)
- Messages constants pour optimiser la performance
- Messages personnalisables via le paramètre `errorMessage?` de chaque contrainte

### Avantages

- **Performance** : Pas d'allocation d'objets d'erreur complexes
- **Simplicité** : Messages d'erreur directement lisibles
- **Flexibilité** : Messages personnalisables par contrainte

## Inférence de type

### Types utilitaires

Les types TypeScript sont automatiquement inférés depuis les schémas :

- Inférence automatique du type de sortie
- Extensions TypeScript pour l'API fluide
- Types spécialisés pour chaque contrainte (`StringConstraint`, `NumberConstraint`, etc.)

## API de chaînage

Les schémas avec contraintes supportent le chaînage de méthodes pour les contraintes :

```typescript
const schema = string().minLength(5).maxLength(100).email();
```

**Note** : Les wrappers (`optional()`, `nullable()`, `default_()`) sont des fonctions séparées, pas des méthodes de chaînage :

```typescript
const schema = optional(
  default_(string().minLength(5).email(), "default@example.com")
);
```

## Exemples d'utilisation

### Schéma simple

```typescript
import { string, number, object, optional } from "@kanon";

const userSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
  email: string().email(),
  phone: optional(string()), // Propriété optionnelle
});
```

### Schéma strict (Rejette les propriétés supplémentaires)

```typescript
import { string, number, object, strictObject } from "@kanon";

// Méthode 1 : Utiliser .strict() pour rendre un objet strict (chaînage)
const strictSchema = object({
  name: string(),
  age: number(),
}).strict();

// Méthode 2 : Utiliser strictObject() directement (équivalent)
const strictSchema2 = strictObject({
  name: string(),
  age: number(),
});

// Les deux produisent le même comportement : rejeter les propriétés supplémentaires
parse(strictSchema, { name: "John", age: 30, extra: "value" }); // ❌ Erreur
parse(strictSchema2, { name: "John", age: 30, extra: "value" }); // ❌ Erreur

// Utilisez strictObject() pour créer directement un objet strict,
// ou object().strict() si vous devez chaîner d'autres méthodes avant
const strictWithConstraints = object({
  name: string(),
  age: number(),
}).minKeys(1).strict();
```

### Schéma complexe

```typescript
import { string, number, object, array, record, unionOf } from "@kanon";

const complexSchema = object({
  id: string().uuid(),
  profile: object({
    firstName: string().minLength(1),
    lastName: string().minLength(1),
  }),
  tags: array(string()).minLength(1),
  metadata: record(string(), unionOf(string(), number())),
});
```

### Union et intersection

```typescript
import { string, number, unionOf, intersection, object } from "@kanon";

const stringOrNumber = unionOf(string(), number());

const userWithId = intersection(
  object({ id: string() }),
  object({ name: string() })
);
```

### Évaluation paresseuse

```typescript
import { string, array, object, lazy } from "@kanon";

type Node = {
  value: string;
  children: Node[];
};

const nodeSchema = lazy(() =>
  object({
    value: string(),
    children: array(nodeSchema),
  })
);
```

### Validation en masse avec Early Abort

```typescript
import { string, parseBulk } from "@kanon";

const schema = string().email();
const emails = ["valid@example.com", "invalid", "another@example.com"];

// Mode rapide : s'arrête à la première erreur
const result = parseBulk(schema, emails, { earlyAbort: true });
if (!result.success) {
  console.log(result.errors); // "Index 1: Invalid email format"
}
```

## Architecture

### Pattern fonctionnel pur

V3 utilise des fonctions pures pour chaque type de schéma :

- Pas de classes, uniquement des fonctions
- Validation via `validator: (value: unknown) => true | string`
- Composition simple via les extensions TypeScript

### Optimisations de performance

- **Fast paths** : Optimisations explicites pour les cas courants
- **Singleton pattern** : Réduction des allocations mémoire
- **Early abort** : Arrêt immédiat à la première erreur en validation en masse
- **Messages constants** : Évite l'interpolation de chaînes à chaque validation
- **Inlining** : Fonctions marquées `/*@__INLINE__*/` pour l'optimisation du compilateur

### Structure des schémas

Chaque schéma expose :

- `type: SchemaType` - Type de validation (ex : "string", "array", "object")
- `message?: string` - Message d'erreur personnalisé optionnel
- `refinements?: Array<(value: T) => true | string>` - Validations personnalisées
- `validator: (value: unknown) => true | string` - Fonction de validation
- Propriétés de composition selon le type (`entries`, `item`, `schemas`, `keySchema`, `valueSchema`, `itemSchema`, etc.)

### Extensions fluides

Les contraintes sont ajoutées via les extensions TypeScript :

- `StringSchema & StringExtension` → `StringConstraint`
- `NumberSchema & NumberExtension` → `NumberConstraint`
- `ArraySchema & ArrayExtension` → `ArrayConstraint`
- etc.

Cela permet une API fluide avec autocomplétion TypeScript complète.

## Limitations connues

### Fonctionnalités non supportées

- **Parsing async** : Pas de support natif pour `parseAsync()` ou `safeParseAsync()`. Utilisez `parse()` et `parseBulk()` qui sont synchrones mais optimisés.
- **Chemin d'erreur imbriqué** : Les messages d'erreur ne contiennent pas de chemin d'erreur structuré (pas de tableau `path`). Les erreurs sont de simples chaînes.
- **Transformations de chaînes** : Pas de méthodes `.toLowerCase()`, `.toUpperCase()`, `.trim()` comme en V1. Utilisez des refinements personnalisés si nécessaire.

## Différences avec V1

### Architecture

- **V1** : Classes avec chaînage mutable
- **V3** : Fonctions pures avec extensions TypeScript

### Gestion des erreurs

- **V1** : Objets `PithosIssue` complexes avec codes et chemins
- **V3** : Messages d'erreur simples (`string`)

### Performance

- **V1** : Baseline
- **V3** : +200% vs V1 grâce aux fast paths et au singleton pattern

### Parsing

- **V1** : `parse()`, `safeParse()`, `parseAsync()`, `safeParseAsync()`
- **V3** : `parse()` et `parseBulk()` (pas de support async natif, mais early abort pour optimiser)

### Flexibilité

- **V1** : API fluide complète mais architecture plus rigide
- **V3** : API fluide avec composition naturelle et extensibilité via les extensions TypeScript

### Wrappers

- **V1** : Méthodes de chaînage (`.optional()`, `.nullable()`, `.default()`)
- **V3** : Fonctions séparées (`optional()`, `nullable()`, `default_()`) qui prennent un schéma en paramètre

## Prochaines étapes

- [Architecture & Évolution](./architecture.md) - Découvrez l'évolution V1→V2→V3
- [Innovations de conception](./innovations.md) - Explorez les évolutions théoriques et pourquoi elles ont été abandonnées
- [Référence API](/api/kanon) - Documentation API détaillée
