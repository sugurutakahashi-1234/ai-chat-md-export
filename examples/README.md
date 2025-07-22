# Examples

Sample ChatGPT and Claude conversations with their converted outputs in various formats.

## Directory Structure

```
examples/
├── chatgpt/
│   ├── conversations.json
│   └── output/
│       ├── markdown/           # Default: split markdown files
│       ├── markdown-no-split/  # Combined markdown file
│       ├── json/              # Default: split JSON files
│       └── json-no-split/     # Combined JSON file
├── claude/
│   ├── conversations.json
│   └── output/
│       ├── markdown/           # Default: split markdown files
│       ├── markdown-no-split/  # Combined markdown file
│       ├── json/              # Default: split JSON files
│       └── json-no-split/     # Combined JSON file
└── README.md
```

## Commands

Generate the example outputs using these commands:

### ChatGPT Examples

```bash
# Markdown format (default: split into individual files)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/markdown/ -p chatgpt

# Markdown format (combined into single file)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/markdown-no-split/ -p chatgpt --no-split

# JSON format (default: split into individual files)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/json/ -p chatgpt -f json

# JSON format (combined into single file)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/json-no-split/ -p chatgpt -f json --no-split
```

### Claude Examples

```bash
# Markdown format (default: split into individual files)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/markdown/ -p claude

# Markdown format (combined into single file)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/markdown-no-split/ -p claude --no-split

# JSON format (default: split into individual files)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/json/ -p claude -f json

# JSON format (combined into single file)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/json-no-split/ -p claude -f json --no-split
```