#!/usr/bin/env bash
# Render build script for full-stack deployment

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install

# Build the React frontend
echo "Building React frontend..."
npm run build

# Go back to root
cd ..

echo "Build completed successfully!"
