// Storyloom server — serves the app and persists the vault to disk (vault.json).
// Zero dependencies. Run:  node storyloom/server.js
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const VAULT = path.join(ROOT, 'vault.json');
const BACKUP = path.join(ROOT, 'vault.backup.json');
const PORT = process.env.PORT || 4173;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8' };

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');

  if (u.pathname === '/api/vault') {
    // Lets the page tell "our server, no vault yet" apart from "static host, no API here"
    // (on GitHub Pages this path just returns that host's own 404).
    res.setHeader('X-Storyloom', '1');
    if (req.method === 'GET') {
      fs.readFile(VAULT, (err, data) => {
        if (err) { res.writeHead(404); res.end('no vault yet'); }
        else { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(data); }
      });
      return;
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      let body = '';
      req.on('data', c => { body += c; if (body.length > 50e6) req.destroy(); });
      req.on('end', () => {
        try {
          const v = JSON.parse(body);
          if (!Array.isArray(v.notes) || !Array.isArray(v.sequences)) throw new Error('not a vault');
        } catch (e) { res.writeHead(400); res.end('invalid vault json'); return; }
        // keep the previous version as a one-step backup before overwriting
        try { if (fs.existsSync(VAULT)) fs.copyFileSync(VAULT, BACKUP); } catch (e) {}
        const tmp = VAULT + '.tmp';
        fs.writeFile(tmp, body, err => {
          if (err) { res.writeHead(500); res.end(err.message); return; }
          fs.rename(tmp, VAULT, err2 => {
            if (err2) { res.writeHead(500); res.end(err2.message); }
            else { res.writeHead(200); res.end('ok'); }
          });
        });
      });
      return;
    }
    res.writeHead(405); res.end();
    return;
  }

  // the page supplies its own inline SVG icon; answer the browser's probe quietly
  if (u.pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }

  // static files
  let p = u.pathname === '/' ? '/index.html' : decodeURIComponent(u.pathname);
  const file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[\\/])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); }
    else {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    }
  });
}).listen(PORT, () => console.log(`Storyloom ✦ http://localhost:${PORT}  (vault: ${VAULT})`));
