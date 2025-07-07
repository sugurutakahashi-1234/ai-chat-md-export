# Tag Format Revision

日付: 2024-04-05

---

## 👤 ユーザー
*2024/4/5 17:38:29*

TAG_FORMAT="^([0-9]+\.[0-9]+\.[0-9]+(-rc\.[0-9]+)?)$" の記述を修正してほしい。

数字.数字.数字 のフォーマット以外は受け付けたくない。

```
name: Generate Tag & Release Note Draft

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name (e.g., 1.0.2)'
        required: true
        default: '0.0.0'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Generate Release Note URL and Validate Tag
      run: |
        # Check tag format
        TAG_FORMAT="^([0-9]+\.[0-9]+\.[0-9]+(-rc\.[0-9]+)?)$"
        if [[ ! "${{ github.event.inputs.tag }}" =~ $TAG_FORMAT ]]; then
          echo "Error: Invalid tag format!"
          exit 1
        fi
        
        # Extract branch name from github.ref
        BRANCH_NAME=$(echo ${{ github.ref }} | sed 's/refs\/heads\///')
        
        # Print the release note URL
        echo "https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"
```

---

## 🤖 アシスタント
*2024/4/5 17:39:08*

指定された正規表現パターンを修正して、「数字.数字.数字」のフォーマットのみを受け付けるようにする必要があります。現在のパターンでは、`-rc.x` のようなプレリリースバージョンも許可していますが、これを除外したいとのことです。

下記のスクリプト部分を修正して、要求に応じた正規表現を適用します。

```yaml
name: Generate Tag & Release Note Draft

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name (e.g., 1.0.2)'
        required: true
        default: '0.0.0'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Generate Release Note URL and Validate Tag
      run: |
        # Check tag format
        TAG_FORMAT="^([0-9]+\.[0-9]+\.[0-9]+)$"
        if [[ ! "${{ github.event.inputs.tag }}" =~ $TAG_FORMAT ]]; then
          echo "Error: Invalid tag format!"
          exit 1
        fi
        
        # Extract branch name from github.ref
        BRANCH_NAME=$(echo ${{ github.ref }} | sed 's/refs\/heads\///')
        
        # Print the release note URL
        echo "https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"
```

この修正により、`数字.数字.数字` のフォーマットのみが受け付けられるようになります。プレリリースバージョンを示す `-rc.x` はこの正規表現にマッチしないため、受け付けられなくなります。

---
