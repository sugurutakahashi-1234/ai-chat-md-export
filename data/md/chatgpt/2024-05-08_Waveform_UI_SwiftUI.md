# Waveform UI SwiftUI

日付: 2024-05-08

---

## 👤 ユーザー
*2024/05/08 12:56:43*

iOSアプリで録音中と再生中に音量などに合わせた波形のUIを表示したい
それをSwiftUIで実現したいんだけどどうすればいい？

---

## 🤖 アシスタント
*2024/05/08 12:57:39*

SwiftUIで音量に合わせた波形のUIを実装するには、音声の振幅データをリアルタイムで取得し、そのデータをグラフィカルに表示する必要があります。以下に基本的な手順を説明します。

### 必要なツール
1. **AVFoundation**: 音声の録音と再生を管理します。
2. **SwiftUI**: UIを構築します。
3. **Combine**: データのバインディングと更新のために使用します。

### ステップ1: 音声の録音とデータ取得
`AVAudioRecorder`を使用して音声を録音し、録音中に音声の振幅を周期的に取得します。

```swift
import AVFoundation

class AudioRecorder: NSObject, ObservableObject {
    var audioRecorder: AVAudioRecorder?
    var timer: Timer?
    @Published var soundSamples: [Float] = []

    func startRecording() {
        let audioFilename = getDocumentsDirectory().appendingPathComponent("recording.m4a")
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 12000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]

        do {
            audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
            audioRecorder?.record()
            timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
                self?.updateSoundSamples()
            }
        } catch {
            print("Failed to start recording.")
        }
    }

    func updateSoundSamples() {
        audioRecorder?.updateMeters()
        let normalizedValue = pow(10, audioRecorder?.averagePower(forChannel: 0) ?? 0 / 20)
        soundSamples.append(normalizedValue)
        if soundSamples.count > 100 {
            soundSamples.removeFirst()
        }
    }

    func stopRecording() {
        audioRecorder?.stop()
        timer?.invalidate()
    }

    private func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
}
```

### ステップ2: SwiftUIでの波形の表示
取得した音声の振幅を元に、SwiftUIで波形を描画します。

```swift
import SwiftUI

struct WaveformView: View {
    @ObservedObject var audioRecorder: AudioRecorder

    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let width = geometry.size.width
                let height = geometry.size.height
                let step = width / CGFloat(audioRecorder.soundSamples.count)

                var x: CGFloat = 0
                for sample in audioRecorder.soundSamples {
                    let y = CGFloat(sample) * height
                    path.move(to: CGPoint(x: x, y: height / 2))
                    path.addLine(to: CGPoint(x: x, y: height / 2 - y))
                    x += step
                }
            }
            .stroke(Color.blue, lineWidth: 2)
        }
    }
}
```

### 実行と組み込み
`WaveformView`をアプリの適切な場所に組み込んで、`AudioRecorder`を初期化して録音を開始します。

これで、SwiftUIを使用してリアルタイムで音声の振幅に基づいた波形を描画できるようになります。各パラメータやデザインはプロジェクトの要件に合わせて調整してください。

---

## 👤 ユーザー
*2024/05/08 12:58:12*

再生時はどうすればいいの？

---

## 🤖 アシスタント
*2024/05/08 12:59:07*

音声の再生中に波形を表示する場合、再生される音声データから振幅を取得して、それをリアルタイムでUIに反映させる必要があります。以下にそのプロセスを説明します。

### 必要なツール
1. **AVFoundation**: 音声の再生を管理します。
2. **SwiftUI** と **Combine**: UIの更新とデータのバインディングに使用します。

### ステップ1: 音声の再生とデータ取得
`AVAudioPlayer` を使用して音声を再生し、再生中に音声の振幅を周期的に取得します。

