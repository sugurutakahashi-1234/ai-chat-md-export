# DebugPrintable Protocol.

日付: 2023-08-01

---

## 👤 ユーザー
*2023/8/2 8:17:08*

以下の "\(type(of: self)).init: \(ObjectIdentifier(self))" をどのclass でも使えるような共通変数を定義してほしい

class HogeClass {
    init(dependencyInjector: AnythingAreaCalculationMeasuredLinesSetPresenterDependency) {
        print("\(type(of: self)).init: \(ObjectIdentifier(self))")
    }

    deinit {
        print("\(type(of: self)).deinit: \(ObjectIdentifier(self))")
    }
}

---

## 🤖 アシスタント
*2023/8/2 8:17:28*

指定したメッセージをクラスの `init` と `deinit` メソッドでプリントするために、共通の関数を作成し、任意のクラスで使用できるようにすることができます。

まず、共通の関数を定義するために、次のようなプロトコルを定義します：

```swift
protocol DebugPrintable {
    func printLifecycleEvent(_ event: LifecycleEvent)
}

enum LifecycleEvent {
    case initialization
    case deinitialization
}

extension DebugPrintable {
    func printLifecycleEvent(_ event: LifecycleEvent) {
        let eventType: String
        switch event {
        case .initialization:
            eventType = "init"
        case .deinitialization:
            eventType = "deinit"
        }
        print("\(type(of: self)).\(eventType): \(ObjectIdentifier(self))")
    }
}
```

次に、このプロトコルを適用したいクラスに `DebugPrintable` プロトコルを採用します：

```swift
class HogeClass: DebugPrintable {
    init(dependencyInjector: AnythingAreaCalculationMeasuredLinesSetPresenterDependency) {
        printLifecycleEvent(.initialization)
    }

    deinit {
        printLifecycleEvent(.deinitialization)
    }
}
```

これによって、任意のクラスが `DebugPrintable` プロトコルを採用すると、共通の関数を使って `init` と `deinit` メソッドで指定したメッセージをプリントできるようになります。

---
