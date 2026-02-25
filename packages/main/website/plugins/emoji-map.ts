/**
 * Shared emoji map used by the remark plugin (build-time)
 * and the TOC Tree component (client-side).
 */
export const EMOJI_MAP: Record<string, { src: string; alt: string; id?: string }> = {
  // Pithos logo — uses the image pipeline (not the emoji pipeline) because it's
  // displayed at larger sizes elsewhere. The 120px variant comes from generate-images.ts.
  "🏺": { src: "/img/emoji/pithos.webp", alt: "pithos" },
  "🚪" : { src: "/img/emoji/gate.webp", alt: "get started"}, 
  "🅰": { src: "/img/emoji/letter-a.webp", alt: "arkhe" },
  "🅺": { src: "/img/emoji/letter-k.webp", alt: "kanon" },
  "🆉": { src: "/img/emoji/letter-z.webp", alt: "zygos" },
  "🆃": { src: "/img/emoji/letter-t.webp", alt: "taphos" },
  "🆂": { src: "/img/emoji/letter-s.webp", alt: "Sphalma" },
  "✅": { src: "/img/emoji/checkmark.webp", alt: "checkmark" },
  "❌": { src: "/img/emoji/cross.webp", alt: "cross" },
  "🔒": { src: "/img/emoji/padlock.webp", alt: "padlock"},
  "⚡️": { src: "/img/emoji/flash.webp", alt: "flash" },
  "🛡️": { src: "/img/emoji/shield.webp", alt: "shield" },
  "📜": { src: "/img/emoji/parchment.webp", alt: "parchment" },
  "👁️": { src: "/img/emoji/eye.webp", alt: "eye" },
  "🖥️": { src: "/img/emoji/installation.webp", alt: "installation" },
  "🛠": { src: "/img/emoji/tools.webp", alt: "tools" },
  "🗜️" : { src: "/img/emoji/anvil.webp", alt: "anvil"},  
  "⚖️": { src: "/img/emoji/scales.webp", alt: "scales" },
  "📋": { src: "/img/emoji/changelog.webp", alt: "changelog"},
  "🧱": { src: "/img/emoji/column.webp", alt: "basics"},
  "⛩️" : { src: "/img/emoji/ark.webp", alt: "modules"},  
  "📦": { src: "/img/emoji/two-jars.webp", alt: "bundle size", id:"bundle"},
  "🟰": { src: "/img/emoji/twins.webp", alt: "equivalence"},
  "🚅": { src: "/img/emoji/speed.webp", alt: "performance benchmarks", id:"performance"},
  "⛓️‍💥": { src: "/img/emoji/chain-links.webp", alt: "interoperability"},
  "📔": { src: "/img/emoji/book.webp", alt: "API reference", id:"api"},
  "🔭": { src: "/img/emoji/telescope.webp", alt: "explorer"},
  "🎁": { src: "/img/emoji/cornucopia.webp", alt: "Use Cases explorer", id:"usecases"},
  "🎯": { src: "/img/emoji/target.webp", alt: "target"},
  "⏮️": { src: "/img/emoji/previous.webp", alt: "previous"},
  "⏭️": { src: "/img/emoji/next.webp", alt: "next"},
  "🔄" : { src: "/img/emoji/convert.webp", alt: "convert"},
  "✍️": { src: "/img/emoji/parchment-rolled.webp", alt: "contract"},
  "🕯️": { src: "/img/emoji/light.webp", alt: "read more", id: "read-more"},
  "📎": { src: "/img/emoji/import.webp", alt: "import"},
  "🃏" : { src: "/img/emoji/examples.webp", alt: "examples"},
  "🎰" : { src: "/img/emoji/treasure.webp", alt: "what is the box"},
  "🏮" : { src: "/img/emoji/lantern.webp", alt: "reproduce our data"},
  "⚠️" : { src: "/img/emoji/warning.webp", alt: "warning"},
  "✨" : { src: "/img/emoji/sparkles.webp", alt: "sparkles"},  
  "🤝" : { src: "/img/emoji/handshake.webp", alt: "handshake"},  
  "🧭" : { src: "/img/emoji/compass.webp", alt: "design principles", id:"priciples"}, 
  "🏗️" : { src: "/img/emoji/architecture.webp", alt: "architecture"}, 
  "📙" : { src: "/img/emoji/contributing-guide.webp", alt: "contribution guide", id:"contribution-guide"}, 
  "🥇" : { src: "/img/emoji/medal-gold.webp", alt: "first"}, 
  "🥈" : { src: "/img/emoji/medal-silver.webp", alt: "second"}, 
  "🥉" : { src: "/img/emoji/medal-bronze.webp", alt: "third"}, 




  
};
