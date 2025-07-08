# プレビューに@EnvironmentObjectを提供

Date: 2023-05-31

---

## 👤 User
*2023-05-31 13:21:47*

SwiftUI でアプリ開発をしていて、@EnvironmentObject を使っているのだけれども、プレビューを表示するときにうまく動かないことがある。どうすればいいのか教えて欲しい。

---

## 🤖 Assistant
*2023-05-31 13:22:12*

SwiftUIのプレビューでは、@EnvironmentObjectで提供されるデータが利用可能でない場合があります。これは、プレビューがアプリの完全なランタイム環境と同じではないためです。したがって、プレビュー内でEnvironmentObjectを使用すると、"MissingObject"エラーが発生することがあります。

この問題を解決するためには、プレビュー用にEnvironmentObjectを提供する必要があります。これは、プレビューのinitializerにEnvironmentObjectを注入することで達成できます。例えば、次のように行うことができます：

```swift
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        YourView()
            .environmentObject(YourObservableObject())
    }
}
```

ここでは、`YourObservableObject()`は、`@EnvironmentObject`として使用されているオブジェクトのインスタンスです。これはプレビュー用のダミーデータや、必要に応じて実際のデータを使用することができます。

これにより、プレビューコード内で必要なEnvironmentObjectが提供され、プレビューが正常に表示されます。

---

## 👤 User
*2023-05-31 13:23:01*

子Viewに@EnvironmentObjectをつかっていると、いろんな画面のPreviewに対して、.environmentObject() しないといけないが大変です。

---

## 🤖 Assistant
*2023-05-31 13:23:57*

その課題は確かに理解できます。いくつかの解決策があります：

1. **Default Environment Objects**: あなたが作成したカスタムビューに対してデフォルトの `@EnvironmentObject` を提供することができます。これにより、ビューがプレビューモードの場合、またはオブジェクトが提供されていない場合にデフォルトのオブジェクトを使用します。この方法であれば、すべてのプレビューに手動で `@EnvironmentObject` を追加する必要がありません。

    ```swift
    struct ContentView: View {
        @EnvironmentObject var model: YourModelType

        //...
    }

    extension ContentView {
        // This is a default value for previews and for cases when no EnvironmentObject is available.
        static let defaultModel: YourModelType = .init(/*default data*/)
    }

    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            ContentView().environmentObject(ContentView.defaultModel)
        }
    }
    ```

2. **Preview Environment Wrapper**: 同じ `@EnvironmentObject` を使用するすべてのビューのプレビューに対して共通のラッパー関数を作成します。これは、プレビュー用のビューに環境オブジェクトを提供する役割を果たします。

    ```swift
    func PreviewWrapper<Content: View>(content: () -> Content) -> some View {
        content()
            .environmentObject(YourObservableObject())
    }

    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            PreviewWrapper {
                ContentView()
            }
        }
    }
    ```

どちらのアプローチも、繰り返しの労力を軽減し、プレビュー用の環境オブジェクトの設定を一元化します。

---

## 👤 User
*2023-05-31 13:24:32*

複数のEnvironmentObjectを使っている場合はどう書けばいい？

---

## 🤖 Assistant
*2023-05-31 13:25:02*

複数の`@EnvironmentObject`が必要な場合は、それぞれに対して`.environmentObject()`を呼び出すことができます。これはチェーン状に連結することができます。

例えば、あなたが`ModelA`と`ModelB`という二つの`ObservableObject`を`@EnvironmentObject`として使っているとすると、プレビューの作成は以下のように行うことができます：

```swift
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(ModelA())
            .environmentObject(ModelB())
    }
}
```

上記のコードは、`ContentView`に対して`ModelA`と`ModelB`という2つの`@EnvironmentObject`を提供します。

もし、プレビューラッパーを使用している場合は、ラッパーファンクション内で同様に`.environmentObject()`を複数回呼び出します：

```swift
func PreviewWrapper<Content: View>(content: () -> Content) -> some View {
    content()
        .environmentObject(ModelA())
        .environmentObject(ModelB())
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapper {
            ContentView()
        }
    }
}
```

これにより、複数の`@EnvironmentObject`をプレビューに適用することができます。

---

## 👤 User
*2023-05-31 13:26:41*

PreviewWrapper の方向性で行きたいのだけれどもModelA の生成時にModelBを使いたくて、ModelBについてもenvironmentObject であり、ModelB は ModelA の生成時に使ったインスタンスと同じものを使いたい場合はどうすればいい？つまり値を保持しておきたい

---

## 🤖 Assistant
*2023-05-31 13:27:00*

あなたが述べたように、特定のインスタンスを複数の場所で再利用する場合、一時的なインスタンスを作成してそれを複数回使用することが可能です。

次に、この方法を`PreviewWrapper`のコンテキストで示します：

```swift
func PreviewWrapper<Content: View>(content: () -> Content) -> some View {
    let modelB = ModelB()
    let modelA = ModelA(modelB: modelB)

    return content()
        .environmentObject(modelA)
        .environmentObject(modelB)
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapper {
            ContentView()
        }
    }
}
```

上記のコードでは、`modelB`は一度作成され、その後`modelA`とビューの環境オブジェクトの両方に使用されます。これにより、同じ`modelB`インスタンスが`modelA`の作成とビューの環境オブジェクトの設定の両方に利用されます。これがあなたの要件に適合するかどうかご確認ください。

---

## 👤 User
*2023-05-31 13:27:45*

保持しているmodelA や  modelB は保持されたままなのかな？ struct とかでつくったほうがいいのかな？

---

## 🤖 Assistant
*2023-05-31 13:28:20*

Swiftの関数は一般的に状態を保持しません。したがって、`PreviewWrapper`関数の中で生成した`modelA`と`modelB`はその関数のスコープの外では存在しません。それらは関数が呼び出されるたびに新たに生成されます。

一方で、それらのオブジェクトを長期間保持したい場合は、確かに`struct`や`class`を使用してそれらを格納することができます。例えば、以下のように`PreviewEnvironment`という新しい`struct`を作成し、その中で`modelA`と`modelB`を保持することができます：

```swift
struct PreviewEnvironment {
    let modelA: ModelA
    let modelB: ModelB

    init() {
        modelB = ModelB()
        modelA = ModelA(modelB: modelB)
    }
    
    func inject<Content: View>(into content: () -> Content) -> some View {
        content()
            .environmentObject(modelA)
            .environmentObject(modelB)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewEnvironment().inject {
            ContentView()
        }
    }
}
```

ここでは`PreviewEnvironment`は`modelA`と`modelB`を保持し、それらのオブジェクトをビューに注入する`inject`メソッドを提供します。これにより、それらのオブジェクトはプレビューコードのスコープの外でも存在し続けます。

ただし、`PreviewWrapper`関数や`PreviewEnvironment`構造体のようなヘルパーは、プレビューの期間中だけ存在します。プレビューが終了すると、それらのインスタンスも解放されます。これはプレビューが各ビルド間で状態を保持しないためです。

---

## 👤 User
*2023-05-31 13:29:24*

これを使うのはどう思う？

---

## 🤖 Assistant
*2023-05-31 13:29:37*

申し訳ありませんが、具体的に何を使うのかについて具体的な情報が提供されていないようです。もしSwiftUI、@EnvironmentObject、またはその他の関連技術の特定の部分やアプローチについて質問がある場合は、それについてもう少し詳しく教えていただけますか？ それによって、私はより具体的で適切な回答を提供することができます。

---
