import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

interface WarningTooltipProps {
  content: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
}

// Context to allow parent to trigger modal
interface WarningModalContextValue {
  openModal: (content: React.ReactNode, header?: { icon: string; title: string }) => void;
}

const WarningModalContext = React.createContext<WarningModalContextValue | null>(null);

/**
 * Provider that renders the modal. Wrap your table with this.
 */
export function WarningModalProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalHeader, setModalHeader] = useState<{ icon: string; title: string } | null>(null);

  const openModal = useCallback((content: React.ReactNode, header?: { icon: string; title: string }) => {
    setModalContent(content);
    setModalHeader(header ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
    setModalHeader(null);
  }, []);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalContent) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [modalContent, closeModal]);

  const modalElement = modalContent && typeof document !== "undefined"
    ? createPortal(
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>{modalHeader?.icon ?? '⚠️'}</span>
              <span className={styles.modalTitle}>{modalHeader?.title ?? translate({ id: 'shared.warningTooltip.modalTitle', message: 'Nearly equivalent' })}</span>
              <button
                className={styles.modalClose}
                onClick={closeModal}
                aria-label={translate({ id: 'shared.warningTooltip.close', message: 'Close' })}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>{modalContent}</div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <WarningModalContext.Provider value={{ openModal }}>
      {children}
      {modalElement}
    </WarningModalContext.Provider>
  );
}

/**
 * Hook to get the openModal function
 */
export function useWarningModal(): WarningModalContextValue | null {
  return React.useContext(WarningModalContext);
}

/**
 * Warning icon with tooltip on desktop only.
 * On mobile/tablet, the parent cell handles the click via useWarningModal.
 */
export function WarningTooltip({ content, icon, children }: WarningTooltipProps): React.ReactElement {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipReady, setTooltipReady] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0, placement: "top" });
  const iconRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Measure tooltip and calculate final position
  useEffect(() => {
    if (showTooltip && !tooltipReady && tooltipRef.current && iconRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const iconRect = iconRef.current.getBoundingClientRect();
      
      const spaceAbove = iconRect.top;
      const tooltipHeight = tooltipRect.height;
      
      // Check if there's enough space above
      const placement = spaceAbove > tooltipHeight + 16 ? "top" : "bottom";
      
      setTooltipPosition({
        top: placement === "top" ? iconRect.top - 8 : iconRect.bottom + 8,
        left: iconRect.left + iconRect.width / 2,
        placement,
      });
      setTooltipReady(true);
    }
  }, [showTooltip, tooltipReady]);

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      // Initial position for measurement (hidden)
      setTooltipPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
        placement: "top",
      });
      setTooltipReady(false);
      setShowTooltip(true);
    }
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice) {
      setShowTooltip(false);
      setTooltipReady(false);
    }
  }, [isTouchDevice]);

  // Tooltip rendered via portal to body (desktop only)
  // First render hidden for measurement, then show at correct position
  const tooltipElement = showTooltip && !isTouchDevice && typeof document !== "undefined"
    ? createPortal(
        <span
          ref={tooltipRef}
          className={`${styles.tooltip} ${tooltipPosition.placement === "bottom" ? styles.tooltipBottom : ""} ${!tooltipReady ? styles.tooltipMeasuring : ""}`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: tooltipPosition.placement === "top" 
              ? "translate(-50%, -100%)" 
              : "translate(-50%, 0)",
          }}
        >
          {content}
        </span>,
        document.body
      )
    : null;

  return (
    <>
      <span
        ref={iconRef}
        className={styles.warningContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={translate({ id: 'shared.warningTooltip.warningInfo', message: 'Warning information' })}
      >
        {icon ?? <span className={styles.warningIcon}>⚠️</span>}
        {children}
      </span>
      {tooltipElement}
    </>
  );
}

export default WarningTooltip;
