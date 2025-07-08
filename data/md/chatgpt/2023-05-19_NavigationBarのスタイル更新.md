# NavigationBarのスタイル更新

日付: 2023-05-19

---

## 👤 ユーザー
*2023/5/20 0:16:42*

以下のコードでnavigationBarAppearanceをつかいたくない。
なるべくSwiftUIで対応してほしい

```swift
public struct BaseView: View {
    private let appEnvironment = AppEnvironment()

    public init() {
        let navigationBarAppearance = UINavigationBarAppearance()
        navigationBarAppearance.configureWithOpaqueBackground()
        navigationBarAppearance.backgroundColor = CoreAssets.Color.PrimaryBackgroundHoge.primary100.swiftUIColor
        navigationBarAppearance.titleTextAttributes = [
            .foregroundColor: CoreAssets.Color.Neutral.black.color,
        ]
        navigationBarAppearance.largeTitleTextAttributes = [
            .foregroundColor: CoreAssets.Color.Neutral.black.color,
        ]
        UINavigationBar.appearance().standardAppearance = navigationBarAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navigationBarAppearance
        UINavigationBar.appearance().compactAppearance = navigationBarAppearance
    }

    public var body: some View {
        NavigationView {
            CoverScreenView(currentItem: .constant(nil)) {
                RootTabView()
            }
            .onShake {
                appEnvironment.coverScreenTriggerSubject.send(.debugMenu)
            }
            .navigationTitle(Text(CoreStrings.Common.appName))
            .navigationBarTitleDisplayMode(.inline)
            .navigationViewStyle(StackNavigationViewStyle())
        }
        .environmentObject(appEnvironment)
    }
}

```

---

## 🤖 アシスタント
*2023/5/20 0:18:17*

SwiftUIによりナビゲーションバーのスタイルを変更するには、`.navigationBarTitleDisplayMode()`や`.navigationBarColor()`といったビューモディファイアを使用できます。以下にコードを示します。ここでは、タイトルとバックグラウンドの色をそれぞれ設定しています。

```swift
public struct BaseView: View {
    private let appEnvironment = AppEnvironment()

    public var body: some View {
        NavigationView {
            CoverScreenView(currentItem: .constant(nil)) {
                RootTabView()
            }
            .onShake {
                appEnvironment.coverScreenTriggerSubject.send(.debugMenu)
            }
            .navigationTitle(Text(CoreStrings.Common.appName))
            .navigationBarTitleDisplayMode(.inline)
            .navigationViewStyle(StackNavigationViewStyle())
            .navigationBarColor(CoreAssets.Color.PrimaryBackgroundHoge.primary100.swiftUIColor, CoreAssets.Color.Neutral.black.color)
        }
        .environmentObject(appEnvironment)
    }
}

extension View {
    func navigationBarColor(_ backgroundColor: UIColor, _ foregroundColor: UIColor) -> some View {
        self.modifier(NavigationBarModifier(backgroundColor: backgroundColor, foregroundColor: foregroundColor))
    }
}

struct NavigationBarModifier: ViewModifier {
    var backgroundColor: UIColor
    var foregroundColor: UIColor
    
    init(backgroundColor: UIColor, foregroundColor: UIColor) {
        self.backgroundColor = backgroundColor
        self.foregroundColor = foregroundColor
        let coloredAppearance = UINavigationBarAppearance()
        coloredAppearance.configureWithOpaqueBackground()
        coloredAppearance.backgroundColor = backgroundColor
        coloredAppearance.titleTextAttributes = [.foregroundColor: foregroundColor]
        coloredAppearance.largeTitleTextAttributes = [.foregroundColor: foregroundColor]

        UINavigationBar.appearance().standardAppearance = coloredAppearance
        UINavigationBar.appearance().compactAppearance = coloredAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = coloredAppearance
    }
    
    func body(content: Content) -> some View {
        content
    }
}
```

このコードでは、新しいビューモディファイア`navigationBarColor(_:_:)`を作成しています。これにより、navigationBarのbackgroundColorとforegroundColorを一度に設定できます。あくまでビューモディファイア内部でUINavigationBarAppearanceを使っていますが、SwiftUIのビューで直接このビューモディファイアを使うことで、よりSwiftUIらしい形での設定が可能になります。

