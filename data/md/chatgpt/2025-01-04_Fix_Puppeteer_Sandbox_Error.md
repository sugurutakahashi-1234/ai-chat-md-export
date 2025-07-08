# Fix Puppeteer Sandbox Error

Date: 2025-01-04

---

## 👤 User
*2025-01-04 17:03:41*

0s
Run npm run generate-diagram

&gt; finance@1.0.0 generate-diagram
&gt; mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP'

Generating single mermaid chart

Error: Failed to launch the browser process!
[0104/075503.615128:FATAL:zygote_host_impl_linux.cc(128)] No usable sandbox! If you are running on Ubuntu 23.10+ or another Linux distro that has disabled unprivileged user namespaces with AppArmor, see https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md. Otherwise see https://chromium.googlesource.com/chromium/src/+/main/docs/linux/suid_sandbox_development.md for more information on developing with the (older) SUID sandbox. If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.


TROUBLESHOOTING: https://pptr.dev/troubleshooting

    at Interface.onClose (file:///home/runner/work/finance/finance/node_modules/@puppeteer/browsers/lib/esm/launch.js:303:24)
    at Interface.emit (node:events:530:35)
    at Interface.close (node:internal/readline/interface:527:10)
    at Socket.onend (node:internal/readline/interface:253:10)
    at Socket.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)

Error: Process completed with exit code 1.

```
name: Deploy Mermaid Diagram

on:
  push:
    paths:
      - 'assets/mermaid/finance.mmd'
      - '.github/workflows/*.yml'
      - 'README.md'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        persist-credentials: false

    - name: Set up Node.js environment
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm install

    - name: Install Japanese font
      run: |
        sudo apt-get update
        sudo apt-get install -y fonts-noto-cjk

    - name: Generate Mermaid Diagram
      run: npm run generate-diagram

    - name: Update README with mermaid diagram
      run: npm run update-readme

    - name: Commit and push updates
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"

        git add ./docs/diagrams/finance.png README.md

        # Check for changes and commit if there are any
        if ! git diff --cached --quiet; then
          git commit -m "Update README with latest Mermaid diagram and finance.png"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push origin HEAD:${{ github.ref }}
        else
          echo "No changes to commit."
        fi

  #   - name: Upload to Imgur
  #     uses: devicons/public-upload-to-imgur@v2.2.2
  #     with:
  #       path: './docs/diagrams/finance.png'
  #       client_id: ${{ secrets.IMGUR_CLIENT_ID }}
  #       description: "Images uploaded by public-upload-to-imgur GitHub Action"

  #   - name: Set up GitHub Pages
  #     uses: actions/configure-pages@v5

  #   - name: Upload Pages Artifact
  #     uses: actions/upload-pages-artifact@v3
  #     with:
  #       path: './docs'

  # deploy:
  #   needs: build
  #   runs-on: ubuntu-latest
  #   permissions:
  #     contents: read
  #     pages: write
  #     id-token: write
  #   environment:
  #     name: github-pages
  #   steps:
  #   - name: Deploy to GitHub Pages
  #     uses: actions/deploy-pages@v4

---

## 🤖 Assistant
*2025-01-04 17:03:54*

The error occurs because the `puppeteer` library (used by `mmdc` for rendering Mermaid diagrams) cannot launch the browser due to missing or restricted sandboxing permissions. This is common on modern Linux distributions, including the latest Ubuntu versions, where unprivileged user namespaces may be restricted by AppArmor.

Here are some steps to resolve the issue:

### Update the Workflow
Add the `--no-sandbox` flag to the `mmdc` command in your `npm run generate-diagram` script:

```json
"scripts": {
  "generate-diagram": "mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' --no-sandbox"
}
```

Alternatively, if modifying the script isn't desirable, pass the flag directly in the workflow:

```yaml
- name: Generate Mermaid Diagram
  run: mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' --no-sandbox
```

### Install Required Dependencies
Ensure that `chromium` and its dependencies are installed on the runner. Add the following before running the `mmdc` command:

```yaml
- name: Install dependencies for puppeteer
  run: |
    sudo apt-get update
    sudo apt-get install -y chromium-browser
```

### Use Puppeteer’s Built-in Chromium
Puppeteer downloads its own version of Chromium during installation. Verify that the `puppeteer` installation step completes successfully, as missing Chromium can also cause issues.

### Debugging Locally
If you’re testing locally, ensure you have sandboxing enabled on your system or use `--no-sandbox` for testing purposes.

### Final Workflow Example

Here’s the updated GitHub Actions workflow:

```yaml
name: Deploy Mermaid Diagram

on:
  push:
    paths:
      - 'assets/mermaid/finance.mmd'
      - '.github/workflows/*.yml'
      - 'README.md'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        persist-credentials: false

    - name: Set up Node.js environment
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm install

    - name: Install Japanese font
      run: |
        sudo apt-get update
        sudo apt-get install -y fonts-noto-cjk chromium-browser

    - name: Generate Mermaid Diagram
      run: mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' --no-sandbox

    - name: Update README with mermaid diagram
      run: npm run update-readme

    - name: Commit and push updates
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"

        git add ./docs/diagrams/finance.png README.md

        # Check for changes and commit if there are any
        if ! git diff --cached --quiet; then
          git commit -m "Update README with latest Mermaid diagram and finance.png"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push origin HEAD:${{ github.ref }}
        else
          echo "No changes to commit."
        fi
