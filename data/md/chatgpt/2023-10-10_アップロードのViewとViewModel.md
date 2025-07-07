# アップロードのViewとViewModel

日付: 2023-10-10

---

## 👤 ユーザー
*2023/10/11 0:02:34*

以下の処理を一つのアップロードをするViewとViewModelに変更してほしい

import Foundation
import PlaygroundSupport
import SwiftUI

// # この Playground でわかること
//
// - upload() で AsyncStream&lt;Progress&gt; を返却した場合の View で表示する例
// - 個別の AsyncStream&lt;Progress&gt; をまとめたような内容もゴリゴリ実装すれば表現することもできるが、ViewModel 層で行うと処理の見通しが悪いということ
// - なので、複数のアップロードをまとめた ProgressView を表示する際は、複数を同時に upload する UseCase を設置して、全部まとめた AsyncStream を 1つ返すよなアプローチが良さそうだということ（続きの Playground でこの問題点を解消した改良版を実装）

protocol CloudStorageManagerProtocol: AnyObject {
    func upload(key: String, data: Data) async throws -&gt; AsyncStream&lt;Progress&gt;
}

final class MockCloudStorageManager: CloudStorageManagerProtocol {
    func upload(key \_: String, data \_: Data) async throws -&gt; AsyncStream&lt;Progress&gt; {
        AsyncStream { continuation in
            Task {
                let totalUnitCount = Int64.random(in: 7...13) // Random totalUnitCount between 7 and 13
                for i in 1...totalUnitCount {
                    let sleepTime = UInt64.random(in: 500\_000\_000...1\_500\_000\_000) // Random sleep between 0.5 and 1.5 seconds
                    try! await Task.sleep(nanoseconds: sleepTime)
                    let progress = Progress(totalUnitCount: totalUnitCount)
                    progress.completedUnitCount = Int64(i)
                    continuation.yield(progress)
                }
                continuation.finish()
            }
        }
    }
}

class UploadViewModel: ObservableObject {
    @Published var progressValues: \[Double\] = \[\]
    @Published var totalProgress: Double = 0
    @Published var estimatedRemainingTimes: \[TimeInterval?\] = \[\]
    @Published var totalEstimatedRemainingTime: TimeInterval? = nil
    @Published var isEachComplete: \[Bool\] = \[\] // 各プログレスの完了状態を保持します
    @Published var isTotalComplete: Bool = false

    let manager: CloudStorageManagerProtocol

    init(manager: CloudStorageManagerProtocol = MockCloudStorageManager()) {
        self.manager = manager
    }

    func uploadData(keys: \[String\], datas: \[Data\]) {
        guard keys.count == datas.count else {
            return
        }

        progressValues = Array(repeating: 0.0, count: keys.count)
        estimatedRemainingTimes = Array(repeating: nil, count: keys.count) // Initialize with nil
        isEachComplete = Array(repeating: false, count: keys.count)

        for (index, (key, data)) in zip(keys, datas).enumerated() {
            let startTime = Date()
            Task {
                do {
                    for await progress in try await manager.upload(key: key, data: data) {
                        let elapsedTime = Date().timeIntervalSince(startTime)
                        let fractionCompleted = progress.fractionCompleted
                        let estimatedRemainingTime: TimeInterval? = fractionCompleted &gt; 0 ? (1 - fractionCompleted) \* elapsedTime / fractionCompleted : nil

                        await MainActor.run {
                            self.progressValues\[index\] = fractionCompleted
                            self.estimatedRemainingTimes\[index\] = estimatedRemainingTime

                            // Calculate total progress
                            self.totalProgress = self.progressValues.reduce(0, +) / Double(self.progressValues.count)

                            // Calculate total estimated remaining time
                            if self.estimatedRemainingTimes.allSatisfy({ $0 != nil }) {
                                let nonOptionalEstimatedTimes = self.estimatedRemainingTimes.compactMap { $0 }
                                self.totalEstimatedRemainingTime = nonOptionalEstimatedTimes.reduce(0, +) / Double(nonOptionalEstimatedTimes.count)
                            } else {
                                self.totalEstimatedRemainingTime = nil
                            }

                            self.isTotalComplete = self.totalProgress &gt;= 1.0
                            self.isEachComplete\[index\] = self.progressValues\[index\] &gt;= 1.0 // 各プログレスが完了したかをセット
                        }
                    }
                } catch {
                    print("Failed to upload \\(key): \\(error)")
                }
            }
        }
    }
}

struct UploadView: View {
    @StateObject private var viewModel: UploadViewModel

    init(viewModel: UploadViewModel) {
        \_viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Divider()

                ForEach(viewModel.progressValues.indices, id: \\.self) { index in
                    ProgressView(value: viewModel.progressValues\[index\], total: 1.0) {
                        Text("Upload \\(index + 1)")
                    } currentValueLabel: {
                        HStack {
                            Text("\\(Int(viewModel.progressValues\[index\] \* 100))%")
                            Text(viewModel.isEachComplete\[index\] ? "Complete" : "Estimated Remaining Time: \\(viewModel.estimatedRemainingTimes\[index\]?.formatted() ?? "Calculating...")")
                        }
                    }
                }

                Divider()

                VStack {
                    ProgressView(value: viewModel.totalProgress, total: 1.0) {
                        Text("Total Progress")
                    } currentValueLabel: {
                        HStack {
                            Text("\\(Int(viewModel.totalProgress \* 100))%")
                            Text(viewModel.isTotalComplete ? "Complete" : "Estimated Remaining Time: \\(viewModel.totalEstimatedRemainingTime?.formatted() ?? "Calculating...")")
                        }
                    }
                }

                Divider()

                Button("Restart Upload") {
                    let keys = \["key1", "key2", "key3", "key4"\]
                    let datas = Array(repeating: Data(), count: keys.count)
                    viewModel.uploadData(keys: keys, datas: datas)
                }
            }
            .padding()
        }
    }
}

extension TimeInterval {
    func formatted() -&gt; String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = \[.hour, .minute, .second\]
        formatter.unitsStyle = .full
        return formatter.string(from: self) ?? "Calculating..."
    }
}

let view = UploadView(viewModel: UploadViewModel())
    .frame(width: 300, height: 500)

PlaygroundPage.current.setLiveView(view)

---

## 🤖 アシスタント
*2023/10/11 0:02:47*

以下は、指定されたPlaygroundの内容を、一つのアップロードだけをするViewとViewModelに変更したコードです：

```swift
import Foundation
import PlaygroundSupport
import SwiftUI

protocol CloudStorageManagerProtocol: AnyObject {
    func upload(key: String, data: Data) async throws -> AsyncStream<Progress>
}

final class MockCloudStorageManager: CloudStorageManagerProtocol {
    func upload(key _: String, data _: Data) async throws -> AsyncStream<Progress> {
        AsyncStream { continuation in
            Task {
                let totalUnitCount = Int64.random(in: 7...13)
                for i in 1...totalUnitCount {
                    let sleepTime = UInt64.random(in: 500_000_000...1_500_000_000)
                    try! await Task.sleep

---
