# Adjust Text Position

日付: 2023-06-20

---

## 👤 ユーザー
*2023/6/21 3:19:02*

Text("スマートフォンを顔から30cmほどはなして、\\n画面上の赤い丸を見続けてください")の文言を画面の下から 2/5 の高さにしたい場合はどうするのか？

public struct GazeTrackCalibrationView: View {
    @Environment(\\.dismiss) private var dismiss
    @StateObject private var presenter: GazeTrackCalibrationPresenter

    public init(orientation: AppUIInterfaceOrientation, shouldShowCalibrationView: Binding&lt;Bool&gt;) {
        \_presenter = StateObject(wrappedValue: GazeTrackCalibrationPresenter(orientation: orientation, shouldShowCalibrationView: shouldShowCalibrationView))
    }

    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            // TODO: Spacer()によらない高さ調整（横画面対応も考えると難しかも？）
            Text("スマートフォンを顔から30cmほどはなして、\\n画面上の赤い丸を見続けてください")
                .typographyStyle(.body2)
                .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                .multilineTextAlignment(.center)
                .isHidden(presenter.isCalibrating, remove: true)
            
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
            .isHidden(presenter.isCalibrating, remove: true)

            ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)
        }
        .edgesIgnoringSafeArea(.all)
        .alert(isPresented: $presenter.shouldShowAlert) {
            // TODO: エラー設計
            Alert(title: Text("Error"),
                  message: Text(presenter.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $presenter.shouldShowLandscapeRightCalibration) {
            GazeTrackCalibrationView(orientation: .landscapeRight, shouldShowCalibrationView: $presenter.shouldShowCalibrationView)
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 アシスタント
*2023/6/21 3:19:52*

指定された位置にテキストを配置するためには、`GeometryReader`を使って視覚的なコンテナのサイズを知り、その情報を元にテキストの位置を計算することができます。

以下に示すのは、画面の下から2/5の位置にテキストを配置する例です。

```swift
public var body: some View {
    GeometryReader { geometry in
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                .typographyStyle(.body2)
                .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                .multilineTextAlignment(.center)
                .position(x: geometry.size.width / 2, y: geometry.size.height * 3 / 5)
                .isHidden(presenter.isCalibrating, remove: true)
            
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
            .isHidden(presenter.isCalibrating, remove: true)

            ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)
        }
        .edgesIgnoringSafeArea(.all)
        .alert(isPresented: $presenter.shouldShowAlert) {
            Alert(title: Text("Error"),
                  message: Text(presenter.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $presenter.shouldShowLandscapeRightCalibration) {
            GazeTrackCalibrationView(orientation: .landscapeRight, shouldShowCalibrationView: $presenter.shouldShowCalibrationView)
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

このコードでは、`GeometryReader`を使って視覚的なコンテナのサイズ（`geometry.size`）を取得し、その高さの3/5（画面の下から2/5）の位置にテキストを配置しています。また、テキストを画面の中央に配置するために、幅の1/2をx座標として使用しています。

---
