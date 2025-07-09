# ai-chat-md-export

A Bun-powered CLI tool to convert ChatGPT and Claude chat history to Markdown

## Features

- Load and convert ChatGPT and Claude export data
- Convert to Markdown format with proper formatting
- Detailed schema validation and error reporting
- Detection of unknown fields (format change detection)
- Strict type safety with Zod
- Automatic format detection (ChatGPT, Claude JSON)
- Date filtering with `--since` and `--until` options
- Keyword search with `--search` option
- Quiet mode with `--quiet` for silent operation
- Dry-run mode with `--dry-run` to preview operations
- Can be distributed as a single binary (using Bun's compile feature)

## Requirements

- **Node.js**: v18+ (for npm/pnpm/yarn users)
- **Bun**: v1.0+ (optional, for faster execution)

## Installation

### Homebrew (macOS/Linux)

```bash
# Tap the repository
brew tap sugurutakahashi/tap

# Install the tool
brew install ai-chat-md-export
```

> **Note**: Homebrew formula is ready in the `homebrew/` directory. To enable Homebrew installation:
> 1. Create a GitHub release with platform-specific binaries
> 2. Update SHA256 hashes in `homebrew/ai-chat-md-export.rb`
> 3. Set up the tap repository at `sugurutakahashi/homebrew-tap`
> 
> For now, you can use npm/bun installation or download binaries from [GitHub Releases](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases).

### As a Development Dependency (Recommended)

```bash
# npm
npm install --save-dev ai-chat-md-export

# Bun (for faster execution)
bun add -d ai-chat-md-export

# pnpm
pnpm add -D ai-chat-md-export

# yarn
yarn add -D ai-chat-md-export
```

### Global Installation

```bash
# npm
npm install -g ai-chat-md-export

# Bun
bun add -g ai-chat-md-export
```

### Direct Execution (No Installation)

```bash
# Run directly with npx
npx ai-chat-md-export -i conversations.json

# Run with bunx (faster)
bunx ai-chat-md-export -i conversations.json

# Run with pnpx
pnpx ai-chat-md-export -i conversations.json

# Run with yarn dlx
yarn dlx ai-chat-md-export -i conversations.json -o output/

# Global installation
npm install -g ai-chat-md-export
ai-chat-md-export -i conversations.json -o output/
```

## Data Preparation

### Exporting from ChatGPT
1. Go to ChatGPT settings → "Data controls" → "Export data"
2. Extract the downloaded ZIP file
3. Place `conversations.json` in the `input/` directory (rename to `chatgpt-conversations.json` if you have multiple exports)

### Exporting from Claude
1. Go to Claude settings → "Account" → "Export your data"
2. Place the exported JSON file in the `input/` directory (rename to `claude-conversations.json` if you have multiple exports)

```
input/
├── chatgpt-conversations.json  # ChatGPT export
└── claude-conversations.json   # Claude export
```

> **Note**: The `input/` and `output/` directories are gitignored to protect your personal data. These directories are created automatically with the project.

## Usage

### Performance Note

When using Bun (`bunx`, `bun run`, etc.), the tool runs significantly faster (approximately 20x) compared to Node.js. This is because Bun can directly execute TypeScript without transpilation.

### Quick Start

```bash
# Show example commands for your own data
bun run example:all

# Try with sample data
bun run demo:all
```

### Converting Your Own Data

1. Place your exported JSON files in the `input/` directory:
   - ChatGPT: `input/chatgpt-conversations.json`
   - Claude: `input/claude-conversations.json`

2. Run the conversion:
   ```bash
   # Convert ChatGPT data
   bun run src/cli.ts -i input/chatgpt-conversations.json -o output/ -f chatgpt
   
   # Convert Claude data
   bun run src/cli.ts -i input/claude-conversations.json -o output/ -f claude
   
   # Or convert all JSON files in the input directory
   bun run src/cli.ts -i input/ -o output/
   ```


### CLI Options

```bash
# Basic usage
bun run src/cli.ts -i <input> -o <output>

# Or use the built binary
./dist/ai-chat-md-export -i <input> -o <output>

# Or use the bin entry point
bun bin/ai-chat-md-export.js -i <input> -o <output>
```

#### Available Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--input` | `-i` | Input file or directory path (required) | - |
| `--output` | `-o` | Output directory | Current directory |
| `--format` | `-f` | Input format (`chatgpt`, `claude`, `auto`) | `auto` |
| `--since` | - | Include conversations from this date (YYYY-MM-DD) | - |
| `--until` | - | Include conversations until this date (YYYY-MM-DD) | - |
| `--search` | - | Filter conversations containing keyword | - |
| `--quiet` | `-q` | Suppress progress messages | `false` |
| `--dry-run` | - | Preview what would be done without writing files | `false` |
| `--help` | `-h` | Show help | - |
| `--version` | `-V` | Show version | - |

### Usage Examples

```bash
# Convert a single ChatGPT export file
ai-chat-md-export -i conversations.json

# Convert all JSON files in a directory
ai-chat-md-export -i exports/ -o output/

# Specify format explicitly
ai-chat-md-export -i claude_export.json -f claude

# Filter by date range
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# Filter conversations from a specific date
ai-chat-md-export -i data.json --since 2024-06-01

# Search for conversations containing a keyword
ai-chat-md-export -i data.json --search "machine learning"

# Preview what would be done without writing files
ai-chat-md-export -i data.json --dry-run

# Run silently (only show errors)
ai-chat-md-export -i data.json -o output/ --quiet

# Combine multiple options
ai-chat-md-export -i data.json --since 2024-01-01 --search "API" --quiet
```

### Note on Filtering

- **Date Filtering**: Dates refer to when conversations were STARTED, not last updated
  - ChatGPT: Uses `create_time` field
  - Claude: Uses `created_at` field
  - Both `--since` and `--until` dates are inclusive
- **Search**: 
  - Case-insensitive search
  - Searches in both conversation titles and message contents
  - Partial matches are supported

## Output

Converted Markdown files are saved in the `output/` directory:

```
output/
├── YYYY-MM-DD_ChatGPT_Title.md
└── YYYY-MM-DD_Claude_Title.md
```

## Project Structure

```
ai-chat-md-export/
├── bin/              # Entry point for CLI
│   └── ai-chat-md-export.js
├── src/              # Source code
│   ├── index.ts      # Package exports
│   ├── cli.ts        # CLI logic
│   ├── loaders/      # Service-specific loaders
│   ├── schemas/      # Zod schema definitions
│   ├── utils/        # Utilities
│   └── markdown.ts   # Markdown conversion
├── dist/             # Built binaries
│   └── ai-chat-md-export
├── tests/            # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── binary/       # Binary executable tests
├── input/            # Place your exported JSON files here (gitignored)
├── output/           # Converted Markdown files go here (gitignored)
└── tests/fixtures/   # Sample data for testing and demos
```

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build single binary |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run lint` | Lint and fix code |
| `bun run lint:check` | Check linting without fixing |
| `bun run format` | Format code |
| `bun test` | Run all tests (except binary) |
| `bun run test:coverage` | Run tests with coverage |
| `bun run test:coverage:html` | Generate HTML coverage report |
| `bun run test:binary` | Run binary executable tests |
| `bun run ci` | Run all CI checks |
| `bun run knip` | Check for unused code |

### Building

```bash
# Type check and build
bun run build:all

# Build only (compiles to dist/ai-chat-md-export)
bun run build
```

### Testing

```bash
# Run all tests
bun test

# Run tests with coverage
bun run test:coverage

# Generate HTML coverage report
bun run test:coverage:html
# Open coverage/html/index.html in browser

# Run specific test files
bun test tests/unit/cli.test.ts
```

### CI/CD

The project uses a comprehensive CI workflow:

```bash
# Run all CI checks (type check, lint, test, build, binary)
bun run ci
```

## Configuration

### TypeScript

The project uses strict TypeScript configuration (`tsconfig.base.json`):
- `strict: true` - Enables all strict type checking options
- Includes `noImplicitAny`, `strictNullChecks`, etc.
- Ensures maximum type safety

### Linting and Formatting

Uses Biome for fast, opinionated code formatting and linting:
- Configuration in `biome.json`
- Automatic fixes with `bun run lint`

## Troubleshooting

### Export Format Changes

Use `conv:*:watch` commands to detect unknown fields or schema errors:

```bash
bun run conv:chatgpt:watch
# Check chatgpt-warnings.log
```

Log includes:
- Unknown field names
- Type mismatches
- Missing required fields

### Claude Data Formats

Claude supports the following formats:
- JSON array format (new): Role determined by `sender` field
- JSON array format (old): Role determined by `role` field

Format is auto-detected. Latest Claude exports use the `sender` field ("human"/"assistant") for message roles.

### Memory Issues with Large Files

For very large export files, the tool loads the entire file into memory. If you encounter memory issues:
1. Split large export files into smaller chunks
2. Process files individually instead of directories
3. Increase Node.js/Bun memory limit if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`bun test`)
- Code is properly formatted (`bun run lint`)
- Type checking passes (`bun run typecheck`)
- CI checks pass (`bun run ci`)

## License

This project is licensed under the MIT License - see the LICENSE file for details.