# ai-chat-md-export

[![npm version](https://img.shields.io/npm/v/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![Homebrew](https://img.shields.io/badge/Homebrew-tap-orange.svg)](https://github.com/sugurutakahashi-1234/homebrew-tap)
[![CI](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/ci-push-main.yml)
[![npm Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-npm-release.yml)
[![Homebrew Release](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml/badge.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/actions/workflows/cd-homebrew-release.yml)
[![codecov](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export/graph/badge.svg?token=KPN7UZ7ATY)](https://codecov.io/gh/sugurutakahashi-1234/ai-chat-md-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/ai-chat-md-export.svg)](https://www.npmjs.com/package/ai-chat-md-export)
[![npm bundle size](https://img.shields.io/bundlephobia/min/ai-chat-md-export)](https://bundlephobia.com/package/ai-chat-md-export)
[![Types](https://img.shields.io/npm/types/ai-chat-md-export)](https://www.npmjs.com/package/ai-chat-md-export)

将 ChatGPT 和 Claude 聊天记录转换为可读的 Markdown 文件

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

## Quick Start

```bash
# 1. 安装工具
npm install -g ai-chat-md-export

# 2. 从 ChatGPT 或 Claude 导出您的对话
# → 获取 conversations.json 文件（参见下面的"Getting conversations.json"部分）

# 3. 转换为 Markdown
ai-chat-md-export -i conversations.json
```

就这么简单！您的对话现在已经变成了组织良好、可搜索的 Markdown 文件。

### Example Output

运行上述命令将生成如下文件：

```
2025-01-15_Math_Question.md
2025-01-16_Recipe_Help.md
```

每个文件都包含格式优美的对话，带有时间戳、用户/助手标记，并保留了原始格式。

## What You'll Get

将复杂的 JSON 导出转换为清晰、可读的 Markdown：

### Input (来自 ChatGPT 的 conversations.json)
```json
{
  "title": "Hello World",
  "create_time": 1736899200,
  "mapping": {
    "msg-1": {
      "message": {
        "author": { "role": "user" },
        "content": {
          "parts": ["你好！你好吗？"]
        }
      }
    },
    "msg-2": {
      "message": {
        "author": { "role": "assistant" },
        "content": {
          "parts": ["你好！我很好，谢谢您的问候。今天我能帮您做些什么？"]
        }
      }
    }
  }
}
```

### → Output (2025-01-15_Hello_World.md)
```markdown
# Hello World
Date: 2025-01-15 18:00:00 +09:00

---

## 👤 User
Date: 2025-01-15 18:00:00 +09:00

你好！你好吗？

---

## 🤖 Assistant
Date: 2025-01-15 18:00:10 +09:00

你好！我很好，谢谢您的问候。今天我能帮您做些什么？

---
```

✨ **特点**: 清晰的格式 • 时间戳 • 可视化标记 • 保留代码块和格式

## Installation

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/ai-chat-md-export
brew install ai-chat-md-export
```

### npm

```bash
npm install -g ai-chat-md-export
```

## What is ai-chat-md-export?

`ai-chat-md-export` 是一个 CLI 工具，可以将您的 ChatGPT 和 Claude 对话转换为组织良好、可读的 Markdown 文件。

### Key benefits

- **保存您的 AI 聊天记录**：在它们丢失或被删除之前保存下来
- **可读格式**：在任何 Markdown 编辑器中轻松查看
- **搜索和组织**：使用标准工具搜索和管理您的聊天历史
- **共享或版本控制**：根据需要共享或管理对话

## Privacy & Security

### 🔒 Offline-First Design

此工具设计为**在您的设备上本地运行**，无需互联网连接：

- **无网络请求**：工具本身不会进行任何外部 API 调用或网络连接
- **仅本地处理**：所有转换操作都在您的机器上完成
- **无数据收集**：我们不包含任何分析、遥测或跟踪功能
- **您的数据保持本地**：对话仅从本地文件系统读取和写入

非常适合重视数据隐私的组织和个人。您可以查看我们的[源代码](https://github.com/sugurutakahashi-1234/ai-chat-md-export)来验证该工具不包含任何网络相关代码。请注意，虽然我们的代码不会进行外部连接，但我们无法保证所有依赖项的行为。

## Usage

### Basic usage

```bash
# 转换单个 conversations.json 文件
ai-chat-md-export -i conversations.json

# 转换目录中的所有 JSON 文件
ai-chat-md-export -i exports/ -o output/

# 指定输出目录
ai-chat-md-export -i conversations.json -o markdown/
```

### Filtering options

```bash
# 按日期范围过滤
ai-chat-md-export -i conversations.json --since 2024-01-01 --until 2024-12-31

# 搜索特定关键词
ai-chat-md-export -i conversations.json --search "API"

# 组合过滤器
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"
```

### Other options

```bash
# 预览将要转换的内容而不创建文件
ai-chat-md-export -i conversations.json --dry-run

# 静默模式（抑制进度消息）
ai-chat-md-export -i conversations.json --quiet
```

## Command-line Options

| 选项                             | 描述                                      | 默认值     |
| -------------------------------- | ----------------------------------------- | ---------- |
| `-i, --input <path>`             | 输入文件或目录路径（必需）                | -          |
| `-o, --output <path>`            | 输出目录                                  | `.`        |
| `-f, --format <format>`          | 输入格式（`chatgpt`/`claude`/`auto`）     | `auto`     |
| `--since <date>`                 | 从日期过滤（YYYY-MM-DD）                  | -          |
| `--until <date>`                 | 截止日期过滤（YYYY-MM-DD）                | -          |
| `--search <keyword>`             | 在对话中搜索                              | -          |
| `--filename-encoding <encoding>` | 文件名编码（`standard`/`preserve`）       | `standard` |
| `-q, --quiet`                    | 抑制进度消息                              | -          |
| `--dry-run`                      | 预览模式，不创建文件                      | -          |

## Getting conversations.json

ChatGPT 和 Claude 都允许您将聊天历史导出为 `conversations.json` 文件。该文件包含您所有的对话，采用我们的工具可以处理的结构化格式。

### Export from ChatGPT (OpenAI)

1. 登录 ChatGPT (https://chat.openai.com)
2. 点击您的头像 → Settings
3. 从左侧菜单打开"Data Controls"
4. 点击"Export Data" → "Export"
5. 点击"Confirm export"确认
6. 几分钟内，您将收到一封邮件"Your ChatGPT data export is ready"
7. 从链接下载 `chatgpt-data.zip`（24 小时内有效）
8. 解压 ZIP 文件，在根目录中找到 `conversations.json`

注意：下载链接在 24 小时后过期，请及时下载。

### Export from Claude (Anthropic)

1. 登录 Claude (https://claude.ai)
2. 点击左下角的首字母缩写 → Settings
3. 打开"Privacy"标签（企业版为"Data management"）
4. 点击"Export data"并确认
5. 几分钟内，您将收到一封邮件"Your Claude data export is ready"
6. 下载 `claude-export.dms` 或 ZIP 文件
7. 如果收到的是 `.dms` 文件，将其重命名为 `.zip` 并解压
8. 在根目录中找到 `conversations.json`


## How it Works

该工具会自动检测您的输入是来自 ChatGPT 还是 Claude，并相应地处理转换。ChatGPT 使用基于树的对话结构，而 Claude 使用扁平的消息数组，但您不需要担心这些差异 - 工具会处理一切。

主要功能：
- **自动检测**：自动识别格式
- **保留格式**：保持代码块、列表和特殊字符
- **时间戳**：将所有时间戳转换为您的本地时区
- **清晰输出**：生成具有清晰消息分隔的可读 Markdown

## Date Filtering Details

`--since` 和 `--until` 选项根据对话**开始**的时间进行过滤，而不是最后更新时间：

- **ChatGPT**：使用导出中的 `create_time` 字段
- **Claude**：使用导出中的 `created_at` 字段
- **日期格式**：YYYY-MM-DD（例如：2024-01-15）
- **时区**：所有日期都在您的本地时区中解释
- **包含性过滤**：--since 和 --until 日期都是包含的

示例：
```bash
# 2024 年的对话
ai-chat-md-export -i data.json --since 2024-01-01 --until 2024-12-31

# 最近 30 天的对话（如果今天是 2024-12-15）
ai-chat-md-export -i data.json --since 2024-11-15

# 仅特定日期的对话
ai-chat-md-export -i data.json --since 2024-06-01 --until 2024-06-01
```

## Search Functionality

`--search` 选项提供强大的过滤功能：

- **不区分大小写**：匹配"API"、"api"、"Api"等
- **全面搜索**：搜索对话标题和所有消息内容
- **部分匹配**："learn"匹配"learning"、"machine learning"等
- **多个单词**：搜索输入的确切短语

示例：
```bash
# 查找所有关于 Python 的对话
ai-chat-md-export -i data.json --search "python"

# 搜索特定错误消息
ai-chat-md-export -i data.json --search "TypeError: cannot read property"

# 与日期过滤结合使用
ai-chat-md-export -i data.json --search "docker" --since 2024-01-01
```

## More Examples

有关包含多个对话的完整示例，请参见 [examples](examples/) 目录：

- **ChatGPT**：[示例对话](examples/chatgpt/)，包含多轮对话
- **Claude**：[示例对话](examples/claude/)，包含各种对话类型

## Troubleshooting

### Large files taking too long to process
该工具分批处理文件。对于非常大的对话历史：
- 使用 `--since` 和 `--until` 处理特定日期范围
- 将导出拆分为多个较小的文件
- 使用 `--search` 仅提取相关对话

### Character encoding issues
如果在输出中看到乱码文本：
- 确保您的终端支持 UTF-8 编码
- 检查您的 `conversations.json` 文件是否正确编码

对于文件名编码问题：
- `--filename-encoding standard`（默认）：清理文件名以在操作系统之间实现最大兼容性
- `--filename-encoding preserve`：保留对话标题中的原始字符，但某些系统上的特殊字符可能会导致问题

### Missing conversations
如果某些对话未出现在输出中：
- 检查导出日期 - 仅包含截止到导出日期的对话
- 验证 JSON 结构是否与 ChatGPT 或 Claude 格式匹配
- 使用 `--dry-run` 预览将转换哪些对话

## Roadmap

### ✅ Completed Features

- [x] ChatGPT 对话导出支持
- [x] Claude 对话导出支持
- [x] 自动格式检测（`--format auto`）
- [x] 日期范围过滤（`--since`、`--until`）
- [x] 关键词搜索功能（`--search`）
- [x] 时区感知的时间戳转换
- [x] 预览的干运行模式（`--dry-run`）
- [x] npm 包分发
- [x] Homebrew 公式支持

### 🚧 In Progress

- [ ] **导出为 JSON 格式** - 结构化 JSON 输出选项
- [ ] **进度条** - 长时间操作的视觉反馈

### 📋 Planned Features

- [ ] **Gemini 支持** - 从 Google Gemini 导出对话
- [ ] **导出统计** - 显示对话计数、消息计数、日期范围

## Contributing

请参见 [CONTRIBUTING.md](CONTRIBUTING.md)

## Contact

如果您有任何问题或反馈，可以在 X/Twitter 上联系我：[@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)