#!/bin/bash

# Check if http-server is installed
if ! command -v http-server &> /dev/null; then
    echo "Installing http-server..."
    npm install -g http-server
fi

# Start the server
echo "Starting OmniPass on http://localhost:8080"
http-server -c-1 -p 8080
