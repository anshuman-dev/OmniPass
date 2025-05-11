#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for Python to create a simple HTTP server
if command_exists python3; then
  echo "Starting server with Python3..."
  python3 -m http.server 8080
elif command_exists python; then
  echo "Starting server with Python..."
  python -m SimpleHTTPServer 8080
elif command_exists npx; then
  echo "Starting server with npx..."
  npx http-server -p 8080
else
  echo "Error: No suitable server found. Please install Python or Node.js."
  exit 1
fi
