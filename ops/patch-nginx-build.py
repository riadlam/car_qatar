#!/usr/bin/env python3
from pathlib import Path

path = Path("/etc/nginx/sites-enabled/almajdluxurytransport")
text = path.read_text()

if "location ^~ /build/" in text:
    print("already_patched")
    raise SystemExit(0)

old = """    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }"""

new = """    # Vite build assets: never fall through to Laravel HTML (breaks module MIME)
    location ^~ /build/ {
        try_files $uri =404;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }"""

if old not in text:
    raise SystemExit("location / block not found for patch")

path.write_text(text.replace(old, new, 1))
print("patched")
