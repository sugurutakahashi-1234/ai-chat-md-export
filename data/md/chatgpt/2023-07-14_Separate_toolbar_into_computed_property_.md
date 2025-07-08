# Separate toolbar into computed property.

Date: 2023-07-14

---

## 👤 User
*2023-07-14 18:15:40*

swiftでツールバーのところを別でコンピューテッドプロパティーにして読みやすくして欲しい

```swift

struct WebMeasurementView: View {
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var navigator: MissionPageNavigator
    @StateObject private var presenter: WebMeasurementPresenter
    @Binding var shouldPushPage: Bool

    init(sessionId: Session.ID, web: MissionValueType.Web, shouldPushPage: Binding<Bool>) {
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, web: web))
        _shouldPushPage = shouldPushPage

        // toolbarBackground() によって bottom のカラーが効かないため以下で代用している
        // TODO: 現状、WebView を最後の下までスクロールするとカラーが消えるというバグが発生しているので対応する
        UIToolbar.appearance().barTintColor = CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.color
    }

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                ZStack {
                    AnalysisWebView(presenter: presenter)
                        .onChange(of: presenter.isReadyToSessionStart) { isReadyToSessionStart in
                            if isReadyToSessionStart {
                                presenter.updateWebViewFrameInfo(frameInfo: FrameInfo(
                                    minLeft: geometry.frame(in: .global).minX,
                                    minTop: geometry.frame(in: .global).minY,
                                    maxLeft: geometry.frame(in: .global).maxX,
                                    maxTop: geometry.frame(in: .global).maxY,
                                    width: geometry.size.width,
                                    height: geometry.size.height
                                ))
                            }
                        }
                    // TODO: デバッグ用のViewを置く予定

                    CoreAssets.Color.Neutral.white.swiftUIColor
                        .isHidden(presenter.isReadyToSessionStart, remove: true)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    Button {
                        presenter.goBackButtonTapped()
                    } label: {
                        SFSymbols.chevronLeft.image
                            .foregroundColor(presenter.canGoBack ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
                    }
                    .disabled(!presenter.canGoBack)

                    Spacer()

                    Button {
                        presenter.goForwardButtonTapped()
                    } label: {
                        SFSymbols.chevronRight.image
                            .foregroundColor(presenter.canGoForward ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
                    }
                    .disabled(!presenter.canGoForward)

                    Spacer()

                    Button {
                        presenter.reloadButtonTapped()
                    } label: {
                        SFSymbols.arrowTriangleDoubleCirclepath.image
                            .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                    }

                    Spacer()

                    Button {
                        Task {
                            await presenter.sessionEndedButtonTapped()
                        }
                    } label: {
                        Text("終了する")
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                    }
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                    .background(CoreAssets.Color.Neutral.white.swiftUIColor.opacity(presenter.isEnabledSessionEndedButton ? 1.0 : 0.5))
                    .cornerRadius(30)
                    .disabled(!presenter.isEnabledSessionEndedButton)
                }
            }
        }
        .overlayLoading(isPresented: $presenter.isLoading)
        .appErrorAlert(isPresented: $presenter.shouldShowGeneralAlert, appError: presenter.appError, onDismiss: {
            dismiss.callAsFunction()
            navigator.closeMissionPage()
        })
        .appErrorAlert(isPresented: $presenter.shouldShowAccessControlErrorAlert, appError: presenter.appError, onDismiss: {
            presenter.closedAccessControlErrorAlert()
        })
        .appErrorAlert(isPresented: $presenter.shouldShowSessionTimeoutAlert, appError: presenter.appError, onDismiss: {
            Task {
                await presenter.closedSessionTimeoutAlert()
            }
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
        .onChange(of: presenter.shouldDismissAndPushPage) { shouldDismissAndPushPage in
            if shouldDismissAndPushPage {
                dismiss.callAsFunction()
                shouldPushPage = true
            }
        }
        .onChange(of: scenePhase) { newScenePhase in
            switch newScenePhase {
            case .inactive, .background:
                Task {
                    // TODO: こちらの処理はなぜか動いていない（onChangeが検知できていなさそう）もし視聴していないとしても、有効なデータが少なくてエラーになるので問題ないかもしれないが、意図した挙動ではないので調査した方が良さそう
                    await presenter.interruptionAnalysis()
                }
            default:
                break
            }
        }
    }
}

```

