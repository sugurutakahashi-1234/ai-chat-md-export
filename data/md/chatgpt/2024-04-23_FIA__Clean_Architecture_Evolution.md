# FIA: Clean Architecture Evolution

日付: 2024-04-23

---

## 👤 ユーザー
*2024/04/23 16:02:22*

まとめの章を作成してほしい

```
---
marp: true
theme: gaia
class: invert
---

<!-- _class : lead invert-->

## Framework-Independent Architecture (FIA)
#### - Clean Architecture で iOS アプリを爆速でビルドする -

2024/04/25

---

<!-- paginate: true -->

![bg right:35%](./assets/images/account.jpg)

## 自己紹介

- 高橋 俊
  - iOS エンジニア
  - アカウント
    - X: @ikuraikuraaaaaa
    - GitHub: @suguruTakahashi-1234
  - 技術
    - Swift, iOS, IoT

---

## 話すこと

- Clean Architecture を使って iOS アプリを爆速でビルドする方法
  - → Framework-Independent Architecture (FIA) の紹介
- リアーキテクチャの実演
  - MV
  - MVP (MVVM)
  - Clean Architecture
  - FIA

---

## 話さないこと

- Clean Architecture の詳細

---

<!-- _class : lead invert-->

# iOS アプリ開発における<br>現状のアーキテクチャ候補

---

## 大きくこれらの 3 パターンに分けられる

- Layered Architecture 系 (MVVM, MVP, VIPER)
  - → View と ビズネスロジック の分離
- Redux 系 (TCA, ReSwift)
  - → 単方向データフロー
- Clean Architecture 系 (VIPER)
  - → 内側方向への依存性の統一、依存性の逆転原則、関心事の分離

---

<!-- _class : lead invert-->

![](./assets/drawio/architecture_venn_diagram_delete_fia.drawio.svg)

### iOS アプリ開発 アーキテクチャ パターン

---

<!-- _class : lead invert-->

![](./assets/drawio/architecture_venn_diagram.drawio.svg)

### 今回、紹介する FIA は Clean Architecture 系 である

---

<!-- _class : lead invert-->

## Framework-Independent Architecture とは

### F = Framework Layer = Framework 層に
### I = Independent = 非依存な
### A = Architecture = アーキテクチャ

## → Framework 層に 非依存な アーキテクチャ

---

<!-- _class : lead invert-->

# Framework Layer ?

---

## Framework Layer ?

- Clean Architecture の<br>最も外側の層
- Data Access Layer や<br>Infrastructure Layer とも<br>呼ばれる
- iOS アプリ開発においては<br>3rd パーティー製 SDK や<br>ギークな処理を扱う層

※ 一般的な用語ではない

![bg right 100%](./assets/images/clean_architecture.jpg)

---

## FIA を採用する目的

- **Xcode ビルド時間の短縮**
  - テスト、Previews も対象
- Clean Architecture のメリットの享受
  - 独立性
  - テスタビリティー
  - メンテナビリティー
  - etc...

---

## FIA 概略

![bg contain](./assets/drawio/architecture_outline.drawio.svg)

---

<!-- _class : lead invert-->

## Clean Architecture 円との比較

![bg contain 80%](./assets/images/clean_architecture.jpg)
![bg contain 80%](./assets/drawio/architecture_circle.drawio.svg)

### <br><br><br><br><br><br><br>本質的に両者は同じことを表している

---

<!-- _class : lead invert-->

# リアーキテクチャの実演

---

## MV

- メリット✨
  - シンプル
- デメリット⚠️
  - ビジネスロジックのテストができない
- テスト🧪
  - 🆕 XCUITest での UI テスト
  - 🆕 Previews での View の確認

---

## MVP (MVVM) (Not Repository Pattern)

- メリット✨
  - View とビジネスロジックの分離
  - ビジネスロジックのテスト可能
- デメリット⚠️
  - Previews で View のバリエーションを増やすのが難しい
- テスト🧪
  - 🆕 Presenter (ViewModel) のビジネスロジックのテスト

---

## MVP (MVVM) + Repository Pattern

- メリット✨
  - ビジネスロジックとデータアクセスの分離
  - モックによるデータの差し替えが可能
  - データアクセスロジックのテストが可能
- デメリット⚠️
  - View→Presenter での Repository (Driver) のバケツリレーの発生
- テスト🧪
  - 🆕 Previews でのモックを使ったバリエーションテスト
  - 🆕 Repository (Driver) のデータアクセスロジックの単体テスト

---

## Clean Architecture

- メリット✨
  - Presentation 層 (View, Presenter (ViewModel)) が、　Framework 層 (Repository (Driver)) に非依存になる
    - → 3rd パーティー製ライブラリの乗換えによる影響が限定的
- デメリット⚠️
  - Domain Entity の定義の発生
- テスト🧪
  - Clean Architecture に変更しても MVP (MVVM) + Repository Pattern から追加で実施できるテストは特にない

---

## Framework-Independent Architecture (FIA)

- メリット✨
  - Framework 層に非依存なアプリ/モジュールのビルドの高速化
- デメリット⚠️
  - Application 層からの Repository (Driver) のバケツリレーの発生
    - → DI Container の導入で解決
- テスト🧪
  - Framework 層に非依存なアプリの XCUITest の高速化

---

<!-- _class : lead invert-->

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 24px; }
</style>

## FIA で可能なテスト

| Test Type  | DI Container  |    Test Target:     |                   |           |            |        |
| ---------- | :-----------: | :-----------------: | :---------------: | :-------: | :--------: | :----: |
|            |               | View<br>Interaction | View<br>Variation | Presenter | Interactor | Driver |
| XCUITest   | Actual / Mock |          ◎          |         ◯         |     ◯     |     ◯      | ◯ / -  |
| Previews   |     Mock      |          -          |         ◎         |     ◯     |     ◯      |   -    |
| Presenter  | Actual / Mock |          -          |         -         |     ◎     |     ◯      | ◯ / -  |
| Interactor | Actual / Mock |          -          |         -         |     -     |     ◎      | ◯ / -  |
| Driver     |    Actual     |          -          |         -         |     -     |     -      |   ◎    |


#### → 各テストがどの範囲をカバーするかが明確

---


## FIA の実装課題とその解決策

- protocol の any → some とする場合、型解決が複雑になる
- アーキテクチャ実現のための、多くのボイラーコードが必要
- モック用の DI Container の準備が手間になる
- View のテスト制約
  - XCUITest: 長い実行時間、低いメンテナンス性
  - Previews: 目視確認が必要、エラーが自動的には検出されない

### → Sourcery、Mockolo、PreviewSnapshots の導入

---

## FIA の実装を助けるライブラリの紹介

- [Sourcery](https://github.com/krzysztofzablocki/Sourcery)
  - 繰り返しとなるボイラーコードの自動生成
- [Mockolo](https://github.com/uber/mockolo)
  - モック用の DI Container の自動生成
  - typealias での some protocol の型解決にも対応
- [PreviewSnapshots](https://github.com/doordash-oss/swiftui-preview-snapshots)
  - Previews のコードをスナップショットテストとして転用可能

これらのライブラリを採用したリポジトリを公開:
https://github.com/suguruTakahashi-1234/fia-practical-sample

---

## まとめ

---

<!-- _class : lead invert-->

# Thank You!

```

