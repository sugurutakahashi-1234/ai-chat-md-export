# Visualize SwiftUI Sound Wave.

日付: 2024-06-19

---

## 👤 ユーザー
*2024/6/19 10:48:01*

{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-j3rUoiWyQuDMcB5ZG7LuWGvi",
  "size\_bytes": 142821,
  "width": 1156,
  "height": 1144,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
SwiftUIで音声再生時に音量などを表す簡易的な波形を表現したい。正確ではなくて良いのだが、デフォルメされた波形を表現したい。イメージとしてはこんなイメージである。

---

## 🤖 アシスタント
*2024/6/19 10:48:18*

SwiftUIで音声再生時に音量を表す簡易的な波形を表現するには、以下のような方法でカスタムビューを作成できます。デフォルメされた波形を表現するために、ランダムな高さの長方形を使用します。

```swift
import SwiftUI

struct WaveformView: View {
    @State private var heights: [CGFloat] = [20, 40, 60, 80, 60, 40, 20]
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 4) {
            ForEach(0..<heights.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 10, height: heights[index])
            }
        }
        .onAppear {
            Timer.scheduledTimer(withTimeInterval: 0.2, repeats: true) { _ in
                withAnimation {
                    heights = heights.map { _ in CGFloat.random(in: 20...80) }
                }
            }
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("音声波形表示")
                .font(.headline)
            WaveformView()
                .frame(height: 100)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明
1. **WaveformView**:
    - 長方形の高さを保持する`heights`配列を持っています。
    - `HStack`を使用して長方形を並べます。
    - `onAppear`で`Timer`を設定し、定期的に長方形の高さをランダムに変更してアニメーションします。

2. **ContentView**:
    - タイトルと`WaveformView`を`VStack`で配置します。
    - `WaveformView`の高さを設定します。

このコードを使うと、音声再生中に波形をデフォルメして表示するシンプルなアニメーションが得られます。波形の動きは音声のリアルな波形を表していませんが、視覚的な効果として十分です。

---

## 👤 ユーザー
*2024/6/19 10:48:54*

実際の音量など適当なパラメーターを取得して棒を高くしたり低くしたりしたい。

---

## 🤖 アシスタント
*2024/6/19 10:49:12*

実際の音量に基づいて波形を表示するには、AVFoundationを使用してマイク入力の音量レベルを取得することができます。以下の例では、音声入力のレベルに基づいて波形を表示する方法を示します。

まず、必要なAVFoundationをインポートし、AVAudioRecorderを使って音量レベルを取得します。

```swift
import SwiftUI
import AVFoundation

class AudioLevelMonitor: ObservableObject {
    private var audioRecorder: AVAudioRecorder!
    private var timer: Timer?
    
    @Published var levels: [CGFloat] = Array(repeating: 0, count: 20)
    
    init() {
        startMonitoring()
    }
    
    private func startMonitoring() {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
            try audioSession.setActive(true)
            
            let settings: [String: Any] = [
                AVFormatIDKey: Int(kAudioFormatAppleLossless),
                AVSampleRateKey: 44100.0,
                AVNumberOfChannelsKey: 1,
                AVEncoderAudioQualityKey: AVAudioQuality.max.rawValue
            ]
            
            let url = URL(fileURLWithPath: "/dev/null")
            audioRecorder = try AVAudioRecorder(url: url, settings: settings)
            audioRecorder.isMeteringEnabled = true
            audioRecorder.record()
            
            timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
                self.audioRecorder.updateMeters()
                let level = self.audioRecorder.averagePower(forChannel: 0)
                let normalizedLevel = self.normalizedPowerLevel(fromDecibels: level)
                DispatchQueue.main.async {
                    self.levels = self.levels.map { _ in CGFloat(normalizedLevel * 100) }
                }
            }
        } catch {
            print("Failed to set up audio session and recorder: \(error)")
        }
    }
    
    private func normalizedPowerLevel(fromDecibels decibels: Float) -> Float {
        let minDb: Float = -80
        if decibels < minDb {
            return 0.0
        } else if decibels >= 0.0 {
            return 1.0
        } else {
            return (abs(minDb) - abs(decibels)) / abs(minDb)
        }
    }
    
    deinit {
        timer?.invalidate()
        audioRecorder.stop()
    }
}

struct WaveformView: View {
    @ObservedObject var monitor = AudioLevelMonitor()
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 4) {
            ForEach(0..<monitor.levels.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 10, height: monitor.levels[index])
            }
        }
        .frame(height: 100)
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("音声波形表示")
                .font(.headline)
            WaveformView()
                .frame(height: 100)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **AudioLevelMonitor**:
    - `AVAudioRecorder`を使用して音量レベルを取得します。
    - `Timer`を設定し、定期的に音量レベルを更新します。
    - デシベル値を正規化して波形の高さに変換します。

2. **WaveformView**:
    - `AudioLevelMonitor`を使用して音量レベルを監視し、波形を表示します。

3. **ContentView**:
    - タイトルと`WaveformView`を`VStack`で配置します。

