# Zshrc Flutter PATH追加

Date: 2024-12-05

---

## 👤 User
*2024-12-05 12:53:23*

以下を改行含めてechoでワンライナー
~/.zshrc

```
# flutter
export PATH="$PATH:$HOME/development/flutter/bin"
```

---

## 🤖 Assistant
*2024-12-05 12:53:25*

以下のように記述すると、改行を含めた内容を `~/.zshrc` にワンライナーで追記できます。

```bash
echo -e '\n# flutter\nexport PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.zshrc
```

---
