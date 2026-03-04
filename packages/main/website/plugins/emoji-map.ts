/**
 * Shared emoji map used by the remark plugin (build-time)
 * and the TOC Tree component (client-side).
 *
 * These images are purely decorative (inline icons replacing Unicode emoji).
 * The `alt` attribute is always an empty string for accessibility.
 * The `id` is used as a CSS class suffix for styling: `custom-emoji--{id}`.
 */
export const EMOJI_MAP: Record<string, { src: string; id: string }> = {
  // Pithos logo — uses the image pipeline (not the emoji pipeline) because it's
  // displayed at larger sizes elsewhere. The 120px variant comes from generate-images.ts.
  "🏺": { src: "/img/emoji/pithos.webp", id: "pithos" },
  "🚪" : { src: "/img/emoji/gate.webp", id: "get-started"}, 
  "🅰": { src: "/img/emoji/letter-a.webp", id: "arkhe" },
  "🅺": { src: "/img/emoji/letter-k.webp", id: "kanon" },
  "🆉": { src: "/img/emoji/letter-z.webp", id: "zygos" },
  "🆃": { src: "/img/emoji/letter-t.webp", id: "taphos" },
  "🆂": { src: "/img/emoji/letter-s.webp", id: "sphalma" },
  "✅": { src: "/img/emoji/checkmark.webp", id: "checkmark" },
  "❌": { src: "/img/emoji/cross.webp", id: "cross" },
  "🔒": { src: "/img/emoji/padlock.webp", id: "padlock"},
  "⚡️": { src: "/img/emoji/flash.webp", id: "flash" },
  "🛡️": { src: "/img/emoji/shield.webp", id: "shield" },
  "📜": { src: "/img/emoji/parchment.webp", id: "parchment" },
  "👁️": { src: "/img/emoji/eye.webp", id: "eye" },
  "🖥️": { src: "/img/emoji/installation.webp", id: "installation" },
  "🛠": { src: "/img/emoji/tools.webp", id: "tools" },
  "🗜️" : { src: "/img/emoji/anvil.webp", id: "anvil"},  
  "⚖️": { src: "/img/emoji/scales.webp", id: "scales" },
  "📋": { src: "/img/emoji/changelog.webp", id: "changelog"},
  "🧱": { src: "/img/emoji/column.webp", id: "basics"},
  "⛩️" : { src: "/img/emoji/ark.webp", id: "modules"},  
  "📦": { src: "/img/emoji/two-jars.webp", id: "bundle"},
  "🟰": { src: "/img/emoji/twins.webp", id: "equivalence"},
  "🚅": { src: "/img/emoji/speed.webp", id: "performance"},
  "⛓️‍💥": { src: "/img/emoji/chain-links.webp", id: "interoperability"},
  "📔": { src: "/img/emoji/book.webp", id: "api"},
  "🔭": { src: "/img/emoji/telescope.webp", id: "explorer"},
  "🎁": { src: "/img/emoji/cornucopia.webp", id: "usecases"},
  "🎯": { src: "/img/emoji/target.webp", id: "target"},
  "⏮️": { src: "/img/emoji/previous.webp", id: "previous"},
  "⏭️": { src: "/img/emoji/next.webp", id: "next"},
  "🔄" : { src: "/img/emoji/convert.webp", id: "convert"},
  "✍️": { src: "/img/emoji/parchment-rolled.webp", id: "contract"},
  "🕯️": { src: "/img/emoji/light.webp", id: "read-more"},
  "📎": { src: "/img/emoji/import.webp", id: "import"},
  "🃏" : { src: "/img/emoji/examples.webp", id: "examples"},
  "🎰" : { src: "/img/emoji/treasure.webp", id: "what-is-the-box"},
  "🏮" : { src: "/img/emoji/lantern.webp", id: "reproduce-our-data"},
  "⚠️" : { src: "/img/emoji/warning.webp", id: "warning"},
  "✨" : { src: "/img/emoji/sparkles.webp", id: "sparkles"},  
  "🤝" : { src: "/img/emoji/handshake.webp", id: "handshake"},  
  "🧭" : { src: "/img/emoji/compass.webp", id: "principles"}, 
  "🏗️" : { src: "/img/emoji/architecture.webp", id: "architecture"}, 
  "📙" : { src: "/img/emoji/contributing-guide.webp", id: "contribution-guide"}, 
  "🥇" : { src: "/img/emoji/medal-gold.webp", id: "first"}, 
  "🥈" : { src: "/img/emoji/medal-silver.webp", id: "second"}, 
  "🥉" : { src: "/img/emoji/medal-bronze.webp", id: "third"}, 
  "⛵️" : { src: "/img/emoji/ship.webp", id: "migration"},
  "🪢" : { src: "/img/emoji/node.webp", id: "node"},
};
