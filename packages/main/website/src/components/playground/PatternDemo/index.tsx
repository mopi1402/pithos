import React from "react";
import { translate } from "@docusaurus/Translate";
import { Playground, type SourceFile } from "../Playground";
import styles from "./styles.module.css";

// Import all pattern sources
import builderSources from "@site/src/data/builder-demo-sources.json";
import chainSources from "@site/src/data/chain-demo-sources.json";
import commandSources from "@site/src/data/command-demo-sources.json";
import decoratorSources from "@site/src/data/decorator-demo-sources.json";
import observerSources from "@site/src/data/observer-demo-sources.json";
import stateSources from "@site/src/data/state-demo-sources.json";
import strategySources from "@site/src/data/strategy-demo-sources.json";
import proxySources from "@site/src/data/proxy-demo-sources.json";
import iteratorSources from "@site/src/data/iterator-demo-sources.json";
import mediatorSources from "@site/src/data/mediator-demo-sources.json";
import abstractFactorySources from "@site/src/data/abstract-factory-demo-sources.json";
import compositeSources from "@site/src/data/composite-demo-sources.json";
import adapterSources from "@site/src/data/adapter-demo-sources.json";
import mementoSources from "@site/src/data/memento-demo-sources.json";
import templateSources from "@site/src/data/template-demo-sources.json";
import bridgeSources from "@site/src/data/bridge-demo-sources.json";
import interpreterSources from "@site/src/data/interpreter-demo-sources.json";
import facadeSources from "@site/src/data/facade-demo-sources.json";
import factoryMethodSources from "@site/src/data/factory-method-demo-sources.json";
import flyweightSources from "@site/src/data/flyweight-demo-sources.json";
import prototypeSources from "@site/src/data/prototype-demo-sources.json";
import singletonSources from "@site/src/data/singleton-demo-sources.json";
import visitorSources from "@site/src/data/visitor-demo-sources.json";

const GITHUB_REPO = "https://github.com/mopi1402/pithos";
const EXAMPLES_PATH = "packages/pithos/examples/design-patterns";

/** Map pattern names to their sources */
const PATTERN_SOURCES: Record<string, Record<string, SourceFile>> = {
  builder: builderSources,
  chain: chainSources,
  command: commandSources,
  decorator: decoratorSources,
  observer: observerSources,
  state: stateSources,
  strategy: strategySources,
  proxy: proxySources,
  iterator: iteratorSources,
  mediator: mediatorSources,
  "abstract-factory": abstractFactorySources,
  composite: compositeSources,
  adapter: adapterSources,
  memento: mementoSources,
  template: templateSources,
  bridge: bridgeSources,
  interpreter: interpreterSources,
  facade: facadeSources,
  "factory-method": factoryMethodSources,
  flyweight: flyweightSources,
  prototype: prototypeSources,
  singleton: singletonSources,
  visitor: visitorSources,
};

interface PatternDemoProps {
  /** The pattern name (folder name in design-patterns) */
  pattern: string;
}

/**
 * Complete pattern demo component.
 * Loads sources automatically based on pattern name and displays the playground.
 */
export function PatternDemo({ pattern }: PatternDemoProps): React.ReactElement {
  const sources = PATTERN_SOURCES[pattern];
  const sourceUrl = `${GITHUB_REPO}/tree/main/${EXAMPLES_PATH}/${pattern}`;
  const title = `${pattern.charAt(0).toUpperCase() + pattern.slice(1)} Pattern Demo`;

  if (!sources) {
    return (
      <div className="admonition admonition-warning alert alert--warning">
        <div className="admonition-content">
          Unknown pattern: {pattern}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Playground
        iframeSrc={`/demos/design-patterns/${pattern}/index.html`}
        sources={sources}
        title={title}
      />
      <div className={styles.sourceLink}>
        <div className="admonition admonition-info alert alert--info">
          <div className="admonition-content">
            {translate({
              id: "patternDemo.sourceCode",
              message: "The complete source code is available on",
            })}{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