---

## 🤖 アシスタント
*2024/04/23 16:03:16*

以下は、プレゼンテーションのまとめ章として提案するテキストです。このセクションでは、話された主要なポイントを強調し、聴衆に持ち帰ってほしい核心的なメッセージを繰り返します。

---

&lt;!-- _class : lead invert--&gt;

## まとめ

### Framework-Independent Architecture (FIA) の紹介

本日は、iOSアプリ開発においてClean Architectureを適用し、その拡張としてFramework-Independent Architecture（FIA）について解説しました。FIAはFramework層に依存しないことで、アプリケーションの独立性とテスタビリティ、メンテナンス性を高めることが可能です。

### 主要なアーキテクチャパターン

- **Layered Architecture 系**：MVVM, MVP, VIPERなど
- **Redux 系**：TCA, ReSwiftなど
- **Clean Architecture 系**：VIPERなど
- **新提案：FIA**

### FIAの実装と利点

FIAの導入により、ビルド時間の短縮という具体的な改善が見込めます。また、プレゼンテーション層がFramework層に非依存となることで、外部ライブラリの変更や更新が他の層に与える影響を最小限に抑えることが可能です。

### 実装の課題と解決策

実装中に遭遇する可能性のある課題に対しては、Sourcery、Mockolo、PreviewSnapshotsといったツールを利用して解決する方法を紹介しました。これにより、ボイラーコードの生成、モックの準備、そしてスナップショットテストが容易になります。