このコードを使うと、マイク入力に基づいたリアルタイムの波形表示が可能になります。

---

## 👤 ユーザー
*2024/6/19 10:51:08*

これだと単純な大きさのみを反映するので、2次元のパラメーターで変化させたい。

---

## 🤖 アシスタント
*2024/6/19 10:51:32*

2次元のパラメーターで波形を変化させるには、音量レベルを反映するだけでなく、時間経過に伴う変化も取り入れます。例えば、波形の複数の棒の高さを、それぞれ異なる音量レベルに基づいて動的に更新します。以下の例では、複数の波形要素を時間と音量レベルに基づいて動的に変化させます。

```swift
import SwiftUI
import AVFoundation

class AudioLevelMonitor: ObservableObject {
    private var audioRecorder: AVAudioRecorder!
    private var timer: Timer?
    
    @Published var levels: [CGFloat] = Array(repeating: 0, count: 20)
    
    init() {
        startMonitoring()
    }
    
    private func startMonitoring() {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
            try audioSession.setActive(true)
            
            let settings: [String: Any] = [
                AVFormatIDKey: Int(kAudioFormatAppleLossless),
                AVSampleRateKey: 44100.0,
                AVNumberOfChannelsKey: 1,
                AVEncoderAudioQualityKey: AVAudioQuality.max.rawValue
            ]
            
            let url = URL(fileURLWithPath: "/dev/null")
            audioRecorder = try AVAudioRecorder(url: url, settings: settings)
            audioRecorder.isMeteringEnabled = true
            audioRecorder.record()
            
            timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
                self.audioRecorder.updateMeters()
                let level = self.audioRecorder.averagePower(forChannel: 0)
                let normalizedLevel = self.normalizedPowerLevel(fromDecibels: level)
                DispatchQueue.main.async {
                    self.updateLevels(with: normalizedLevel)
                }
            }
        } catch {
            print("Failed to set up audio session and recorder: \(error)")
        }
    }
    
    private func normalizedPowerLevel(fromDecibels decibels: Float) -> Float {
        let minDb: Float = -80
        if decibels < minDb {
            return 0.0
        } else if decibels >= 0.0 {
            return 1.0
        } else {
            return (abs(minDb) - abs(decibels)) / abs(minDb)
        }
    }
    
    private func updateLevels(with newLevel: Float) {
        // Shift all levels to the left and add the new level to the end
        levels.removeFirst()
        levels.append(CGFloat(newLevel * 100))
    }
    
    deinit {
        timer?.invalidate()
        audioRecorder.stop()
    }
}

struct WaveformView: View {
    @ObservedObject var monitor = AudioLevelMonitor()
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 4) {
            ForEach(0..<monitor.levels.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 10, height: monitor.levels[index])
            }
        }
        .frame(height: 100)
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("音声波形表示")
                .font(.headline)
            WaveformView()
                .frame(height: 100)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **AudioLevelMonitor**:
    - `AVAudioRecorder`を使用して音量レベルを取得します。
    - `Timer`を設定し、定期的に音量レベルを更新します。
    - デシベル値を正規化して波形の高さに変換します。
    - `updateLevels`メソッドで、最新の音量レベルを配列の最後に追加し、古い値を削除して波形が左から右に流れるようにします。

2. **WaveformView**:
    - `AudioLevelMonitor`を使用して音量レベルを監視し、波形を表示します。

3. **ContentView**:
    - タイトルと`WaveformView`を`VStack`で配置します。

このコードを使うと、マイク入力に基づいたリアルタイムの波形表示が可能になり、波形が時間とともに変化して動的に表示されます。

---

## 👤 ユーザー
*2024/6/19 10:51:49*

この場合横軸は何で縦軸は何を表すのか？

---

## 🤖 アシスタント
*2024/6/19 10:51:59*

この場合、縦軸と横軸の意味は以下の通りです。

- \*\*縦軸 (Y軸)\*\*: 波形の棒の高さを表し、音量レベルを示します。音量が大きいほど棒の高さが高くなります。具体的には、音声のデシベルレベルを正規化した値に基づいて高さが決まります。

- \*\*横軸 (X軸)\*\*: 時間の経過を表します。最新の音量データが右端に追加され、古いデータは左端に移動します。これは波形が左から右に流れていくように見える効果を生み出します。

このビューでは、最新の音量レベルが継続的に表示され、過去の音量レベルが時間の経過とともに左に流れていきます。これにより、波形が動いているように見え、リアルタイムの音声データの変動を視覚化することができます。

---

## 👤 ユーザー
*2024/6/19 10:52:29*

時間経過以外で横軸を取りたい。その瞬間を表すようなパラメーターがいい。

---

## 🤖 アシスタント
*2024/6/19 10:53:11*

時間経過以外で横軸を取る場合、例えば音声の周波数成分を横軸に取ることができます。これにより、各瞬間の周波数スペクトラムを表示することができます。FFT（Fast Fourier Transform）を使用して音声信号の周波数成分を抽出し、その結果を波形として表示する方法を紹介します。

以下は、Swiftの`AVAudioEngine`を使ってリアルタイムで音声の周波数スペクトラムを表示する例です。

```swift
import SwiftUI
import AVFoundation

