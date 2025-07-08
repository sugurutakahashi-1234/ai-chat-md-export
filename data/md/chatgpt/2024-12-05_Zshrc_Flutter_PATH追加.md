# Zshrc Flutter PATH追加

日付: 2024-12-05

---

## 👤 ユーザー
*2024/12/05 12:53:23*

以下を改行含めてechoでワンライナー
~/.zshrc

```
# flutter
export PATH="$PATH:$HOME/development/flutter/bin"
```

---

## 🤖 アシスタント
*2024/12/05 12:53:25*

以下のように記述すると、改行を含めた内容を `~/.zshrc` にワンライナーで追記できます。

```bash
echo -e '\n# flutter\nexport PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.zshrc
```

---