---

## 🤖 Assistant
*2023-07-14 18:16:11*

ツールバー部分を別のコンピューテッドプロパティとして管理し、コードの読みやすさを向上させることは可能です。以下に、ツールバー部分を別のコンピューテッドプロパティ`toolbarContent`に分けた例を示します。

```swift
struct WebMeasurementView: View {
    // ... your properties ...

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                ZStack {
                    // ... your code ...
                }
            }
            .toolbar { toolbarContent }
        }
        // ... your code ...
    }

    @ViewBuilder
    var toolbarContent: some View {
        ToolbarItemGroup(placement: .bottomBar) {
            Button {
                presenter.goBackButtonTapped()
            } label: {
                SFSymbols.chevronLeft.image
                    .foregroundColor(presenter.canGoBack ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoBack)

            Spacer()

            Button {
                presenter.goForwardButtonTapped()
            } label: {
                SFSymbols.chevronRight.image
                    .foregroundColor(presenter.canGoForward ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoForward)

            Spacer()

            Button {
                presenter.reloadButtonTapped()
            } label: {
                SFSymbols.arrowTriangleDoubleCirclepath.image
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }

            Spacer()

            Button {
                Task {
                    await presenter.sessionEndedButtonTapped()
                }
            } label: {
                Text("終了する")
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
            }
            .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
            .background(CoreAssets.Color.Neutral.white.swiftUIColor.opacity(presenter.isEnabledSessionEndedButton ? 1.0 : 0.5))
            .cornerRadius(30)
            .disabled(!presenter.isEnabledSessionEndedButton)
        }
    }
}
```
このように分けることで、`body`プロパティの見通しが良くなり、読みやすさを向上させることが可能です。ただし、この方法はコードの整理のためのものであり、動作には影響を与えません。

---

## 👤 User
*2023-07-14 18:17:33*

Return type of property 'toolbarContent' requires that 'ToolbarItemGroup&lt;TupleView&lt;(some View, Spacer, some View, Spacer, Button&lt;some View&gt;, Spacer, some View)&gt;&gt;' conform to 'View' というエラーになった

---

## 🤖 Assistant
*2023-07-14 18:18:03*

すみません、私のミスでした。`ToolbarItemGroup`が具体的な`View`を返す必要があります。以下に修正したコードを示します。

```swift
struct WebMeasurementView: View {
    // ... your properties ...

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                ZStack {
                    // ... your code ...
                }
            }
            .toolbar { toolbarContent }
        }
        // ... your code ...
    }

    @ViewBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItemGroup(placement: .bottomBar) {
            Button {
                presenter.goBackButtonTapped()
            } label: {
                SFSymbols.chevronLeft.image
                    .foregroundColor(presenter.canGoBack ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoBack)

            Spacer()

            Button {
                presenter.goForwardButtonTapped()
            } label: {
                SFSymbols.chevronRight.image
                    .foregroundColor(presenter.canGoForward ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoForward)

            Spacer()

            Button {
                presenter.reloadButtonTapped()
            } label: {
                SFSymbols.arrowTriangleDoubleCirclepath.image
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }

            Spacer()

            Button {
                Task {
                    await presenter.sessionEndedButtonTapped()
                }
            } label: {
                Text("終了する")
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
            }
            .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
            .background(CoreAssets.Color.Neutral.white.swiftUIColor.opacity(presenter.isEnabledSessionEndedButton ? 1.0 : 0.5))
            .cornerRadius(30)
            .disabled(!presenter.isEnabledSessionEndedButton)
        }
    }
}
```

ここで、`toolbarContent` の型を `some ToolbarContent` にすることで、正しく `ToolbarItemGroup` を返すようにしています。

---

## 👤 User
*2023-07-14 18:18:23*

というエラーが出た

Static method 'buildBlock' requires that 'ToolbarItemGroup&lt;TupleView&lt;(some View, Spacer, some View, Spacer, Button&lt;some View&gt;, Spacer, some View)&gt;&gt;' conform to 'View'

