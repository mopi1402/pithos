import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export interface SourceFile {
  content: string;
  label: string;
  step: number;
}

export interface PlaygroundProps {
  /** URL for the iframe demo */
  iframeSrc: string;
  /** Source files to display in tabs */
  sources: Record<string, SourceFile>;
  /** Title shown in fullscreen mode */
  title?: string;
}

export function Playground({
  iframeSrc,
  sources,
  title = "Demo",
}: PlaygroundProps): React.ReactElement {
  const [mobileView, setMobileView] = useState<"code" | "preview">("code");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [startRect, setStartRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const orderedFiles = Object.entries(sources)
    .sort(([, a], [, b]) => a.step - b.step)
    .filter(([, file]) => file.step > 0);

  // Lock body scroll when expanded or fullscreen
  useEffect(() => {
    if (isExpanded || isFullscreen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isExpanded, isFullscreen]);

  const handleExpand = () => {
    const el = containerRef.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    setStartRect(rect);
    setIsExpanded(true);
    setIsClosing(false);
    setSkipAnimation(false);
  };

  const handleCollapse = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    const animName = e.animationName;
    if (animName.includes("collapse") && isClosing) {
      setIsExpanded(false);
      setIsClosing(false);
      setStartRect(null);
    }
  };

  // Escape key
  useEffect(() => {
    if (!isExpanded && !isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else if (isExpanded && !isClosing) handleCollapse();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isExpanded, isFullscreen, isClosing, handleCollapse]);

  const headerButtons = (showCollapse: boolean) => (
    <div className={styles.headerButtons}>
      <button
        className={styles.expandBtn}
        onClick={showCollapse ? handleCollapse : handleExpand}
        aria-label={translate({
          id: showCollapse ? "playground.collapse" : "playground.expand",
          message: showCollapse ? "Collapse view" : "Expand view",
        })}
        title={translate({
          id: showCollapse ? "playground.collapse" : "playground.expand",
          message: showCollapse ? "Collapse view" : "Expand view",
        })}
      >
        {showCollapse ? "⤡" : "⤢"}
      </button>
      <button
        className={styles.fullscreenBtn}
        onClick={() => {
          if (isExpanded) setSkipAnimation(true);
          setIsFullscreen(true);
        }}
        aria-label={translate({ id: "playground.fullscreen", message: "Fullscreen" })}
        title={translate({ id: "playground.fullscreen", message: "Fullscreen" })}
      >
        ⛶
      </button>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        <div ref={containerRef} className={styles.placeholder} style={{ height: startRect?.height || 400 }} />
        <div className={styles.fullscreenOverlay}>
          <div className={styles.fullscreenHeader}>
            <span>{title}</span>
            <button
              className={styles.closeBtn}
              onClick={() => setIsFullscreen(false)}
              aria-label={translate({ id: "playground.closeFullscreen", message: "Close fullscreen" })}
            >
              ✕
            </button>
          </div>
          <iframe src={iframeSrc} title={title} className={styles.fullscreenIframe} />
        </div>
      </>
    );
  }

  const expandedStyle = isExpanded && startRect ? {
    "--start-top": `${startRect.top}px`,
    "--start-left": `${startRect.left}px`,
    "--start-width": `${startRect.width}px`,
    "--start-height": `${startRect.height}px`,
  } as React.CSSProperties : undefined;

  const containerClasses = [
    styles.container,
    isExpanded && styles.expanded,
    isExpanded && !isClosing && !skipAnimation && styles.animateExpand,
    isClosing && styles.animateCollapse,
  ].filter(Boolean).join(" ");

  return (
    <>
      {isExpanded && startRect && (
        <div className={styles.placeholder} style={{ height: startRect.height }} />
      )}

      {isExpanded && createPortal(
        <div
          className={`${styles.backdrop} ${isClosing ? styles.backdropCollapsing : ""}`}
          onClick={handleCollapse}
          onKeyDown={(e) => e.key === "Enter" && handleCollapse()}
          role="button"
          tabIndex={0}
          aria-label={translate({ id: "playground.closeExpanded", message: "Close expanded view" })}
        />,
        document.body
      )}

      <div 
        ref={containerRef} 
        className={containerClasses}
        style={expandedStyle}
        onAnimationEnd={handleAnimationEnd}
        role={isExpanded ? "dialog" : undefined}
        aria-modal={isExpanded ? true : undefined}
      >
        {!isExpanded && (
          <div className={styles.mobileToggle}>
            <button
              className={`${styles.toggleBtn} ${mobileView === "code" ? styles.active : ""}`}
              onClick={() => setMobileView("code")}
            >
              {translate({ id: "playground.code", message: "Code" })}
            </button>
            <button
              className={`${styles.toggleBtn} ${mobileView === "preview" ? styles.active : ""}`}
              onClick={() => setMobileView("preview")}
            >
              {translate({ id: "playground.preview", message: "Preview" })}
            </button>
          </div>
        )}

        {isExpanded && (
          <div className={styles.expandedHeader}>
            <div className={styles.expandedHeaderCode}>
              <span>{translate({ id: "playground.code", message: "Code" })}</span>
            </div>
            <div className={styles.expandedHeaderResult}>
              <span>{translate({ id: "playground.result", message: "Result" })}</span>
              {headerButtons(true)}
            </div>
          </div>
        )}

        <div className={styles.splitView}>
          <div
            className={`${styles.codePanel} ${!isExpanded && mobileView === "code" ? styles.mobileVisible : ""} ${!isExpanded && mobileView !== "code" ? styles.mobileHidden : ""}`}
          >
            {!isExpanded && (
              <div className={styles.panelHeader}>
                <span>{translate({ id: "playground.code", message: "Code" })}</span>
              </div>
            )}
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

          <div
            className={`${styles.previewPanel} ${!isExpanded && mobileView === "preview" ? styles.mobileVisible : ""} ${!isExpanded && mobileView !== "preview" ? styles.mobileHidden : ""}`}
          >
            {!isExpanded && (
              <div className={styles.panelHeader}>
                <span>{translate({ id: "playground.result", message: "Result" })}</span>
                {headerButtons(false)}
              </div>
            )}
            <div className={styles.iframeWrapper}>
              <iframe src={iframeSrc} title={title} className={styles.iframe} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
