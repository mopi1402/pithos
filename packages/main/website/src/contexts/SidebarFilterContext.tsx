import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarFilterContextValue {
  showTopPicksOnly: boolean;
  setShowTopPicksOnly: (value: boolean) => void;
  showHiddenGemsOnly: boolean;
  setShowHiddenGemsOnly: (value: boolean) => void;
}

const SidebarFilterContext = createContext<
  SidebarFilterContextValue | undefined
>(undefined);

export function SidebarFilterProvider({ children }: { children: ReactNode }) {
  const [showTopPicksOnly, setShowTopPicksOnly] = useState(false);
  const [showHiddenGemsOnly, setShowHiddenGemsOnly] = useState(false);

  return (
    <SidebarFilterContext.Provider
      value={{
        showTopPicksOnly,
        setShowTopPicksOnly,
        showHiddenGemsOnly,
        setShowHiddenGemsOnly,
      }}
    >
      {children}
    </SidebarFilterContext.Provider>
  );
}

export function useSidebarFilter() {
  const context = useContext(SidebarFilterContext);
  // Return default values if context is not available (for components outside provider)
  if (!context) {
    return {
      showTopPicksOnly: false,
      setShowTopPicksOnly: () => {},
      showHiddenGemsOnly: false,
      setShowHiddenGemsOnly: () => {},
    };
  }
  return context;
}
