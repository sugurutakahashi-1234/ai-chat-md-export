# Swift vs Dart TypeScript

日付: 2025-07-01

---

## 👤 ユーザー
*2025/7/2 0:41:39*

Swiftでは簡単に表現できるがDartやTypeScriptだと表現するのが大変な記述は？

---

## 🤖 アシスタント
*2025/7/2 0:41:41*

以下では “Swift だとほぼワンライナーで書けるのに、Dart や TypeScript では回りくどい／冗長になりがちな代表的な構文・仕組み” を、簡潔なコード例とともに並べてみました。  
（★は “特に差が大きい” と感じるものです）

---

### 1. ★ 関連値付き `enum` ＋網羅的パターンマッチ

| Swift | Dart / TypeScript |
|-------|------------------|
| ```swift<br>enum NetworkError: Error {<br>    case timeout(seconds: Int)<br>    case http(statusCode: Int, body: Data)<br>}<br>```<br>➡︎ `switch` が** Exhaustive** でコンパイラが漏れを検出。 | **Dart 3** の sealed class でも書けるが、<br>```dart<br>sealed class NetworkError {<br>  const NetworkError();<br>}<br>class Timeout extends NetworkError {<br>  final int seconds;<br>  const Timeout(this.seconds);<br>}<br>class Http extends NetworkError {<br>  final int statusCode;<br>  final Uint8List body;<br>  const Http(this.statusCode, this.body);<br>}<br>```<br>クラスを 2 つ作る必要。<br><br>**TypeScript** は discriminated union で近いことができるが、列挙体としての一貫性が薄く、`switch` 漏れ検出は `--strictNullChecks` と `never` を駆使する必要あり。 |

---

### 2. ★ `protocol` の `associatedtype` ＋条件付き適合

| Swift | Dart / TypeScript |
|-------|------------------|
| ```swift<br>protocol Repository {<br>    associatedtype Entity<br>    func fetch(id: UUID) async throws -> Entity<br>}<br><br>struct UserRepository: Repository {<br>    func fetch(id: UUID) async throws -> User { … }<br>}<br>```<br>→ 実装側は **“型実装が決める”**。<br><br>さらに：<br>```swift<br>extension Array: Equatable where Element: Equatable {}<br>``` | **Dart** ではジェネリック型引数で代用できるが、<br>```dart<br>abstract interface class Repository<T> {<br>  Future<T> fetch(String id);<br>}<br>```<br>呼び出し側が型を指定し続ける必要があり、“適合条件付き拡張（where 句）”は言語仕様にない。<br><br>**TypeScript** も同様にジェネリックで書けるが、条件付き適合（`where Element: Equatable` 相当）を表現できず、ユーティリティ型で手当てするしかない。 |

---

### 3. ★ プロパティラッパー（`@propertyWrapper`）

| Swift | Dart / TypeScript |
|-------|------------------|
| ```swift<br>@propertyWrapper<br>struct Clamped<Value: Comparable> {<br>    private var value: Value<br>    var range: ClosedRange<Value><br>    var wrappedValue: Value {<br>        get { value }<br>        set { value = min(max(newValue, range.lowerBound), range.upperBound) }<br>    }<br>    init(wrappedValue: Value, _ range: ClosedRange<Value>) {<br>        self.value = wrappedValue<br>        self.range = range<br>    }<br>}<br><br>struct Player {<br>    @Clamped(0...100) var hp = 100<br>}<br>``` | **Dart**：`@` は metadata 用だが変数ラッパー機構はないので、<br>- 生成マクロ & カスタム getter/setter を手書きする<br>- もしくはコード生成（`build_runner`）<br><br>**TypeScript**：デコレータで似たことは可能。ただし class field decorators はまだ Stage 3、初期化ロジックや代入フックは verbose になりがち。 |

---

### 4. DSL を実現する `@resultBuilder`

| Swift | Dart / TypeScript |
|-------|------------------|
| SwiftUI / Swift-Macro-DSL の核。<br>```swift<br>@resultBuilder<br>struct HTMLBuilder { … }<br><br>@HTMLBuilder<br>func page() -> Node {<br>  html {<br>    body {<br>      h1("Hello")<br>    }<br>  }<br>}<br>``` | **Dart**：コード生成マクロ（experimental）で再現可能だが実装ハードル高。<br><br>**TypeScript**：template literal か JSX を使うのが一般的で、コンパイラ拡張は不可。 |

---

### 5. キーパス（`KeyPath`）の静的安全性