### 終わりに

FIAを導入することで、iOSアプリの開発プロセスがどのように変化し、どのような利点があるかを理解していただけたかと思います。今後のアプリ開発において、このアーキテクチャがより良い選択肢となることを願っています。

---

&lt;!-- _class : lead invert--&gt;

# ご清聴ありがとうございました！

---

このまとめ章は、プレゼンテーションの締めくくりとして、聴衆が持ち帰るべき要点を再度強調することで、内容の理解と記憶を促進します。

---

## 👤 ユーザー
*2024/04/23 16:06:39*

他の --- で区切られているように marp になっていて、5行ぐらいしか書けないのでそれを考慮してほしい

---

## 🤖 アシスタント
*2024/04/23 16:06:56*

承知しました。Marpプレゼンテーションに合わせて、まとめの章を簡潔にまとめた形で再構成します。

---

&lt;!-- _class : lead invert--&gt;

## まとめ

Framework-Independent Architecture（FIA）を用いることで、iOSアプリの独立性、テスタビリティ、メンテナンス性を向上させます。また、ビルド時間の短縮も実現可能です。FIAの導入には、SourceryやMockoloなどのツールが有効です。

---

この形式であれば、Marpでのスライド表示に最適化され、視覚的にもすっきりとした印象を与えることができます。

---

## 👤 ユーザー
*2024/04/23 16:07:01*

箇条書きでまとめてほしい

---

## 🤖 アシスタント
*2024/04/23 16:07:18*

了解しました。以下は、Marpプレゼンテーション用の箇条書き形式で簡潔にまとめた章です。

---

&lt;!-- _class : lead invert--&gt;

## まとめ

- **FIAの導入**: Clean Architectureを基に、iOSアプリの独立性とメンテナンス性を向上。
- **ビルド時間の短縮**: Framework層に非依存にすることで、ビルドプロセスが高速化。
- **ツールの活用**: Sourcery、Mockoloを利用し、実装の効率化とテストの容易化を実現。

---

この形式でプレゼンテーションの要点を簡潔にまとめ、視覚的にも整理しやすくなっています。

---

## 👤 ユーザー
*2024/04/23 16:07:44*

あと2つぐらい箇条書きの項目を増やしてほしい

