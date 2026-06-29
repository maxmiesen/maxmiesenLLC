#!/usr/bin/env python3
"""Local preview server that mirrors the production .htaccess rewrite:
extensionless URLs (e.g. /creative) are served from the matching .html file,
and /foo.html redirects to /foo — so local previews match the live host.
Run: python3 devserver.py   (serves http://127.0.0.1:8000)
"""
import http.server
import os
import socketserver

PORT = 8000
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


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}")
    httpd.serve_forever()
