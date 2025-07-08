# Dynamic Sheet Height SwiftUI

日付: 2024-08-23

---

## 👤 ユーザー
*2024/08/23 17:54:10*

sheetの高さを中のコンテンツの高さに依存させる方法はあるのか？

public struct BoxEditView: View {
    @StateObject private var presenter: BoxEditPresenter
    @Environment(\.dismiss) private var dismiss

    public init(talkBox: TalkBox) {
        _presenter = .init(wrappedValue: BoxEditPresenter(talkBox: talkBox))
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // ZStack を PhotoRegisterButton の内側に入れると機能しない
                ZStack(alignment: .topTrailing) {
                    PhotoRegisterButton(selectedImage: $presenter.selectedImage, enablePhotoCrop: false, showCropOnUpdate: true) {
                        Group {
                            if let selectedImage = presenter.selectedImage {
                                Image(uiImage: selectedImage)
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: 120, height: 120)
                                    .clipShape(.rect(cornerRadius: 8))
                            } else {
                                VStack {
                                    SFSymbols.camera.image
                                        .foregroundColor(.white)
                                        .frame(width: 80, height: 80)
                                        .background(Color.accentColor)
                                        .clipShape(.circle)
                                        .font(.largeTitle)
                                }
                            }
                        }
                    }
                    .frame(width: 120, height: 120)

                    Button {
                        presenter.onTapDeletePhoto()
                    } label: {
                        SFSymbols.xmarkCircle.image
                            .resizable()
                            .scaledToFit()
                            .foregroundColor(.white)
                            .frame(width: 24, height: 24)
                            .background(Color.gray)
                            .clipShape(.circle)
                            .font(.title2)
                    }
                    .offset(x: 16, y: -16)
                    .isHidden(presenter.selectedImage.isNil)
                }
                .padding(.top, 24)

                VStack {
                    HStack {
                        Text("ボックスタイトル")
                            .font(.headline)
                        Spacer()
                    }
                    .padding(.bottom, 8)

                    VStack(spacing: 5) {
                        TextField("入力してください", text: Binding(
                            get: { presenter.talkBox.name },
                            set: { newName in
                                presenter.talkBox = presenter.talkBox.updatedName(newName)
                            })
                        )

                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(.gray)
                    }
                }

                VStack {
                    HStack {
                        Text("参加者")
                            .font(.headline)
                        Spacer()
                    }
                    .padding(.bottom, 8)

                    VStack(spacing: 5) {
                        ForEach(presenter.talkBox.accounts, id: \.id) { account in
                            HStack {
                                CachedAsyncImageView(imageUrl: account.imageUrl)
                                    .frame(width: 48, height: 48)
                                    .clipShape(.circle)
                                    .padding(.trailing, 16)

                                Text("\(account.name)さん")

                                Spacer()
                            }
                        }
                    }
                }

                VStack(alignment: .leading, spacing: 24) {
                    HStack {
                        Text("通知")
                        Spacer()
                        Toggle("", isOn:Binding(
                            get: { presenter.talkBox.isMuted },
                            set: { newIsMuted in
                                presenter.talkBox = presenter.talkBox.updatedIsMuted(newIsMuted)
                            })
                        )
                    }

                    Button {
                        presenter.onTapSendBoxCode()
                    } label: {
                        Text("ボックスコードを送る")
                            .tint(.primary)
                    }

                    Button {
                        presenter.onTapLeaveBox()
                    } label: {
                        Text("ボックスから退出")
                            .foregroundStyle(.red)
                    }
                }

