import React, { useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./styles.module.css";

import demoSources from "@site/src/data/demo-sources.json";

type SourceFile = {
  content: string;
  label: string;
  step: number;
};

const sources = demoSources as Record<string, SourceFile>;

const orderedFiles = Object.entries(sources)
  .sort(([, a], [, b]) => a.step - b.step)
  .filter(([, file]) => file.step > 0);

export function DashboardPlayground(): React.ReactElement {
  const [mobileView, setMobileView] = useState<"code" | "preview">("code");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div className={styles.fullscreenOverlay}>
        <div className={styles.fullscreenHeader}>
          <span>Dashboard Demo</span>
          <button
            className={styles.closeBtn}
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            ✕
          </button>
        </div>
        <iframe
          src="/demos/practical-example/index.html"
          title="Dashboard Demo"
          className={styles.fullscreenIframe}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Mobile toggle */}
      <div className={styles.mobileToggle}>
        <button
          className={`${styles.toggleBtn} ${mobileView === "code" ? styles.active : ""}`}
          onClick={() => setMobileView("code")}
        >
          Code
        </button>
        <button
          className={`${styles.toggleBtn} ${mobileView === "preview" ? styles.active : ""}`}
          onClick={() => setMobileView("preview")}
        >
          Preview
        </button>
      </div>

      <div className={styles.splitView}>
        {/* Code Panel */}
        <div className={`${styles.codePanel} ${mobileView === "code" ? styles.mobileVisible : styles.mobileHidden}`}>
          <div className={styles.panelHeader}>
            <span>Code</span>
          </div>
          <Tabs>
            {orderedFiles.map(([path, file]) => (
              <TabItem key={path} value={path} label={file.label}>
                <CodeBlock language="typescript" showLineNumbers>
                  {file.content}
                </CodeBlock>
              </TabItem>
            ))}
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className={`${styles.previewPanel} ${mobileView === "preview" ? styles.mobileVisible : styles.mobileHidden}`}>
          <div className={styles.panelHeader}>
            <span>Result</span>
            <button
              className={styles.fullscreenBtn}
              onClick={() => setIsFullscreen(true)}
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              ⛶
            </button>
          </div>
          <div className={styles.iframeWrapper}>
            <iframe
              src="/demos/practical-example/index.html"
              title="Dashboard Demo"
              className={styles.iframe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
