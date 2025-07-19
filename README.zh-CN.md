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
[![GitHub Release Date](https://img.shields.io/github/release-date/sugurutakahashi-1234/ai-chat-md-export)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases)
[![GitHub issues](https://img.shields.io/github/issues/sugurutakahashi-1234/ai-chat-md-export)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/pulls)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sugurutakahashi-1234/ai-chat-md-export)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/graphs/commit-activity)
[![GitHub contributors](https://img.shields.io/github/contributors/sugurutakahashi-1234/ai-chat-md-export)](https://github.com/sugurutakahashi-1234/ai-chat-md-export/graphs/contributors)

将 ChatGPT 和 Claude 聊天记录转换为可读的 Markdown 文件

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

## 目录

- [Quick Start](#quick-start)
- [安装](#安装)
- [什么是 ai-chat-md-export？](#什么是-ai-chat-md-export)
- [隐私与安全](#隐私与安全)
- [使用方法](#使用方法)
- [命令行选项](#命令行选项)
- [获取 conversations.json](#获取-conversationsjson)
- [故障排除](#故障排除)
- [路线图](#路线图)
- [贡献](#贡献)
- [联系方式](#联系方式)
- [许可证](#许可证)

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

## 安装

### Homebrew (macOS/Linux)

```bash
brew tap sugurutakahashi-1234/tap
brew install ai-chat-md-export
```

### npm

```bash
npm install -g ai-chat-md-export
```

### 直接下载 (Windows / 其他)

预构建的二进制文件可从[发布页面](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest)获取。

#### Windows
1. 下载 [ai-chat-md-export-windows-amd64.zip](https://github.com/sugurutakahashi-1234/ai-chat-md-export/releases/latest/download/ai-chat-md-export-windows-amd64.zip)
2. 解压缩文件
3. 将解压后的文件夹添加到PATH，或直接运行：
   ```cmd
   ai-chat-md-export.exe -i conversations.json
   ```

#### macOS / Linux
从发布页面下载适合您平台的`.tar.gz`文件。

## 什么是 ai-chat-md-export？

`ai-chat-md-export` 是一个 CLI 工具，可以将您的 ChatGPT 和 Claude 对话转换为组织良好、可读的 Markdown 文件。

### 主要特性

**核心功能**
- 🚀 **快速高效** - 在几秒钟内处理数千个对话
- 📝 **清晰的 Markdown 输出** - 格式良好、易读的 Markdown 文件
- 🔍 **高级过滤** - 按日期范围、搜索关键字过滤
- 🌍 **多平台支持** - 支持 ChatGPT 和 Claude 导出

**便利性**
- 📅 **智能文件命名** - 按日期组织，使用清理后的对话标题
- 💻 **跨平台** - 适用于 Windows、macOS 和 Linux
- 🎯 **灵活的输出** - 分割对话或合并到单个文件
- 🛠️ **开发者友好** - TypeScript、完全类型安全、充分测试

**主要优点**
- **保存您的 AI 聊天记录** - 在它们丢失或被删除之前保存下来
- **可读格式** - 在任何 Markdown 编辑器中轻松查看
- **搜索和组织** - 使用标准工具搜索和管理您的聊天历史
- **共享或版本控制** - 根据需要共享或管理对话

## 隐私与安全

### 🔒 Offline-First Design

此工具设计为**在您的设备上本地运行**，无需互联网连接：

- **无网络请求**：工具本身不会进行任何外部 API 调用或网络连接
- **仅本地处理**：所有转换操作都在您的机器上完成
- **无数据收集**：我们不包含任何分析、遥测或跟踪功能
- **您的数据保持本地**：对话仅从本地文件系统读取和写入

非常适合重视数据隐私的组织和个人。您可以查看我们的[源代码](https://github.com/sugurutakahashi-1234/ai-chat-md-export)来验证该工具不包含任何网络相关代码。请注意，虽然我们的代码不会进行外部连接，但我们无法保证所有依赖项的行为。

## Usage

```bash
# 基本用法：将 conversations.json 转换为 Markdown 文件
ai-chat-md-export -i conversations.json

# 指定输出目录
ai-chat-md-export -i conversations.json -o output/

# 按日期或关键词过滤
ai-chat-md-export -i conversations.json --since 2024-01-01 --search "Python"

# 导出为 JSON 格式
ai-chat-md-export -i conversations.json -f json

# 将所有对话合并到一个文件中
ai-chat-md-export -i conversations.json --no-split
```

更多示例请参见 [examples](examples/) 目录。

## Command-line Options

| 选项                             | 描述                                                             | 默认值     |
| -------------------------------- | --------------------------------------------------------------- | ---------- |
| `-h, --help`                     | 显示帮助信息                                                     | -          |
| `-v, --version`                  | 显示版本号                                                       | -          |
| `-i, --input <path>`             | 输入文件路径（必需）                                              | -          |
| `-o, --output <path>`            | 输出目录                                                         | `.`        |
| `-f, --format <format>`          | 输出格式（`markdown`/`json`）                                    | `markdown` |
| `--no-split`                     | 将所有对话合并到一个文件中（默认：分割文件）                        | -          |
| `--since <date>`                 | 从日期过滤（YYYY-MM-DD）。按对话开始日期过滤                       | -          |
| `--until <date>`                 | 截止日期过滤（YYYY-MM-DD）。包含性过滤                            | -          |
| `--search <keyword>`             | 在对话中搜索。不区分大小写，搜索标题和消息                          | -          |
| `-p, --platform <platform>`      | 输入平台（`chatgpt`/`claude`/`auto`）                            | `auto`     |
| `--filename-encoding <encoding>` | 文件名编码（`standard`/`preserve`）                              | `standard` |
| `-q, --quiet`                    | 抑制进度消息                                                     | -          |
| `--dry-run`                      | 预览模式，不创建文件                                              | -          |

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


## Troubleshooting

### Large files taking too long to process
对于非常大的对话历史：
- 使用 `--since` 和 `--until` 处理特定日期范围
- 如果遇到内存问题，请一次处理一个文件
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
- [x] 自动格式检测
- [x] 日期范围过滤（`--since`、`--until`）
- [x] 关键词搜索功能（`--search`）
- [x] 时区感知的时间戳转换
- [x] 预览的干运行模式（`--dry-run`）
- [x] 导出为 JSON 格式（`-f json`）
- [x] 将对话合并到单个文件（`--no-split`）
- [x] npm 包分发
- [x] Homebrew 公式支持

### 🚧 In Progress

- [ ] **进度条** - 长时间操作的视觉反馈

### 📋 Planned Features

- [ ] **Gemini 支持** - 从 Google Gemini 导出对话
- [ ] **导出统计** - 显示对话计数、消息计数、日期范围

## 贡献

欢迎贡献！有关开发设置、测试指南和如何提交拉取请求，请参见 [CONTRIBUTING.md](CONTRIBUTING.md)

## Contact

如果您有任何问题或反馈，可以在 X/Twitter 上联系我：[@ikuraikuraaaaaa](https://x.com/ikuraikuraaaaaa)

## License

MIT © [Suguru Takahashi](https://github.com/sugurutakahashi-1234)