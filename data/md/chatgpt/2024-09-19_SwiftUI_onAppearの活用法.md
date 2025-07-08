# SwiftUI onAppearの活用法

Date: 2024-09-19

---

## 👤 User
*2024-09-19 19:57:52*

SwiftUIでViewが表示されたタイミングでログを送信したいけど、onAppearだと一度しか発火しないので、ナビゲーション遷移で戻ったりとかした際もちゃんと動作させたい。どうすればいい？

---

## 🤖 Assistant
*2024-09-19 19:58:04*

SwiftUIの`onAppear`は、一度だけ発火するため、ナビゲーション遷移で戻った際に再度発火させたい場合には、以下のような方法を使って解決できます。

1. **`onAppear`と`onDisappear`の組み合わせ**  
   `onAppear`と`onDisappear`を組み合わせることで、ナビゲーションで戻る際に再度`onAppear`が発火するようにできます。`onDisappear`で状態をリセットして、戻ってきた際に再度処理が走るようにします。

   ```swift
   struct ContentView: View {
       @State private var shouldLogAppear = true

       var body: some View {
           NavigationView {
               VStack {
                   Text("Hello, World!")
                       .onAppear {
                           if shouldLogAppear {
                               logAppear()
                               shouldLogAppear = false
                           }
                       }
                       .onDisappear {
                           shouldLogAppear = true
                       }
                   NavigationLink("Go to Detail", destination: DetailView())
               }
           }
       }

       func logAppear() {
           print("View appeared, logging...")
           // ログを送信するコード
       }
   }
   ```

2. **`onChange`を使用してアクティブ状態を監視する**  
   `@Environment(\.scenePhase)`を使うと、アプリのアクティブ状態（フォアグラウンドやバックグラウンド）を監視することができ、ビューが再度アクティブになったときにログを送信することも可能です。

   ```swift
   struct ContentView: View {
       @Environment(\.scenePhase) var scenePhase

       var body: some View {
           Text("Hello, World!")
               .onChange(of: scenePhase) { newPhase in
                   if newPhase == .active {
                       logAppear()
                   }
               }
       }

       func logAppear() {
           print("View appeared, logging...")
           // ログを送信するコード
       }
   }
   ```

3. **`NavigationStack`を使用して`onAppear`を再度発火させる**  
   `NavigationStack`を使った場合、ナビゲーション遷移後に戻ってきた時でも`onAppear`が再度発火するように、`NavigationStack`の動作に依存して実装することができます。`onAppear`自体をそのまま使いたいなら、`NavigationStack`の利用が効果的です。

もし`NavigationStack`をすでに使っていて`onAppear`が意図したとおりに動かない場合や、特定のシナリオでの解決策が必要であれば、追加のコンテキストを教えてもらえれば、さらに適切な提案ができるかもしれません。

---
