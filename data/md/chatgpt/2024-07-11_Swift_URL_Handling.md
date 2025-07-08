# Swift URL Handling

日付: 2024-07-11

---

## 👤 ユーザー
*2024/07/11 19:57:44*

Swiftでapp://hoge?id=1やapp://moge?id=2を分岐して処理するコードをかいてほしい。他にも色々なパターンのurlが来る想定なのでswitch文だったり拡張性の高いコードで書いてほしい

---

## 🤖 アシスタント
*2024/07/11 19:58:06*

SwiftでカスタムURLスキームを処理するコードを以下のように記述できます。このコードでは、`switch`文を使用して各URLパターンを処理し、拡張性を考慮してコードを記述します。

まず、URLパターンを処理するためのヘルパー関数を定義し、各パターンごとに適切な処理を行います。

```swift
import Foundation

// Define an enum to handle different URL patterns
enum AppURL {
    case hoge(id: Int)
    case moge(id: Int)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let queryItems = components?.queryItems
        let id = queryItems?.first(where: { $0.name == "id" })?.value.flatMap(Int.init)

        switch host {
        case "hoge":
            if let id = id {
                self = .hoge(id: id)
            } else {
                self = .unknown
            }
        case "moge":
            if let id = id {
                self = .moge(id: id)
            } else {
                self = .unknown
            }
        default:
            self = .unknown
        }
    }
}

// Function to handle the URL
func handleAppURL(_ url: URL) {
    let appURL = AppURL(url: url)

    switch appURL {
    case .hoge(let id):
        handleHoge(id: id)
    case .moge(let id):
        handleMoge(id: id)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: Int) {
    print("Handle hoge with id: \(id)")
    // Add your logic here
}

func handleMoge(id: Int) {
    print("Handle moge with id: \(id)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1") {
    handleAppURL(url)
}

if let url = URL(string: "app://moge?id=2") {
    handleAppURL(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleAppURL(url)
}
```

このコードでは、`AppURL`という`enum`を定義しており、URLのパターンごとに異なるケースを持っています。`init(url:)`イニシャライザを使用してURLを解析し、パターンに応じて`enum`のケースを設定します。`handleAppURL(_:)`関数では、`switch`文を使用してURLパターンに応じた処理を呼び出します。これにより、異なるパターンのURLが来ても拡張しやすいコードとなっています。

---

## 👤 ユーザー
*2024/07/11 19:59:09*

id だけとは限らない。クエリパラメーターをいい感じに取得するメソッドなどは用意されていないのかは手間

---

## 🤖 アシスタント
*2024/07/11 19:59:32*

URLクエリパラメータを簡単に取得するための拡張を用意して、さらに汎用的なURL処理を行うようにコードを改良します。以下のようにURLクエリパラメータを辞書として取得できる拡張を追加し、各パラメータを柔軟に処理するコードを記述します。

### URLクエリパラメータを取得する拡張

```swift
import Foundation

// URLクエリパラメータを辞書として取得する拡張
extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum AppURL {
    case hoge(params: [String: String])
    case moge(params: [String: String])
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        switch host {
        case "hoge":
            self = .hoge(params: params)
        case "moge":
            self = .moge(params: params)
        default:
            self = .unknown
        }
    }
}

// Function to handle the URL
func handleAppURL(_ url: URL) {
    let appURL = AppURL(url: url)

    switch appURL {
    case .hoge(let params):
        handleHoge(params: params)
    case .moge(let params):
        handleMoge(params: params)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(params: [String: String]) {
    print("Handle hoge with params: \(params)")
    // Add your logic here
}

func handleMoge(params: [String: String]) {
    print("Handle moge with params: \(params)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleAppURL(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleAppURL(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleAppURL(url)
}
```

このコードでは、`URL`の拡張を使用してクエリパラメータを辞書として取得し、`AppURL`の`init(url:)`イニシャライザでその辞書を使用して適切なケースに分岐します。各ケースではクエリパラメータの辞書を受け取り、柔軟に処理を行えるようにしています。これにより、ID以外のクエリパラメータが含まれている場合でも容易に対応できるようになります。

---

## 👤 ユーザー
*2024/07/11 20:00:07*