```
---
marp: true
theme: gaia
class: invert
---

<!-- _class : lead invert-->

## Framework-Independent Architecture (FIA)
#### - Clean Architecture で iOS アプリを爆速でビルドする -

2024/04/25

---

<!-- paginate: true -->

![bg right:35%](./assets/images/account.jpg)

## 自己紹介

- 高橋 俊
  - iOS エンジニア
  - アカウント
    - X: @ikuraikuraaaaaa
    - GitHub: @suguruTakahashi-1234
  - 技術
    - Swift, iOS, IoT

---

## 話すこと

- Clean Architecture を使って iOS アプリを爆速でビルドする方法
  - → Framework-Independent Architecture (FIA) の紹介
- リアーキテクチャの実演
  - MV
  - MVP (MVVM)
  - Clean Architecture
  - FIA

---

## 話さないこと

- Clean Architecture の詳細

---

<!-- _class : lead invert-->

# iOS アプリ開発における<br>現状のアーキテクチャ候補

---

## 大きくこれらの 3 パターンに分けられる

- Layered Architecture 系 (MVVM, MVP, VIPER)
  - → View と ビズネスロジック の分離
- Redux 系 (TCA, ReSwift)
  - → 単方向データフロー
- Clean Architecture 系 (VIPER)
  - → 内側方向への依存性の統一、依存性の逆転原則、関心事の分離

---

<!-- _class : lead invert-->

![](./assets/drawio/architecture_venn_diagram_delete_fia.drawio.svg)

### iOS アプリ開発 アーキテクチャ パターン

---

<!-- _class : lead invert-->

![](./assets/drawio/architecture_venn_diagram.drawio.svg)

### 今回、紹介する FIA は Clean Architecture 系 である

---

<!-- _class : lead invert-->

## Framework-Independent Architecture とは

### F = Framework Layer = Framework 層に
### I = Independent = 非依存な
### A = Architecture = アーキテクチャ

## → Framework 層に 非依存な アーキテクチャ

---

<!-- _class : lead invert-->

# Framework Layer ?

---

## Framework Layer ?

- Clean Architecture の<br>最も外側の層
- Data Access Layer や<br>Infrastructure Layer とも<br>呼ばれる
- iOS アプリ開発においては<br>3rd パーティー製 SDK や<br>ギークな処理を扱う層

※ 一般的な用語ではない

![bg right 100%](./assets/images/clean_architecture.jpg)

---

## FIA を採用する目的

- **Xcode ビルド時間の短縮**
  - テスト、Previews も対象
- Clean Architecture のメリットの享受
  - 独立性
  - テスタビリティー
  - メンテナビリティー
  - etc...

---

## FIA 概略

![bg contain](./assets/drawio/architecture_outline.drawio.svg)

---

<!-- _class : lead invert-->

## Clean Architecture 円との比較

![bg contain 80%](./assets/images/clean_architecture.jpg)
![bg contain 80%](./assets/drawio/architecture_circle.drawio.svg)

### <br><br><br><br><br><br><br>本質的に両者は同じことを表している

---

<!-- _class : lead invert-->

# リアーキテクチャの実演

---

## MV

- メリット✨
  - シンプル
- デメリット⚠️
  - ビジネスロジックのテストができない
- テスト🧪
  - 🆕 XCUITest での UI テスト
  - 🆕 Previews での View の確認

---

## MVP (MVVM) (Not Repository Pattern)

- メリット✨
  - View とビジネスロジックの分離
  - ビジネスロジックのテスト可能
- デメリット⚠️
  - Previews で View のバリエーションを増やすのが難しい
- テスト🧪
  - 🆕 Presenter (ViewModel) のビジネスロジックのテスト

---

## MVP (MVVM) + Repository Pattern

- メリット✨
  - ビジネスロジックとデータアクセスの分離
  - モックによるデータの差し替えが可能
  - データアクセスロジックのテストが可能
- デメリット⚠️
  - View→Presenter での Repository (Driver) のバケツリレーの発生
- テスト🧪
  - 🆕 Previews でのモックを使ったバリエーションテスト
  - 🆕 Repository (Driver) のデータアクセスロジックの単体テスト

---

## Clean Architecture

- メリット✨
  - Presentation 層 (View, Presenter (ViewModel)) が、　Framework 層 (Repository (Driver)) に非依存になる
    - → 3rd パーティー製ライブラリの乗換えによる影響が限定的
- デメリット⚠️
  - Domain Entity の定義の発生
- テスト🧪
  - Clean Architecture に変更しても MVP (MVVM) + Repository Pattern から追加で実施できるテストは特にない

---

## Framework-Independent Architecture (FIA)

- メリット✨
  - Framework 層に非依存なアプリ/モジュールのビルドの高速化
- デメリット⚠️
  - Application 層からの Repository (Driver) のバケツリレーの発生
    - → DI Container の導入で解決
- テスト🧪
  - Framework 層に非依存なアプリの XCUITest の高速化

---

<!-- _class : lead invert-->

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 24px; }
</style>

## FIA で可能なテスト

| Test Type  | DI Container  |    Test Target:     |                   |           |            |        |
| ---------- | :-----------: | :-----------------: | :---------------: | :-------: | :--------: | :----: |
|            |               | View<br>Interaction | View<br>Variation | Presenter | Interactor | Driver |
| XCUITest   | Actual / Mock |          ◎          |         ◯         |     ◯     |     ◯      | ◯ / -  |
| Previews   |     Mock      |          -          |         ◎         |     ◯     |     ◯      |   -    |
| Presenter  | Actual / Mock |          -          |         -         |     ◎     |     ◯      | ◯ / -  |
| Interactor | Actual / Mock |          -          |         -         |     -     |     ◎      | ◯ / -  |
| Driver     |    Actual     |          -          |         -         |     -     |     -      |   ◎    |


#### → 各テストがどの範囲をカバーするかが明確

---


## FIA の実装課題とその解決策

- protocol の any → some とする場合、型解決が複雑になる
- アーキテクチャ実現のための、多くのボイラーコードが必要
- モック用の DI Container の準備が手間になる
- View のテスト制約
  - XCUITest: 長い実行時間、低いメンテナンス性
  - Previews: 目視確認が必要、エラーが自動的には検出されない

### → Sourcery、Mockolo、PreviewSnapshots の導入

---

## FIA の実装を助けるライブラリの紹介

- [Sourcery](https://github.com/krzysztofzablocki/Sourcery)
  - 繰り返しとなるボイラーコードの自動生成
- [Mockolo](https://github.com/uber/mockolo)
  - モック用の DI Container の自動生成
  - typealias での some protocol の型解決にも対応
- [PreviewSnapshots](https://github.com/doordash-oss/swiftui-preview-snapshots)
  - Previews のコードをスナップショットテストとして転用可能

これらのライブラリを採用したリポジトリを公開:
https://github.com/suguruTakahashi-1234/fia-practical-sample

---

## まとめ

---

<!-- _class : lead invert-->

# Thanks!

```

