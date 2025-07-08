# Animate WaveformView SwiftUI

日付: 2024-06-25

---

## 👤 ユーザー
*2024/06/25 20:48:09*

アニメーションを実装してほしい

if presenter.isPlaying {
                        WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                            .padding(.horizontal, 40)
                            .padding(.vertical)
                            .animation(.default, value: presenter.isPlaying)
                    }

---

## 🤖 アシスタント
*2024/06/25 20:48:27*

`WaveformView`のアニメーションを適用するには、SwiftUIのアニメーションモディファイアを適切に使用することが重要です。現在のコードでは、`.animation(.default, value: presenter.isPlaying)`が追加されていますが、アニメーションの詳細を調整するためにはもう少し工夫が必要です。

例えば、`.transition`を使用してWaveformViewの出現と消失をアニメートすることができます。以下に例を示します：

```swift
import SwiftUI

struct ContentView: View {
    @ObservedObject var presenter: Presenter
    
    var body: some View {
        VStack {
            if presenter.isPlaying {
                WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                    .padding(.horizontal, 40)
                    .padding(.vertical)
                    .transition(.scale) // アニメーションのトランジションを追加
            }
        }
        .animation(.easeInOut, value: presenter.isPlaying) // アニメーションのタイプを指定
    }
}

class Presenter: ObservableObject {
    @Published var isPlaying: Bool = false
    @Published var recordingVolumeLevels: [Float] = []
    
    // 例として、トグルボタンを追加
    func togglePlaying() {
        withAnimation {
            isPlaying.toggle()
        }
    }
}

struct WaveformView: View {
    var volumeLevels: [Float]
    
    var body: some View {
        // Waveformの表示ロジック
        Text("Waveform View") // プレースホルダーとしての表示
    }
}
```

上記のコードでは、`isPlaying`の値が変更されると、`WaveformView`の表示がスケールアニメーションとともにトランジションします。また、`withAnimation`を使用してトグルボタンの操作時にアニメーションを適用しています。

このアプローチにより、WaveformViewの表示と非表示が滑らかにアニメートされます。他のアニメーション効果（例えば、フェードイン・フェードアウト）を使用する場合は、`transition(.opacity)`などの他のトランジションを適用することも可能です。

さらにカスタマイズが必要な場合は、`matchedGeometryEffect`やカスタムトランジションを使用することも検討できます。

---

## 👤 ユーザー
*2024/06/25 20:51:25*

スッと消えたりふわっと現れるだけでいい

---

## 🤖 アシスタント
*2024/06/25 20:51:40*

`WaveformView`がスッと消えたり、ふわっと現れるアニメーションを実装するには、`opacity`トランジションを使用するのが適しています。以下のコードはその実装例です。

```swift
import SwiftUI

struct ContentView: View {
    @ObservedObject var presenter: Presenter
    
    var body: some View {
        VStack {
            if presenter.isPlaying {
                WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                    .padding(.horizontal, 40)
                    .padding(.vertical)
                    .transition(.opacity) // フェードイン・フェードアウトのトランジションを追加
            }
        }
        .animation(.easeInOut, value: presenter.isPlaying) // アニメーションのタイプを指定
    }
}

class Presenter: ObservableObject {
    @Published var isPlaying: Bool = false
    @Published var recordingVolumeLevels: [Float] = []
    
    // 例として、トグルボタンを追加
    func togglePlaying() {
        withAnimation {
            isPlaying.toggle()
        }
    }
}

struct WaveformView: View {
    var volumeLevels: [Float]
    
    var body: some View {
        // Waveformの表示ロジック
        Text("Waveform View") // プレースホルダーとしての表示
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(presenter: Presenter())
    }
}
```

このコードでは、`isPlaying`の状態が変更されると、`WaveformView`がスムーズにフェードインまたはフェードアウトするようにアニメーションが適用されます。`transition(.opacity)`がフェードイン・フェードアウトのトランジションを提供し、`.animation(.easeInOut, value: presenter.isPlaying)`がアニメーションのイージングを制御しています。

---
