# fullScreenCover to push transition

日付: 2023-06-22

---

## 👤 ユーザー
*2023/06/23 05:49:09*

public struct GazeTrackCalibrationView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var presenter: GazeTrackCalibrationPresenter

    public init(orientation: AppUIInterfaceOrientation, shouldShowCalibrationView: Binding&lt;Bool&gt;) {
        _presenter = StateObject(wrappedValue: GazeTrackCalibrationPresenter(orientation: orientation, shouldShowCalibrationView: shouldShowCalibrationView))
    }

    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            VStack {
                HStack {
                    Button {
                        dismiss.callAsFunction()
                    } label: {
                        Text("閉じる")
                    }
                    .padding(.top, presenter.orientation == .portrait ? 56 : 28)
                    .padding(.leading, presenter.orientation == .portrait ? 28 : 56)
                    Spacer()
                }
                Spacer()
            }
            .isHidden(presenter.isCalibrating, remove: true)

            // TODO: 画面が縦横のときのpaddingをデザイン通りにする（現在は簡易的にSpacerで調整している）
            VStack {
                Spacer()
                Spacer()
                Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                    .multilineTextAlignment(.center)
                    .padding(.top, 16)
                    .isHidden(presenter.isCalibrating, remove: true)
                Spacer()
            }
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
*2023/06/23 05:49:17*

This is a `SwiftUI` view that handles the calibration for gaze tracking, represented by the `GazeTrackCalibrationView` struct. Let me explain the main parts of this code:

- The struct `GazeTrackCalibrationView` implements `View` which is SwiftUI's protocol for user interface. 
- It has two properties:
  - `dismiss`, which is an environment property that helps

---
