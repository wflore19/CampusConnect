#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Pull the latest changes from GitHub
git pull origin main

# Install any new dependencies
npm install

# Rebuild the project
npm run build

# Restart the application server using PM2
pm2 restart CampusConnect

echo "Deployment completed successfully!"