| Swift | Dart / TypeScript |
|-------|------------------|
| ```swift<br>let nameKey = \User.name<br>users.map { $0[keyPath: nameKey] }<br>```<br>コンパイル時に安全。 | **Dart**：`(User u) => u.name` の関数を渡すのが定番。リフレクションやシンボルは遅い。<br><br>**TypeScript**：`keyof` と文字列リテラルで近いことはできるが、実行時はただのプロパティ名文字列。 |

---

### 6. 自動合成 & 省ボイラープレート

| Swift | Dart / TypeScript |
|-------|------------------|
| - `Codable` / `Equatable` / `Hashable` / `Sendable` の自動合成<br>- `enum CaseIterable`<br>→ `struct`/`enum` に適合宣言するだけ。 | **Dart**：`json_serializable`, `freezed` などジェネレーター依存。<br><br>**TypeScript**：コード生成せずランタイムで解決する文化なので、`class-transformer` 等を使うか plain object をハンドリングするしかない。 |

---

### 7. Concurrency: `async let`, `actors`, `Sendable`

Swift の**構造化並行**は文法組み込み。  
Dart は `async/await` + isolate、TypeScript は JS の非同期モデル（Web Worker）に依存し、スレッドセーフ保証はコンパイラ層にない。

---

## まとめ

| Swift で “楽” なもの | Dart / TypeScript での状態 |
|----------------------|----------------------------|
| 代数的データ型 (Enum + associated value) | Sealed class / discriminated union を手書き |
| Protocol + associatedtype / 条件付き適合 | ジェネリック相当＋制約表現が弱い |
| PropertyWrapper | マクロ or デコレータで擬似実装 |
| Result Builder | コード生成 or テンプレート文字列 |
| KeyPath | 高速安全な代替なし |
| 自動 `Codable` 等 | 外部ジェネレータ依存 |
| 構造化並行 (actor 等) | Isolate / Promise で近似、型安全保証は弱い |

---

### もう少し深掘りしたい場合

- **実務で遭遇する具体例**（たとえば「型付き Redux reducer を enum で書きたい」など）を挙げていただければ、Dart / TS での実装パターンとボイラープレート削減テクも合わせて紹介できます。  
- 逆に **Dart/TypeScript が得意で Swift が冗長** なケース（メタプログラミング、ランタイム型操作など）も気になるようでしたらお知らせください！

---

## 👤 ユーザー
*2025/7/2 0:44:50*

それらに比べてKotlinはどうだろうか？

---

## 🤖 アシスタント
*2025/7/2 0:45:22*

### Kotlin の「書きやすさポジション」は Swift ↔ Dart/TypeScript の \*\*中間よりやや Swift 寄り\*\*

| 以前挙げた項目 | Kotlin での表現力 | コメント |
|---|---|---|
| \*\*1. 関連値付き enum ＋網羅的パターンマッチ\*\* | \*\*◎\*\* `sealed class / interface` + `data class` サブクラス化で実現。`when` は exhaustiveness をコンパイル時チェック (else 不要) citeturn3search0 | 生成コードは Swift より 2–3 行多いが、Dart/TS の boiler-plate よりは圧倒的に少ない。 |
| \*\*2. `associatedtype` 相当 & 条件付き適合\*\* | \*\*○▲\*\* ジェネリック＋`where` 制約で大半は書けるが、\*\*型ごとに実装を変える\*\* “真の associatedtype” には届かず。\*\*条件付き適合\*\*も拡張関数レベル止まりで、Swift ほど自在ではない。 |
| \*\*3. PropertyWrapper\*\* | \*\*◎\*\* `property delegates`（`by Delegates.observable` など）として標準機能で提供 citeturn1search0。独自 delegate も 1 ファイルで書け、Swift とほぼ同等の簡潔さ。 |
| \*\*4. Result Builder / DSL\*\* | \*\*◎\*\* ラムダ \*\*with receiver\*\* + `@DslMarker` に加え、近年 \*\*context receivers → context parameters\*\* が正式採用され DSL がさらに簡潔に citeturn2search1turn0search7。HTML DSL などは kotlinx.html が実例。 |
| \*\*5. KeyPath 的参照\*\* | \*\*○\*\* プロパティ参照 `User::name` は型安全。ただし実行時には `KProperty` 反射オブジェクトで、Swift の `KeyPath` ほどゼロコストではない。 |
| \*\*6. 自動合成\*\* | \*\*◎\*\* `data class` が `equals / hashCode / copy / toString` を自動生成。JSON も `kotlinx.serialization`（プラグインだけで完結）。Swift の `Codable` にかなり近い体験。 |
| \*\*7. 構造化並行 & Actor\*\* | \*\*◎\*\* コルーチンは \*\*言語＋標準ライブラリ\*\*で一体化。Kotlin 2.x で \*\*structured concurrency\*\* が正式ドキュメント化 citeturn0search2。スレッドセーフ保証（`Sendable` 相当）は無いが、`CoroutineScope` によるキャンセル木で安全性を確保。 |

