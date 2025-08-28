#!/bin/sh
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

if [ ! -d "build" ]; then
  echo "Building frontend..."
  npm run build
fi

exec "$@"
