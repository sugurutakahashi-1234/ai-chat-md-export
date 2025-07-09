# Contributing

[日本語版](CONTRIBUTING.ja.md)

## Development Setup

```bash
# Install dependencies
bun install

# Run all checks
bun run ci
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build binary |
| `bun run typecheck` | Type check |
| `bun run lint` | Lint and fix |
| `bun test` | Run tests |
| `bun run ci` | Run all CI checks |

## Pull Request Process

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run ci`
5. Submit a pull request

## Release Process

Releases are managed by maintainers:

```bash
bun run release
```

This will:
- Prompt for version (patch/minor/major)
- Run CI checks
- Build and tag
- Create GitHub release
- Publish to npm