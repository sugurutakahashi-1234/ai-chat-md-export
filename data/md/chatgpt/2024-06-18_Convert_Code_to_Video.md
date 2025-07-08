# Convert Code to Video

日付: 2024-06-18

---

## 👤 ユーザー
*2024/06/18 12:46:27*

これを動画に変換したい

extension UIImage: @retroactive Transferable {
    public static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .png) { image in
            if let pngData = image.pngData() {
                return pngData
            } else {
                throw AppError.customError()
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/06/18 12:46:46*

こちらはコードを動画に変換する手順です。SwiftUIとAVFoundationを使用してコードのプロセスを動画にすることができます。以下の手順を参考にしてください。

### ステップ 1: プロジェクトの準備

1. 新しいSwiftUIプロジェクトを作成します。
2. `AVFoundation`フレームワークを追加します。

### ステップ 2: コードの表示を準備

コードを表示するためのビューを作成します。

```swift
import SwiftUI

struct CodeView: View {
    var body: some View {
        Text("""
        extension UIImage: @retroactive Transferable {
            public static var transferRepresentation: some TransferRepresentation {
                DataRepresentation(exportedContentType: .png) { image in
                    if let pngData = image.pngData() {
                        return pngData
                    } else {
                        throw AppError.customError()
                    }
                }
            }
        }
        """)
        .font(.system(size: 16, design: .monospaced))
        .padding()
    }
}
```

### ステップ 3: 動画録画のセットアップ

`AVCaptureSession`と`AVCaptureMovieFileOutput`を使用して画面を録画する設定をします。

```swift
import AVFoundation

class VideoRecorder: NSObject, ObservableObject {
    private var session: AVCaptureSession?
    private var movieOutput: AVCaptureMovieFileOutput?
    private var outputURL: URL?
    
    func startRecording() {
        session = AVCaptureSession()
        session?.sessionPreset = .high
        guard let session = session else { return }
        
        movieOutput = AVCaptureMovieFileOutput()
        guard let movieOutput = movieOutput else { return }
        
        if session.canAddOutput(movieOutput) {
            session.addOutput(movieOutput)
        }
        
        outputURL = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString).appendingPathExtension("mov")
        
        session.startRunning()
        movieOutput.startRecording(to: outputURL!, recordingDelegate: self)
    }
    
    func stopRecording() {
        movieOutput?.stopRecording()
        session?.stopRunning()
    }
}

extension VideoRecorder: AVCaptureFileOutputRecordingDelegate {
    func fileOutput(_ output: AVCaptureFileOutput, didFinishRecordingTo outputFileURL: URL, from connections: [AVCaptureConnection], error: Error?) {
        if let error = error {
            print("Error recording movie: \(error.localizedDescription)")
        } else {
            print("Movie recorded successfully to: \(outputFileURL)")
        }
    }
}
```

### ステップ 4: UIの統合

SwiftUIで録画の開始と停止を行うボタンを設置します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var videoRecorder = VideoRecorder()
    
    var body: some View {
        VStack {
            CodeView()
            HStack {
                Button("Start Recording") {
                    videoRecorder.startRecording()
                }
                .padding()
                
                Button("Stop Recording") {
                    videoRecorder.stopRecording()
                }
                .padding()
            }
        }
    }
}
```

### ステップ 5: 実行

アプリを実行して「Start Recording」ボタンを押すと、コードが表示されたビューの録画が開始されます。「Stop Recording」ボタンを押すと録画が停止し、動画が保存されます。

この設定を用いて、Swiftのコードを動画に変換するプロセスを簡単に実行することができます。

---
