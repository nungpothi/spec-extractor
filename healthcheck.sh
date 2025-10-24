#!/bin/bash
# Health check script for Self-Service Kiosk container

set -e

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "ERROR: Nginx is not running"
    exit 1
fi

# Check if the application is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$HTTP_CODE" != "200" ]; then
    echo "ERROR: Application not responding (HTTP $HTTP_CODE)"
    exit 1
fi

# Check if static files are accessible
STATIC_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/static/ || echo "404")
if [ "$STATIC_CODE" = "000" ]; then
    echo "ERROR: Cannot reach static files"
    exit 1
fi

echo "OK: Self-Service Kiosk is healthy"
exit 0