```swift
import AVFoundation

class AudioPlayer: NSObject, ObservableObject, AVAudioPlayerDelegate {
    var audioPlayer: AVAudioPlayer?
    var timer: Timer?
    @Published var soundSamples: [Float] = []

    func startPlaying(from url: URL) {
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.delegate = self
            audioPlayer?.isMeteringEnabled = true
            audioPlayer?.prepareToPlay()
            audioPlayer?.play()
            timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
                self?.updateSoundSamples()
            }
        } catch {
            print("Failed to initialize the audio player.")
        }
    }

    func updateSoundSamples() {
        audioPlayer?.updateMeters()
        let normalizedValue = pow(10, audioPlayer?.averagePower(forChannel: 0) ?? 0 / 20)
        soundSamples.append(normalizedValue)
        if soundSamples.count > 100 {
            soundSamples.removeFirst()
        }
    }

    func stopPlaying() {
        audioPlayer?.stop()
        timer?.invalidate()
    }
}
```

### ステップ2: SwiftUIでの波形の表示
再生中の音声の振幅を元に、波形を描画します。これは録音時の`WaveformView`と同様です。

```swift
import SwiftUI

struct WaveformView: View {
    @ObservedObject var audioPlayer: AudioPlayer

    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let width = geometry.size.width
                let height = geometry.size.height
                let step = width / CGFloat(audioPlayer.soundSamples.count)

                var x: CGFloat = 0
                for sample in audioPlayer.soundSamples {
                    let y = CGFloat(sample) * height
                    path.move(to: CGPoint(x: x, y: height / 2))
                    path.addLine(to: CGPoint(x: x, y: height / 2 - y))
                    x += step
                }
            }
            .stroke(Color.green, lineWidth: 2) // 再生中は色を変えるなどのカスタマイズが可能
        }
    }
}
```

### 実行と組み込み
`WaveformView`をアプリの適切な場所に組み込み、`AudioPlayer`を初期化して音声の再生を開始します。

このコードは、再生中の音声の振幅に基づいてリアルタイムで波形を描画するための基本的なアプローチを提供します。プロジェクトの要件に合わせてさらに詳細な調整や機能の追加を行ってください。

---

## 👤 ユーザー
*2024/05/08 12:59:27*

再生と録音の波形のコードをうまく共通化できないかな？

---

## 🤖 アシスタント
*2024/05/08 13:00:31*

再生と録音の両方で使用できる共通の波形表示コンポーネントを作成することは、コードの再利用と保守性を向上させる良いアプローチです。以下のステップで共通化を図ることができます。

### ステップ1: 共通の波形データモデルの作成
波形のデータを管理するための共通のデータモデルを作成し、そのデータモデルを使って波形を更新するロジックを中央集権化します。

```swift
import Combine

class WaveformManager: ObservableObject {
    @Published var soundSamples: [Float] = []

    func update(with normalizedValue: Float) {
        soundSamples.append(normalizedValue)
        if soundSamples.count > 100 {
            soundSamples.removeFirst()
        }
    }
}
```

### ステップ2: 録音と再生の各クラスで共通のデータモデルを使用
録音と再生の各クラスで`WaveformManager`のインスタンスを使用し、振幅データを更新します。

```swift
import AVFoundation

class AudioRecorder: NSObject, ObservableObject {
    var audioRecorder: AVAudioRecorder?
    var timer: Timer?
    var waveformManager: WaveformManager

    init(waveformManager: WaveformManager) {
        self.waveformManager = waveformManager
    }

    func startRecording() {
        // setup and start recording
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.updateSoundSamples()
        }
    }

    func updateSoundSamples() {
        audioRecorder?.updateMeters()
        let normalizedValue = pow(10, audioRecorder?.averagePower(forChannel: 0) ?? 0 / 20)
        waveformManager.update(with: normalizedValue)
    }

    // stopRecording function here
}

class AudioPlayer: NSObject, ObservableObject, AVAudioPlayerDelegate {
    var audioPlayer: AVAudioPlayer?
    var timer: Timer?
    var waveformManager: WaveformManager

    init(waveformManager: WaveformManager) {
        self.waveformManager = waveformManager
    }

    func startPlaying(from url: URL) {
        // setup and start playing
        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
            self?.updateSoundSamples()
        }
    }

    func updateSoundSamples() {
        audioPlayer?.updateMeters()
        let normalizedValue = pow(10, audioPlayer?.averagePower(forChannel: 0) ?? 0 / 20)
        waveformManager.update(with: normalizedValue)
    }

    // stopPlaying function here
}
```

