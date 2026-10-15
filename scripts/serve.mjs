// Minimal static server for site/ (local preview only – production uses any static host).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site');
const port = Number(process.env.PORT) || 5180;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(root, urlPath);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!urlPath.endsWith('/')) { res.writeHead(301, { Location: `${urlPath}/` }).end(); return; }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) { res.writeHead(404, { 'Content-Type': types['.html'] }).end('Not found'); return; }
  const type = types[path.extname(file)] || 'application/octet-stream';
  const { size } = fs.statSync(file);
  // Safari refuses to play <video> from servers that ignore Range requests.
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`FaveUp landing → http://localhost:${port}/`));
