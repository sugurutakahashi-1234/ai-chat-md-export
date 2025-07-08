# Embed SpeakerDeck in GitHub

Date: 2024-04-23

---

## 👤 User
*2024-04-23 17:13:28*

SpeakerDeck のスライド(pdfであったり)をGithubのreadme でページングできるように埋め込む方法。

---

## 🤖 Assistant
*2024-04-23 17:14:40*

SpeakerDeckでホストされているスライドをGitHubのREADMEファイルに埋め込むための一般的な方法を説明します。ただし、GitHubのMarkdownは直接的にスライドのページングをサポートしていないため、スライドをページごとに切り替えることはできません。しかし、スライド全体へのリンクを提供するか、特定のスライドへのリンクを個別に配置することができます。

### SpeakerDeck スライドを GitHub README に埋め込むステップ:

1. **SpeakerDeckのスライドを公開する**  
   SpeakerDeck上でスライドをアップロードし、公開設定にします。これにより、外部のユーザーがアクセスできるようになります。

2. **埋め込みコードを取得する**  
   SpeakerDeckのスライドページにアクセスし、「Share」または「Embed」ボタンをクリックします。表示される埋め込みコード（iframeタグ）をコピーします。

3. **Markdown形式でREADMEに追加する**  
   GitHubのMarkdownはiframeを直接サポートしていないため、iframeタグを直接READMEファイルに貼り付けることはできません。代わりに、スライドへの直接リンクをMarkdownリンクとして追加できます。以下のようにフォーマットします：
   ```
   [![スライドタイトル](画像URL)](SpeakerDeckのスライドURL)
   ```
   ここで、「画像URL」はスライドのカバー画像や任意のプレビュー画像のURLで、これによってクリック可能なリンクとして表示されます。

4. **特定のスライドにリンクする**  
   SpeakerDeckのスライドは、特定のページに直接リンクする機能を提供していないため、各ページを個別にリンクすることはできません。ユーザーがスライドを見たい場合は、SpeakerDeckのプラットフォーム上でページングしなければなりません。

### 実装例

```markdown
[![SpeakerDeck Slide](https://example.com/image_preview.png)](https://speakerdeck.com/username/slideshow)
```
ここでは、`https://example.com/image_preview.png`をスライドのプレビュー画像のURLに、`https://speakerdeck.com/username/slideshow`を実際のSpeakerDeckのスライドページのURLに置き換えてください。

以上の方法で、GitHubのREADMEにスライドを「埋め込む」ことができますが、ページング機能は直接サポートされていない点に注意が必要です。ユーザーはリンクをクリックしてSpeakerDeckのページでスライドを閲覧します。

---

## 👤 User
*2024-04-23 17:24:08*

SpeakerDeckのプレビューはどうやって取得するのか？

---

## 🤖 Assistant
*2024-04-23 17:24:57*

SpeakerDeckで公開されているプレゼンテーションのプレビュー画像を取得するには、いくつかのステップが必要です。以下にその方法を説明します：

### SpeakerDeckプレビュー画像の取得方法

1. **SpeakerDeckスライドを開く**  
   WebブラウザでSpeakerDeckのスライドページにアクセスします。

2. **ページソースを表示**  
   スライドのページで右クリックして「ページのソースを表示」を選ぶか、ブラウザのメニューからページソースを開きます。

3. **画像のURLを見つける**  
   ページソース内で画像のURLを探します。多くの場合、`.jpg` や `.png` といった画像フォーマットで終わるURLが含まれています。例えば、`<meta property="og:image" content="画像のURL">` のように `<meta>` タグ内にある `og:image` プロパティを探します。

4. **URLをコピー**  
   見つかった画像URLをコピーします。このURLは、SpeakerDeckが提供するスライドのプレビュー画像です。

5. **READMEに埋め込む**  
   取得した画像URLをGitHubのREADMEファイルにMarkdown形式で埋め込みます。以下の形式を使用します：
   ```markdown
   ![スライドのタイトル](画像のURL)
   ```

### 注意点
- スライドのプレビュー画像は、通常はスライドの最初のページを示しています。
- 画像のURLは時として変更されることがあるため、定期的にチェックして更新が必要な場合があります。

これらのステップを使って、GitHubのREADMEでSpeakerDeckのスライドを視覚的にリンクすることができます。ただし、直接のページング機能は提供されていないため、完全なスライドを見るにはSpeakerDeckのウェブサイトを訪れる必要があります。

---
