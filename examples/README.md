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
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/markdown/

# Markdown format (combined into single file)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/markdown-no-split/ --no-split

# JSON format (default: split into individual files)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/json/ -f json

# JSON format (combined into single file)
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/json-no-split/ -f json --no-split
```

### Claude Examples

```bash
# Markdown format (default: split into individual files)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/markdown/

# Markdown format (combined into single file)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/markdown-no-split/ --no-split

# JSON format (default: split into individual files)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/json/ -f json

# JSON format (combined into single file)
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/json-no-split/ -f json --no-split
```