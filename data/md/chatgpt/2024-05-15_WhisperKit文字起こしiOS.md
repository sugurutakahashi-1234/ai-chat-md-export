# WhisperKit文字起こしiOS

日付: 2024-05-15

---

## 👤 ユーザー
*2024/5/15 14:01:56*

iOSでWhisperKitを使ってリアルタイムでの文字起こし

---

## 🤖 アシスタント
*2024/5/15 14:02:22*

WhisperKitを使ってiOSアプリでリアルタイムの文字起こしを実装するには、以下のステップに従うと良いでしょう。WhisperKitはOpenAIのWhisperモデルを使用して音声をテキストに変換します。具体的な手順は以下の通りです。

### 1. WhisperKitのインストール

まず、プロジェクトにWhisperKitをインストールします。Podfileに以下の行を追加して、CocoaPodsを使ってインストールします。

```ruby
pod 'WhisperKit'
```

その後、ターミナルで以下のコマンドを実行します。

```bash
pod install
```

### 2. マイクの使用許可

マイクへのアクセスを許可するために、`Info.plist`に以下のエントリーを追加します。

```xml
<key>NSMicrophoneUsageDescription</key>
<string>音声入力のためにマイクを使用します</string>
```

### 3. WhisperKitのセットアップ

アプリケーション内でWhisperKitを初期化し、音声認識を開始するコードを記述します。以下は基本的な実装例です。

```swift
import WhisperKit

class ViewController: UIViewController {

    var whisper: WhisperKit?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // WhisperKitの初期化
        whisper = WhisperKit()
        
        // マイクからの音声入力を開始
        startRecording()
    }
    
    func startRecording() {
        whisper?.startRecording(completion: { [weak self] result in
            switch result {
            case .success(let transcription):
                DispatchQueue.main.async {
                    // 文字起こし結果を表示
                    self?.handleTranscription(transcription)
                }
            case .failure(let error):
                // エラー処理
                print("録音中にエラーが発生しました: \(error)")
            }
        })
    }
    
    func handleTranscription(_ transcription: String) {
        // ここで文字起こし結果を処理
        print("文字起こし結果: \(transcription)")
    }
}
```

### 4. エラー処理とUIの更新

リアルタイムで文字起こしを表示するためには、UIの更新も考慮する必要があります。例えば、テキストビューに文字起こし結果を表示する場合は、以下のように実装します。

```swift
import WhisperKit

class ViewController: UIViewController {

    @IBOutlet weak var transcriptionTextView: UITextView!
    var whisper: WhisperKit?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // WhisperKitの初期化
        whisper = WhisperKit()
        
        // マイクからの音声入力を開始
        startRecording()
    }
    
    func startRecording() {
        whisper?.startRecording(completion: { [weak self] result in
            switch result {
            case .success(let transcription):
                DispatchQueue.main.async {
                    // 文字起こし結果を表示
                    self?.transcriptionTextView.text = transcription
                }
            case .failure(let error):
                // エラー処理
                print("録音中にエラーが発生しました: \(error)")
            }
        })
    }
}
```

### 5. 録音停止の実装

アプリケーションで録音を停止する機能も追加する必要があります。ボタンを使用して録音の開始・停止を制御する例を以下に示します。

```swift
class ViewController: UIViewController {

    @IBOutlet weak var transcriptionTextView: UITextView!
    @IBOutlet weak var recordButton: UIButton!
    var whisper: WhisperKit?
    var isRecording = false

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // WhisperKitの初期化
        whisper = WhisperKit()
    }
    
    @IBAction func toggleRecording(_ sender: UIButton) {
        if isRecording {
            stopRecording()
        } else {
            startRecording()
        }
        isRecording.toggle()
        updateButtonTitle()
    }
    
    func startRecording() {
        whisper?.startRecording(completion: { [weak self] result in
            switch result {
            case .success(let transcription):
                DispatchQueue.main.async {
                    // 文字起こし結果を表示
                    self?.transcriptionTextView.text = transcription
                }
            case .failure(let error):
                // エラー処理
                print("録音中にエラーが発生しました: \(error)")
            }
        })
    }
    
    func stopRecording() {
        whisper?.stopRecording()
    }
    
    func updateButtonTitle() {
        let title = isRecording ? "Stop Recording" : "Start Recording"
        recordButton.setTitle(title, for: .normal)
    }
}
```