```

This should resolve the issue and allow the workflow to complete successfully.

---

## 👤 User
*2025-01-04 17:04:06*

日本ンゴで

---

## 🤖 Assistant
*2025-01-04 17:04:19*

以下は、日本語での説明と修正版のGitHub Actionsワークフローです。

### 問題の原因
`puppeteer` が `mmdc` 実行時にブラウザを起動しようとしましたが、Linux（特に最新のUbuntu）でのサンドボックス機能の制限によりエラーが発生しました。この問題は、`--no-sandbox` オプションを追加することで回避できます。

また、`chromium` が正しくインストールされていない場合も同様のエラーが発生する可能性があります。

---

### 解決策
1. **`--no-sandbox` オプションを追加**
   `npm run generate-diagram` スクリプトに `--no-sandbox` を追加するか、GitHub Actions内で直接指定します。

2. **Chromiumのインストール**
   Puppeteerが利用するブラウザが不足している可能性があるため、`chromium-browser` をインストールします。

---

### 修正版ワークフロー例

```yaml
name: Mermaid 図の生成とデプロイ

on:
  push:
    paths:
      - 'assets/mermaid/finance.mmd'
      - '.github/workflows/*.yml'
      - 'README.md'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - name: コードをチェックアウト
      uses: actions/checkout@v4
      with:
        persist-credentials: false

    - name: Node.js 環境をセットアップ
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: 必要なパッケージをインストール
      run: npm install

    - name: 日本語フォントとChromiumをインストール
      run: |
        sudo apt-get update
        sudo apt-get install -y fonts-noto-cjk chromium-browser

    - name: Mermaid図を生成
      run: mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' --no-sandbox

    - name: READMEをMermaid図で更新
      run: npm run update-readme

    - name: 更新内容をコミット＆プッシュ
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"

        git add ./docs/diagrams/finance.png README.md

        # 差分がある場合のみコミット
        if ! git diff --cached --quiet; then
          git commit -m "最新のMermaid図とREADMEを更新"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push origin HEAD:${{ github.ref }}
        else
          echo "コミットすべき変更はありません。"
        fi