いやわるくないんだけど、辞書型はなるべく使いたくない。連想値を持つ配列はいいと思った

---

## 🤖 アシスタント
*2024/07/11 20:00:32*

連想値を持つ配列を使用して、URLクエリパラメータを管理し、`switch`文を使用して各URLパターンを処理するようにコードを修正します。この方法では、クエリパラメータをより型安全に扱えます。

以下に、クエリパラメータを連想値を持つ配列で管理するコードを示します。

### URLクエリパラメータを構造体として取得する拡張

```swift
import Foundation

struct URLQueryParameter {
    let name: String
    let value: String
}

extension URL {
    var queryParameters: [URLQueryParameter] {
        var params = [URLQueryParameter]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { 
            if let value = $0.value {
                params.append(URLQueryParameter(name: $0.name, value: value))
            }
        }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum AppURL {
    case hoge(params: [URLQueryParameter])
    case moge(params: [URLQueryParameter])
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        switch host {
        case "hoge":
            self = .hoge(params: params)
        case "moge":
            self = .moge(params: params)
        default:
            self = .unknown
        }
    }
}

// Function to handle the URL
func handleAppURL(_ url: URL) {
    let appURL = AppURL(url: url)

    switch appURL {
    case .hoge(let params):
        handleHoge(params: params)
    case .moge(let params):
        handleMoge(params: params)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(params: [URLQueryParameter]) {
    print("Handle hoge with params:")
    for param in params {
        print("\(param.name): \(param.value)")
    }
    // Add your logic here
}

func handleMoge(params: [URLQueryParameter]) {
    print("Handle moge with params:")
    for param in params {
        print("\(param.name): \(param.value)")
    }
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleAppURL(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleAppURL(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleAppURL(url)
}
```

このコードでは、`URLQueryParameter`という構造体を使用してクエリパラメータを表現し、URLの拡張でクエリパラメータを取得します。これにより、各パラメータを連想値を持つ配列として管理でき、`switch`文で適切なケースに分岐して処理を行います。この方法により、辞書型を避けて型安全な方法でクエリパラメータを扱えます。

---

## 👤 ユーザー
*2024/07/11 20:02:11*

普通に

case hoge(id: String, name: String) などでもっていいよ

---

## 🤖 アシスタント
*2024/07/11 20:02:34*

以下のコードでは、URLクエリパラメータを直接連想値として持つように`AppURL`のケースを定義し、各URLパターンに応じてパラメータを取得して処理しています。

### URLクエリパラメータを取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum AppURL {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        switch host {
        case "hoge":
            if let id = params["id"], let name = params["name"] {
                self = .hoge(id: id, name: name)
            } else {
                self = .unknown
            }
        case "moge":
            if let id = params["id"], let type = params["type"] {
                self = .moge(id: id, type: type)
            } else {
                self = .unknown
            }
        default:
            self = .unknown
        }
    }
}

