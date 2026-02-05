import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const EMOJI_DIR = 'ressources/emoji';
const OUTPUT_DIR = 'reports';
const OUTPUT_FILE = join(OUTPUT_DIR, 'emoji-preview.html');
const PORT = 3456;

// Scan emoji directory
const files = readdirSync(EMOJI_DIR)
  .filter(f => f.endsWith('.png'))
  .sort();

console.log(`📸 Found ${files.length} emoji images`);

// Generate HTML
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Emoji Preview</title>
<style>
  body { background: #1a1a1a; color: #ccc; font-family: sans-serif; margin: 2rem; }
  h1 { color: #f26f17; }
  .controls { margin-bottom: 1rem; }
  .controls label { margin-right: 0.5rem; }
  .controls select { padding: 0.25rem 0.5rem; background: #2a2a2a; color: #ccc; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, 160px); gap: 1rem; }
  .cell {
    width: 160px; height: 160px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
    background: rgba(255,255,255,0.03);
  }
  .cell img { object-fit: contain; }
  .cell span { margin-top: 0.5rem; font-size: 0.7rem; opacity: 0.7; word-break: break-all; text-align: center; padding: 0 0.5rem; }
</style>
</head>
<body>
<h1>Emoji Preview</h1>
<div class="controls">
  <label for="sizeSelect">Image size:</label>
  <select id="sizeSelect">
    <option value="16">16×16</option>
    <option value="24">24×24</option>
    <option value="32">32×32</option>
    <option value="64">64×64</option>
    <option value="128" selected>128×128</option>
    <option value="256">256×256</option>
  </select>
</div>
<div class="grid" id="grid"></div>
<script>
const files = ${JSON.stringify(files, null, 2)};
const grid = document.getElementById("grid");
const sizeSelect = document.getElementById("sizeSelect");

function render() {
  const size = parseInt(sizeSelect.value);
  const cellSize = size === 256 ? 288 : 160;
  
  grid.style.gridTemplateColumns = \`repeat(auto-fill, \${cellSize}px)\`;
  grid.innerHTML = '';
  
  files.forEach(f => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.width = \`\${cellSize}px\`;
    cell.style.height = \`\${cellSize}px\`;
    cell.innerHTML = \`<img src="/emoji/\${f}" alt="\${f}" style="width: \${size}px; height: \${size}px;"><span>\${f}</span>\`;
    grid.appendChild(cell);
  });
}

sizeSelect.addEventListener('change', render);
render();
</script>
</body>
</html>
`;

// Ensure reports directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

// Write HTML file
writeFileSync(OUTPUT_FILE, html, 'utf-8');

console.log(`✅ Generated ${OUTPUT_FILE}`);

// Start HTTP server
const server = createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url === '/emoji-preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else if (req.url?.startsWith('/emoji/')) {
      const filename = req.url.slice(7); // Remove '/emoji/'
      const filepath = join(EMOJI_DIR, filename);
      const content = await readFile(filepath);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (err) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop`);
  
  // Open browser
  import('child_process').then(({ exec }) => {
    exec(`open http://localhost:${PORT}`);
  });
});