### ステップ3: 波形表示用の共通のSwiftUIビューの作成
`WaveformManager`から直接データを受け取り、それを表示する共通のビューを作成します。

```swift
import SwiftUI

struct WaveformView: View {
    @ObservedObject var waveformManager: WaveformManager

    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let width = geometry.size.width
                let height = geometry.size.height
                let step = width / CGFloat(waveformManager.soundSamples.count)

                var x: CGFloat = 0
                for sample in waveformManager.soundSamples {
                    let y = CGFloat(sample) * height
                    path.move(to: CGPoint(x: x, y: height / 2))
                    path.addLine(to: CGPoint(x: x, y: height / 2 - y))
                    x += step
                }
            }
            .stroke(Color.blue, lineWidth: 2) // 再生時や録音時に色を変えることも可能です
        }
    }
}
```

これにより、再生と録音の両方で同じ`WaveformView`を使用し、`WaveformManager`を介してデータを更新することができます。これにより、波形表示のロジックを一元化し、コードの重複を減らすことができます。

---

## 👤 ユーザー
*2024/05/08 13:00:54*

updateSoundSamplesのような処理を共通化したいんだ。delegateは使いたくない

---

## 🤖 アシスタント
*2024/05/08 13:01:56*

音声の録音と再生で共通のデータ処理（特に振幅の更新）を行いたい場合、`AudioRecorder`と`AudioPlayer`からデータ更新ロジックを切り離し、独立したコンポーネントにすると良いでしょう。この方法でdelegateを使わずに処理を共通化することができます。

### ステップ1: 音声データの処理を行う共通のモジュールの作成
音声データを更新する関数を`WaveformManager`に実装し、録音と再生のどちらでも呼び出せるようにします。また、AVAudioSessionをセットアップして、必要に応じて音声の入出力を管理します。

```swift
import AVFoundation

class WaveformManager: ObservableObject {
    @Published var soundSamples: [Float] = []

    func updateSoundSamples(from audioLevelGetter: () -> Float) {
        let normalizedValue = pow(10, audioLevelGetter() / 20)
        soundSamples.append(normalizedValue)
        if soundSamples.count > 100 {
            soundSamples.removeFirst()
        }
    }
}
```

### ステップ2: 録音と再生クラスで共通モジュールを使用
`AudioRecorder`と`AudioPlayer`で共通の`WaveformManager`を使用し、定期的に`updateSoundSamples`を呼び出すようにします。`audioLevelGetter`はクロージャとして、各クラスから現在の音声レベルを取得する方法を`WaveformManager`に渡します。

```swift
class AudioRecorder: NSObject, ObservableObject {
    var audioRecorder: AVAudioRecorder?
    var timer: Timer?
    var waveformManager: WaveformManager

    init(waveformManager: WaveformManager) {
        self.waveformManager = waveformManager
    }

    func startRecording() {
        // setup audio recorder
        audioRecorder?.isMeteringEnabled = true
        audioRecorder?.record()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.waveformManager.updateSoundSamples {
                self?.audioRecorder?.updateMeters()
                return self?.audioRecorder?.averagePower(forChannel: 0) ?? 0
            }
        }
    }
}

class AudioPlayer: NSObject, ObservableObject {
    var audioPlayer: AVAudioPlayer?
    var timer: Timer?
    var waveformManager: WaveformManager

    init(waveformManager: WaveformManager) {
        self.waveformManager = waveformManager
    }

    func startPlaying(from url: URL) {
        // setup audio player
        audioPlayer?.isMeteringEnabled = true
        audioPlayer?.play()
        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
            self?.waveformManager.updateSoundSamples {
                self?.audioPlayer?.updateMeters()
                return self?.audioPlayer?.averagePower(forChannel: 0) ?? 0
            }
        }
    }
}
```

