# CachedAsyncImageView Update Suggestion

日付: 2024-07-05

---

## 👤 ユーザー
*2024/07/05 18:24:38*

selectedStampが変更されても画像が変わらない

VStack {
                HStack {
                    Spacer()
                    Button {
                        presenter.onTapClose()
                    } label: {
                        SFSymbols.xmark.image
                            .tint(.black)
                    }
                }
                if let imageUrl = presenter.selectedStamp?.imageUrl {
                    CachedAsyncImageView(imageUrl: imageUrl, directory: Constants.FilePath.stampDirectory)
                        .frame(width: 80, height: 80)
                }

                Spacer() // たぶんあったほうがいい
            }


struct CachedAsyncImageView: View {
    let imageUrl: URL
    let directory: URL

    @State private var uiImage: UIImage?
    @State private var appError: AppError?

    var body: some View {
        Group {
            if let uiImage {
                Rectangle()
                    .fill(Color.clear) // ボタンにした時に fill を指定しないと青くなるため
                    .overlay(
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFill()
                    )
                    .clipped()
            } else if let _ = appError {
                AsyncImageErrorView()
            } else {
                AsyncImageLoadingView()
                    .task {
                        await loadImage()
                    }
            }
        }
    }

    private func loadImage() async {
        // 一律で拡張子は取り除く（png で保存するため）
        let fileName = imageUrl.deletingPathExtension().lastPathComponent
        do {
            let cachedImage = try FileManageDriver.loadImageFromCache(fileName: fileName, directory: directory)
            uiImage = cachedImage
        } catch {
            do {
                let downloadedImage = try await URLSessionDownloadDriver.imageDownload(url: imageUrl)
                uiImage = downloadedImage
                try FileManageDriver.saveImageToCache(fileName: fileName, image: downloadedImage, directory: directory)
            } catch let error as URLError where error.code == .cancelled {
                // キャンセルの場合は何もせずに終了
            } catch {
                OSLogger.errorLog(error.toAppError)
                appError = error.toAppError
            }
        }
    }
}


@MainActor
final class StampListPresenter&lt;Dependency: StampListPresenterDependency&gt;: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var stamps: [Stamp] = []
    @Published private(set) var stampGroupSelectType: StampGroupSelectType = .history
    @Published private(set) var selectedStamp: Stamp?

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread

        $stampGroupSelectType
            .map { stampGroupSelectType in
                switch stampGroupSelectType {
                case .history:
                    dependency.localDataStoreDriver.stampHistorys.sorted(by: \.postedAt, order: .descending).map { $0.stamp }.reduce(into: [Stamp]()) { result, stamp in
                        // 同じスタンプ は フィルタリングして除外する（Set 型は順番を保持しないので不向き）
                        if !result.contains(where: { $0 == stamp }) {
                            result.append(stamp)
                        }
                    }
                case .stampGroup(let stampGroup):
                    stampGroup.stamps
                }
            }
            .assign(to: &$stamps)
    }

    deinit {
        dependency.logDriver.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()

        isLoading = true
        defer {
            isLoading = false
        }

        do {
            stampGroups = try await dependency.apiRequestDriver.getStampGroups()
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    func onTapStampHistory() {
        stampGroupSelectType = .history
    }

    func onTapStampGroup(stampGroup: StampGroup) {
        stampGroupSelectType = .stampGroup(stampGroup)
    }

    func onTapStamp(stamp: Stamp) async {
        if selectedStamp != stamp {
            selectedStamp = stamp
            return
        }

        do {
            try await dependency.apiRequestDriver.postStamp(stamp: stamp, talkThread: talkThread)

            // スタンプを送信して履歴を 100 件まで登録する（重複 OK として、表示するときにフィルタリングする）
            dependency.localDataStoreDriver.stampHistorys = (dependency.localDataStoreDriver.stampHistorys + [StampHistory(stamp: stamp, postedAt: .now)]).suffix(100)

            // 閉じた先で toast を表示させるので、この画面では toast は表示しない（Bindingでも実装可能であるが取り回しが面倒なのでこうしている）
            dependency.toastDriver.showToast(.postedStamp)

            shouldDismiss = true
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onLongPressStamp(stamp: Stamp) async {
        switch stamp.type {
        case .image:
            break
        case .audio(let stampAudio):
            do {
                dependency.audioPlayDriver.pause()
                try await dependency.audioPlayDriver.play(audioSource: .remoteAudioURL(stampAudio.audioUrl))
            } catch {
                dependency.logDriver.errorLog("\(error)")
                appError = error.toAppError
                showAlert = true
            }
        }
    }

    func onTapClose() {
        selectedStamp = nil
    }
}

---

## 🤖 アシスタント
*2024/07/05 18:25:05*

To ensure that the image updates correctly when `selectedStamp` changes, you should make sure that the `CachedAsyncImageView` properly reacts to changes in its `imageUrl` property. One potential issue could be that `CachedAsyncImageView` is not resetting its state when `imageUrl` changes.

To address this, you can add an `onChange` modifier to reset the state whenever the `imageUrl` changes. Here's how you can update your `CachedAsyncImageView` implementation:

```swift
struct CachedAsyncImageView: View {
    let imageUrl: URL
    let directory: URL

    @State private var uiImage: UIImage?
    @State private var appError: AppError?

    var body: some View {
        Group {
            if let uiImage {
                Rectangle()
                    .fill(Color.clear) // ボタンにした時に fill を指定しないと青くなるため
                    .overlay(
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFill()
                    )
                    .clipped()
            } else if let _ = appError {
                AsyncImageErrorView()
            } else {
                AsyncImageLoadingView()
                    .task {
                        await loadImage()
                    }
                    .onChange(of: imageUrl) { newUrl in
                        Task {
                            await loadImage()
                        }
                    }
            }
        }
    }

    private func loadImage() async {
        // 一律で拡張子は取り除く（png で保存するため）
        let fileName = imageUrl.deletingPathExtension().lastPathComponent
        do {
            let cachedImage = try FileManageDriver.loadImageFromCache(fileName: fileName, directory: directory)
            uiImage = cachedImage
        } catch {
            do {
                let downloadedImage = try await URLSessionDownloadDriver.imageDownload(url: imageUrl)
                uiImage = downloadedImage
                try FileManageDriver.saveImageToCache(fileName: fileName, image: downloadedImage, directory: directory)
            } catch let error as URLError where error.code == .cancelled {
                // キャンセルの場合は何もせずに終了
            } catch {
                OSLogger.errorLog(error.toAppError)
                appError = error.toAppError
            }
        }
    }
}
```

This code ensures that the `loadImage()` function is called every time the `imageUrl` changes, thus allowing the `CachedAsyncImageView` to update accordingly.

Additionally, ensure that `selectedStamp` is correctly being updated and observed in the `VStack` containing the `CachedAsyncImageView`:

```swift
VStack {
    HStack {
        Spacer()
        Button {
            presenter.onTapClose()
        } label: {
            SFSymbols.xmark.image
                .tint(.black)
        }
    }
    if let imageUrl = presenter.selectedStamp?.imageUrl {
        CachedAsyncImageView(imageUrl: imageUrl, directory: Constants.FilePath.stampDirectory)
            .frame(width: 80, height: 80)
    }
    Spacer() // たぶんあったほうがいい
}
```

This should ensure that the image view correctly updates whenever the `selectedStamp` changes.

---