このコードでは、録音の開始・停止をボタンで制御し、UIの更新を行います。

### 注意点

- WhisperKitが正式に提供されているか、または最新のライブラリを利用しているかを確認してください。
- WhisperKitのドキュメントやサンプルコードを参照して、最新の実装方法を確認することをお勧めします。

これで、iOSアプリでWhisperKitを使ってリアルタイムの文字起こしを実装するための基本的な手順は完了です。必要に応じて、さらなるカスタマイズやエラー処理を追加してください。

---

## 👤 ユーザー
*2024/5/15 14:02:50*

でもこれってレコーディングが終了したタイミングでの文字起こしだよね？

---

## 🤖 アシスタント
*2024/5/15 14:03:09*

おっしゃる通り、前述のコードでは録音が終了したタイミングで文字起こしが行われます。リアルタイムで文字起こしを行うためには、音声データを継続的に処理し、随時文字起こし結果を取得する必要があります。以下に、リアルタイムで文字起こしを行うための実装方法を示します。

### リアルタイム文字起こしの実装

リアルタイムで文字起こしを行うためには、音声データをフレーム単位で取得し、逐次処理する必要があります。以下はその基本的な流れを示すコード例です。

1. **必要なフレームワークのインポート**

   音声の録音には`AVFoundation`を使用します。

   ```swift
   import AVFoundation
   import WhisperKit
   ```

2. **クラスプロパティの宣言**

   `AVAudioEngine`を使用して音声データを取得します。

   ```swift
   class ViewController: UIViewController {

       @IBOutlet weak var transcriptionTextView: UITextView!
       @IBOutlet weak var recordButton: UIButton!
       
       var whisper: WhisperKit?
       var audioEngine = AVAudioEngine()
       var recognitionTask: SFSpeechRecognitionTask?
       var isRecording = false

       override func viewDidLoad() {
           super.viewDidLoad()
           
           // WhisperKitの初期化
           whisper = WhisperKit()
       }
   }
   ```

3. **録音と文字起こしの開始**

   `AVAudioEngine`を使ってマイクからの音声データをリアルタイムで取得し、それをWhisperKitに渡して文字起こしを行います。

   ```swift
   func startRecording() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
           try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
       } catch {
           print("Audio session properties weren't set because of an error.")
           return
       }

       let inputNode = audioEngine.inputNode
       let recordingFormat = inputNode.outputFormat(forBus: 0)
       inputNode.removeTap(onBus: 0)
       inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, when in
           self.whisper?.processAudioBuffer(buffer) { [weak self] result in
               switch result {
               case .success(let transcription):
                   DispatchQueue.main.async {
                       self?.transcriptionTextView.text = transcription
                   }
               case .failure(let error):
                   print("Error during transcription: \(error)")
               }
           }
       }

       audioEngine.prepare()
       do {
           try audioEngine.start()
       } catch {
           print("AudioEngine couldn't start because of an error.")
       }

       isRecording = true
       updateButtonTitle()
   }
   ```

4. **録音の停止**

   録音を停止するには、`audioEngine`を停止し、マイク入力を解除します。

   ```swift
   func stopRecording() {
       audioEngine.stop()
       audioEngine.inputNode.removeTap(onBus: 0)
       isRecording = false
       updateButtonTitle()
   }
   ```

5. **ボタンの更新**

   録音の開始と停止をボタンで制御します。

   ```swift
   @IBAction func toggleRecording(_ sender: UIButton) {
       if isRecording {
           stopRecording()
       } else {
           startRecording()
       }
   }
   
   func updateButtonTitle() {
       let title = isRecording ? "Stop Recording" : "Start Recording"
       recordButton.setTitle(title, for: .normal)
   }
   ```

### まとめ

このコード例では、`AVAudioEngine`を使用してリアルタイムで音声データを取得し、それをWhisperKitで処理してリアルタイムの文字起こしを実現しています。実際のアプリケーションでは、エラー処理やユーザーインターフェースの調整を追加して、より良いユーザー体験を提供することができます。

また、WhisperKitがリアルタイム文字起こしをサポートしているかを確認するために、最新のドキュメントやライブラリのバージョンを確認することも重要です。

---
