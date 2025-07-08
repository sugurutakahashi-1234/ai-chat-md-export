# SwiftUI Countdown Timer

日付: 2024-07-22

---

## 👤 ユーザー
*2024/07/22 17:31:32*

60秒カウントダウnnの処理

Timer.publish(every: 1.0, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
            }
            .assign(to: &$resendableRemainingTime)
            .store(in: &cancellables)

---

## 🤖 アシスタント
*2024/07/22 17:31:42*

60秒カウントダウンの処理を実装するためのコードは以下のようになります。この例では、カウントダウンが1秒ごとに更新され、`resendableRemainingTime`が減少していきます。

```swift
import SwiftUI
import Combine

class CountdownViewModel: ObservableObject {
    @Published var resendableRemainingTime: Int = 60
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        startCountdown()
    }
    
    private func startCountdown() {
        Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                if self.resendableRemainingTime > 0 {
                    self.resendableRemainingTime -= 1
                }
            }
            .store(in: &cancellables)
    }
}

struct CountdownView: View {
    @StateObject private var viewModel = CountdownViewModel()
    
    var body: some View {
        VStack {
            Text("Remaining Time: \(viewModel.resendableRemainingTime)")
                .font(.largeTitle)
                .padding()
            if viewModel.resendableRemainingTime == 0 {
                Text("Time's up!")
                    .font(.title)
                    .foregroundColor(.red)
            }
        }
    }
}

struct ContentView: View {
    var body: some View {
        CountdownView()
    }
}

@main
struct CountdownApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードでは、`CountdownViewModel`クラスがカウントダウンのロジックを管理し、`CountdownView`がUIを構成します。タイマーは1秒ごとに`resendableRemainingTime`を減少させ、残り時間がゼロになると「Time's up!」メッセージが表示されます。

---