// Function to handle the URL
func handleAppURL(_ url: URL) {
    let appURL = AppURL(url: url)

    switch appURL {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleAppURL(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleAppURL(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleAppURL(url)
}
```

このコードでは、`AppURL`の`enum`を使用して、各URLパターンに応じたケースを定義し、必要なパラメータを連想値として持つようにしています。`init(url:)`イニシャライザでURLを解析し、必要なパラメータが存在する場合は適切なケースに分岐し、存在しない場合は`unknown`ケースに分岐します。各ケースに応じた処理は、対応する関数で行います。これにより、各URLパターンに対して型安全にパラメータを扱えるようになります。

---

## 👤 ユーザー
*2024/07/11 20:04:17*

CustomUrlSchema という enum に変更してほしい。

---

## 🤖 アシスタント
*2024/07/11 20:04:44*

以下のコードでは、`AppURL`を`CustomUrlSchema`に変更し、URLクエリパラメータを直接連想値として持つようにしています。

### URLクエリパラメータを取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        switch host {
        case "hoge":
            if let id = params["id"], let name = params["name"] {
                self = .hoge(id: id, name: name)
            } else {
                self = .unknown
            }
        case "moge":
            if let id = params["id"], let type = params["type"] {
                self = .moge(id: id, type: type)
            } else {
                self = .unknown
            }
        default:
            self = .unknown
        }
    }
}

// Function to handle the URL
func handleCustomUrl(_ url: URL) {
    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleCustomUrl(url)
}
```

このコードでは、`CustomUrlSchema`という`enum`を使用して、各URLパターンに応じたケースを定義し、必要なパラメータを連想値として持つようにしています。`init(url:)`イニシャライザでURLを解析し、必要なパラメータが存在する場合は適切なケースに分岐し、存在しない場合は`unknown`ケースに分岐します。各ケースに応じた処理は、対応する関数で行います。これにより、各URLパターンに対して型安全にパラメータを扱えるようになります。

---

## 👤 ユーザー
*2024/07/11 20:05:38*

init の処理が長くなるので、private var などに分けてほしい

---

## 🤖 アシスタント
*2024/07/11 20:06:07*

`init(url:)`の処理が長くならないように、必要な部分をプライベートメソッドに分けて整理します。以下のコードでは、クエリパラメータを取得するメソッドとURLのホスト名をチェックするメソッドに分割しています。

### URLクエリパラメータを取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        self = CustomUrlSchema.processHost(host: host, params: params)
    }

    private static func processHost(host: String, params: [String: String]) -> CustomUrlSchema {
        switch host {
        case "hoge":
            return processHoge(params: params)
        case "moge":
            return processMoge(params: params)
        default:
            return .unknown
        }
    }

    private static func processHoge(params: [String: String]) -> CustomUrlSchema {
        if let id = params["id"], let name = params["name"] {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [String: String]) -> CustomUrlSchema {
        if let id = params["id"], let type = params["type"] {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }
}

// Function to handle the URL
func handleCustomUrl(_ url: URL) {
    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleCustomUrl(url)
}
```

このコードでは、`init(url:)`メソッドを簡潔に保つために、`processHost(host:params:)`、`processHoge(params:)`、および`processMoge(params:)`というプライベートメソッドに処理を分割しています。これにより、URLパターンの処理がより見やすく、メンテナンスしやすくなっています。

---

## 👤 ユーザー
*2024/07/11 20:06:44*

case "hoge": などは rawValue で定義してほしい

---

## 🤖 アシスタント
*2024/07/11 20:07:10*

`CustomUrlSchema`のホスト名を`rawValue`で定義するように、以下のコードに変更します。これにより、ホスト名を追加したり変更したりする場合に、コードがより簡潔かつメンテナンスしやすくなります。

### URLクエリパラメータを取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema: String {
    case hoge
    case moge
    case unknown

    init(url: URL) {
        guard let host = url.host, let schema = CustomUrlSchema(rawValue: host) else {
            self = .unknown
            return
        }

        let params = url.queryParameters

        self = CustomUrlSchema.processHost(schema: schema, params: params)
    }

    private static func processHost(schema: CustomUrlSchema, params: [String: String]) -> CustomUrlSchema {
        switch schema {
        case .hoge:
            return processHoge(params: params)
        case .moge:
            return processMoge(params: params)
        case .unknown:
            return .unknown
        }
    }

    private static func processHoge(params: [String: String]) -> CustomUrlSchema {
        if let id = params["id"], let name = params["name"] {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [String: String]) -> CustomUrlSchema {
        if let id = params["id"], let type = params["type"] {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }

    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown
}

// Function to handle the URL
func handleCustomUrl(_ url: URL) {
    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
if let url = URL(string: "app://hoge?id=1&name=example") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://moge?id=2&type=test") {
    handleCustomUrl(url)
}

if let url = URL(string: "app://unknown?id=3") {
    handleCustomUrl(url)
}
```

このコードでは、`CustomUrlSchema`のホスト名を`rawValue`で定義し、URLパターンの処理をより簡潔にしています。`init(url:)`メソッドでURLのホスト名を`CustomUrlSchema`に変換し、プライベートメソッドに分割された処理を呼び出しています。これにより、URLパターンの追加や変更が容易になり、コードのメンテナンス性が向上します。

---

## 👤 ユーザー
*2024/07/11 20:24:49*

悪くはないんだけど、辞書型ではなくて、key value のタプルにしてほしい。

enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params: [String: String] = url.queryParameters

        self = CustomUrlSchema.processHost(host: host, params: params)
    }

    private static func processHost(host: String, params: [String: String]) -&gt; CustomUrlSchema {
        switch host {
        case "hoge":
            return processHoge(params: params)
        case "moge":
            return processMoge(params: params)
        default:
            return .unknown
        }
    }

    private static func processHoge(params: [String: String]) -&gt; CustomUrlSchema {
        if let id = params["id"], let name = params["name"] {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [String: String]) -&gt; CustomUrlSchema {
        if let id = params["id"], let type = params["type"] {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }
}

extension URL {
    var queryParameters: [String: String] {
        var params = [String: String]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { params[$0.name] = $0.value }
        return params
    }
}

また、String を引数に取得するようにしてほしい。

---

## 🤖 アシスタント
*2024/07/11 20:25:23*

以下のコードでは、URLクエリパラメータをタプルの配列として扱い、`String`を引数に取得するように変更しました。

### URLクエリパラメータをタプルの配列として取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [(String, String)] {
        var params = [(String, String)]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { 
            if let value = $0.value {
                params.append(($0.name, value))
            }
        }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params: [(String, String)] = url.queryParameters

        self = CustomUrlSchema.processHost(host: host, params: params)
    }

    private static func processHost(host: String, params: [(String, String)]) -> CustomUrlSchema {
        switch host {
        case "hoge":
            return processHoge(params: params)
        case "moge":
            return processMoge(params: params)
        default:
            return .unknown
        }
    }

    private static func processHoge(params: [(String, String)]) -> CustomUrlSchema {
        var id: String?
        var name: String?

        for param in params {
            switch param.0 {
            case "id":
                id = param.1
            case "name":
                name = param.1
            default:
                break
            }
        }

        if let id = id, let name = name {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [(String, String)]) -> CustomUrlSchema {
        var id: String?
        var type: String?

        for param in params {
            switch param.0 {
            case "id":
                id = param.1
            case "type":
                type = param.1
            default:
                break
            }
        }

        if let id = id, let type = type {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }
}

// Function to handle the URL
func handleCustomUrl(_ urlString: String) {
    guard let url = URL(string: urlString) else {
        print("Invalid URL string")
        return
    }

    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
handleCustomUrl("app://hoge?id=1&name=example")
handleCustomUrl("app://moge?id=2&type=test")
handleCustomUrl("app://unknown?id=3")
```

このコードでは、`CustomUrlSchema`の`init(url:)`メソッドを使用してURLを解析し、必要なパラメータを連想値として持つようにしています。また、`String`を引数に取得して処理する`handleCustomUrl(_:)`関数を用意しています。各ケースに応じた処理は、対応する関数で行います。これにより、URLパターンの追加や変更が容易になり、コードのメンテナンス性が向上します。

---

## 👤 ユーザー
*2024/07/11 20:25:28*

タプルには変数を設けて可読性をよくしてほしい。

---

## 🤖 アシスタント
*2024/07/11 20:26:01*

URLクエリパラメータのタプルに変数を設けて可読性を高めるようにコードを変更します。

### URLクエリパラメータをタプルの配列として取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [(name: String, value: String)] {
        var params = [(name: String, value: String)]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { 
            if let value = $0.value {
                params.append((name: $0.name, value: value))
            }
        }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params: [(name: String, value: String)] = url.queryParameters

        self = CustomUrlSchema.processHost(host: host, params: params)
    }

    private static func processHost(host: String, params: [(name: String, value: String)]) -> CustomUrlSchema {
        switch host {
        case "hoge":
            return processHoge(params: params)
        case "moge":
            return processMoge(params: params)
        default:
            return .unknown
        }
    }

    private static func processHoge(params: [(name: String, value: String)]) -> CustomUrlSchema {
        var id: String?
        var name: String?

        for param in params {
            switch param.name {
            case "id":
                id = param.value
            case "name":
                name = param.value
            default:
                break
            }
        }

        if let id = id, let name = name {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [(name: String, value: String)]) -> CustomUrlSchema {
        var id: String?
        var type: String?

        for param in params {
            switch param.name {
            case "id":
                id = param.value
            case "type":
                type = param.value
            default:
                break
            }
        }

        if let id = id, let type = type {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }
}

// Function to handle the URL
func handleCustomUrl(_ urlString: String) {
    guard let url = URL(string: urlString) else {
        print("Invalid URL string")
        return
    }

    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
handleCustomUrl("app://hoge?id=1&name=example")
handleCustomUrl("app://moge?id=2&type=test")
handleCustomUrl("app://unknown?id=3")
```

このコードでは、タプルに`name`と`value`という変数を設けてクエリパラメータを管理し、可読性を高めています。`init(url:)`メソッドでURLを解析し、必要なパラメータをタプルとして扱い、各パラメータの名前と値に基づいて処理を行っています。各ケースに応じた処理は、対応する関数で行います。

---

## 👤 ユーザー
*2024/07/11 20:26:04*

[(key: String, value: String)] にしてほしい。

---

## 🤖 アシスタント
*2024/07/11 20:26:37*

URLクエリパラメータを`(key: String, value: String)`のタプルとして扱うようにコードを変更します。

### URLクエリパラメータをタプルの配列として取得する拡張

```swift
import Foundation

extension URL {
    var queryParameters: [(key: String, value: String)] {
        var params = [(key: String, value: String)]()
        let components = URLComponents(url: self, resolvingAgainstBaseURL: false)
        components?.queryItems?.forEach { 
            if let value = $0.value {
                params.append((key: $0.name, value: value))
            }
        }
        return params
    }
}
```

### URLパターンを処理するコード

```swift
// Define an enum to handle different URL patterns
enum CustomUrlSchema {
    case hoge(id: String, name: String)
    case moge(id: String, type: String)
    case unknown

    init(url: URL) {
        guard let host = url.host else {
            self = .unknown
            return
        }

        let params: [(key: String, value: String)] = url.queryParameters

        self = CustomUrlSchema.processHost(host: host, params: params)
    }

    private static func processHost(host: String, params: [(key: String, value: String)]) -> CustomUrlSchema {
        switch host {
        case "hoge":
            return processHoge(params: params)
        case "moge":
            return processMoge(params: params)
        default:
            return .unknown
        }
    }

    private static func processHoge(params: [(key: String, value: String)]) -> CustomUrlSchema {
        var id: String?
        var name: String?

        for param in params {
            switch param.key {
            case "id":
                id = param.value
            case "name":
                name = param.value
            default:
                break
            }
        }

        if let id = id, let name = name {
            return .hoge(id: id, name: name)
        } else {
            return .unknown
        }
    }

    private static func processMoge(params: [(key: String, value: String)]) -> CustomUrlSchema {
        var id: String?
        var type: String?

        for param in params {
            switch param.key {
            case "id":
                id = param.value
            case "type":
                type = param.value
            default:
                break
            }
        }

        if let id = id, let type = type {
            return .moge(id: id, type: type)
        } else {
            return .unknown
        }
    }
}

// Function to handle the URL
func handleCustomUrl(_ urlString: String) {
    guard let url = URL(string: urlString) else {
        print("Invalid URL string")
        return
    }

    let customUrl = CustomUrlSchema(url: url)

    switch customUrl {
    case .hoge(let id, let name):
        handleHoge(id: id, name: name)
    case .moge(let id, let type):
        handleMoge(id: id, type: type)
    case .unknown:
        handleUnknown()
    }
}

// Example handler functions
func handleHoge(id: String, name: String) {
    print("Handle hoge with id: \(id), name: \(name)")
    // Add your logic here
}

func handleMoge(id: String, type: String) {
    print("Handle moge with id: \(id), type: \(type)")
    // Add your logic here
}

func handleUnknown() {
    print("Unknown URL pattern")
    // Add your logic here
}

// Example usage
handleCustomUrl("app://hoge?id=1&name=example")
handleCustomUrl("app://moge?id=2&type=test")
handleCustomUrl("app://unknown?id=3")
```

このコードでは、タプルを`(key: String, value: String)`の形式で扱うように変更し、クエリパラメータの処理をより可読性の高い形にしました。各パラメータの名前と値に基づいて処理を行い、各ケースに応じた処理を対応する関数で行っています。これにより、URLパターンの追加や変更が容易になり、コードのメンテナンス性が向上します。

---
