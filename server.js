// Zero-dependency static file server for production (Render Web Service).
// Mirrors .htaccess / devserver.py behavior:
//   - "/foo.html"  -> 301 redirect to "/foo"  (clean URLs)
//   - "/foo"       -> serves "foo.html" when it exists
//   - HTML is sent no-cache; versioned css/js and images cache long.
// Binds to process.env.PORT (Render sets this) on 0.0.0.0.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function cacheHeader(ext) {
  if (ext === '.html') return 'no-cache, no-store, must-revalidate';
  if (ext === '.css' || ext === '.js') return 'max-age=31536000, public';
  if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp'].includes(ext)) return 'max-age=604800, public';
  if (ext === '.pdf') return 'max-age=604800, public';
  return 'no-cache';
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body);
  else res.end();
}

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(req.url.split('?')[0]);

  // Redirect direct .html requests to the clean URL (except the root index).
  if (pathname.endsWith('.html') && pathname !== '/index.html') {
    send(res, 301, { Location: pathname.slice(0, -5) });
    return;
  }

  // Resolve to a file inside ROOT (guard against path traversal).
  let rel = pathname.replace(/^\/+/, '');
  if (rel === '') rel = 'index.html';

  let filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) {
    send(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');
    return;
  }

  // Extensionless request -> serve matching .html when present.
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
        '<!doctype html><meta charset="utf-8"><title>404</title><h1>404 — Not found</h1>');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': cacheHeader(ext),
    }, data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Serving ${ROOT} at http://${HOST}:${PORT}`);
});
