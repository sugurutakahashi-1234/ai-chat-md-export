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
VERSION=$(grep '"version"' package.json | cut -d '"' -f 4)

echo -e "${GREEN}Building ai-chat-md-export v${VERSION} for Homebrew...${NC}"

# Create dist directory if it doesn't exist
mkdir -p dist

# Build for each platform
echo -e "${YELLOW}Building for macOS ARM64...${NC}"
bun build src/cli.ts --compile --target=darwin-arm64 --outfile dist/ai-chat-md-export
mv dist/ai-chat-md-export dist/ai-chat-md-export-darwin-arm64

echo -e "${YELLOW}Building for macOS x64...${NC}"
bun build src/cli.ts --compile --target=darwin-x64 --outfile dist/ai-chat-md-export
mv dist/ai-chat-md-export dist/ai-chat-md-export-darwin-x64

echo -e "${YELLOW}Building for Linux x64...${NC}"
bun build src/cli.ts --compile --target=linux-x64 --outfile dist/ai-chat-md-export
mv dist/ai-chat-md-export dist/ai-chat-md-export-linux-x64

# Create release directory
mkdir -p releases

# Create tar.gz archives
echo -e "${YELLOW}Creating archives...${NC}"
cd dist

# For each binary, create a directory with just the binary name and tar it
for platform in darwin-arm64 darwin-x64 linux-x64; do
  mkdir -p temp-release
  cp "ai-chat-md-export-${platform}" temp-release/ai-chat-md-export
  tar -czf "../releases/ai-chat-md-export-${platform}.tar.gz" -C temp-release ai-chat-md-export
  rm -rf temp-release
  echo -e "${GREEN}Created: releases/ai-chat-md-export-${platform}.tar.gz${NC}"
done

cd ..

# Calculate SHA256 hashes
echo -e "${YELLOW}Calculating SHA256 hashes...${NC}"
cd releases

echo "# SHA256 Hashes for v${VERSION}" > SHA256SUMS.txt
echo "" >> SHA256SUMS.txt

for file in *.tar.gz; do
  if [[ -f "$file" ]]; then
    SHA=$(shasum -a 256 "$file" | awk '{print $1}')
    echo "${SHA}  ${file}" >> SHA256SUMS.txt
    echo -e "${GREEN}${file}: ${SHA}${NC}"
  fi
done

cd ..

echo -e "${GREEN}Build complete! Files are in the 'releases' directory.${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create a GitHub release with tag v${VERSION}"
echo "2. Upload the tar.gz files from the releases directory"
echo "3. Update the SHA256 hashes in homebrew/ai-chat-md-export.rb"
echo "4. Copy the formula to your homebrew-tap repository"