#!/usr/bin/env python3
"""Production web server for maxmiesen LLC.

Serves the repo root as a dynamic Python web app, mirroring the .htaccess
behavior used on Apache hosts:
  - extensionless clean URLs (e.g. /creative) are served from the matching
    .html file,
  - /foo.html 301-redirects to /foo so the address bar shows the clean URL,
  - HTML is sent no-cache; css/js cache for a year; images cache for a week.

Binds 0.0.0.0 on $PORT (Render sets PORT); defaults to 8000 for local use.
Run locally: python3 server.py
"""
import http.server
import os
import socketserver

PORT = int(os.environ.get("PORT", "8000"))
HOST = os.environ.get("HOST", "0.0.0.0")
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        # /foo.html -> 301 /foo  (match production clean-URL redirect)
        if path.endswith(".html") and path != "/index.html":
            self.send_response(301)
            self.send_header("Location", path[:-5])
            self.end_headers()
            return
        # /foo -> serve foo.html if it exists
        rel = path.lstrip("/")
        if rel and not os.path.splitext(rel)[1]:
            candidate = os.path.join(ROOT, rel + ".html")
            if os.path.isfile(candidate):
                self.path = "/" + rel + ".html"
        return super().do_GET()

    def end_headers(self):
        self._set_cache_headers()
        super().end_headers()

    def _set_cache_headers(self):
        path = self.path.split("?", 1)[0].lower()
        ext = os.path.splitext(path)[1]
        if ext == ".html" or path.rstrip("/") == "" or not ext:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        elif ext in (".css", ".js"):
            self.send_header("Cache-Control", "max-age=31536000, public")
        elif ext in (".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg"):
            self.send_header("Cache-Control", "max-age=604800, public")


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://{HOST}:{PORT}")
    httpd.serve_forever()
