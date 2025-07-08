# Production Environment Naming Conventions

Date: 2025-06-11

---

## 👤 User
*2025-06-11 14:24:37*

local dev stg など環境を表す単語でprd と prod はどちらが使われることが多いか

---

## 🤖 Assistant
*2025-06-11 14:24:49*

実際の使用頻度としては、**prod** の方が圧倒的に多く使われています。

主な理由：
- **prod** は "production" の自然な省略形として広く認識されている
- dev, stg, prod と3文字で統一できるため、環境変数や設定ファイルで見た目が揃う
- 多くの開発ツールやフレームワークのデフォルト設定でも prod が採用されている

例えば：
```
NODE_ENV=prod
APP_ENV=prod
environment: prod
```

**prd** も使われることはありますが、比較的少数派です。特に日本の企業では prd を使うケースも見られますが、グローバルスタンダードとしては prod が主流です。

環境名の一般的なパターン：
- `dev` (development)
- `stg` または `stage` (staging)  
- `prod` (production)

この3文字または4文字での統一感も、prod が好まれる理由の一つとなっています。

---

## 👤 User
*2025-06-11 14:25:06*

`stg` と `stage`では？

---

## 🤖 Assistant
*2025-06-11 14:25:17*

**stg** の方が多く使われています。

主な理由：
- **文字数の統一性**: `dev`, `stg`, `prod` と3文字で揃えられる
- **簡潔性**: 環境変数やURLなどで短い方が扱いやすい
- **業界標準**: 多くの企業やプロジェクトで stg が採用されている

使用例：
```
# 環境変数
APP_ENV=stg

# URL
https://stg.example.com
https://api-stg.example.com

# ブランチ名
release/stg
```

ただし、`stage` も一定の支持があります：
- より明確で読みやすい
- 省略形に慣れていない人にも理解しやすい
- 一部のツールやフレームワークでは stage がデフォルト

結論として：
- **短縮形を好む場合**: `dev` / `stg` / `prod`
- **可読性を重視する場合**: `development` / `staging` / `production`
- **最も一般的な組み合わせ**: `dev` / `stg` / `prod`

---
