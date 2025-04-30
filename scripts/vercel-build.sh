#!/bin/bash

# Clone submodules with auth
echo "Setting up submodules..."
git submodule init
git submodule update --remote --recursive

# Git LFS pull
echo "Fetching LFS files..."
git lfs install
cd public/sf-girls-assets
git lfs pull
cd ../../

# Proceed with the React build
echo "Building React app..."
npm install
npm run build