---

## まとめ：Kotlin が優位なポイント / 物足りないポイント

### Swift とほぼ互角・あるいは勝る

1. \*\*DSL 構築\*\*  
   - `context parameters` により依存解決も簡潔。  
2. \*\*プロパティラッパー相当\*\*  
   - `observable`, `vetoable`, `lazy` などが標準で充実。  
3. \*\*コルーチン\*\*  
   - クロスプラットフォーム（JVM/Native/Wasm/JS）で統一 API。  

### Swift にまだ及ばない

1. \*\*Associated Type & Conditional Conformance\*\*  
   - “実装側が決める関連型” を表せず、拡張にも where 句が付けられない。  
2. \*\*ゼロコスト KeyPath\*\*  
   - リフレクション経由なのでランタイムコストは避けられない。  
3. \*\*コンパイラ保証付きスレッドセーフ\*\* (`Sendable`)  
   - 現状は設計／コードレビューで担保する必要がある。  

### Dart / TypeScript との比較

| 観点 | Kotlin vs Dart | Kotlin vs TypeScript |
|---|---|---|
| \*\*ボイラープレート量\*\* | ほぼ同数行かやや少ない | 明らかに少ない（TS は型情報と実装を二重に書く場面が多い） |
| \*\*非同期モデル\*\* | コルーチンが優勢（isolate 依存より柔軟） | コルーチン API が Promise チェーンより読みやすい |
| \*\*高速マクロ／コード生成依存度\*\* | 小さい（標準言語機能で完結） | 小さい（TS はデコレータや AST 変換が未標準） |

---

### 実務での選定ヒント

- \*\*UI DSL を多用する Android / Compose Multiplatform\*\* → Kotlin は Swift と同じ感覚で DSL を書ける。  
- \*\*複雑なエラー型（関連値 enum）\*\* を共有したい場合 → Kotlin の sealed class が Dart/TS より手間が少なく、Swift 移植もスムーズ。  
- \*\*高度なジェネリクス依存ライブラリ\*\* を書く場合 → Swift のほうが still 有利。Kotlin だけで完結させるなら設計を多少妥協。  

&gt; 「Swift ほぼそのままのエレガンスで書けるが、型レベルメタプログラミングの頂点は Swift が一歩リード」── これが Kotlin の現在地と言えます。

---

## 👤 ユーザー
*2025/7/2 0:46:46*

逆にTypeScriptやDartが得意でSwiftが苦手な記述

---

## 🤖 アシスタント
*2025/7/2 0:46:47*

## TypeScript / Dart でラクに書けるのに Swift だと冗長・難しい代表例

