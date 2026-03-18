---
sidebar_label: "Eidos"
sidebar_position: 4.6
title: "Eidos in the TypeScript Ecosystem"
description: "How Eidos fits into the TypeScript ecosystem. The only library that provides all 23 GoF design patterns in functional TypeScript, with zero dependencies."
keywords:
  - design patterns typescript
  - gof patterns functional
  - typescript patterns comparison
  - eidos vs alternatives
  - functional design patterns library
  - strategy pattern typescript
  - observer pattern typescript
---

import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { Picture } from '@site/src/components/shared/Picture';
import Link from '@docusaurus/Link';

<ArticleSchema
  headline="Eidos in the TypeScript Ecosystem"
  description="How Eidos fits into the TypeScript ecosystem. The only library that provides all 23 GoF design patterns in functional TypeScript, with zero dependencies."
  datePublished="2026-03-29"
/>

# Eidos in the TypeScript Ecosystem

The GoF design patterns are not outdated. The problems they solve are still real. They just need to be adapted to the way we write TypeScript today: composable, functional, without classes or inheritance. Even the Singleton, often criticized as an anti-pattern in OOP, becomes harmless in functional TypeScript where it's just a module-level `const`.

Pithos is the only TypeScript library that provides all 23 GoF design patterns in a functional style. Some libraries teach them as OOP examples. Others solve one or two patterns in isolation. Eidos is the first to cover all 23 with a unified, composable, framework-agnostic API. This page explains why that matters.

---

## What Exists Today

Design pattern resources in JS/TS fall into three categories. Each solves part of the problem. None solves all of it.

