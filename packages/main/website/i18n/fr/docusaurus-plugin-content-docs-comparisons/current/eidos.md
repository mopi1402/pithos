---
sidebar_label: "Eidos"
sidebar_position: 4.6
title: "Eidos dans l'écosystème TypeScript"
description: "Comment Eidos se positionne dans l'écosystème TypeScript. La seule bibliothèque qui fournit les 23 design patterns GoF en TypeScript fonctionnel, sans dépendance."
keywords:
  - design patterns typescript
  - gof patterns fonctionnel
  - comparaison patterns typescript
  - eidos vs alternatives
  - bibliothèque design patterns fonctionnels
  - strategy pattern typescript
  - observer pattern typescript
---

import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { Picture } from '@site/src/components/shared/Picture';
import Link from '@docusaurus/Link';

<ArticleSchema
  headline="Eidos dans l'écosystème TypeScript"
  description="Comment Eidos se positionne dans l'écosystème TypeScript. La seule bibliothèque qui fournit les 23 design patterns GoF en TypeScript fonctionnel, sans dépendance."
  datePublished="2026-03-29"
/>

# Eidos dans l'écosystème TypeScript

Les design patterns du GoF ne sont pas obsolètes et les problèmes qu'ils résolvent sont toujours d'actualité. En fait, ils avaient juste besoin d'un léger rafraîchissement pour coller aux stacks TypeScript modernes : composable et fonctionnel, en s'éloignant de la POO (classes, héritage, …). Même le Singleton, souvent catalogué comme un anti-pattern en POO, se révèle être un bon atout en TypeScript fonctionnel, là où il se résume à un `const` au niveau du module.

Pithos est la seule bibliothèque TypeScript qui fournit les 23 design patterns du GoF dans un style fonctionnel. Certaines bibliothèques se concentrent sur leur apprentissage sous la forme d'exemples POO. D'autres utilisent un ou deux patterns isolément. Eidos est la première à couvrir les 23 avec une API unifiée, composable et agnostique de tout framework. Cette page explique pourquoi c'est important.

---

## Ce qui existe aujourd'hui

Dans l'écosystème JS/TS, on retrouvera les design patterns sous trois formes. Chacune d'elles résout quelque chose, mais jamais tout à la fois.

