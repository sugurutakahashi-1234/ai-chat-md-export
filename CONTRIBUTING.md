# Contributing

[Japanese](CONTRIBUTING.ja.md)

## Development Setup

```bash
# Install dependencies
bun install

# Run all checks
bun run ci
```

## Scripts

| Command             | Description       |
| ------------------- | ----------------- |
| `bun run build`     | Build binary      |
| `bun run typecheck` | Type check        |
| `bun run lint`      | Lint and fix      |
| `bun test`          | Run tests         |
| `bun run ci`        | Run all CI checks |

## Pull Request Process

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run ci`
5. Submit a pull request

## Commit Message Guidelines

Please use [conventional commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `test:` Test updates

Example: `feat: add support for new chat format`