### 説明
この設計により、`AudioRecorder`と`AudioPlayer`は各自の音声レベルの取得方法を`WaveformManager`に渡すだけで済み、実際のデータ更新処理は`WaveformManager`が担います。これによりコードの重複が減り、再利用性が向上します。また、将来的に他の音声処理コンポーネントを追加する場合も、同様の方法で簡単に統合できるようになります。

---

## 👤 ユーザー
*2024/05/08 13:02:58*

以下の処理を解説してほしい

    func updateSoundSamples(from audioLevelGetter: () -&gt; Float) {
        let normalizedValue = pow(10, audioLevelGetter() / 20)
        soundSamples.append(normalizedValue)
        if soundSamples.count &gt; 100 {
            soundSamples.removeFirst()
        }
    }

---

## 🤖 アシスタント
*2024/05/08 13:03:53*

この`updateSoundSamples`関数は、音声の振幅レベルをリアルタイムで更新し、それを波形データとして保存するためのものです。ここでの処理は、音声のデシベルレベルを視覚化しやすい形に変換し、波形として表示できるデータのリストを維持するために使われます。以下に各部分の詳細な解説を行います。

### 引数: `audioLevelGetter`
- `audioLevelGetter`: これはクロージャ（関数ポインタのようなもの）で、特定の瞬間のオーディオの平均パワーレベル（デシベル単位）を返す関数を指します。この関数は、録音または再生のクラスから提供され、それぞれの音声の平均パワーレベルを取得するために使用されます。

### 処理の流れ
1. **正規化された値の計算**
   - `let normalizedValue = pow(10, audioLevelGetter() / 20)`: ここで`audioLevelGetter()`を呼び出すと、現在の音声のデシベル値が返されます。この値を20で割り、10のべき乗を取ることで、デシベル値をより扱いやすい正規化された形（振幅）に変換します。
   - この変換は、デシベルスケール（対数的な値）をリニアスケール（直線的な値）に変換するために行われます。これにより、音声の振幅が0から1の範囲で表現され、UI上での波形表示が容易になります。

2. **波形データの更新**
   - `soundSamples.append(normalizedValue)`: 正規化された音声振幅を`soundSamples`配列に追加します。この配列は、波形ビューでの描画に使われるデータの集まりです。
   
3. **データの管理**
   - `if soundSamples.count > 100 { soundSamples.removeFirst() }`: `soundSamples`の長さが100を超えた場合、最も古いデータ（配列の最初の要素）を削除します。これは、メモリの消費を抑えつつ、最新のデータだけを表示するために行います。つまり、画面上に表示される波形がリアルタイムで更新され続けるようにするための措置です。

この関数は、音声データを視覚的に表現するための非常に重要な役割を担っています。波形ビューがユーザーにとって有益なフィードバックを提供し、音声の録音や再生の状況を直感的に理解するのに役立ちます。

---

## 👤 ユーザー
*2024/05/08 13:10:07*

updateMeters() や averagePower(forChannel: 0) の処理について教えてほしい

---

## 🤖 アシスタント
*2024/05/08 13:11:09*

`updateMeters()`と`averagePower(forChannel: 0)`は、`AVAudioRecorder`や`AVAudioPlayer`といったクラスで使われる、オーディオのレベルメータリングに関連するメソッドです。これらは、iOS開発で音声のデシベル値を取得し、音量レベルを測定する際に重要な役割を果たします。以下にそれぞれのメソッドの詳細と使用法について説明します。

### `updateMeters()`
- **用途**: `AVAudioRecorder`や`AVAudioPlayer`インスタンスのレベルメーターを更新します。これは、録音や再生中のオーディオ信号の現在の平均パワーレベルやピークレベルを取得するために必要な前処理です。
- **動作**: このメソッドは内部的にメーターの値を更新します。オーディオデータの最新のフレームを分析して、その音量レベルを計算します。これは定期的に呼び出される必要があり、通常はタイマーやオーディオの再生フレームコールバック内で使用されます。