- **Sites et repositories éducatifs.**
Des projets comme [refactoring.guru](https://refactoring.guru/design-patterns/typescript), [torokmark/design_patterns_in_typescript](https://github.com/torokmark/design_patterns_in_typescript) ou [design-patterns-for-humans](https://github.com/kamranahmedse/design-patterns-for-humans) couvrent les 23 patterns, mais jamais sous la forme d'une bibliothèque installable dans son propre projet pour déployer ensuite en production. Et en plus, ils présentent les patterns par l'intermédiaire de la POO (classes et héritage), alors que les stacks TypeScript modernes privilégient de plus en plus les approches composables et fonctionnelles.

- **Bibliothèques spécialisées.**
L'écosystème offre d'excellentes solutions mono-pattern : [RxJS](https://rxjs.dev/), [mitt](https://github.com/developit/mitt) ou [nanoevents](https://github.com/ai/nanoevents) pour Observer ; [XState](https://xstate.js.org/) ou [Robot](https://thisrobot.life/) pour les machines à états ; [Immer](https://immerjs.github.io/immer/) pour Command/undo-redo ; [Ramda](https://ramdajs.com/) pour la composition de fonctions. Certaines bibliothèques comme [Zustand](https://zustand.docs.pmnd.rs/) combinent plusieurs patterns (State, Observer, Command) mais restent liées à React. Chacune couvre bien sa niche, mais aucune ne vise à fournir un ensemble complet et indépendant de tout framework.

- **Écosystèmes FP.**
Des bibliothèques comme [fp-ts](https://gcanti.github.io/fp-ts/), [Effect](https://effect.website/) ou [purify-ts](https://gigobyte.github.io/purify/) fournissent des abstractions fonctionnelles qui chevauchent indirectement certains patterns GoF. Mais aucune ne se donne pour objectif de couvrir les 23. La couverture est incidente.

### Où se situe Eidos

Eidos occupe un espace qu'aucune des trois catégories ci-dessus ne couvre : une bibliothèque prête pour la production, tree-shakable, qui couvre chaque pattern GoF avec une API fonctionnelle cohérente.

---

## Le problème de la fragmentation

Couvrir seulement cinq patterns avec des bibliothèques spécialisées, ça veut dire cinq packages à installer, cinq styles d'API, cinq sites de documentation et cinq modèles qui pourraient pourtant être utilisés conjointement :

```bash
npm install rxjs           # Observer
npm install xstate         # State
npm install ramda          # Decorator / composition
npm install immer          # Memento / Command
npm install iter-tools     # Iterator
```

Ces bibliothèques sont excellentes dans leur périmètre, mais c'est un peu dommage de devoir installer autant de packages qui ne sont pas prévus spécifiquement pour fonctionner ensemble, qui augmentent la surface de maintenance et qui en plus multiplient le risque de supply chain : chaque dépendance est une vulnérabilité potentielle.

---

## Ce qu'Eidos fait différemment

### Indépendant de tout framework

La plupart des bibliothèques spécialisées sont liées à un écosystème spécifique. Par exemple : 
- RxJS est profondément intégré à Angular 
- Zustand est conçu spécifiquement pour React.
- XState a des bindings spécifiques par framework.  

Si vous changez de framework, ou si vous travaillez sur un projet backend Node.js, ces bibliothèques pourraient apporter de la friction ou risqueraient d'introduire un couplage inutile.

Eidos n'est pas propre à une technologie ou un framework. Il produit des fonctions pures et des données simples. Vous pouvez l'utiliser en React, Angular, Vue, Svelte, un outil CLI, une fonction serverless ou un projet TypeScript vanilla. Les patterns fonctionnent de façon identique quelle que soit la stack, parce que la seule chose dont ils dépendent, c'est TypeScript !

### Un chemin d'import, une philosophie

Chaque pattern suit les mêmes conventions : les fonctions retournent des données simples, l'état est immuable, la configuration utilise des records typés, la composition utilise des fonctions d'ordre supérieur.

```typescript
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";
import { createMachine }    from "@pithos/core/eidos/state/state";
import { createChain }      from "@pithos/core/eidos/chain/chain";
import { createObservable } from "@pithos/core/eidos/observer/observer";
import { createBuilder }    from "@pithos/core/eidos/builder/builder";
```

Pas de classes. Pas d'héritage. Pas de méthodes abstraites.

### Transparence vis-à-vis du langage

Eidos exporte délibérément les 23 patterns, y compris les cinq que TypeScript rend triviaux. Ces cinq sont marqués `@deprecated`, ce qui sert deux objectifs : 
- La bibliothèque reste une référence complète et homogène pour tous les patterns GoF, 
- En cherchant un design pattern tel que "factory method" ou "visitor", l'IDE indique simplement la façon d'utiliser TypeScript nativement plutôt que de rajouter une fonction passe-plat qui n'apporterait rien.

| Pattern | Ce que votre IDE vous montre |
|---|---|
| Factory Method | _"Passez la fonction factory en paramètre. C'est de l'injection de dépendances."_ |
| Bridge | _"Passez l'implémentation comme paramètre de fonction."_ |
| Facade | _"Écrivez une fonction qui appelle d'autres fonctions."_ |
| Visitor | _"Utilisez un switch sur une union discriminée."_ |
| Interpreter | _"Définissez une union discriminée pour l'AST et une fonction eval récursive."_ |

### Infrastructure partagée avec Pithos

Afin de ne pas dupliquer inutilement le code source et ajouter du poids mort dans le bundle, quatre designs patterns sont des ré-exports d'Arkhe :

| Pattern | Fonction Arkhe |
|---|---|
| Prototype | [`deepClone()`](/api/arkhe/object/deepClone) |
| Singleton | [`once()`](/api/arkhe/function/once) |
| Flyweight | [`memoize()`](/api/arkhe/function/memoize) |
| Proxy | [`memoize()`](/api/arkhe/function/memoize), [`throttle()`](/api/arkhe/function/throttle), [`debounce()`](/api/arkhe/function/debounce), [`lazy()`](/api/eidos/proxy/lazy), [`guarded()`](/api/eidos/proxy/guarded) |

### Chaque pattern a une démo interactive

Chaque design pattern est accompagné d'une page dédiée qui inclut le problème qu'il résout, la solution Eidos, et une démo interactive que vous pouvez essayer dans le navigateur, avec son code source téléchargeable.

<details>
<summary>Découvrir les démos</summary>

<style>{`
.demo-related p { margin-bottom: 0.25rem; }
.demo-related ul { padding-left: 1.25rem; margin: 0; }
.demo-related li { margin-bottom: 0.15rem; }
.demo-img { flex: 0 0 50%; max-width: 400px; }
@media (max-width: 1250px) {
  .demo-img { flex: 0 0 33.33%; max-width: none; }
}
@media (max-width: 450px) {
  .demo-row { flex-direction: column; }
  .demo-img { flex: none; width: 100%; max-width: none; }
}
`}</style>
<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/state/#live-demo"><Picture src="/img/generated/demos/design-patterns/state" alt="State demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**State**<br/>
Machine à états finis avec transitions et événements typés. Un tableau de scores de tennis pour Roland Garros où la boucle Deuce/Avantage est encodée dans les transitions, pas dans des conditions.

[`createMachine()`](/api/eidos/state/createMachine)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/state/)
- [Démo interactive](/api/eidos/state/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/strategy/#live-demo"><Picture src="/img/generated/demos/design-patterns/strategy" alt="Strategy demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Strategy**<br/>
Interchanger des algorithmes à l'exécution par clé. Un calculateur de prix pour un e-shop cosmétique avec des stratégies de réduction interchangeables (Standard, Club, Saisonnier, Coffret).

[`createStrategies()`](/api/eidos/strategy/createStrategies), [`safeStrategy()`](/api/eidos/strategy/safeStrategy), [`withFallback()`](/api/eidos/strategy/withFallback), [`withValidation()`](/api/eidos/strategy/withValidation)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/strategy/)
- [Démo interactive](/api/eidos/strategy/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/observer/#live-demo"><Picture src="/img/generated/demos/design-patterns/observer" alt="Observer demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Observer**<br/>
Émetteur d'événements pub/sub typé. Un tableau de bord de trading où graphique, alertes et portefeuille réagissent indépendamment aux variations de prix.

[`createObservable()`](/api/eidos/observer/createObservable)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/observer/)
- [Démo interactive](/api/eidos/observer/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/command/#live-demo"><Picture src="/img/generated/demos/design-patterns/command" alt="Command demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Command**<br/>
Encapsuler des actions avec undo/redo. Un tableau Kanban où chaque glisser-déposer est une commande réversible avec un historique lisible et un replay.

[`undoableState()`](/api/eidos/command/undoableState), [`createReactiveCommandStack()`](/api/eidos/command/createReactiveCommandStack)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/command/)
- [Démo interactive](/api/eidos/command/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/iterator/#live-demo"><Picture src="/img/generated/demos/design-patterns/iterator" alt="Iterator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Iterator**<br/>
Séquences lazy avec next() basé sur Option. Un navigateur Pokédex avec trois stratégies de parcours interchangeables sur 151 Pokémon.

[`createIterable()`](/api/eidos/iterator/createIterable), [`lazyRange()`](/api/eidos/iterator/lazyRange), [`iterate()`](/api/eidos/iterator/iterate)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/iterator/)
- [Démo interactive](/api/eidos/iterator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/builder/#live-demo"><Picture src="/img/generated/demos/design-patterns/builder" alt="Builder demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Builder**<br/>
Construction étape par étape avec une API fluide. Un constructeur de graphiques où activer/désactiver des étapes met à jour la visualisation en temps réel.

[`createBuilder()`](/api/eidos/builder/createBuilder), [`createValidatedBuilder()`](/api/eidos/builder/createValidatedBuilder)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/builder/)
- [Démo interactive](/api/eidos/builder/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/decorator/#live-demo"><Picture src="/img/generated/demos/design-patterns/decorator" alt="Decorator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Decorator**<br/>
Empiler des comportements sans modifier la fonction de base. Un pipeline d'analyse ADN où l'on active/désactive des décorateurs de filtre qualité, cache, retry et chronométrage.

[`decorate()`](/api/eidos/decorator/decorate), [`before()`](/api/eidos/decorator/before), [`after()`](/api/eidos/decorator/after), [`around()`](/api/eidos/decorator/around)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/decorator/)
- [Démo interactive](/api/eidos/decorator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/chain/#live-demo"><Picture src="/img/generated/demos/design-patterns/chain" alt="Chain demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Chain of Responsibility**<br/>
Pipeline de handlers qui peuvent passer la main ou court-circuiter. Un simulateur de middleware HTTP avec auth, rate-limit, validation et logging activables.

[`createChain()`](/api/eidos/chain/createChain), [`safeChain()`](/api/eidos/chain/safeChain)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/chain/)
- [Démo interactive](/api/eidos/chain/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/mediator/#live-demo"><Picture src="/img/generated/demos/design-patterns/mediator" alt="Mediator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Mediator**<br/>
Centraliser la communication entre composants. Un tableau de bord de vols DGAC où les panneaux météo, vols et piste communiquent via un hub d'événements typé.

[`createMediator()`](/api/eidos/mediator/createMediator)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/mediator/)
- [Démo interactive](/api/eidos/mediator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/memento/#live-demo"><Picture src="/img/generated/demos/design-patterns/memento" alt="Memento demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Memento**<br/>
Capturer et restaurer des snapshots d'état. Un éditeur photo avec filtres où chaque modification crée une miniature de snapshot vers laquelle on peut revenir.

[`createHistory()`](/api/eidos/memento/createHistory)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/memento/)
- [Démo interactive](/api/eidos/memento/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/template/#live-demo"><Picture src="/img/generated/demos/design-patterns/template" alt="Template demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Template Method**<br/>
Définir le squelette d'un algorithme avec des étapes redéfinissables. Un constructeur de CV où les profils Développeur, Designer et Manager redéfinissent des étapes spécifiques.

[`templateWithDefaults()`](/api/eidos/template/templateWithDefaults)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/template/)
- [Démo interactive](/api/eidos/template/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/abstract-factory/#live-demo"><Picture src="/img/generated/demos/design-patterns/abstract-factory" alt="Abstract Factory demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Abstract Factory**<br/>
Créer des familles d'objets liés. Un kit UI multiplateforme où basculer entre iOS/Android/Web re-habille l'ensemble du formulaire d'un coup.

[`createAbstractFactory()`](/api/eidos/abstract-factory/createAbstractFactory)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/abstract-factory/)
- [Démo interactive](/api/eidos/abstract-factory/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/composite/#live-demo"><Picture src="/img/generated/demos/design-patterns/composite" alt="Composite demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Composite**<br/>
Structures arborescentes avec traitement uniforme feuille/branche. Un explorateur de fichiers où la taille des dossiers est calculée récursivement via fold().

[`leaf()`](/api/eidos/composite/leaf), [`branch()`](/api/eidos/composite/branch), [`fold()`](/api/eidos/composite/fold), [`map()`](/api/eidos/composite/map), [`flatten()`](/api/eidos/composite/flatten), [`find()`](/api/eidos/composite/find)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/composite/)
- [Démo interactive](/api/eidos/composite/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/adapter/#live-demo"><Picture src="/img/generated/demos/design-patterns/adapter" alt="Adapter demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Adapter**<br/>
Faire fonctionner ensemble des API incompatibles. Une application cartographique qui normalise deux API open data françaises (bornes de recharge + stations-service) en un format uniforme.

[`adapt()`](/api/eidos/adapter/adapt), [`createAdapter()`](/api/eidos/adapter/createAdapter)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/adapter/)
- [Démo interactive](/api/eidos/adapter/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/proxy/#live-demo"><Picture src="/img/generated/demos/design-patterns/proxy" alt="Proxy demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Proxy**<br/>
Contrôler l'accès avec cache, rate-limiting et fallback. Une API LLM simulée où les cache hits économisent de l'argent et les rate limits protègent le fournisseur.

[`memoize()`](/api/arkhe/function/memoize), [`throttle()`](/api/arkhe/function/throttle), [`lazy()`](/api/eidos/proxy/lazy), [`guarded()`](/api/eidos/proxy/guarded)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/proxy/)
- [Démo interactive](/api/eidos/proxy/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/singleton/#live-demo"><Picture src="/img/generated/demos/design-patterns/singleton" alt="Singleton demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Singleton**<br/>
Initialisation lazy, même instance à chaque appel. Trois services (Database, Cache, Logger) où la première requête est lente et les suivantes instantanées.

[`once()`](/api/arkhe/function/once)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/singleton/)
- [Démo interactive](/api/eidos/singleton/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/prototype/#live-demo"><Picture src="/img/generated/demos/design-patterns/prototype" alt="Prototype demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Prototype**<br/>
Cloner des objets sans références partagées. Un éditeur de configuration où le deep clone préserve l'original intact tandis que le shallow copy laisse fuiter les mutations.

[`deepClone()`](/api/arkhe/object/deepClone), [`deepCloneFull()`](/api/arkhe/object/deepCloneFull)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/prototype/)
- [Démo interactive](/api/eidos/prototype/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/flyweight/#live-demo"><Picture src="/img/generated/demos/design-patterns/flyweight" alt="Flyweight demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Flyweight**<br/>
Partager l'état commun pour réduire la mémoire. Un éditeur de texte où les objets de style sont mutualisés via memoize, avec 96 % d'économie mémoire.

[`memoize()`](/api/arkhe/function/memoize)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/flyweight/)
- [Démo interactive](/api/eidos/flyweight/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/factory-method/#live-demo"><Picture src="/img/generated/demos/design-patterns/factory-method" alt="Factory Method demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Factory Method**<br/>
Déléguer la création à des fonctions injectées. Un expéditeur de notifications où le même appel sendNotification() produit des notifications Email, SMS, Push ou Slack.

Pattern absorbé par le langage (injection de dépendances)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/factory-method/)
- [Démo interactive](/api/eidos/factory-method/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/visitor/#live-demo"><Picture src="/img/generated/demos/design-patterns/visitor" alt="Visitor demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Visitor**<br/>
Ajouter des opérations sans modifier les objets. Un constructeur d'emails où la même liste de blocs produit un rendu Aperçu, HTML, Texte brut ou Audit d'accessibilité.

Pattern absorbé par le langage (switch sur union discriminée)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/visitor/)
- [Démo interactive](/api/eidos/visitor/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/bridge/#live-demo"><Picture src="/img/generated/demos/design-patterns/bridge" alt="Bridge demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Bridge**<br/>
Découpler deux axes qui varient indépendamment. Un visualiseur musical avec 3 sources audio × 5 renderers = 15 combinaisons en un seul appel de fonction.

Pattern absorbé par le langage (passer des fonctions en paramètre)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/bridge/)
- [Démo interactive](/api/eidos/bridge/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/facade/#live-demo"><Picture src="/img/generated/demos/design-patterns/facade" alt="Facade demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Facade**<br/>
Interface simplifiée vers un sous-système complexe. Une démo de requête API montrant 6 étapes manuelles vs un seul appel fetchUser().

Pattern absorbé par le langage (c'est juste une fonction)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/facade/)
- [Démo interactive](/api/eidos/facade/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/interpreter/#live-demo"><Picture src="/img/generated/demos/design-patterns/interpreter" alt="Interpreter demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Interpreter**<br/>
Évaluer des expressions ou des DSL. Un interpréteur Markdown complet avec aperçu en direct, visualisation de l'AST et défilement synchronisé.

Pattern absorbé par le langage (union discriminée + eval récursif)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Liens**
- [Documentation](/api/eidos/interpreter/)
- [Démo interactive](/api/eidos/interpreter/#live-demo)

</div>

</div>
</div>

</details>

---

## Eidos vs bibliothèques dédiées

Pour certains patterns, une lib dédiée ira plus loin qu'Eidos. C'est normal et c'est même voulu : Eidos couvrira 80-90% des cas les plus courants, mais pour des cas limites, certaines bibliothèques spécialisées prendront le relais.

| Pattern | Quand Eidos suffit | Quand passer à une lib dédiée |
|---|---|---|
| **Observer** | Pub/sub typé simple | Traitement de flux complexe (RxJS) |
| **State** | Machine à états finis avec transitions typées | Statecharts hiérarchiques, acteurs, visualiseur (XState) |
| **Iterator** | Séquences lazy, opérateurs de base | Opérateurs d'itération async étendus (IxJS) |
| **Command** | Undo/redo avec historique d'actions | Gestion d'état complète avec devtools (Zustand) |
| **Decorator** | Hooks before/after/around | Lib utilitaire FP complète (Ramda) |

### Patterns sans alternative

Huit patterns n'ont tout simplement aucune lib TypeScript fonctionnelle standalone. Aujourd'hui, c'est soit on l'implémente à la main, soit on utilise Eidos :

- **Abstract Factory**
- **Builder** (générique, pas spécifique à un domaine)
- **Chain of Responsibility** (standalone, pas du middleware de framework)
- **Adapter** (wrapper de fonction typé)
- **Mediator** (hub d'événements typé)
- **Memento** (historique de snapshots)
- **Template Method**
- **Composite** (arbre typé avec fold/map)

---

## Eidos complète, il ne remplace pas

Eidos n'est pas un concurrent direct des bibliothèques spécialisées. Si le framework fournit déjà une primitive réactive (Observables RxJS, Signals Angular, signals Solid), on l'utilise. Eidos s'efface. Si on a besoin de statecharts complets avec un inspecteur visuel, XState est le bon outil. Si on a besoin d'un système d'effets complet avec concurrence structurée, Effect est le bon outil.

Eidos comble les trous entre ces solutions spécialisées : les patterns qui n'ont pas de lib dédiée, ceux qu'on implémente à la main faute de mieux, et ceux qui sont tellement simples en TypeScript fonctionnel qu'un rappel d'une ligne dans l'IDE suffit.

On peut utiliser Eidos à côté de n'importe laquelle de ces libs. Un pattern ou vingt, chacun est tree-shakable indépendamment, et les patterns qui chevauchent Arkhe n'ajoutent aucun poids au bundle.

---

<RelatedLinks title="Pour aller plus loin">

- [Guide du module Eidos](/guide/modules/eidos) : philosophie, catégories et exemples rapides
- [Référence API Eidos](/api/eidos/) : les 23 patterns avec documentation complète
- [Pithos vs Effect](./pithos-vs-effect.md) : écosystème modulaire vs système d'effets complet
- [Vue d'ensemble des comparaisons](./overview.md) : quand utiliser chaque module Pithos

</RelatedLinks>