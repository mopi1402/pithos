import React, { ReactNode } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import styles from "./styles.module.css";

interface CodeProps {
  children: ReactNode;
  lang?: string;
}

function highlightCode(code: string, lang: string): string {
  return Prism.highlight(code, Prism.languages[lang] || Prism.languages.javascript, lang);
}

function renderChildren(children: ReactNode, lang: string): ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return (
        <span dangerouslySetInnerHTML={{ __html: highlightCode(child, lang) }} />
      );
    }
    
    if (React.isValidElement(child) && child.type === "s") {
      const text = child.props.children as string;
      return (
        <span 
          className={styles.strikethrough}
          dangerouslySetInnerHTML={{ __html: highlightCode(text, lang) }}
        />
      );
    }
    
    return child;
  });
}

export function Code({ children, lang = "typescript" }: CodeProps): React.ReactElement {
  return (
    <code className={styles.code}>
      {renderChildren(children, lang)}
    </code>
  );
}
