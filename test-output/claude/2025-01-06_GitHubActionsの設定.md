# GitHubActionsの設定

日付: 2025-01-06

---

## 👤 ユーザー
*2025/1/7 0:30:00*

GitHub ActionsでNode.jsプロジェクトのCI/CDを設定したい

---

## 🤖 アシスタント
*2025/1/7 0:31:00*

GitHub ActionsでNode.jsプロジェクトのCI/CDを設定する基本的なワークフローを紹介します。

`.github/workflows/ci.yml`を作成：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linter
      run: npm run lint
    
    - name: Build
      run: npm run build
```

これで、プッシュやPR時に自動的にテストが実行されます。

---
