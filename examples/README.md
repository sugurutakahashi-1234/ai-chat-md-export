# Examples

Sample ChatGPT and Claude conversations with their converted Markdown outputs.

## Directory Structure

```
examples/
├── chatgpt/
│   ├── conversations.json
│   └── output/
├── claude/
│   ├── conversations.json
│   └── output/
└── README.md
```

## Commands

Generate the example outputs using these commands:

```bash
# ChatGPT examples
ai-chat-md-export -i examples/chatgpt/conversations.json -o examples/chatgpt/output/

# Claude examples
ai-chat-md-export -i examples/claude/conversations.json -o examples/claude/output/

# All examples at once
ai-chat-md-export -i examples/ -o examples/
```