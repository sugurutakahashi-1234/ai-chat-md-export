# View onChange Compatibility

Date: 2024-07-25

---

## 👤 User
*2024-07-25 15:59:22*

@available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *)
extension View {
    nonisolated public func onChange&lt;V&gt;(of value: V, initial: Bool = false, _ action: @escaping (_ oldValue: V, _ newValue: V) -&gt; Void) -&gt; some View where V : Equatable


private extension View {
    @ViewBuilder
    func onChangeIfAvailable(of: ) -&gt; some View where V : Equatable {
        if #available(iOS 17.0, *) {
            // ここを実装したい
        } else {
            self
        }
    }
}

---

## 🤖 Assistant
*2024-07-25 15:59:34*

以下は、`onChangeIfAvailable`の実装例です。この実装では、iOS 17.0以上のバージョンで`onChange(of:initial:_:)`メソッドを呼び出し、古いバージョンではそのままビューを返します。

```swift
import SwiftUI

@available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *)
extension View {
    nonisolated public func onChange<V>(of value: V, initial: Bool = false, _ action: @escaping (_ oldValue: V, _ newValue: V) -> Void) -> some View where V : Equatable
}

private extension View {
    @ViewBuilder
    func onChangeIfAvailable<V: Equatable>(of value: V, initial: Bool = false, _ action: @escaping (_ oldValue: V, _ newValue: V) -> Void) -> some View {
        if #available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *) {
            self.onChange(of: value, initial: initial, action)
        } else {
            self
        }
    }
}
```

このコードでは、`onChangeIfAvailable`関数が条件付きで`onChange`メソッドを呼び出します。`onChange`メソッドはiOS 17.0以上で利用可能ですが、それ以前のバージョンでは単に元のビューを返すだけです。これにより、コードの互換性を保ちながら、新しい機能を利用できます。

---
