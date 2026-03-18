import type { BlockDef, EmailBlock, VisitorKey } from "@/lib/types";

export const BLOCK_PALETTE: BlockDef[] = [
  { type: "header", label: "Header", emoji: "🔤", create: () => ({ type: "header", text: "Welcome to our newsletter", level: 1 }) },
  { type: "text", label: "Text", emoji: "📝", create: () => ({ type: "text", content: "Thank you for subscribing. Here are this week's highlights and updates from our team." }) },
  { type: "image", label: "Image", emoji: "🖼️", create: () => ({ type: "image", src: "https://placehold.co/600x200/e2e8f0/64748b?text=Banner+Image", alt: "" }) },
  { type: "button", label: "Button", emoji: "🔘", create: () => ({ type: "button", label: "Read More", url: "https://example.com/article" }) },
  { type: "divider", label: "Divider", emoji: "➖", create: () => ({ type: "divider" }) },
];

export const DEFAULT_BLOCKS: EmailBlock[] = [
  { type: "header", text: "Your restaurant is online! 🍽️", level: 1 },
  { type: "text", content: "Welcome to Platify." },
  { type: "text", content: "Your site https://golden-fork.platify.io is live and ready for reservations." },
  { type: "image", src: import.meta.env.BASE_URL + "the-golden-fork.jpg", alt: "" },
  { type: "header", text: "Get started", level: 2 },
  { type: "text", content: "Upload your menu, add your opening hours, and enable online reservations. Your 14-day Pro trial includes the QR code menu feature." },
  { type: "button", label: "Open your dashboard", url: "https://platify.io/dashboard" },
  { type: "divider" },
  { type: "text", content: "Platify Inc. You're receiving this because you created an account. https://platify.io/unsubscribe" },
];

export const VISITORS: { key: VisitorKey; label: string; emoji: string }[] = [
  { key: "preview", label: "Preview", emoji: "👁️" },
  { key: "html", label: "HTML", emoji: "🌐" },
  { key: "plaintext", label: "Plain Text", emoji: "📄" },
  { key: "audit", label: "Audit", emoji: "♿" },
];