```

---

### 解説
1. **`--no-sandbox` の追加**
   `mmdc` コマンドに `--no-sandbox` オプションを指定することで、サンドボックスの制限を回避します。

2. **Chromiumのインストール**
   Puppeteerが利用するブラウザとしてChromiumをインストールします。

3. **変更内容のコミット**
   Mermaid図やREADMEに変更がある場合のみ、コミットしてプッシュします。

---

これでエラーが解消され、ワークフローが正常に動作するはずです！ 😊

---

## 👤 User
*2025-01-04 17:04:56*

サンドボックスの制限とはなに？

---

## 🤖 Assistant
*2025-01-04 17:05:12*

サンドボックスの制限とは、セキュリティを高めるためにプロセスやアプリケーションを制御された環境（＝サンドボックス）内で動作させる仕組みの制約を指します。以下で詳しく説明します。

---

### サンドボックスとは？
サンドボックスは、プログラムやプロセスを隔離された環境で動作させるセキュリティ機能のことです。これにより、プログラムがシステム全体に影響を与えたり、予期しない動作をしたりするのを防ぐことができます。

たとえば：
- ウェブブラウザが外部サイトのコードを実行するときに、システム全体にアクセスできないようにする。
- アプリが他のアプリやシステムのデータにアクセスするのを防ぐ。

---

### サンドボックスの制限とは？
最新のLinuxディストリビューション（例：Ubuntu 23.10以降）では、サンドボックス機能を強化するために、特定のセキュリティポリシー（例：AppArmor）を採用しています。このポリシーにより、**非特権ユーザーが「名前空間（namespace）」を利用してサンドボックスを作成する機能が無効化される**ことがあります。

#### サンドボックス制限の例
- **非特権ユーザーによるサンドボックスの作成を禁止**
  - Puppeteer（`mmdc` が内部で使用）はサンドボックス内でChromiumブラウザを起動しようとしますが、Linuxの制限によって失敗する。
  
- **AppArmorやSELinuxによる制限**
  - システムのセキュリティポリシーが原因で、サンドボックス内のプロセスに必要なリソースへのアクセスがブロックされる。

---

### エラーの原因
今回のエラーは、PuppeteerがChromiumブラウザをサンドボックス環境で起動しようとしたときに、Linuxのセキュリティ設定によって失敗したことが原因です。

エラーメッセージにも次のように記載されています：
&gt; No usable sandbox! If you are running on Ubuntu 23.10+ or another Linux distro that has disabled unprivileged user namespaces with AppArmor...

これは、**AppArmor** が「非特権ユーザーの名前空間利用を無効化した」ために発生した問題です。

---

### 解決方法
この制限を回避するには、以下の方法があります。

#### 方法1: `--no-sandbox` オプションを追加
`--no-sandbox` オプションを指定すると、Chromiumをサンドボックスなしで起動できます。
- 簡単に問題を解決できますが、セキュリティ面ではリスクがあります。
- GitHub Actionsのような信頼できるCI環境では安全とされています。

#### 方法2: システムの設定を変更
サンドボックス機能を再有効化するには、以下を試す必要があります。
1. **名前空間の利用を許可する**:
   - `sudo sysctl kernel.unprivileged_userns_clone=1` で名前空間の利用を有効化。
2. **AppArmorのポリシーを調整する**:
   - Chromiumに関連する制限を緩和します。

ただし、これはシステム全体に影響を与えるため、推奨されません。

---

### サンドボックスを無効化するリスク
`--no-sandbox` を利用すると、サンドボックスのセキュリティ保護を失うため、攻撃者が悪意のあるコードを実行するリスクが高まります。ただし、GitHub Actionsのような隔離されたCI環境では、セキュリティリスクはほとんどありません。

---

### 今回の状況における最適解
GitHub Actionsを使用しているため、`--no-sandbox` オプションを追加するのが最も簡単で適切な解決方法です。

---

これがサンドボックス制限の概要とその回避方法です！ 😊

---

## 👤 User
*2025-01-04 17:06:33*

npm run generate-diagram                                                                                                                                                                                                                                            1 ↵

&gt; finance@1.0.0 generate-diagram
&gt; mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' --no-sandbox

error: unknown option '--no-sandbox'

---

## 🤖 Assistant
*2025-01-04 17:06:51*

`--no-sandbox` オプションが `mmdc` (Mermaid CLI) に認識されないのは、`mmdc` がそのオプションを直接サポートしていないためです。この場合、`puppeteer` を直接設定する必要があります。

以下に、エラーを解決する方法を説明します。

---

### 解決方法

#### 1. **環境変数を利用して Puppeteer にオプションを設定**
`puppeteer` を利用するツール（`mmdc`）に対して `--no-sandbox` を有効化するには、環境変数を使用します。

`PUPPETEER_EXECUTABLE_PATH` または `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` を設定することで、`puppeteer` が利用する Chromium に適切な設定を適用できます。

以下を `npm run generate-diagram` 実行時に追加します：

```bash
env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm run generate-diagram
```

#### 2. **シェルスクリプトで対応**
GitHub Actions やローカルで自動化する場合、以下のようにシェルスクリプトで直接 Chromium のオプションを指定することができます。

```bash
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run generate-diagram
```

---

### Mermaid CLI (`mmdc`) の設定方法
もし上記で解決しない場合、`puppeteerConfigFile` を指定して直接 Puppeteer のオプションを調整します。

#### 手順：
1. プロジェクトディレクトリに Puppeteer の設定ファイルを作成します。

   **`puppeteer-config.json`**
   ```json
   {
     "args": ["--no-sandbox", "--disable-setuid-sandbox"]
   }
   ```

2. `mmdc` に設定ファイルを渡します。

   ```bash
   mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' -c puppeteer-config.json
   ```

3. `package.json` のスクリプトに反映する場合：
   ```json
   "scripts": {
     "generate-diagram": "mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' -c puppeteer-config.json"
   }
   ```

---

### 修正後の GitHub Actions ワークフロー例

以下は、`puppeteer-config.json` を利用した GitHub Actions の修正版です。

```yaml
name: Deploy Mermaid Diagram

on:
  push:
    paths:
      - 'assets/mermaid/finance.mmd'
      - '.github/workflows/*.yml'
      - 'README.md'

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - name: コードをチェックアウト
      uses: actions/checkout@v4
      with:
        persist-credentials: false

    - name: Node.js 環境をセットアップ
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: 必要なパッケージをインストール
      run: npm install

    - name: 日本語フォントとChromiumをインストール
      run: |
        sudo apt-get update
        sudo apt-get install -y fonts-noto-cjk chromium-browser

    - name: Puppeteer 設定ファイルを作成
      run: |
        echo '{ "args": ["--no-sandbox", "--disable-setuid-sandbox"] }' > puppeteer-config.json

    - name: Mermaid図を生成
      run: mmdc -i assets/mermaid/finance.mmd -o docs/diagrams/finance.png -f 'Noto Sans JP' -c puppeteer-config.json

    - name: READMEをMermaid図で更新
      run: npm run update-readme

    - name: 更新内容をコミット＆プッシュ
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"

        git add ./docs/diagrams/finance.png README.md

        # 差分がある場合のみコミット
        if ! git diff --cached --quiet; then
          git commit -m "最新のMermaid図とREADMEを更新"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push origin HEAD:${{ github.ref }}
        else
          echo "コミットすべき変更はありません。"
        fi
```

---

### 補足
- `--no-sandbox` が直接サポートされていない場合でも、Puppeteer の設定を通じて制御可能です。
- 設定ファイルを使う方法は、再利用性が高く管理が容易です。

これで問題が解決するはずです！ 😊

---
