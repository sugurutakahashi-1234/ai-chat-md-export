# Common Variable for Classes.

日付: 2023-08-01

---

## 👤 ユーザー
*2023/08/02 08:16:48*

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
*2023/08/02 08:16:52*

共通変数を定義して、どのクラスでも利用できるようにする方法としては、Swiftのextensionを使用することが考えられます。extensionを使って既存のクラスに新しいメソッドやプロパティを追加することができます。以下のように共通変数を定義するextensionを追加します：

```swift
// 共通変数を定義するextension
extension NSObject {
    var objectIdentifierString: String {
        return "\(type(of: self)).init: \(ObjectIdentifier(self))"
    }
}

// クラスの定義
class HogeClass {
    init(dependencyInjector: AnythingAreaCalculationMeasuredLinesSetPresenterDependency) {
        print(self.objectIdentifierString)
    }

    deinit {
        print("\(type(of: self)).deinit: \(ObjectIdentifier(self))")
    }
}
```

ここで、`NSObject`を拡張しているのは、Swiftの全てのクラスは`NSObject`を継承しているため、このextensionはどのクラスでも利用できるようになります。

上記のように共通のextensionを追加することで、`HogeClass`や他のクラスでも、`self.objectIdentifierString`を呼び出すことができます。これにより、クラスのインスタンスが初期化される際に、そのクラスの情報とオブジェクトIDが出力されるようになります。

---
