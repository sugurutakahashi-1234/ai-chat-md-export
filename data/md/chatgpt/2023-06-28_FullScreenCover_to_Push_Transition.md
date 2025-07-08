# FullScreenCover to Push Transition

日付: 2023-06-28

---

## 👤 ユーザー
*2023/6/28 21:18:36*

fullScreenCover の遷移をpush遷移にしたい

// TODO: ローカライゼーション
public struct GazeTrackCalibrationView: View {
    @StateObject private var presenter: GazeTrackCalibrationPresenter

    public init(
        orientation: AppUIInterfaceOrientation,
        shouldShowCalibrationView: Binding&lt;Bool&gt;,
        gazeCalibrationFinishedStatus: Binding&lt;GazeCalibrationFinishedStatus?&gt;
    ) {
        _presenter = StateObject(wrappedValue: GazeTrackCalibrationPresenter(
            orientation: orientation,
            shouldShowCalibrationView: shouldShowCalibrationView,
            gazeCalibrationFinishedStatus: gazeCalibrationFinishedStatus
        ))
    }

    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            switch presenter.calibrationStatus {
            case .notStarted:
                // Figmaにはないが実装必要そうなので実装した
                VStack {
                    HStack {
                        Button {
                            presenter.closeButtonTapped()
                        } label: {
                            Text("中断する")
                        }
                        .padding(.top, presenter.orientation == .portrait ? 56 : 28)
                        .padding(.leading, presenter.orientation == .portrait ? 28 : 56)
                        Spacer()
                    }
                    Spacer()
                }

                // TODO: 画面が縦横のときのpaddingをデザイン通りにする（現在は簡易的にSpacerで調整している）
                VStack {
                    Spacer()
                    Spacer()
                    Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                        .typographyStyle(.body2)
                        .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                        .multilineTextAlignment(.center)
                        .padding(.top, 16)
                    Spacer()
                }

                // Figmaにはないが実装必要そうなので実装した
                VStack {
                    Spacer()
                    Button {
                        presenter.calibrationStartButtonTapped()
                    } label: {
                        Text("キャリブレーションを開始する")
                    }
                    .buttonStyle(CustomButtonStyle(.primary))
                    .disabled(!presenter.canStartCalibration)
                    .padding(.horizontal, 24)
                    .padding(.bottom, 42)
                }

                // キャリブレーション開始前の中央表示用の赤丸
                ProgressCircle()

            case .started:
                ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)

            case .finished:
                EmptyView()
            }
        }
        .edgesIgnoringSafeArea(.all)
        .navigationBarHidden(true)
        .alert(isPresented: $presenter.shouldShowAlert) {
            // TODO: エラー設計
            Alert(
                title: Text("エラー"),
                message: Text("キャリブレーションに失敗しました"),
                dismissButton: .default(Text("OK"))
            )
        }
        .fullScreenCover(isPresented: $presenter.shouldShowLandscapeRightCalibration) {
            GazeTrackCalibrationView(
                orientation: .landscapeRight,
                shouldShowCalibrationView: $presenter.shouldShowCalibrationView,
                gazeCalibrationFinishedStatus: $presenter.gazeCalibrationFinishedStatus
            )
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 アシスタント
*2023/6/28 21:19:30*

SwiftUIでのフルスクリーン遷移は、通常 `.fullScreenCover(isPresented:content:)` メソッドを使用して行われますが、これは新しいビューをモーダルとして表示します。しかし、フルスクリーン遷移をpush遷移にする方法が直接的にはありません。代わりにNavigationLinkを使用して新しい画面をpushすることができますが、この場合でもフルスクリーン表示にするためには追加の作業が必要です。

以下にその一例を示します。`NavigationView`を追加し、必要な遷移を `NavigationLink` で実装します。NavigationLinkは`isActive`パラメータで制御できます。

```swift
public struct GazeTrackCalibrationView: View {
    //...

    @State private var isNextViewActive = false

    public var body: some View {
        NavigationView {
            ZStack {
                //...

                NavigationLink(
                    destination: GazeTrackCalibrationView(
                        orientation: .landscapeRight,
                        shouldShowCalibrationView: $presenter.shouldShowCalibrationView,
                        gazeCalibrationFinishedStatus: $presenter.gazeCalibrationFinishedStatus
                    ),
                    isActive: $isNextViewActive
                ) {
                    EmptyView()
                }
                
                //...
            }
            .navigationBarHidden(true)
            .edgesIgnoringSafeArea(.all)
        }
        .onAppear {
            isNextViewActive = presenter.shouldShowLandscapeRightCalibration
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

この場合、`NavigationLink`は非表示となり、`isNextViewActive`の状態に基づいて遷移します。遷移が必要なときは、`presenter.shouldShowLandscapeRightCalibration`の値を監視して`isNextViewActive`を更新します。

ただし、この解決策はあくまでワークアラウンドであり、`.fullScreenCover`のような直感的なフルスクリーン表示とは異なる結果をもたらす場合があります。この方法での遷移は、画面全体をカバーするモーダルではなく、ナビゲーションスタックに新しいビューを追加する形になります。この違いが重要な場合、要件やUIの設計を再考することも必要かもしれません。

---