---

## 🤖 アシスタント
*2024/04/23 16:08:08*

了解しました。以下は、Marpプレゼンテーション用のまとめ章に追加するための箇条書き項目です。

---

&lt;!-- _class : lead invert--&gt;

## まとめ

- **FIAの導入**: Clean Architectureを基に、iOSアプリの独立性とメンテナンス性を向上。
- **ビルド時間の短縮**: Framework層に非依存にすることで、ビルドプロセスが高速化。
- **ツールの活用**: Sourcery、Mockoloを利用し、実装の効率化とテストの容易化を実現。
- **DIコンテナの導入**: アプリケーション層の柔軟性を保ちながら依存性管理を効率化。
- **テストの最適化**: FIAによるテストプロセスの加速と、XCUITestの実行時間の短縮。

---

これで、プレゼンテーションの核心的なメッセージとFIAの主要な利点がまとめられています。

---

## 👤 ユーザー
*2024/04/23 16:08:47*

FIA の紹介にもっとフォーカスしてほしい

---

## 🤖 アシスタント
*2024/04/23 16:09:13*

了解しました。FIAの紹介に特化したまとめを以下のように簡潔にまとめます。

---

&lt;!-- _class : lead invert--&gt;

## FIAの重要ポイント

- **非依存性**: FIAはFramework層に依存しないことで、アーキテクチャの柔軟性と独立性を保証します。
- **高速ビルド**: Framework層の変更がアプリ全体に影響を与えないため、ビルド時間が大幅に短縮されます。
- **テストの効率化**: テストプロセスが独立しているため、XCUITestなどのUIテストが迅速に実施可能。
- **維持管理の容易さ**: FIAによるクリアな依存関係と層の分離が、アプリのメンテナンスを容易にします。
- **拡張性**: 新しいフレームワークやライブラリへの移行が容易で、将来的な技術的変更に柔軟に対応可能。

---

このまとめはFIAの核心的な概念とその利点を強調し、聴衆に明確な理解を促します。

---

## 👤 ユーザー
*2024/04/23 16:09:25*

FIAのまとめというよりはこのスライドをまとめてほしいんだ

---

## 🤖 アシスタント
*2024/04/23 16:09:55*

了解しました。プレゼンテーション全体の内容をまとめる形で、FIAを中心に据えたスライドのまとめを作成します。

---

&lt;!-- _class : lead invert--&gt;

## まとめ

- **FIAの紹介**: Clean Architectureを拡張し、iOSアプリの独立性と効率を高めるアーキテクチャです。
- **主要な利点**:
  - ビルド時間の短縮: Framework層に依存しない構造により、開発プロセスが加速。
  - テスタビリティの向上: 独立したテストが可能で、迅速なフィードバックループを提供。
  - 維持管理の容易さ: クリアな層分けがアップデートや修正を簡素化。
- **実装の課題とツール**:
  - 課題: ボイラーコードの増加、DIコンテナの複雑化。
  - 解決策: Sourcery、Mockoloなどの自動化ツールを利用。

---

このまとめは、プレゼンテーションで扱ったFIAの重要性と具体的な実装のポイントを再確認し、聴衆が主要なメッセージを把握しやすくします。

---
