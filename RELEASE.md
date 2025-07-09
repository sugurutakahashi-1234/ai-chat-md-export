# Release Process

This document describes the release process for ai-chat-md-export.

## Prerequisites

1. Ensure you have npm access rights to publish the package
2. Make sure you're on the `main` branch with a clean working directory
3. Ensure all tests pass: `bun run ci`

## Release Steps

### 1. Prepare for Release

```bash
# Make sure you're on main branch
git checkout main
git pull origin main

# Run CI to ensure everything is working
bun run ci
```

### 2. Create a Release

The release process is automated using release-it:

```bash
# Dry run to preview what will happen
bun run release --dry-run

# Create a release (interactive)
bun run release
```

During the release process, release-it will:
1. Prompt you to select the version bump (patch/minor/major)
2. Run the CI checks (`bun run ci`)
3. Update the version in package.json
4. Build the project (`bun run build`)
5. Build platform-specific binaries (`bun run homebrew:build`)
6. Create a git commit and tag
7. Push the commit and tag to GitHub
8. Create a GitHub release with the binaries attached
9. Publish the package to npm

### 3. Version Selection

Follow semantic versioning:
- **Patch** (0.0.x): Bug fixes and minor updates
- **Minor** (0.x.0): New features that are backwards compatible
- **Major** (x.0.0): Breaking changes

### 4. Post-Release

After a successful release:
1. Verify the package on npm: https://www.npmjs.com/package/ai-chat-md-export
2. Check the GitHub release page for the binaries
3. Update the Homebrew formula if needed (see homebrew/README.md)

## Manual Release (if needed)

If you need to release manually:

```bash
# 1. Update version
npm version patch # or minor/major

# 2. Build
bun run build
bun run homebrew:build

# 3. Create git tag
git tag v$(node -p "require('./package.json').version")

# 4. Push changes
git push origin main --tags

# 5. Create GitHub release
# Upload files from releases/ directory

# 6. Publish to npm
npm publish
```

## Troubleshooting

### npm Authentication Issues

If you encounter authentication issues:
```bash
npm login
```

### GitHub Token Issues

Ensure you have a GitHub token with appropriate permissions set in your environment:
```bash
export GITHUB_TOKEN=your_token_here
```

### Build Failures

If the build fails during release:
1. Fix the issue
2. Run `bun run ci` to verify
3. Start the release process again

## First-time npm Publication

For the first npm publication:
1. Ensure the package name is available on npm
2. Run `npm publish --access public` (since the package has a scoped name if applicable)
3. Subsequent releases can use `bun run release`