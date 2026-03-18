import type { Platform, UIKit } from "@/lib/types";

/** Platform switcher metadata */
export const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
  { key: "web", label: "Web" },
];

/** Factory family definitions — one per platform */
export const PLATFORM_FAMILIES: Record<Platform, () => UIKit> = {
  ios: () => ({
    button: () => ({
      container: "bg-[#007AFF] px-5 py-3 text-center active:opacity-70",
      text: "text-white text-sm font-semibold tracking-tight",
      secondaryContainer: "bg-[#007AFF]/10 px-5 py-3 text-center active:opacity-70",
      secondaryText: "text-[#007AFF] text-sm font-semibold tracking-tight",
      radius: "12px",
    }),
    input: () => ({
      container: "bg-[#F2F2F7] px-4 py-3 border border-transparent",
      text: "text-[15px] text-black placeholder:text-[#8E8E93]",
      placeholder: "text-[#8E8E93]",
      focus: "border-[#007AFF]",
      radius: "12px",
    }),
    modal: () => ({
      backdrop: "bg-black/40 backdrop-blur-sm",
      panel: "bg-white/95 backdrop-blur-xl rounded-2xl mx-8 overflow-hidden shadow-2xl",
      title: "text-[17px] font-semibold text-black text-center pt-5 px-4",
      message: "text-[13px] text-[#8E8E93] text-center px-4 pt-1 pb-4",
      button: "text-[#007AFF] text-[17px] font-normal py-3 text-center border-t border-[#E5E5EA] active:bg-[#E5E5EA]",
    }),
    nav: () => ({
      container: "px-4 pb-2 pt-1 flex items-center justify-center relative",
      title: "text-[17px] font-semibold text-black",
      backButton: "absolute left-2 text-[#007AFF] text-[17px]",
      statusBar: "bg-white",
    }),
    theme: () => ({
      name: "iOS",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      bg: "#F2F2F7",
      cardBg: "#FFFFFF",
      accent: "#007AFF",
    }),
  }),

  android: () => ({
    button: () => ({
      container: "bg-[#6750A4] px-6 py-3 text-center shadow-md active:shadow-sm",
      text: "text-white text-sm font-medium tracking-wide",
      secondaryContainer: "border-2 border-[#6750A4] px-6 py-3 text-center",
      secondaryText: "text-[#6750A4] text-sm font-medium tracking-wide",
      radius: "22px",
    }),
    input: () => ({
      container: "bg-transparent border-b-2 border-[#79747E] px-1 py-3",
      text: "text-[14px] text-[#1D1B20] placeholder:text-[#49454F]",
      placeholder: "text-[#49454F]",
      focus: "border-[#6750A4]",
      radius: "0px",
    }),
    modal: () => ({
      backdrop: "bg-black/50",
      panel: "bg-[#ECE6F0] rounded-3xl mx-6 overflow-hidden shadow-2xl",
      title: "text-[24px] font-normal text-[#1D1B20] px-6 pt-6",
      message: "text-[14px] text-[#49454F] px-6 pt-2 pb-4",
      button: "text-[#6750A4] text-[14px] font-medium px-6 py-3 text-right",
    }),
    nav: () => ({
      container: "px-4 pb-3 pt-2 flex items-center gap-3",
      title: "text-[22px] font-normal text-[#1D1B20]",
      backButton: "text-[#1D1B20]",
      statusBar: "bg-white",
    }),
    theme: () => ({
      name: "Android",
      fontFamily: "'Roboto', 'Google Sans', sans-serif",
      bg: "#FEF7FF",
      cardBg: "#FFFFFF",
      accent: "#6750A4",
    }),
  }),

  web: () => ({
    button: () => ({
      container: "bg-[#2563EB] px-5 py-2.5 text-center hover:bg-[#1D4ED8] shadow-sm",
      text: "text-white text-sm font-medium",
      secondaryContainer: "bg-white border border-[#D1D5DB] px-5 py-2.5 text-center hover:bg-[#F9FAFB] shadow-sm",
      secondaryText: "text-[#374151] text-sm font-medium",
      radius: "6px",
    }),
    input: () => ({
      container: "bg-white border border-[#D1D5DB] px-3 py-2 shadow-sm",
      text: "text-[14px] text-[#111827] placeholder:text-[#9CA3AF]",
      placeholder: "text-[#9CA3AF]",
      focus: "border-[#2563EB] ring-2 ring-[#2563EB]/20",
      radius: "6px",
    }),
    modal: () => ({
      backdrop: "bg-black/50",
      panel: "bg-white rounded-lg mx-12 overflow-hidden shadow-xl border border-[#E5E7EB]",
      title: "text-[16px] font-semibold text-[#111827] px-4 pt-4",
      message: "text-[13px] text-[#6B7280] px-4 pt-2 pb-4",
      button: "text-white text-[13px] font-medium bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md py-2 text-center",
    }),
    nav: () => ({
      container: "px-4 pb-2 pt-2 flex items-center gap-3 border-b border-[#E5E7EB]",
      title: "text-[16px] font-semibold text-[#111827]",
      backButton: "text-[#6B7280] hover:text-[#111827]",
      statusBar: "bg-white",
    }),
    theme: () => ({
      name: "Web",
      fontFamily: "'Inter', -apple-system, sans-serif",
      bg: "#F9FAFB",
      cardBg: "#FFFFFF",
      accent: "#2563EB",
    }),
  }),
};