                Button {
                    presenter.onTapPut()
                } label: {
                    Text("この内容で登録する")
                        .font(.title2)
                        .frame(height: 54)
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .clipShape(.rect(cornerRadius: 50))
                .padding(.bottom, 32)
                .disabled(presenter.talkBox.name.isEmpty)
            }
            .padding(.horizontal, 32)
        }
        .navigationTitle("ボックス編集")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showBoxLeave) {
            VStack {
                Text("退出してもボックス内のあなたの投稿データは消えません\nこのボックス内での投稿を消したい場合は、ボックスを退出する前に削除することをおすすめします")
                
                Button {
                    presenter.onTapLeaveBoxOk()
                } label: {
                    Text("退出する")
                        .font(.title2)
                        .frame(height: 54)
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .clipShape(.rect(cornerRadius: 50))
                .padding(.bottom, 32)
                
                Button {
                    presenter.onTapLeaveBoxCancel()
                } label: {
                    Text("キャンセル")
                        .font(.title2)
                        .frame(height: 54)
                        .frame(maxWidth: .infinity)
                        .tint(.clear)
                }
                .buttonStyle(.borderedProminent)
                .clipShape(.rect(cornerRadius: 50))
                .padding(.bottom, 32)
            }
            .padding(.horizontal, 32)
            .navigationTitle("ボックスから退出")
            .navigationStacked()
        }
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
        .onChange(of: presenter.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/08/23 17:54:39*

`SwiftUI`の`sheet`ビューの高さを中のコンテンツの高さに依存させる方法として、以下の方法があります。

1. **`sheet` の `.presentationDetents` を使う:**
   `presentationDetents`を使って、`medium`や`large`などのプリセット高さや、`fraction`でカスタムの割合を指定できますが、コンテンツの高さに完全に依存させるのは少し難しいです。`presentationDetents`は特定の高さに固定されるため、コンテンツが少なすぎる場合、シートが予想より大きく表示されることがあります。

2. **`GeometryReader` を使った動的調整:**
   `GeometryReader`を使って、シートの高さを動的に取得し、それに基づいて`presentationDetents`を調整することが考えられます。ただし、現在の`SwiftUI`では、`GeometryReader`を使って高さを取得しても、シートの高さをコンテンツに合わせて動的に変更することが難しいです。

3. **`View`の外部で制御:**
   `View`の外部で`sheet`のコンテンツサイズに基づいて`View`を切り替えることで、シートの高さを間接的に制御できます。

以下は、一つの方法として`presentationDetents`を使う例です。

```swift
.sheet(isPresented: $presenter.showBoxLeave) {
    VStack {
        Text("退出してもボックス内のあなたの投稿データは消えません\nこのボックス内での投稿を消したい場合は、ボックスを退出する前に削除することをおすすめします")

        Button {
            presenter.onTapLeaveBoxOk()
        } label: {
            Text("退出する")
                .font(.title2)
                .frame(height: 54)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .clipShape(.rect(cornerRadius: 50))
        .padding(.bottom, 32)

        Button {
            presenter.onTapLeaveBoxCancel()
        } label: {
            Text("キャンセル")
                .font(.title2)
                .frame(height: 54)
                .frame(maxWidth: .infinity)
                .tint(.clear)
        }
        .buttonStyle(.borderedProminent)
        .clipShape(.rect(cornerRadius: 50))
        .padding(.bottom, 32)
    }
    .padding(.horizontal, 32)
    .navigationTitle("ボックスから退出")
    .presentationDetents([.fraction(0.5)]) // コンテンツに応じた高さを設定
}
```

現時点では、`sheet`の高さをコンテンツに完全に合わせるのは難しいですが、今後の`SwiftUI`アップデートで改善される可能性があります。

---

## 👤 ユーザー
*2024/08/23 18:03:44*

iPod touch で .fraction(0.65)が適正であることがわかった。

---

## 🤖 アシスタント
*2024/08/23 18:03:49*

User found that using `.fraction(0.65)` is suitable for the iPod touch when adjusting the height of a sheet in SwiftUI.

---

## 🔧 ツール
*2024/08/23 18:03:49*

Model set context updated.

---

## 🤖 アシスタント
*2024/08/23 18:03:49*

それは良かったですね！iPod touchで`.fraction(0.65)`が適正な高さとして機能するのであれば、その設定を他の同様のビューにも適用することで、統一感のあるUIを実現できるでしょう。他に何か調整が必要な部分や質問があれば、気軽にお知らせください。

---

## 👤 ユーザー
*2024/08/23 18:04:07*

それを元に色々な幅の端末で適正になるように計算したい

---

## 🤖 アシスタント
*2024/08/23 18:04:38*

さまざまな幅の端末で適切なシートの高さを計算するために、以下の方法を検討できます。

### 1. **動的計算を使用する方法**
デバイスの画面幅を取得して、それに基づいてシートの高さを調整することができます。SwiftUIでは、`UIScreen.main.bounds.width`を使って画面の幅を取得できます。この値を基に、適切な高さを動的に計算し、`presentationDetents`で設定することが可能です。

以下の例は、画面幅に応じてシートの高さを動的に計算する方法です。

```swift
.sheet(isPresented: $presenter.showBoxLeave) {
    let screenWidth = UIScreen.main.bounds.width
    let fraction = calculateFraction(for: screenWidth)

    VStack {
        Text("退出してもボックス内のあなたの投稿データは消えません\nこのボックス内での投稿を消したい場合は、ボックスを退出する前に削除することをおすすめします")

        Button {
            presenter.onTapLeaveBoxOk()
        } label: {
            Text("退出する")
                .font(.title2)
                .frame(height: 54)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .clipShape(.rect(cornerRadius: 50))
        .padding(.bottom, 32)

        Button {
            presenter.onTapLeaveBoxCancel()
        } label: {
            Text("キャンセル")
                .font(.title2)
                .frame(height: 54)
                .frame(maxWidth: .infinity)
                .tint(.clear)
        }
        .buttonStyle(.borderedProminent)
        .clipShape(.rect(cornerRadius: 50))
        .padding(.bottom, 32)
    }
    .padding(.horizontal, 32)
    .navigationTitle("ボックスから退出")
    .presentationDetents([.fraction(fraction)]) // 動的に計算した高さを設定
}

func calculateFraction(for width: CGFloat) -> CGFloat {
    // 例: iPod touch での 0.65 を基準に、他の端末用に調整
    switch width {
    case 0..<320:
        return 0.6
    case 320..<375:
        return 0.65
    case 375..<414:
        return 0.7
    default:
        return 0.75
    }
}
```

### 2. **実験的なアプローチ**
上記のように、画面の幅ごとに条件分岐を行い、適切な`fraction`値を設定することで、様々なデバイスに対応できます。幅が広がるほどシートの高さを少し高めに設定するのが一般的です。

もし`.fraction(0.65)`がiPod touchに適しているのであれば、他のデバイスでも同様の基準を使って計算できます。この方法では、例えばiPhone 12のような大きなデバイスで若干大きめの`.fraction(0.7)`などに設定することができます。

さらに、実際のデバイスでテストしながら、適切な`fraction`値を見つけることで、最適化されたユーザー体験を提供できるでしょう。

---

## 👤 ユーザー
*2024/08/23 18:05:15*

どうにか内部での高さをpresentationDetentsで設定できないのか？

---

## 🤖 アシスタント
*2024/08/23 18:05:54*

`SwiftUI`では、シートの高さをコンテンツの高さに基づいて動的に設定するのは現時点では直接的にサポートされていませんが、いくつかの工夫によって近い結果を得ることができます。

### 解決策: `GeometryReader`と`PreferenceKey`を使った高さの計測

`GeometryReader`と`PreferenceKey`を組み合わせて、内部のコンテンツの高さを計測し、それに基づいてシートの高さを`presentationDetents`で設定するアプローチが考えられます。

以下は、その実装例です。

```swift
import SwiftUI

struct ContentView: View {
    @State private var sheetHeight: CGFloat = 0

    var body: some View {
        VStack {
            Button("Show Sheet") {
                showSheet = true
            }
        }
        .sheet(isPresented: $showSheet) {
            sheetContent
                .onPreferenceChange(SheetHeightPreferenceKey.self) { height in
                    sheetHeight = height
                }
                .presentationDetents([.fraction(sheetHeightFraction(for: sheetHeight))])
        }
    }

    private var sheetContent: some View {
        VStack {
            // Your sheet content here
            Text("Sample Content")
                .padding()

            // ... other content ...

            GeometryReader { geometry in
                Color.clear
                    .preference(key: SheetHeightPreferenceKey.self, value: geometry.size.height)
            }
        }
    }

    private func sheetHeightFraction(for height: CGFloat) -> CGFloat {
        let screenHeight = UIScreen.main.bounds.height
        return min(height / screenHeight, 0.9) // 0.9 を最大の fraction として制限
    }
}

struct SheetHeightPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}
```

### このアプローチの詳細

1. **`GeometryReader`**:
   - シート内部のコンテンツの高さを計測するために使用します。この例では`Color.clear`を使って、ビューの高さを計測し、`PreferenceKey`にその値を渡しています。

2. **`PreferenceKey`**:
   - `PreferenceKey`を使って、`GeometryReader`から取得した高さを外部に伝搬させます。

3. **`presentationDetents` の動的設定**:
   - 計測した高さをもとに、`presentationDetents`の`fraction`を動的に設定します。この例では、`sheetHeightFraction`関数でシートの高さをスクリーンの高さに対する割合として計算しています。

### 注意点
- `presentationDetents`の`fraction`は、0.0から1.0までの間で設定できますが、画面全体の高さを超えないように制限をかけるのがよいでしょう（例では`0.9`を最大値としています）。
- `SwiftUI`では、シートの高さを完全に動的にコントロールすることはまだ難しいため、このアプローチが完璧ではない場合もあります。

この方法で、シートの高さをコンテンツの高さにできるだけ近づけることができます。実際に試してみて、希望する動作を得られるか確認してみてください。

---

## 👤 ユーザー
*2024/08/23 18:06:18*

fraction ではなく、.height(300) のように決められないのか？

---

## 🤖 アシスタント
*2024/08/23 18:06:36*

`SwiftUI`の`.sheet`で高さを指定する際に、直接的に`.height(300)`のような指定は現時点ではサポートされていません。ただし、iOS 16以降で利用できる`.presentationDetents`を使って、`fraction`以外にも明示的な高さを指定することができます。

具体的には、`.presentationDetents`に`.height(300)`のように特定の高さを指定することができます。

以下にその例を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var showSheet = false

    var body: some View {
        VStack {
            Button("Show Sheet") {
                showSheet = true
            }
        }
        .sheet(isPresented: $showSheet) {
            sheetContent
                .presentationDetents([.height(300)]) // 高さを300ポイントに指定
        }
    }

    private var sheetContent: some View {
        VStack {
            Text("This is a sheet with a fixed height of 300 points.")
            Spacer()
        }
        .padding()
    }
}
```

### `.presentationDetents` の `.height` 使用例

- `.presentationDetents([.height(300)])` を使用して、シートの高さを 300 ポイントに固定できます。
- `.height`は具体的な高さを設定するため、`fraction`のように画面サイズに依存せずに、常に指定されたポイントの高さを保ちます。

### 注意点
- `.height`の指定はあくまでiOS 16以降で利用可能です。対応する最低OSバージョンに注意する必要があります。
- 高さを固定することで、コンテンツがその高さに収まらない場合にスクロール可能な領域が作成されることがあります。

この方法で、シートの高さを明示的に設定でき、必要なレイアウトが実現できるかと思います。

---

## 👤 ユーザー
*2024/08/23 18:07:35*

.height(300)のような指定はiOS16であればできそうである。

---

## 🤖 アシスタント
*2024/08/23 18:07:41*

User noted that specifying `.height(300)` in `.presentationDetents` is possible in iOS 16 and beyond.

---

## 🔧 ツール
*2024/08/23 18:07:41*

Model set context updated.

---

## 🤖 アシスタント
*2024/08/23 18:07:41*

そうですね、iOS 16以降では`.height(300)`のような指定が可能です。これにより、シートの高さを固定のポイント数で指定できるため、UIのレイアウトをより細かく制御することができます。この方法を使えば、異なるデバイスでも一貫した高さでシートを表示できます。必要に応じて試してみてください。

---

## 👤 ユーザー
*2024/08/23 18:07:56*

それを使って、どうにか内部での高さをpresentationDetentsで設定できないのか？

---

## 🤖 アシスタント
*2024/08/23 18:08:24*

`SwiftUI`で`.height()`を使ってシートの高さを動的にコンテンツに基づいて設定することは直接的には難しいですが、次のアプローチで実現可能です。

### アプローチ: `GeometryReader`で高さを計測し、動的に`presentationDetents`を設定

`GeometryReader`を使ってコンテンツの高さを計測し、それに基づいてシートの高さを設定します。計測された高さを一時的に保持し、その高さに基づいて`presentationDetents`を動的に設定する方法です。

#### 実装例

```swift
import SwiftUI

struct ContentView: View {
    @State private var showSheet = false
    @State private var sheetHeight: CGFloat = 300 // デフォルトの高さ

    var body: some View {
        VStack {
            Button("Show Sheet") {
                showSheet = true
            }
        }
        .sheet(isPresented: $showSheet) {
            SheetContent()
                .onPreferenceChange(SheetHeightPreferenceKey.self) { height in
                    sheetHeight = height // 高さを更新
                }
                .presentationDetents([.height(sheetHeight)]) // 高さを動的に設定
        }
    }
}

struct SheetContent: View {
    var body: some View {
        VStack {
            Text("This is a dynamically sized sheet.")
            Spacer()
            GeometryReader { geometry in
                Color.clear
                    .preference(key: SheetHeightPreferenceKey.self, value: geometry.size.height)
            }
        }
        .padding()
    }
}

struct SheetHeightPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 300 // デフォルトの高さ

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}
```

### このアプローチの詳細

1. **`GeometryReader`で高さを計測**:
   `GeometryReader`を使用して、シート内部のコンテンツの高さを計測します。

2. **`PreferenceKey`で高さを外部に伝達**:
   `PreferenceKey`を使用して、計測された高さをシートの外部に伝えます。

3. **`presentationDetents`に動的な高さを設定**:
   `presentationDetents([.height(sheetHeight)])`で、計測された高さに基づいてシートの高さを設定します。

### 注意点
- `presentationDetents`に設定する高さは、シートの初期表示時には既に決まっているため、このアプローチではシートの再表示時に動的に高さが変わることになります。
- 初回表示時にコンテンツの高さが取得されるまでの間、デフォルトの高さが適用されます。

この方法で、コンテンツの高さに基づいたシートの高さを動的に設定できるようになります。要件に合わせてこの実装をカスタマイズしてみてください。

---

## 👤 ユーザー
*2024/08/23 18:09:33*

iOS16.4以降ではいろいろ機能が追加されて異いるらしい。

---

## 🤖 アシスタント
*2024/08/23 18:09:59*

そうですね、iOS 16.4以降では、いくつかの新機能や改善が追加されています。ここでは、特に開発者に関連する主な変更点や新機能を紹介します。

### iOS 16.4以降の主な新機能と改善点

1. **Web Push通知のサポート**:
   - iOS 16.4から、SafariなどのウェブアプリがWeb Push通知をサポートするようになりました。これにより、ホーム画面に追加したウェブアプリでもプッシュ通知を受け取ることが可能になりました。

2. **Webアプリのバッジ表示**:
   - ウェブアプリは、iOSのホーム画面に追加されたときにバッジを表示できるようになりました。これにより、未読メッセージや通知数をユーザーに視覚的に示すことができます。

3. **Matterアクセサリの改善**:
   - Matter（スマートホームの相互運用性標準）のサポートが改善され、Matter対応アクセサリの管理がより安定し、互換性が向上しました。

4. **5Gスタンドアロンのサポート**:
   - 一部のキャリアで、5Gスタンドアロンモードがサポートされました。これにより、5Gの高速通信をフルに活用することができます。

5. **SafariのWebKit機能の改善**:
   - WebKitの改善により、Safariでのウェブ閲覧がさらに高速化され、より多くのウェブ標準に対応するようになりました。

6. **新しいUnicode 15.0絵文字**:
   - iOS 16.4には、Unicode 15.0に基づく新しい絵文字が追加されています。

7. **`SwiftUI`の改善**:
   - `SwiftUI`のいくつかの新機能や改善が追加されました。たとえば、`NavigationStack`や`NavigationSplitView`の改善に

---
