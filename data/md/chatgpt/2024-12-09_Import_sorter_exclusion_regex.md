# Import sorter exclusion regex

日付: 2024-12-09

---

## 👤 ユーザー
*2024/12/9 17:06:32*

lib/gen only exclude

import_sorter:
  ignored_files: # Optional, defaults to []
    - \/lib\/*

---

## 🤖 アシスタント
*2024/12/9 17:06:38*

The given configuration seems to be related to an import sorting tool. If you want to exclude only the `lib/gen` directory (and its subdirectories) while allowing other files in the `lib` folder to be processed, the `ignored_files` pattern should specifically match the `lib/gen` directory. You can achieve this with the following configuration:

```yaml
import_sorter:
  ignored_files:
    - ^lib/gen/
```

### Explanation:
- `^lib/gen/`: This regex pattern matches any files or directories starting with `lib/gen/`. The caret (`^`) ensures it matches from the start of the path.
- Other files in `lib` (e.g., `lib/main.dart`, `lib/utils/helpers.dart`) will still be processed by the import sorter.

If your intention is slightly different, feel free to clarify!

---