| # | パターン | **TypeScript** (or **Dart**) | **Swift での状況** |
|---|----------|-----------------------------|--------------------|
| 1 | **構造的（“ダック”）型チェック** | ```ts\nfunction showName(p: { first: string; last: string }) {\n  console.log(`${p.first} ${p.last}`);\n}\n\n// 別ファイルで勝手に同じ形を作れば即適合\nconst user = { first: 'Ada', last: 'Lovelace', age: 36 };\nshowName(user); // OK\n``` | Swift は**名義的**（nominal）型。<br>```swift\nstruct Person { let first: String; let last: String }\nfunc showName(_ p: Person) { … }\n\nlet user = (first: \"Ada\", last: \"Lovelace\", age: 36)\nshowName(user) // ❌ 同じプロパティでも別型\n```<br>→ 変換用イニシャライザや `protocol` を挟む必要がある。 |
| 2 | **条件付き & マッピング型で “型を計算”** | ```ts\n// T の全プロパティを必須→オプショナルに\n type DeepPartial<T> = {\n   [K in keyof T]?: DeepPartial<T[K]>;\n };\n\n type User = { id: string; profile: { name: string } };\n type UserPatch = DeepPartial<User>; // ネストも自動で ?\n``` | Swift のジェネリクスは **型パラメータを“受け取る”だけ**。<br>型同士を演算して新しい型を返すメタプログラミングは（現状マクロを駆使しても）困難。 |
| 3 | **テンプレートリテラル型 (TS ≥4.1)**<br>文字列をパースして型安全 URL 生成 | ```ts\n// '/users/:id/tasks/:taskId' から { id: string; taskId: string } を抽出\n type Params<S extends string> =\n   S extends `${infer _Start}:${infer P}/${infer Rest}`\n     ? { [K in P | keyof Params<`/${Rest}`>]: string }\n     : S extends `${infer _Start}:${infer P}`\n       ? { [K in P]: string }\n       : {};\n\nfunction buildPath<T extends string>(s: T, p: Params<T>) { … }\n\nbuildPath('/users/:id/tasks/:taskId', { id: '1', taskId: '42' }); // 型安全\n``` | 文字列リテラルを**型レベルで分解**する手段がない。<br>正規表現 or 手動 enum ＆ switch で対応。 |
| 4 | **ランタイムリフレクション & 動的プロパティアクセス** | ```ts\nfunction dump(obj: any) {\n  for (const [k,v] of Object.entries(obj)) {\n    console.log(k, v);\n  }\n}\n``` | `Mirror(reflecting:)` はあるが遅く & 使いにくい。<br>JSON パース後の `Any` → 型判定も追加コードが多い。 |
| 5 | **デコレータ／アノテーション駆動 DI & ORM** | **TypeScript**<br>```ts\n@Entity()\nclass Post {\n @PrimaryGeneratedColumn()\n id!: number;\n\n @Column()\n title!: string;\n}\n```<br>**Dart**<br>```dart\n@JsonSerializable()\nclass User { final String name; User(this.name);\n factory User.fromJson(Map<String,dynamic> j) => _$UserFromJson(j);\n}\n``` | Swift の `@` は **属性 or propertyWrapper** に限定され、<br>- リフレクションでメタ情報取得不可<br>- コード生成パイプラインもまだ限定的 (Swift Macro)<br>→ Vapor / Fluent などでも手書きが多い。 |
| 6 | **ミックスインに “実データ” を含められる**<br>(Dart) | ```dart\nmixin Timestamped {\n  DateTime created = DateTime.now();\n}\nclass Log with Timestamped {}\n``` | Swift の `protocol` `+ extension` では **stored property を持てない**。<br>`class` 継承やラップ構造を作る必要あり。 |
| 7 | **カスケード演算子 (`..`)** (Dart) | ```dart\nfinal button = Button()\n  ..text = 'OK'\n  ..size = 20\n  ..onClick = handle;\n``` | 丸ごと mutable コピーしながら “連続設定” する構文はなし。<br>毎行 `button.text = …`。 |
| 8 | **動的インポート & 環境分割** | ```ts\nif (import.meta.env.DEV) {\n  const { worker } = await import('./mocks');\n  worker.start();\n}\n``` | Swift Package Manager は **条件付き依存解決はビルド設定任せ**。動的ロードは `dlopen` を介すかファイル IO レイヤで実装。 |

---

### ざっくり傾向

| 領域 | TypeScript / Dart が強い理由 | Swift が弱く見える理由 |
|------|------------------------------|------------------------|
| **動的・構造的型** | *“形が合えば OK”* 文化。ランタイム JS / VM の柔軟性。 | 名義的型＋静的レイアウトで最適化重視。 |
| **型レベルメタプログラミング** | テンプレートリテラル型・条件型など **T → T’** 演算が豊富。 | ジェネリクスは *引数* としての型しか扱えない。 |
| **リフレクション & アノテーション** | ECMAScript / Dart VM がメタデータ API 提供。 | ABI 安定化優先でリフレクション機能は制限。 |
| **コード生成ワークフロー** | ts-transform・Babel・build_runner 等が定番で IDE も追随。 | Swift Macros が出たばかり & compile step 固定。 |

---

## まとめ

- **“型を計算・変形したい”**、**“JSON や DB スキーマをアノテーションで一発バインドしたい”** といったタスクは **TypeScript や Dart のほうが圧倒的に手数が少ない**。  
- Swift は **高速・安全性最優先** の設計ゆえ、動的／リフレクティブな魔法は控えめ。<br>そのぶん **可読性と実行時コストが明確** というトレードオフ。  
- プロジェクトで **頻繁にスキーマが変わる & 型を“生成”したい** 場面が多いなら、TypeScript／Dart を採用 or 併用する価値が高いです。

---
