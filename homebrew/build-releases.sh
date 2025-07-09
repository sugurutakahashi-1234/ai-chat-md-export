#!/usr/bin/env bash

# Build script for creating Homebrew releases
# This script builds binaries for all supported platforms and creates tar.gz archives

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get version from package.json
VERSION=$(jq -r '.version' package.json)

echo -e "${GREEN}Building ai-chat-md-export v${VERSION} for Homebrew...${NC}"

# Create dist directory if it doesn't exist
mkdir -p dist

# Build for each platform
echo -e "${YELLOW}Building for macOS ARM64...${NC}"
bun build src/cli.ts --compile --target=bun-darwin-arm64 --outfile dist/ai-chat-md-export-darwin-arm64

echo -e "${YELLOW}Building for macOS x64...${NC}"
bun build src/cli.ts --compile --target=bun-darwin-x64 --outfile dist/ai-chat-md-export-darwin-x64

echo -e "${YELLOW}Building for Linux x64...${NC}"
bun build src/cli.ts --compile --target=bun-linux-x64 --outfile dist/ai-chat-md-export-linux-x64

# Create release directory
mkdir -p releases

# Create tar.gz archives
echo -e "${YELLOW}Creating archives...${NC}"

# For each binary, create tar.gz with renamed binary
for platform in darwin-arm64 darwin-x64 linux-x64; do
  # Create temp directory in dist
  mkdir -p dist/temp-release
  cp "dist/ai-chat-md-export-${platform}" dist/temp-release/ai-chat-md-export
  tar -czf "releases/ai-chat-md-export-${platform}.tar.gz" -C dist/temp-release ai-chat-md-export
  rm -rf dist/temp-release
  echo -e "${GREEN}Created: releases/ai-chat-md-export-${platform}.tar.gz${NC}"
done

# Calculate SHA256 hashes
echo -e "${YELLOW}Calculating SHA256 hashes...${NC}"

echo "# SHA256 Hashes for v${VERSION}" > releases/SHA256SUMS.txt
echo "" >> releases/SHA256SUMS.txt

for file in releases/*.tar.gz; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    SHA=$(shasum -a 256 "$file" | awk '{print $1}')
    echo "${SHA}  ${filename}" >> releases/SHA256SUMS.txt
    echo -e "${GREEN}${filename}: ${SHA}${NC}"
  fi
done

echo -e "${GREEN}Build complete! Files are in the 'releases' directory.${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create a GitHub release with tag v${VERSION}"
echo "2. Upload the tar.gz files from the releases directory"
echo "3. Update the SHA256 hashes in homebrew/ai-chat-md-export.rb"
echo "4. Copy the formula to your homebrew-tap repository"