- **Educational repositories.**  
Projects like [refactoring.guru](https://refactoring.guru/design-patterns/typescript), [torokmark/design_patterns_in_typescript](https://github.com/torokmark/design_patterns_in_typescript) or [design-patterns-for-humans](https://github.com/kamranahmedse/design-patterns-for-humans) cover all 23 patterns, but as examples you cannot `npm install`. And they all teach patterns through OOP (classes and inheritance), while modern TypeScript stacks increasingly favor composable, functional approaches.

- **Specialized libraries.**  
The ecosystem offers excellent single-pattern solutions: [RxJS](https://rxjs.dev/), [mitt](https://github.com/developit/mitt), or [nanoevents](https://github.com/ai/nanoevents) for Observer; [XState](https://xstate.js.org/) or [Robot](https://thisrobot.life/) for State machines; [Immer](https://immerjs.github.io/immer/) for Command/undo-redo; [Ramda](https://ramdajs.com/) for function composition. Some libraries like [Zustand](https://zustand.docs.pmnd.rs/) combine several patterns (State, Observer, Command) but remain tied to React. Each covers its niche well, but none aims to provide a complete, framework-agnostic set of patterns.

- **FP ecosystems.**  
Libraries like [fp-ts](https://gcanti.github.io/fp-ts/), [Effect](https://effect.website/), or [purify-ts](https://gigobyte.github.io/purify/) provide functional abstractions that indirectly overlap with some GoF patterns. But none set out to cover all 23. The coverage is incidental.

### Where Eidos Fits

Eidos sits in a space none of the three categories above occupy: a production-ready, tree-shakable library that covers every GoF pattern with a consistent functional API.

---

## The Fragmentation Problem

Covering just five patterns with specialized libraries means five `npm install`, five API styles, five documentation sites, and five mental models for what are, at the core, related structural ideas:

```bash
npm install rxjs           # Observer
npm install xstate         # State
npm install ramda          # Decorator / composition
npm install immer          # Memento / Command
npm install iter-tools     # Iterator
```

This is not a criticism of these libraries, they are excellent at what they do. But a project that needs several patterns pays for the fragmentation in cognitive load, bundle weight, maintenance surface, and supply chain risk: each dependency is a potential vulnerability.

---

## What Eidos Does Differently

### Framework-Agnostic

Most specialized libraries are tied to a specific ecosystem. RxJS is deeply integrated with Angular. Zustand is designed for React. XState has framework-specific bindings. If you switch framework, or if you work on a backend Node.js project, these libraries either don't apply or bring unnecessary coupling.

Eidos has no opinion on your framework. It produces plain functions and plain data. You can use it in React, Angular, Vue, Svelte, a CLI tool, a serverless function, or a vanilla TypeScript project. The patterns work the same way everywhere because they depend on nothing but TypeScript itself.

### One Import Path, One Philosophy

Every pattern follows the same conventions: functions return plain data, state is immutable, configuration uses typed records, composition uses higher-order functions.

```typescript
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";
import { createMachine }    from "@pithos/core/eidos/state/state";
import { createChain }      from "@pithos/core/eidos/chain/chain";
import { createObservable } from "@pithos/core/eidos/observer/observer";
import { createBuilder }    from "@pithos/core/eidos/builder/builder";
```

No classes. No inheritance. No abstract methods. Same mental model everywhere.

### Honest About What the Language Already Does

Eidos deliberately exports all 23 patterns, including the five that TypeScript makes trivial. These five are marked `@deprecated`, which serves two purposes: the library remains a complete, homogeneous reference for all GoF patterns, and developers searching for "factory method" or "visitor" in their IDE get immediate guidance toward the idiomatic alternative instead of a class-based implementation.

| Pattern | What your IDE shows you |
|---|---|
| Factory Method | _"Pass the factory function as a parameter. This is dependency injection."_ |
| Bridge | _"Pass the implementation as a function parameter."_ |
| Facade | _"Write a function that calls other functions."_ |
| Visitor | _"Use a switch on a discriminated union."_ |
| Interpreter | _"Define a discriminated union AST and a recursive eval function."_ |

### Shared Infrastructure with Pithos

Four patterns are re-exports from Arkhe, with zero additional bundle weight:

| Pattern | Arkhe function |
|---|---|
| Prototype | [`deepClone()`](/api/arkhe/object/deepClone) |
| Singleton | [`once()`](/api/arkhe/function/once) |
| Flyweight | [`memoize()`](/api/arkhe/function/memoize) |
| Proxy | [`memoize()`](/api/arkhe/function/memoize), [`throttle()`](/api/arkhe/function/throttle), [`debounce()`](/api/arkhe/function/debounce), [`lazy()`](/api/eidos/proxy/lazy), [`guarded()`](/api/eidos/proxy/guarded) |

### Every Pattern Has a Live Demo

Each pattern comes with a dedicated page that includes the problem it solves, the Eidos solution, and an interactive demo you can try in the browser, with its source code downloadable.

<details>
<summary>Discover the demos</summary>

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
Finite state machine with typed transitions and events. A tennis scoreboard for Roland Garros where the Deuce/Advantage loop is encoded in transitions, not conditionals.

[`createMachine()`](/api/eidos/state/createMachine)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/state/)
- [Live demo](/api/eidos/state/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/strategy/#live-demo"><Picture src="/img/generated/demos/design-patterns/strategy" alt="Strategy demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Strategy**<br/>
Swap algorithms at runtime by key. A cosmetics e-shop pricing calculator with interchangeable discount strategies (Standard, Club, Seasonal, Coffret).

[`createStrategies()`](/api/eidos/strategy/createStrategies), [`safeStrategy()`](/api/eidos/strategy/safeStrategy), [`withFallback()`](/api/eidos/strategy/withFallback), [`withValidation()`](/api/eidos/strategy/withValidation)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/strategy/)
- [Live demo](/api/eidos/strategy/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/observer/#live-demo"><Picture src="/img/generated/demos/design-patterns/observer" alt="Observer demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Observer**<br/>
Typed pub/sub event emitter. A stock trading dashboard where chart, alerts, and portfolio react independently to price changes.

[`createObservable()`](/api/eidos/observer/createObservable)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/observer/)
- [Live demo](/api/eidos/observer/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/command/#live-demo"><Picture src="/img/generated/demos/design-patterns/command" alt="Command demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Command**<br/>
Encapsulate actions with undo/redo. A Kanban board where every drag is a reversible command with human-readable history and replay.

[`undoableState()`](/api/eidos/command/undoableState), [`createReactiveCommandStack()`](/api/eidos/command/createReactiveCommandStack)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/command/)
- [Live demo](/api/eidos/command/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/iterator/#live-demo"><Picture src="/img/generated/demos/design-patterns/iterator" alt="Iterator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Iterator**<br/>
Lazy sequences with Option-based next(). A Pokédex browser with three interchangeable traversal strategies over 151 Pokémon.

[`createIterable()`](/api/eidos/iterator/createIterable), [`lazyRange()`](/api/eidos/iterator/lazyRange), [`iterate()`](/api/eidos/iterator/iterate)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/iterator/)
- [Live demo](/api/eidos/iterator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/builder/#live-demo"><Picture src="/img/generated/demos/design-patterns/builder" alt="Builder demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Builder**<br/>
Step-by-step construction with a fluent API. A chart builder where toggling steps updates the visualization in real-time.

[`createBuilder()`](/api/eidos/builder/createBuilder), [`createValidatedBuilder()`](/api/eidos/builder/createValidatedBuilder)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/builder/)
- [Live demo](/api/eidos/builder/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/decorator/#live-demo"><Picture src="/img/generated/demos/design-patterns/decorator" alt="Decorator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Decorator**<br/>
Stack behaviors without modifying the core function. A DNA analysis pipeline where you toggle quality filter, cache, retry, and timing decorators.

[`decorate()`](/api/eidos/decorator/decorate), [`before()`](/api/eidos/decorator/before), [`after()`](/api/eidos/decorator/after), [`around()`](/api/eidos/decorator/around)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/decorator/)
- [Live demo](/api/eidos/decorator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/chain/#live-demo"><Picture src="/img/generated/demos/design-patterns/chain" alt="Chain demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Chain of Responsibility**<br/>
Pipeline of handlers that can pass or short-circuit. An HTTP middleware simulator with toggleable auth, rate-limit, validation, and logging.

[`createChain()`](/api/eidos/chain/createChain), [`safeChain()`](/api/eidos/chain/safeChain)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/chain/)
- [Live demo](/api/eidos/chain/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/mediator/#live-demo"><Picture src="/img/generated/demos/design-patterns/mediator" alt="Mediator demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Mediator**<br/>
Centralize communication between components. A DGAC flight dashboard where weather, flights, and runway panels communicate through a typed event hub.

[`createMediator()`](/api/eidos/mediator/createMediator)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/mediator/)
- [Live demo](/api/eidos/mediator/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/memento/#live-demo"><Picture src="/img/generated/demos/design-patterns/memento" alt="Memento demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Memento**<br/>
Capture and restore state snapshots. A photo editor with filters where each change creates a thumbnail snapshot you can jump to.

[`createHistory()`](/api/eidos/memento/createHistory)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/memento/)
- [Live demo](/api/eidos/memento/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/template/#live-demo"><Picture src="/img/generated/demos/design-patterns/template" alt="Template demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Template Method**<br/>
Define an algorithm skeleton with overridable steps. A resume builder where Developer, Designer, and Manager profiles override specific steps.

[`templateWithDefaults()`](/api/eidos/template/templateWithDefaults)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/template/)
- [Live demo](/api/eidos/template/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/abstract-factory/#live-demo"><Picture src="/img/generated/demos/design-patterns/abstract-factory" alt="Abstract Factory demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Abstract Factory**<br/>
Create families of related objects. A cross-platform UI kit where switching iOS/Android/Web re-skins the entire form at once.

[`createAbstractFactory()`](/api/eidos/abstract-factory/createAbstractFactory)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/abstract-factory/)
- [Live demo](/api/eidos/abstract-factory/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/composite/#live-demo"><Picture src="/img/generated/demos/design-patterns/composite" alt="Composite demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Composite**<br/>
Tree structures with uniform leaf/branch handling. A file explorer where folder sizes are computed recursively via fold().

[`leaf()`](/api/eidos/composite/leaf), [`branch()`](/api/eidos/composite/branch), [`fold()`](/api/eidos/composite/fold), [`map()`](/api/eidos/composite/map), [`flatten()`](/api/eidos/composite/flatten), [`find()`](/api/eidos/composite/find)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/composite/)
- [Live demo](/api/eidos/composite/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/adapter/#live-demo"><Picture src="/img/generated/demos/design-patterns/adapter" alt="Adapter demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Adapter**<br/>
Make incompatible APIs work together. A map app that normalizes two French open data APIs (EV charging + fuel stations) into one uniform format.

[`adapt()`](/api/eidos/adapter/adapt), [`createAdapter()`](/api/eidos/adapter/createAdapter)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/adapter/)
- [Live demo](/api/eidos/adapter/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/proxy/#live-demo"><Picture src="/img/generated/demos/design-patterns/proxy" alt="Proxy demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Proxy**<br/>
Control access with caching, rate-limiting, and fallback. A simulated LLM API where cache hits save money and rate limits protect the provider.

[`memoize()`](/api/arkhe/function/memoize), [`throttle()`](/api/arkhe/function/throttle), [`lazy()`](/api/eidos/proxy/lazy), [`guarded()`](/api/eidos/proxy/guarded)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/proxy/)
- [Live demo](/api/eidos/proxy/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/singleton/#live-demo"><Picture src="/img/generated/demos/design-patterns/singleton" alt="Singleton demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Singleton**<br/>
Lazy initialization, same instance on every call. Three services (Database, Cache, Logger) where first request is slow and subsequent ones are instant.

[`once()`](/api/arkhe/function/once)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/singleton/)
- [Live demo](/api/eidos/singleton/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/prototype/#live-demo"><Picture src="/img/generated/demos/design-patterns/prototype" alt="Prototype demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Prototype**<br/>
Clone objects without shared references. A config editor where deep clone keeps the original untouched while shallow copy leaks mutations.

[`deepClone()`](/api/arkhe/object/deepClone), [`deepCloneFull()`](/api/arkhe/object/deepCloneFull)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/prototype/)
- [Live demo](/api/eidos/prototype/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/flyweight/#live-demo"><Picture src="/img/generated/demos/design-patterns/flyweight" alt="Flyweight demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Flyweight**<br/>
Share common state to reduce memory. A text editor where style objects are pooled via memoize, showing 96% memory savings.

[`memoize()`](/api/arkhe/function/memoize)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/flyweight/)
- [Live demo](/api/eidos/flyweight/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/factory-method/#live-demo"><Picture src="/img/generated/demos/design-patterns/factory-method" alt="Factory Method demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Factory Method**<br/>
Delegate creation to injected functions. A notification sender where the same sendNotification() call produces Email, SMS, Push, or Slack notifications.

Pattern absorbed by the language (dependency injection)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/factory-method/)
- [Live demo](/api/eidos/factory-method/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/visitor/#live-demo"><Picture src="/img/generated/demos/design-patterns/visitor" alt="Visitor demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Visitor**<br/>
Add operations without modifying objects. An email builder where the same block list produces Preview, HTML, Plain Text, or Accessibility Audit output.

Pattern absorbed by the language (switch on discriminated union)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/visitor/)
- [Live demo](/api/eidos/visitor/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/bridge/#live-demo"><Picture src="/img/generated/demos/design-patterns/bridge" alt="Bridge demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Bridge**<br/>
Decouple two axes that vary independently. A music visualizer with 3 audio sources x 5 renderers = 15 combinations from one function call.

Pattern absorbed by the language (pass functions as parameters)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/bridge/)
- [Live demo](/api/eidos/bridge/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0",borderBottom:"1px solid var(--ifm-color-emphasis-200)"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/facade/#live-demo"><Picture src="/img/generated/demos/design-patterns/facade" alt="Facade demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Facade**<br/>
Simplified interface to a complex subsystem. An API request demo showing 6 manual steps vs one fetchUser() call.

Pattern absorbed by the language (just a function)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/facade/)
- [Live demo](/api/eidos/facade/#live-demo)

</div>

</div>
</div>

<div className="demo-row" style={{display:"flex",alignItems:"center",gap:"1.5rem",padding:"1rem 0"}}>
<Link className="demo-img" style={{display:'block'}} to="/api/eidos/interpreter/#live-demo"><Picture src="/img/generated/demos/design-patterns/interpreter" alt="Interpreter demo" displaySize={400} sourceWidth={1600} style={{borderRadius:12,width:'100%',display:'block'}} /></Link>
<div style={{flex:1,minWidth:0}}>

**Interpreter**<br/>
Evaluate expressions or DSLs. A full Markdown interpreter with live preview, AST visualization, and synchronized scroll.

Pattern absorbed by the language (discriminated union + recursive eval)


<div className="demo-related" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'0.75rem 1.25rem',marginTop:'0.75rem'}}>

**Related**
- [Documentation](/api/eidos/interpreter/)
- [Live demo](/api/eidos/interpreter/#live-demo)

</div>

</div>
</div>

</details>

---

## Eidos vs Dedicated Libraries

For some patterns, a dedicated library goes deeper than Eidos. This is by design: Eidos covers the 80% case. When you need the full framework, use the framework.

| Pattern | When Eidos is enough | When to reach for a dedicated lib |
|---|---|---|
| **Observer** | Simple typed pub/sub | Complex stream processing (RxJS) |
| **State** | Finite state machine with typed transitions | Hierarchical statecharts, actors, visualizer (XState) |
| **Iterator** | Lazy sequences, basic operators | Extensive async iteration operators (IxJS) |
| **Command** | Undo/redo with action history | Full state management with devtools (Zustand) |
| **Decorator** | before/after/around hooks | Full FP utility library (Ramda) |

### Patterns Where No Alternative Exists

Eight patterns have no standalone functional TypeScript library. The only options today are manual implementation or Eidos:

- **Abstract Factory**
- **Builder** (generic, not domain-specific)
- **Chain of Responsibility** (standalone, not framework middleware)
- **Adapter** (typed function wrapper)
- **Mediator** (typed event hub)
- **Memento** (snapshot history)
- **Template Method**
- **Composite** (typed tree with fold/map)

---

## Eidos Complements, It Doesn't Replace

Eidos is not competing with technology-specific solutions. If your framework provides a reactive primitive (RxJS Observables, Angular Signals, Solid signals), use it. Eidos steps aside. If you need full statecharts with a visual inspector, XState is the right tool. If you need a complete effect system with structured concurrency, Effect is the right tool.

Eidos fills the gaps between these specialized solutions: the patterns that have no dedicated library, the patterns you would otherwise implement by hand, and the patterns that are so simple in functional TypeScript that all you need is a one-line reminder in your IDE.

You can use Eidos alongside any of these libraries. Import one pattern or twenty, each is independently tree-shakable, and patterns that overlap with Arkhe carry zero additional weight.

---

<RelatedLinks title="Further Reading">

- [Eidos module guide](/guide/modules/eidos): philosophy, categories, and quick examples
- [Eidos API reference](/api/eidos/): all 23 patterns with full documentation
- [Pithos vs Effect](./pithos-vs-effect.md): modular ecosystem vs full effect system
- [Comparison Overview](./overview.md): when to use each Pithos module

</RelatedLinks>