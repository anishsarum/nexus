#!/bin/bash
# Build frontend and backend for local development

set -e


(cd frontend && npm run build)
(cd backend && npm run build)

echo "Frontend and backend build complete. You can now run Docker Compose."