### `averagePower(forChannel: channelNumber)`
- **用途**: 指定されたチャンネルの平均パワーレベル（デシベル単位）を取得します。`updateMeters()`メソッドによって更新された後の値です。
- **引数**: `channelNumber` - 平均パワーを取得したいオーディオチャンネルのインデックスです。ステレオオーディオの場合、0は左チャンネル、1は右チャンネルを意味します。
- **戻り値**: 指定されたチャンネルの平均パワーレベルをデシベル単位で返します。この値は通常、0デシベル（最大振幅）を基準とした負の値で、音が大きいほど値は0に近づきます。

### 使用例
以下は`AVAudioRecorder`を使用してオーディオを録音し、リアルタイムでオーディオレベルを取得する例です。

```swift
import AVFoundation

class AudioRecorder: NSObject, AVAudioRecorderDelegate {
    var recorder: AVAudioRecorder!

    override init() {
        super.init()
        let settings = [AVFormatIDKey: Int(kAudioFormatMPEG4AAC), AVSampleRateKey: 44100, AVNumberOfChannelsKey: 2, AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue]
        recorder = try! AVAudioRecorder(url: self.audioFileURL(), settings: settings)
        recorder.isMeteringEnabled = true
        recorder.delegate = self
        recorder.record()

        Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.recorder.updateMeters()
            let averagePower = self?.recorder.averagePower(forChannel: 0) ?? 0
            print("Current average power: \(averagePower) dB")
        }
    }

    func audioFileURL() -> URL {
        // ファイルのURLを返す
    }
}
```
この例では、0.1秒ごとに`updateMeters()`を呼び出し、左チャンネルの平均パワーレベルを取得しています。これにより、オーディオの現在の音量レベルをリアルタイムで監視することが可能です。

---

## 👤 ユーザー
*2024/05/08 13:16:26*

Path で表現しているけど charts を使ったほうがいいのかな？

---

## 🤖 アシスタント
*2024/05/08 13:17:24*

SwiftUIで波形表示を実装する際に、`Path`を使用する方法と`Charts`ライブラリを使用する方法があります。どちらを選択するかは、アプリの要件と目的によります。それぞれの方法の利点と欠点を比較してみましょう。

### `Path`を使用する方法
#### 利点
- **カスタマイズ性**: `Path`を使用すると、描画する波形の見た目を非常に詳細にカスタマイズできます。線の太さ、色、形状など、具体的なスタイルを自由に設定可能です。
- **軽量**: 小さなデータセットでの描画や、シンプルなビジュアルが求められる場合に、リソースの消費を抑えることができます。

#### 欠点
- **複雑なデータ処理**: データをグラフィックに変換する処理を自分で実装する必要があります。大量のデータや複雑な変換が必要な場合、実装が煩雑になることがあります。
- **スケーラビリティ**: 大量のデータ点を扱う際にパフォーマンスの問題が発生する可能性があります。

### `Charts`ライブラリを使用する方法
#### 利点
- **実装の簡便さ**: `Charts`ライブラリは、様々な種類のチャートやグラフを簡単に実装できる機能を提供しています。データを直接チャートにバインドするだけで、美しいビジュアルが得られます。
- **高度な機能**: ズーム、スクロール、データのハイライト表示など、高度なインタラクティブ機能を利用できます。

#### 欠点
- **重量級**: ライブラリが提供する機能が豊富な分、アプリのサイズが大きくなることがあります。また、実行時のパフォーマンスにも影響を与える可能性があります。
- **柔軟性の制限**: 既存のコンポーネントに依存するため、カスタマイズに制限がある場合があります。

### 結論
- シンプルな波形表示であり、高いカスタマイズ性を求める場合は、`Path`を使用する方法が適しています。
- 複雑なインタラクションや高度なビジュアル機能を求める場合は、`Charts`ライブラリの使用を検討すると良いでしょう。

最終的な選択は、アプリの要件、パフォーマンス、開発の複雑性などを総合的に考慮して決定することをお勧めします。

---