class AudioFrequencyMonitor: ObservableObject {
    private var audioEngine: AVAudioEngine!
    private var inputNode: AVAudioInputNode!
    private var bus: Int = 0
    private let fftSize: Int = 512
    
    @Published var amplitudes: [CGFloat] = Array(repeating: 0, count: 256)
    
    init() {
        startMonitoring()
    }
    
    private func startMonitoring() {
        audioEngine = AVAudioEngine()
        inputNode = audioEngine.inputNode
        let inputFormat = inputNode.inputFormat(forBus: bus)
        
        inputNode.installTap(onBus: bus, bufferSize: AVAudioFrameCount(fftSize), format: inputFormat) { buffer, _ in
            guard let channelData = buffer.floatChannelData?[0] else { return }
            let channelDataArray = Array(UnsafeBufferPointer(start: channelData, count: Int(buffer.frameLength)))
            let fft = FFT(channelDataArray: channelDataArray, sampleRate: Float(inputFormat.sampleRate))
            let fftResults = fft.calculateFFT()
            
            DispatchQueue.main.async {
                self.amplitudes = fftResults.map { CGFloat($0) }
            }
        }
        
        audioEngine.prepare()
        do {
            try audioEngine.start()
        } catch {
            print("Audio Engine couldn't start: \(error.localizedDescription)")
        }
    }
    
    deinit {
        inputNode.removeTap(onBus: bus)
        audioEngine.stop()
    }
}

class FFT {
    private var fftSetup: FFTSetup
    private var fftSize: Int
    private var log2n: vDSP_Length
    
    init(channelDataArray: [Float], sampleRate: Float) {
        self.fftSize = channelDataArray.count
        self.log2n = vDSP_Length(log2(Float(fftSize)))
        self.fftSetup = vDSP_create_fftsetup(log2n, Int32(kFFTRadix2))!
    }
    
    func calculateFFT() -> [Float] {
        var realp = [Float](repeating: 0, count: fftSize/2)
        var imagp = [Float](repeating: 0, count: fftSize/2)
        
        realp.withUnsafeMutableBufferPointer { realPointer in
            imagp.withUnsafeMutableBufferPointer { imagPointer in
                let dspSplitComplex = DSPSplitComplex(realp: realPointer.baseAddress!, imagp: imagPointer.baseAddress!)
                var window = [Float](repeating: 0.0, count: fftSize)
                vDSP_hann_window(&window, vDSP_Length(fftSize), Int32(vDSP_HANN_NORM))
                
                var channelData = channelDataArray
                vDSP_vmul(channelData, 1, window, 1, &channelData, 1, vDSP_Length(fftSize))
                
                channelData.withUnsafeBufferPointer { pointer in
                    pointer.baseAddress!.withMemoryRebound(to: DSPComplex.self, capacity: channelDataArray.count) { typeConvertedTransferBuffer in
                        vDSP_ctoz(typeConvertedTransferBuffer, 2, &dspSplitComplex, 1, vDSP_Length(fftSize/2))
                    }
                }
                
                vDSP_fft_zrip(fftSetup, &dspSplitComplex, 1, log2n, FFTDirection(FFT_FORWARD))
                
                var magnitudes = [Float](repeating: 0.0, count: fftSize/2)
                vDSP_zvmags(&dspSplitComplex, 1, &magnitudes, 1, vDSP_Length(fftSize/2))
                
                var normalizedMagnitudes = [Float](repeating: 0.0, count: fftSize/2)
                vDSP_vsmul(sqrtf(magnitudes), 1, [2.0 / Float(fftSize)], &normalizedMagnitudes, 1, vDSP_Length(fftSize/2))
                
                return normalizedMagnitudes
            }
        }
    }
}

struct FrequencySpectrumView: View {
    @ObservedObject var monitor = AudioFrequencyMonitor()
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 1) {
            ForEach(0..<monitor.amplitudes.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 2, height: monitor.amplitudes[index] * 200)
            }
        }
        .frame(height: 200)
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("音声スペクトラム表示")
                .font(.headline)
            FrequencySpectrumView()
                .frame(height: 200)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **AudioFrequencyMonitor**:
    - `AVAudioEngine`と`AVAudioInputNode`を使用して、音声入力をキャプチャします。
    - FFTを計算するためのデータを収集し、結果を`amplitudes`配列に保存します。

2. **FFTクラス**:
    - FFTを計算するためのセットアップと計算処理を行います。
    - 入力信号の周波数成分を計算し、振幅として返します。

3. **FrequencySpectrumView**:
    - `AudioFrequencyMonitor`を使用してリアルタイムで周波数スペクトラムを表示します。

4. **ContentView**:
    - タイトルと`FrequencySpectrumView`を`VStack`で配置します。

このコードを使うと、音声入力の周波数成分をリアルタイムで視覚化することができます。横軸が周波数、縦軸がその周波数成分の振幅を表します。

---
