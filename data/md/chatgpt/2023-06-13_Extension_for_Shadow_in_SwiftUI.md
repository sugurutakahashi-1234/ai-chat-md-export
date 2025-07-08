# Extension for Shadow in SwiftUI

日付: 2023-06-13

---

## 👤 ユーザー
*2023/06/13 16:20:03*

以下のモディファイアをextension Vieｗにしてほしい

import SwiftUI

struct ShadowEnabledModifier: ViewModifier {
    func body(content: Content) -&gt; some View {
        content
            .shadow(color: .black.opacity(0.25), radius: 10, x: 0, y: 2)
    }
}

public extension View {
    var shadowEnabled: some View {
        self.modifier(ShadowEnabledModifier())
    }
}

---

## 🤖 アシスタント
*2023/06/13 16:20:30*

あなたが提供したSwiftUIのコードは、Viewに影を追加するカスタムModifierとそのExtensionです。ただし、Extension ViewはSwiftUIで直接サポートされていないため、Extension Viewを作成することはできません。 

ただし、あなたが書いたコードは既にViewに対するExtensionとして機能しています。これにより、任意のViewで`.shadowEnabled`を呼び出すことができ、その結果としてViewに影が追加されます。

次のような方法でこのカスタムmodifierを使用できます：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, world!")
            .shadowEnabled
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

上記のコードでは、`ContentView`にあるテキストに対して`.shadowEnabled`を呼び出して、テキストに影を追加しています。

---

## 👤 ユーザー
*2023/06/13 16:23:26*

そうじゃなくて、普通にViewのextensionとして定義できないのか気になった

---

## 🤖 アシスタント
*2023/06/13 16:24:08*

SwiftUIでは、`View`に直接メソッドを追加する形でextensionを定義することが可能です。しかし、これは新しい`View`型を作成するのとは異なることに注意が必要です。`View`はプロトコルであり、そのため具象化するためには全ての必要なメソッドとプロパティが実装されていなければなりません。すなわち、`body`プロパティを持つ必要があります。

あなたが共有したコードは、既に`View`にメソッドを追加する形式のextensionとなっています。これは、任意の`View`に対して`.shadowEnabled`を呼び出すことで影を追加する機能を追加しています。

新しい`View`を定義したい場合、それは一般的に新しい構造体を作成し、その構造体で`View`プロトコルを採用することで行います。その構造体は、新しい`View`の内容を定義する`body`プロパティを持つべきです。しかし、`View`のextensionとして新しい`View`を作成することはできません。

---

## 👤 ユーザー
*2023/06/13 16:24:46*

この実装自体をViewModifier を継承しなくても実装できたのではないかという質問です。

```swift

struct ShadowEnabledModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .shadow(color: .black.opacity(0.25), radius: 10, x: 0, y: 2)
    }
}

public extension View {
    var shadowEnabled: some View {
        self.modifier(ShadowEnabledModifier())
    }
}
```

---

## 🤖 アシスタント
*2023/06/13 16:25:19*

確かに、あなたが示した具体的なケースでは、ViewModifierを使用せずに直接Viewのextensionとして実装することが可能です。以下のように書き換えることができます：

```swift
public extension View {
    var shadowEnabled: some View {
        self.shadow(color: .black.opacity(0.25), radius: 10, x: 0, y: 2)
    }
}
```

この実装はよりシンプルであり、元のコードと同じ動作を提供します。しかし、`ViewModifier`を使用する利点は、より複雑なビジュアル修飾や機能を再利用可能なモジュールとしてカプセル化できることです。このため、シンプルな修飾子であっても一貫性を持たせるために`ViewModifier`を使用することが一般的です。

---

## 👤 ユーザー
*2023/06/13 16:27:34*

shadowEnabled よりもいい命名の候補をいくつかだしてほしい。shadowEnabledの命名のよくないところも教えて欲しい

---

## 🤖 アシスタント
*2023/06/13 16:28:32*

命名は非常に重要なプログラミングの側面であり、意図や振る舞いを明確に伝えるためには適切な名前を選ぶことが重要です。

`shadowEnabled`という名前について考えると、まず最初に思い浮かぶ問題は、それがブール型のプロパティであるかのように思われる可能性があるということです。一般的には、`enabled`という語が含まれているプロパティやメソッドは、何かを有効にしたり無効にしたりするためのものと解釈されやすいです。しかし、この名前のメソッドは影を有効にするだけでなく、その特性（色、範囲、オフセット）も指定しています。

したがって、より具体的な名前を選ぶことで、このメソッドが何を行うのかをより明確に伝えることができます。以下に、いくつかの提案を示します：

- `withShadow`: これは現在のビューに影を追加するという行為を直感的に伝えるシンプルな名前です。
- `appliedStandardShadow`: この名前は、特定の「標準的な」影を適用することを強調します。これは、同じ種類の影をアプリ全体で再利用する場合に特に役立ちます。
- `decoratedWithShadow`: これはビューが影で「装飾」されることを強調します。

これらの名前は、影が適用された結果を返すというこのメソッドの意図をより明確に伝えることができます。ただし、最終的な選択はコードベース全体の命名規則や、メソッドの使用方法によります。

---