---

## 🤖 Assistant
*2023-07-14 18:18:59*

すみません、それは私の間違いでした。`ToolbarItemGroup`自体が`View`を返すわけではなく、その中に含まれる各要素が`View`を返します。したがって、各`Button`を個々のコンピューテッドプロパティとして定義し、それを直接`toolbar`内で使用する方が良いでしょう。以下に修正したコードを示します。

```swift
struct WebMeasurementView: View {
    // ... your properties ...

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                ZStack {
                    // ... your code ...
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    goBackButton
                    Spacer()
                    goForwardButton
                    Spacer()
                    reloadButton
                    Spacer()
                    sessionEndedButton
                }
            }
        }
        // ... your code ...
    }

    private var goBackButton: some View {
        Button {
            presenter.goBackButtonTapped()
        } label: {
            SFSymbols.chevronLeft.image
                .foregroundColor(presenter.canGoBack ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
        }
        .disabled(!presenter.canGoBack)
    }

    private var goForwardButton: some View {
        Button {
            presenter.goForwardButtonTapped()
        } label: {
            SFSymbols.chevronRight.image
                .foregroundColor(presenter.canGoForward ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
        }
        .disabled(!presenter.canGoForward)
    }

    private var reloadButton: some View {
        Button {
            presenter.reloadButtonTapped()
        } label: {
            SFSymbols.arrowTriangleDoubleCirclepath.image
                .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
        }
    }

    private var sessionEndedButton: some View {
        Button {
            Task {
                await presenter.sessionEndedButtonTapped()
            }
        } label: {
            Text("終了する")
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
        }
        .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
        .background(CoreAssets.Color.Neutral.white.swiftUIColor.opacity(presenter.isEnabledSessionEndedButton ? 1.0 : 0.5))
        .cornerRadius(30)
        .disabled(!presenter.isEnabledSessionEndedButton)
    }
}
```

このようにすれば、各ボタンが別のコンピューテッドプロパティとして分けられ、全体の見通しが良くなります。

---

## 👤 User
*2023-07-14 18:19:47*

こんなに細かくする必要なないのでGroupで囲ってしまったりHstackで囲ってしまえば、ひとつｊのコンピューテッドプロパティーで定義できるのかな？

---

## 🤖 Assistant
*2023-07-14 18:20:22*

はい、その通りです。`HStack` を使用してボタン群をひとつのグループにまとめることで、全てのボタンをひとつのコンピューテッドプロパティで表現することが可能です。

以下の例では、`HStack`で4つのボタンとそれらの間の`Spacer`をまとめ、`toolbarButtons`というコンピューテッドプロパティとして定義しています。

```swift
struct WebMeasurementView: View {
    // ... your properties ...

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                ZStack {
                    // ... your code ...
                }
            }
            .toolbar {
                ToolbarItem(placement: .bottomBar) {
                    toolbarButtons
                }
            }
        }
        // ... your code ...
    }

    private var toolbarButtons: some View {
        HStack {
            Button {
                presenter.goBackButtonTapped()
            } label: {
                SFSymbols.chevronLeft.image
                    .foregroundColor(presenter.canGoBack ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoBack)

            Spacer()

            Button {
                presenter.goForwardButtonTapped()
            } label: {
                SFSymbols.chevronRight.image
                    .foregroundColor(presenter.canGoForward ? CoreAssets.Color.Neutral.white.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
            }
            .disabled(!presenter.canGoForward)

            Spacer()

            Button {
                presenter.reloadButtonTapped()
            } label: {
                SFSymbols.arrowTriangleDoubleCirclepath.image
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }

            Spacer()

            Button {
                Task {
                    await presenter.sessionEndedButtonTapped()
                }
            } label: {
                Text("終了する")
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
            }
            .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
            .background(CoreAssets.Color.Neutral.white.swiftUIColor.opacity(presenter.isEnabledSessionEndedButton ? 1.0 : 0.5))
            .cornerRadius(30)
            .disabled(!presenter.isEnabledSessionEndedButton)
        }
    }
}
```

このようにすることで、ツールバーのボタン全体を一つのコンピューテッドプロパティとしてまとめることができます。

---
