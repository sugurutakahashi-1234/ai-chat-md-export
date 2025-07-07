# Create HogeClass one-liner (CHOL)

日付: 2023-08-01

---

## 👤 ユーザー
*2023/8/2 8:19:42*

type(of: self) と ObjectIdentifier(self) をワンライナー文字列取得するようにしたい。

class HogeClass {
    init(dependencyInjector: AnythingAreaCalculationMeasuredLinesSetPresenterDependency) {
        print("\\(type(of: self)).init: \\(ObjectIdentifier(self))")
    }

    deinit {
        print("\\(type(of: self)).deinit: \\(ObjectIdentifier(self))")
    }
}

---

## 🤖 アシスタント
*2023/8/2 8:19:58*

Swiftのクラスで、オブジェクトの型とそのオブジェクトの識別子を表示するコードをシンプルにするために、ワンライナーのヘルパーメソッドを作ることができます。以下は、その方法を示す例です。

```swift
class HogeClass {
    private var description: String {
        return "\(type(of: self)).\(ObjectIdentifier(self))"
    }
    
    init(dependencyInjector: Any) { // ここでは型を具体的に知らないため、Anyを使用
        print("\(description).init")
    }

    deinit {
        print("\(description).deinit")
    }
}
```

ここで、`description`プロパティは、そのクラスのインスタンスの型と識別子を連結した文字列を返します。このプロパティを使うことで、`init`と`deinit`メソッドの中で同じコードを繰り返す必要がなくなります。

このようにすると、コードがすっきりし、後でフォーマットを変更する場合にも、一箇所で変更できるようになります。

---

## 👤 ユーザー
*2023/8/2 8:21:24*

"type(of: self)" を  instanceName 、ObjectIdentifier(self) を instanceId としてStringで取得したい

---

## 🤖 アシスタント
*2023/8/2 8:21:36*

指定した名前で型と識別子を文字列として取得したい場合、以下のようなコードを作成することができます：

```swift
class HogeClass {
    private var instanceName: String {
        return "\(type(of: self))"
    }

    private var instanceId: String {
        return "\(ObjectIdentifier(self))"
    }

    init(dependencyInjector: Any) {
        print("\(instanceName).init: \(instanceId)")
    }

    deinit {
        print("\(instanceName).deinit: \(instanceId)")
    }
}
```

このコードでは、`instanceName`プロパティがクラスの型を文字列として返し、`instanceId`プロパティがオブジェクトの識別子を文字列として返します。

これで、`init`メソッドと`deinit`メソッドの中でこれらのプロパティを使って表示することができます。同様に、他のメソッドやプロパティの中でもこれらの値を使うことができます。

---

## 👤 ユーザー
*2023/8/2 8:21:51*

private var instanceName: String {
        return "\\(type(of: self))"
    }

    private var instanceId: String {
        return "\\(ObjectIdentifier(self))"
    }

をどこでも使えるようにしたい場合はどうすればいい？

---

## 🤖 アシスタント
*2023/8/2 8:22:07*

どこでも使えるようにするために、共通のプロトコルを定義して、それを各クラスで採用することができます。以下はその一例です。

```swift
protocol InstanceDescribable {
    var instanceName: String { get }
    var instanceId: String { get }
}

extension InstanceDescribable {
    var instanceName: String {
        return "\(type(of: self))"
    }

    var instanceId: String {
        return "\(ObjectIdentifier(self))"
    }
}

class HogeClass: InstanceDescribable {
    init(dependencyInjector: Any) {
        print("\(instanceName).init: \(instanceId)")
    }

    deinit {
        print("\(instanceName).deinit: \(instanceId)")
    }
}
```

このコードでは、`InstanceDescribable`プロトコルを定義し、そのプロトコルの拡張で`instanceName`と`instanceId`プロパティを提供しています。このようにすると、任意のクラスがこのプロトコルを採用するだけで、これらのプロパティを利用できるようになります。

このアプローチはコードの重複を減らし、プロジェクト全体で一貫した方法でオブジェクトの型と識別子にアクセスできるようにします。

---

## 👤 ユーザー
*2023/8/2 8:23:51*

こういうのを作っていて、extension initを作成して、もっと簡単に記述できないかな？

    public struct InitInstance: LogEventProtocol {
        public let instanceName: String
        public let instanceId: String
        
        public init(instanceName: String, instanceId: String) {
            self.instanceName = instanceName
            self.instanceId = instanceId
        }
    }
    
    public struct DeinitInstance: LogEventProtocol {
        public let instanceName: String
        public let instanceId: String
        
        public init(instanceName: String, instanceId: String) {
            self.instanceName = instanceName
            self.instanceId = instanceId
        }
    }

---

## 🤖 アシスタント
*2023/8/2 8:24:19*

あなたのコードで示されている`InitInstance`と`DeinitInstance`構造体は、インスタンスの初期化と解放のイベントに対応するログイベントを表すように見えます。この構造を更に簡潔に使用できるように、前に提供した`InstanceDescribable`プロトコルと組み合わせることができます。

ここで、イベントをログする関数を提供する新しいプロトコルを定義し、`InstanceDescribable`プロトコルを採用したクラスで使用できるようにします。

```swift
protocol InstanceDescribable {
    var instanceName: String { get }
    var instanceId: String { get }
}

protocol LogEventProtocol {
    var instanceName: String { get }
    var instanceId: String { get }
}

extension InstanceDescribable {
    func logEvent(_ event: LogEventProtocol) {
        print("\(event.instanceName): \(event.instanceId)")
    }
}

public struct InitInstance: LogEventProtocol {
    public let instanceName: String
    public let instanceId: String
}

public struct DeinitInstance: LogEventProtocol {
    public let instanceName: String
    public let instanceId: String
}

class HogeClass: InstanceDescribable {
    init(dependencyInjector: Any) {
        let event = InitInstance(instanceName: instanceName, instanceId: instanceId)
        logEvent(event)
    }

    deinit {
        let event = DeinitInstance(instanceName: instanceName, instanceId: instanceId)
        logEvent(event)
    }
}
```

ここでは、`InstanceDescribable`に`logEvent(_:)`メソッドを追加しました。このメソッドは、`LogEventProtocol`を採用したイベントを受け取り、ログとして出力します。`HogeClass`では、この新しいメソッドを使用して`InitInstance`と`DeinitInstance`イベントを簡潔にログします。

これにより、コードの重複が減少し、構造体とプロトコルの再利用が向上します。また、将来的に新しいイベントタイプを追加する際も、このプロトコルを採用するだけで簡単に実装できるようになります。

---
