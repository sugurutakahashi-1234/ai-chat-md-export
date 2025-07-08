# Stopping App Release in TestFlight

Date: 2025-03-27

---

## 👤 User
*2025-03-27 22:32:10*

テストフライトでアプリのリリースを中止することはできるのか？その場合ダウングレードできるのか？

---

## 🤖 Assistant
*2025-03-27 22:32:20*

テストフライトでアプリのリリースを中止することは可能です。リリースの中止やダウングレードについて詳細にご説明します。

## テストフライトでのリリース中止について

テストフライトでは、リリース予定のビルドを中止することができます。方法としては：

1. App Store Connectにログインします
2. 該当するアプリを選択し、「TestFlight」タブに移動します
3. リリース予定のビルドを選択し、「テスト中止」または「配布停止」オプションを選択します

## ダウングレードについて

以前のバージョンへのダウングレードについては：

- テスト配信中のアプリ：以前のビルドを再度テスターに配信することは可能です
- 既にインストールされたアプリ：テスターのデバイス上では、通常、新しいバージョンから古いバージョンへの自動ダウングレードはできません
- テスター側での対応：テスターが新しいバージョンをアンインストールし、古いバージョンを再インストールする必要があります

## 重要な留意点

- データの互換性：新バージョンで作成されたデータが古いバージョンと互換性がない場合、ダウングレードによりデータが失われる可能性があります
- テスト配信の管理：App Store Connectでは複数のビルドを同時にテスト配信可能で、特定のテスターグループに異なるバージョンを配信できます
- 通知：バージョン変更をテスターに通知することをお忘れなく

何か具体的な状況やご質問がありましたら、お気軽にお知らせください。

---

## 👤 User
*2025-03-27 22:49:31*

これをしたいと思うがユーザにうまく伝えるためのアナウンス文言を考えてほしい

---

## 🤖 Assistant
*2025-03-27 22:49:49*

テストフライトのリリース中止とダウングレードについてのアナウンス文言を作成します。テスターに状況をわかりやすく説明し、必要な対応を丁寧に伝える内容にしました。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



このアナウンス文は以下の点を意識して作成しました：

1. 状況を明確に説明し、変更の理由を透明に伝えています
2. ユーザーが取るべき具体的な手順を順序立てて説明しています
3. データに関する注意点を事前に警告しています
4. 今後の予定を示し、不安を軽減しています
5. フィードバック方法を提供し、コミュニケーションを継続する姿勢を示しています

テストフライトは開発者とテスターの信頼関係が重要なので、誠実でわかりやすい説明を心がけました。必要に応じて、具体的な問題内容や日程などを実際の状況に合わせて編集してください。

---

## 👤 User
*2025-03-27 23:12:14*

すでにインストールした人はアプリはそのまま使えるのか？

---

## 🤖 Assistant
*2025-03-27 23:12:30*

テストフライトでのバージョン変更において、すでに最新版をインストールしたユーザーの状況について明確にしておきましょう。

すでに最新版（中止予定のバージョン）をインストールしたユーザーは、基本的にはそのアプリを引き続き使用することができます。テストフライトでの配信中止は、新規インストールや再インストールができなくなるだけで、すでにインストールされているアプリが強制的に停止したり削除されたりすることはありません。

このポイントをアナウンス文に追加しましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



アナウンス文を更新し、以下の点を明確にしました：

1. すでに最新版をインストールしているユーザーは、そのままアプリを使用し続けることができる点
2. ただし、問題が含まれている可能性があるため、安定版への切り替えを推奨する旨
3. 切り替えは強制ではなく、ユーザーの判断に委ねる形になっている点

これにより、ユーザーは現状をより正確に理解し、適切な判断ができるようになります。問題の深刻度によっては、「できるだけ早く切り替えてください」といった表現に変更することも検討できます。

何か他にアナウンス文に追加や修正したい点はありますか？

---

## 👤 User
*2025-03-27 23:59:47*

v0.0.90 と v0.0.89にしてほしい

---

## 🤖 Assistant
*2025-03-28 00:00:02*

```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



バージョン番号を具体的に更新しました。アナウンス文では、バージョン 0.0.90 の配信中止と、バージョン 0.0.89 への切り替え方法を明確に記載しています。必要に応じて他の部分も編集可能ですので、お知らせください。

---

## 👤 User
*2025-03-28 00:00:23*

iOS のユーザーのみのアナウンスにしてほしい。またテストフライトは英語にしてほしい

---

## 🤖 Assistant
*2025-03-28 00:01:01*

iOSユーザー向けに特化させ、テストフライト関連の表記を英語にしたアナウンス文に更新します。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```





アナウンス文を更新し、以下の変更を行いました：

1. タイトルと本文に「iOS版」の表記を追加
2. バージョン表記を「バージョン」から英語の「Build」に変更
3. 「TestFlightアプリ」を「TestFlight app」に変更
4. 注意事項に「この変更はiOS版のみを対象としています」という文言を追加

これにより、iOS版テスターにとって、より明確で適切なアナウンスになりました。英語と日本語の混在にも注意し、テストフライト関連の用語を英語表記にしています。

何か他に調整すべき点がありましたら、お知らせください。

---

## 👤 User
*2025-03-28 00:01:44*

変更理由を削除して、また、Build はバージョンとしてほしい。また、0.0.89への切り替えをお勧めというよりは

---

## 🤖 Assistant
*2025-03-28 00:01:52*

変更理由を削除し、「Build」を「バージョン」に戻し、お勧めの表現を変更したいとのことですね。アナウンス文を修正します。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```

---

## 👤 User
*2025-03-28 00:02:12*

変更理由を削除して、また、Build はバージョンとしてほしい。また、0.0.89への切り替えをお勧めというよりは変更してほしいということにして

---

## 🤖 Assistant
*2025-03-28 00:02:32*

アナウンス文を指示に従って更新します。変更理由を削除し、「Build」を「バージョン」に戻し、推奨ではなく変更を求める表現に修正します。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



指示通りにアナウンス文を更新しました。変更理由を削除し、「Build」を「バージョン」に戻しました。また、推奨ではなく変更を求める表現に修正しました。

より直接的で明確なアナウンスになり、テスターに対してバージョン 0.0.89 への変更を求める内容になっています。何か他に調整が必要な点がありましたら、お知らせください。

---

## 👤 User
*2025-03-28 00:04:29*

ご注意事項にアンインストールしてもデータは正しく引き継がれることを表記してほしい

---

## 🤖 Assistant
*2025-03-28 00:04:37*

```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



ご注意事項に「アンインストールしても、アプリのデータは正しく引き継がれます」という内容を追加しました。また、バージョン表記も具体的な数字（0.0.90と0.0.89）に統一して、より明確になるよう修正しました。

これにより、テスターはアンインストール時のデータ保持について安心できます。一方で、バージョン間の互換性については依然として注意を促す内容も残しています。

---

## 👤 User
*2025-03-28 00:31:47*

Android版はそのままお使いくださいみたいなもんごんもほしい

---

## 🤖 Assistant
*2025-03-28 00:32:00*

Android版に関する文言を追加します。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```





Android版ユーザーに対する案内を追加しました。具体的には：

1. 冒頭の「重要なお知らせ」に「Android版をご利用のテスターの皆様は、現在のバージョンをそのままご使用ください。」という文言を追加
2. 注意事項の項目にも「Android版をご利用の方は、そのままご使用いただけます」という項目を追加

これにより、iOS版とAndroid版の両方のユーザーに対する指示が明確になり、混乱を防ぐことができます。Android版ユーザーは対応不要であることがはっきりと伝わる内容になりました。

---
