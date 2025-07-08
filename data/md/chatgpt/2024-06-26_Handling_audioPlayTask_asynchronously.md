# Handling audioPlayTask asynchronously

Date: 2024-06-26

---

## 👤 User
*2024-06-26 15:43:25*

onTapTalkThread を実行しているときに、audioPlayTaskが完了していない状態の時の処理を別で実行したい。


import Combine
import DomainLayer
import Foundation

@MainActor
final class TalkThreadListPresenter&lt;Dependency: TalkThreadListPresenterDependency&gt;: ObservableObject {
    @Published private(set) var talkThreads: [TalkThread] = []
    @Published var selectedTalkThread: TalkThread?

    @Published var isPlaying: Bool = false
    @Published var recordingVolumeLevels: [Double] = []
    static var volumeLevelColumns: Int {
        20
    }

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    @Published var showPostView: Bool = false
    @Published var showStampListView: Bool = false

    private let dependency: Dependency
    private var cancellables = Set&lt;AnyCancellable&gt;()
    private var audioPlayTask: Task&lt;Void, Never&gt;? = nil

    init(dependency: Dependency) {
        dependency.logDriver.initLog()

        self.dependency = dependency

        // スワイプしたら再生を止める
        $selectedTalkThread
            .removeDuplicates()
            .sink { [weak self] _ in
                self?.audioPlayTask?.cancel()
                self?.dependency.audioPlayDriver.pause()
                self?.recordingVolumeLevels = []
            }
            .store(in: &cancellables)

        dependency.audioPlayDriver.isPlayingPublisher
            .receive(on: DispatchQueue.main)
            .assign(to: &$isPlaying)

        dependency.audioPlayDriver.recordingVolumeLevelPublisher
            .scan([Double]()) { accumulated, newValue in
                (accumulated + [newValue]).suffix(Self.volumeLevelColumns)
            }
            .receive(on: DispatchQueue.main)
            .assign(to: &$recordingVolumeLevels)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        isLoading = true
        defer {
            isLoading = false
        }

        dependency.logDriver.onAppearLog()

        do {
            talkThreads = try await dependency.apiRequestDriver.getTalkThreads()

            // scrollPosition では初期値が nil のため最初のトークスレッドを selectedTalkThread にセットする
            if selectedTalkThread.isNil, let firstTalkThread = talkThreads.first {
                selectedTalkThread = firstTalkThread
            }
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        audioPlayTask?.cancel()
        dependency.audioPlayDriver.pause()
        recordingVolumeLevels = []

        dependency.logDriver.onDisappearLog()
    }

    func onTapTalkThread() async {
        guard let selectedTalkThread else {
            dependency.logDriver.errorLog("unexpected")
            appError = .customError()
            showAlert = true
            return
        }

        guard !isPlaying else {
            dependency.audioPlayDriver.pause()
            return
        }

        let audioURLs: [URL] = selectedTalkThread.posts.sorted(by: \.postedAt, order: .ascending).reduce(into: [selectedTalkThread.audioUrl]) { result, post in
            switch post.postType {
            case .audio(let talkAudio):
                result.append(talkAudio.audioUrl)
            case .audioStamp(let talkAudioStamp):
                result.append(talkAudioStamp.audioUrl)
            default:
                break
            }
        }

        // 新しいタスクを開始する前に既存のタスクをキャンセル
        audioPlayTask?.cancel()
        audioPlayTask = Task {
            do {
                for audioUrl in audioURLs {
                    try await dependency.audioPlayDriver.play(audioSource: .remoteAudioURL(audioUrl))
                }
            } catch is CancellationError {
                dependency.logDriver.debugLog("Task was cancelled.")
            } catch {
                dependency.logDriver.errorLog("\(error)")
                appError = error.toAppError
                showAlert = true
            }
        }
    }

    func onTapNewPost() {
        showPostView = true
    }

    func onTapStampReaction() {
        showStampListView = true
    }
}

---

## 🤖 Assistant
*2024-06-26 15:44:12*

`onTapTalkThread` 実行中に `audioPlayTask` が完了していない状態の時に特定の処理を実行するためには、既存のタスクが進行中であるかどうかをチェックし、その状態に基づいて別の処理を実行するロジックを追加します。以下のように実装できます。

```swift
import Combine
import DomainLayer
import Foundation

@MainActor
final class TalkThreadListPresenter<Dependency: TalkThreadListPresenterDependency>: ObservableObject {
    @Published private(set) var talkThreads: [TalkThread] = []
    @Published var selectedTalkThread: TalkThread?

    @Published var isPlaying: Bool = false
    @Published var recordingVolumeLevels: [Double] = []
    static var volumeLevelColumns: Int {
        20
    }

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    @Published var showPostView: Bool = false
    @Published var showStampListView: Bool = false

    private let dependency: Dependency
    private var cancellables = Set<AnyCancellable>()
    private var audioPlayTask: Task<Void, Never>? = nil

    init(dependency: Dependency) {
        dependency.logDriver.initLog()

        self.dependency = dependency

        // スワイプしたら再生を止める
        $selectedTalkThread
            .removeDuplicates()
            .sink { [weak self] _ in
                self?.audioPlayTask?.cancel()
                self?.dependency.audioPlayDriver.pause()
                self?.recordingVolumeLevels = []
            }
            .store(in: &cancellables)

        dependency.audioPlayDriver.isPlayingPublisher
            .receive(on: DispatchQueue.main)
            .assign(to: &$isPlaying)

        dependency.audioPlayDriver.recordingVolumeLevelPublisher
            .scan([Double]()) { accumulated, newValue in
                (accumulated + [newValue]).suffix(Self.volumeLevelColumns)
            }
            .receive(on: DispatchQueue.main)
            .assign(to: &$recordingVolumeLevels)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        isLoading = true
        defer {
            isLoading = false
        }

        dependency.logDriver.onAppearLog()

        do {
            talkThreads = try await dependency.apiRequestDriver.getTalkThreads()

            // scrollPosition では初期値が nil のため最初のトークスレッドを selectedTalkThread にセットする
            if selectedTalkThread.isNil, let firstTalkThread = talkThreads.first {
                selectedTalkThread = firstTalkThread
            }
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        audioPlayTask?.cancel()
        dependency.audioPlayDriver.pause()
        recordingVolumeLevels = []

        dependency.logDriver.onDisappearLog()
    }

    func onTapTalkThread() async {
        guard let selectedTalkThread else {
            dependency.logDriver.errorLog("unexpected")
            appError = .customError()
            showAlert = true
            return
        }

        guard !isPlaying else {
            dependency.audioPlayDriver.pause()
            return
        }

        let audioURLs: [URL] = selectedTalkThread.posts.sorted(by: \.postedAt, order: .ascending).reduce(into: [selectedTalkThread.audioUrl]) { result, post in
            switch post.postType {
            case .audio(let talkAudio):
                result.append(talkAudio.audioUrl)
            case .audioStamp(let talkAudioStamp):
                result.append(talkAudioStamp.audioUrl)
            default:
                break
            }
        }

        // 新しいタスクを開始する前に既存のタスクがあるか確認
        if let currentTask = audioPlayTask, !currentTask.isCancelled {
            // 既存のタスクが完了していない場合に別の処理を実行
            handlePendingAudioPlayTask()
        } else {
            // 新しいタスクを開始
            audioPlayTask?.cancel()
            audioPlayTask = Task {
                do {
                    for audioUrl in audioURLs {
                        try await dependency.audioPlayDriver.play(audioSource: .remoteAudioURL(audioUrl))
                    }
                } catch is CancellationError {
                    dependency.logDriver.debugLog("Task was cancelled.")
                } catch {
                    dependency.logDriver.errorLog("\(error)")
                    appError = error.toAppError
                    showAlert = true
                }
            }
        }
    }

    private func handlePendingAudioPlayTask() {
        // audioPlayTask が完了していない時の処理をここに実装
        dependency.logDriver.infoLog("Audio play task is still in progress.")
        // 例えば、ユーザーにタスクが進行中であることを知らせるアラートを表示するなど
        appError = .customError("Audio play task is still in progress.")
        showAlert = true
    }

    func onTapNewPost() {
        showPostView = true
    }

    func onTapStampReaction() {
        showStampListView = true
    }
}
```

この変更により、`onTapTalkThread` 実行中に `audioPlayTask` が完了していない場合、`handlePendingAudioPlayTask` メソッドが呼び出され、特定の処理を実行します。`handlePendingAudioPlayTask` メソッド内で必要なロジックを実装できます。

---
