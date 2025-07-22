# Contributing

Thank you for your interest in contributing to ai-chat-md-export! We're excited to have you here. Every contribution, no matter how small, helps make this tool better for everyone.

## Ways to Contribute

We welcome all kinds of contributions:

- **Code improvements**: New features, bug fixes, performance optimizations
- **Documentation**: Typo fixes, clarifications, translations, examples
- **Bug reports**: Help us identify and fix issues
- **Feature suggestions**: Share your ideas for making the tool more useful
- **Testing**: Help us ensure the tool works across different environments

## Development Setup

This project is developed using [Bun](https://bun.sh/) as the primary runtime and package manager. While npm, yarn, or pnpm will also work, we recommend using Bun for the best development experience.

### Prerequisites

- Node.js >= 24
- Bun (latest version)

### Setup

```bash
# Clone the repository
git clone https://github.com/sugurutakahashi-1234/ai-chat-md-export.git
cd ai-chat-md-export

# Install dependencies
bun install

# For macOS users with Homebrew: Install additional tools
# (Required for building binaries and managing releases)
brew bundle
```

### Testing

```bash
# Run all tests
bun test
```

### Code Quality

```bash
# Run CI pipeline (format, lint, typecheck, build, test)
bun run ci
```

### Understanding the Codebase

To better understand the project structure and dependencies:

- **[Dependency Graphs](./docs/reports/dependencies/README.md)** - Visual representations of code dependencies
- **[Code Quality Reports](./docs/reports/code-quality/README.md)** - Automated code analysis results

## Pull Request Process

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run ci`
5. Submit a pull request

### What Happens Next?

- We'll review your PR as soon as possible (usually within a few days)
- We may suggest changes or improvements
- Once approved, we'll merge your contribution

## Commit Message Guidelines

Please use [conventional commits](https://www.conventionalcommits.org/).

## Getting Help

If you have questions or need help:

- Open an issue on GitHub for discussion
- Check existing issues - someone might have asked the same question
- Be patient and respectful - we're all volunteers here

You can also reach out to the maintainer on X/Twitter: [@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## Community Guidelines

We're committed to providing a welcoming and inclusive environment. Please:

- Be respectful and constructive in all interactions
- Focus on what is best for the community
- Show empathy towards other community members

Thank you for contributing to ai-chat-md-export! 🎉