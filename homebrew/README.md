# Homebrew Formula for ai-chat-md-export

This directory contains the Homebrew formula for ai-chat-md-export.

## Usage

Once the tap repository is set up, this formula will be used to install the tool via Homebrew.

## Structure

- `ai-chat-md-export.rb` - The formula file that defines how to install the binary

## Setup Instructions

To use this formula:

1. Create a new repository named `homebrew-tap` (or similar)
2. Copy the formula file to the `Formula` directory in that repository
3. Update the SHA256 hashes in the formula after creating releases
4. Users can then install with:
   ```bash
   brew tap sugurutakahashi/tap
   brew install ai-chat-md-export
   ```

## Updating the Formula

When releasing a new version:

1. Build binaries for all platforms:
   ```bash
   # macOS ARM64
   bun build src/cli.ts --compile --target=darwin-arm64 --outfile dist/ai-chat-md-export-darwin-arm64
   
   # macOS x64
   bun build src/cli.ts --compile --target=darwin-x64 --outfile dist/ai-chat-md-export-darwin-x64
   
   # Linux x64
   bun build src/cli.ts --compile --target=linux-x64 --outfile dist/ai-chat-md-export-linux-x64
   ```

2. Create tar.gz archives:
   ```bash
   tar -czf ai-chat-md-export-darwin-arm64.tar.gz ai-chat-md-export-darwin-arm64
   tar -czf ai-chat-md-export-darwin-x64.tar.gz ai-chat-md-export-darwin-x64
   tar -czf ai-chat-md-export-linux-x64.tar.gz ai-chat-md-export-linux-x64
   ```

3. Calculate SHA256 hashes:
   ```bash
   shasum -a 256 ai-chat-md-export-*.tar.gz
   ```

4. Update the formula with:
   - New version number
   - New SHA256 hashes

5. Push to GitHub Releases and update the tap repository