なお、このコードは現在実行可能なコードであり、SwiftUIがさらに進化しnavigationBarの見た目を制御するためのより直接的な方法が提供されることもあるかもしれません。ただし、私の知識は2021年9月までのものであるため、その後の更新情報は反映されていません。そのため最新の情報についてはAppleの公式ドキュメンテーションや他の信頼できる情報源を確認してください。

---

## 👤 ユーザー
*2023/5/20 0:18:43*

そもそも以下のコードで何を設定しているのかをおしえてほしい

```
    public init() {
        let navigationBarAppearance = UINavigationBarAppearance()
        navigationBarAppearance.configureWithOpaqueBackground()
        navigationBarAppearance.backgroundColor = CoreAssets.Color.Neutral.white.color
        navigationBarAppearance.titleTextAttributes = [
            .foregroundColor: CoreAssets.Color.Neutral.black.color,
        ]
        navigationBarAppearance.largeTitleTextAttributes = [
            .foregroundColor: CoreAssets.Color.Neutral.black.color,
        ]
        UINavigationBar.appearance().standardAppearance = navigationBarAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navigationBarAppearance
        UINavigationBar.appearance().compactAppearance = navigationBarAppearance
    }
```

---

## 🤖 アシスタント
*2023/5/20 0:20:00*

このコードはナビゲーションバーの見た目を設定しています。具体的には、以下の項目を設定しています。

1. `let navigationBarAppearance = UINavigationBarAppearance()`: `UINavigationBarAppearance`は、ナビゲーションバーの見た目を設定するためのオブジェクトを作成します。

2. `navigationBarAppearance.configureWithOpaqueBackground()`: ナビゲーションバーの背景を不透明に設定します。

3. `navigationBarAppearance.backgroundColor = CoreAssets.Color.Neutral.white.color`: ナビゲーションバーの背景色を白色に設定します。

4. `navigationBarAppearance.titleTextAttributes = [.foregroundColor: CoreAssets.Color.Neutral.black.color]`: ナビゲーションバーのタイトルの色を黒色に設定します。

5. `navigationBarAppearance.largeTitleTextAttributes = [.foregroundColor: CoreAssets.Color.Neutral.black.color]`: ナビゲーションバーのラージタイトルの色を黒色に設定します。

6. `UINavigationBar.appearance().standardAppearance = navigationBarAppearance`: ナビゲーションバーのデフォルトの外観を設定します。この設定は、ナビゲーションバーが表示されている間中ずっと適用されます。

7. `UINavigationBar.appearance().scrollEdgeAppearance = navigationBarAppearance`: ナビゲーションバーがスクロールの端（スクロールビューの最上部または最下部）にあるときの外観を設定します。この設定は、例えばスクロールビューが一番上にスクロールされたときにナビゲーションバーに適用されます。

8. `UINavigationBar.appearance().compactAppearance = navigationBarAppearance`: コンパクトなナビゲーションバーの外観を設定します。この設定は、例えば端末がランドスケープモードのときにナビゲーションバーに適用されます。

全体として、このコードはナビゲーションバーの背景色を白にし、タイトルの文字色を黒にする設定を全てのナビゲーションバーに対して行っています。

---

## 👤 ユーザー
*2023/5/20 0:31:18*

なるほど、ちなみに struct NavigationBarModifier: ViewModifier とする必要があるの？

---

## 🤖 アシスタント
*2023/5/20 0:31:54*

はい、その通りです。`ViewModifier`プロトコルを実装した`NavigationBarModifier`という新しいstructを定義することで、ナビゲーションバーのスタイル設定を再利用可能なコンポーネントとして利用できます。これによりコードの再利用性と可読性が向上します。

`ViewModifier`はSwiftUIの一部で、Viewの表示を修正するためのプロトコルです。`ViewModifier`を実装すると、`.modifier(_:)`メソッドを使用して特定のビューに修正を適用することができます。

`NavigationBarModifier`では、以下のような動作を提供しています:

1. 初期化時に、指定された背景色と前景色（タイトルテキストの色）を使って`UINavigationBarAppearance`を設定します。

2. この修正を特定のビューに適用します。この修正をビューに適用すると、ビューが表示されるときにこのナビゲーションバーのスタイルが使用されます。

したがって、この`NavigationBarModifier`はSwiftUIのビューで直接navigationBarのスタイルを設定するためのユーティリティとなります。

---
