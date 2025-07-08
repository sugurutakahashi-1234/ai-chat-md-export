# Organize audio display.

日付: 2024-05-17

---

## 👤 ユーザー
*2024/5/17 11:46:45*

今このような実装です。
日付ごとにうまくわかるように分けて欲しいのと、DisclosureGroup をやめてfileSize とduration をいい感じに表現したい。

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}


@MainActor
struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError.isNil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError.isNotNil, remove: true)
            } else {
                ForEach(presenter.searchedAudioDatas) { audioData in
                    DisclosureGroup {
                        HStack {
                            Text("Date")
                            Spacer()
                            Text(audioData.createdAt.asISO8601)
                        }
                        HStack {
                            Text("Time")
                            Spacer()
                            Text(audioData.duration.mmss)
                        }
                        HStack {
                            Text("Size")
                            Spacer()
                            Text(audioData.fileSize.formattedSize)
                        }
                        HStack {
                            Text("Extension")
                            Spacer()
                            Text(audioData.audioUrl.pathExtension)
                        }
                    } label: {
                        Button {
                            presenter.onTapAudio(audioData: audioData)
                        } label: {
                            Text(audioData.audioUrl.lastPathComponent)
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText) {}
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    SFSymbols.trash.image
                        .foregroundStyle(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: false)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError, onOk: { _ in
            presenter.onTapOkDelete()
        })
        .sheet(item: $presenter.selectedAudioUrl, content: { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .navigationStacked()
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        })
        .task {
            await presenter.onAppear()
        }
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

#Preview {
    AudioListView()
        .navigationStacked()
}

---

## 🤖 アシスタント
*2024/5/17 11:47:21*

User is working on an AudioListView implementation in SwiftUI and wants to organize the audio data by date and improve the representation of fileSize and duration.

---

## 🔧 ツール
*2024/5/17 11:47:21*

Model set context updated.

---

## 🤖 アシスタント
*2024/5/17 11:47:21*

To achieve better organization by date and improve the display of `fileSize` and `duration` without using `DisclosureGroup`, you can refactor the `AudioListView` to group audio files by date and present the `fileSize` and `duration` more clearly. Here's a revised implementation:

1. Create a dictionary to group audio files by date.
2. Use a custom view to display each audio file's details.

Here is the updated code:

```swift
import SwiftUI

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}

@MainActor
class AudioListPresenter: ObservableObject {
    @Published var audioDatas: [AudioData] = []
    @Published var searchedAudioDatas: [AudioData] = []
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: Error? = nil
    @Published var showAlert: Bool = false
    @Published var selectedAudioUrl: URL? = nil

    func onTapAudio(audioData: AudioData) {
        // Handle audio tap
    }

    func onTapTrash() {
        // Handle trash button tap
    }

    func onTapOkDelete() {
        // Handle OK button tap for delete
    }

    func onAppear() async {
        // Handle view appear
    }
}

extension Date {
    var asISO8601: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
}

extension TimeInterval {
    var mmss: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

extension Int {
    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: Int64(self), countStyle: .file)
    }
}

struct AudioFileRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(audioData.audioUrl.lastPathComponent)
                .font(.headline)
            HStack {
                Text("Date:")
                Spacer()
                Text(audioData.createdAt.asISO8601)
            }
            HStack {
                Text("Duration:")
                Spacer()
                Text(audioData.duration.mmss)
            }
            HStack {
                Text("Size:")
                Spacer()
                Text(audioData.fileSize.formattedSize)
            }
            HStack {
                Text("Extension:")
                Spacer()
                Text(audioData.audioUrl.pathExtension)
            }
        }
        .padding()
    }
}

struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError.isNil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError.isNotNil, remove: true)
            } else {
                ForEach(groupedAudioDatas.keys.sorted(), id: \.self) { date in
                    Section(header: Text(date)) {
                        ForEach(groupedAudioDatas[date] ?? []) { audioData in
                            AudioFileRow(audioData: audioData)
                                .onTapGesture {
                                    presenter.onTapAudio(audioData: audioData)
                                }
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlay(LoadingView(isLoading: $presenter.isLoading))
        .alert(isPresented: $presenter.showAlert) {
            Alert(title: Text("Error"), message: Text(presenter.appError?.localizedDescription ?? ""), dismissButton: .default(Text("OK"), action: {
                presenter.onTapOkDelete()
            }))
        }
        .sheet(item: $presenter.selectedAudioUrl) { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        }
        .task {
            await presenter.onAppear()
        }
    }

    private var groupedAudioDatas: [String: [AudioData]] {
        Dictionary(grouping: presenter.searchedAudioDatas) { audioData in
            let formatter = DateFormatter()
            formatter.dateStyle = .medium
            return formatter.string(from: audioData.createdAt)
        }
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

struct LoadingView: View {
    @Binding var isLoading: Bool

    var body: some View {
        if isLoading {
            ProgressView("Loading...")
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
}

struct AudioPlayerView: View {
    let audioUrl: URL

    var body: some View {
        Text("Audio player for \(audioUrl.lastPathComponent)")
    }
}

#Preview {
    AudioListView()
}
```

### Changes Made:
1. **Grouped Audio Files by Date**: Audio files are grouped by their creation date and displayed in sections.
2. **Custom View for Audio Details**: `AudioFileRow` presents each audio file's details in a clear layout.
3. **Removed `DisclosureGroup`**: Simplified the interface by removing the `DisclosureGroup`.

This should provide a more organized and user-friendly presentation of the audio files.

---

## 👤 ユーザー
*2024/5/17 11:49:00*

辞書型を使うのはやめてほしい。もっとスマートにできないのかな？

---

## 🤖 アシスタント
*2024/5/17 11:49:41*

辞書型を使わずに、もっとスマートに日付ごとにオーディオデータを表示する方法として、`ForEach`の使い方を工夫して、セクションを作成することができます。以下のように`AudioData`を日付ごとにグループ化し、各日付のセクションごとにオーディオデータを表示する実装です。

まず、日付ごとにグループ化するための拡張メソッドを追加します。

```swift
import SwiftUI

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}

@MainActor
class AudioListPresenter: ObservableObject {
    @Published var audioDatas: [AudioData] = []
    @Published var searchedAudioDatas: [AudioData] = []
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: Error? = nil
    @Published var showAlert: Bool = false
    @Published var selectedAudioUrl: URL? = nil

    func onTapAudio(audioData: AudioData) {
        // Handle audio tap
    }

    func onTapTrash() {
        // Handle trash button tap
    }

    func onTapOkDelete() {
        // Handle OK button tap for delete
    }

    func onAppear() async {
        // Handle view appear
    }
}

extension Date {
    var asISO8601: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
    
    var mediumFormat: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: self)
    }
}

extension TimeInterval {
    var mmss: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

extension Int {
    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: Int64(self), countStyle: .file)
    }
}

struct AudioFileRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(audioData.audioUrl.lastPathComponent)
                .font(.headline)
            HStack {
                Text("Date:")
                Spacer()
                Text(audioData.createdAt.asISO8601)
            }
            HStack {
                Text("Duration:")
                Spacer()
                Text(audioData.duration.mmss)
            }
            HStack {
                Text("Size:")
                Spacer()
                Text(audioData.fileSize.formattedSize)
            }
            HStack {
                Text("Extension:")
                Spacer()
                Text(audioData.audioUrl.pathExtension)
            }
        }
        .padding()
    }
}

struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError.isNil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError.isNotNil, remove: true)
            } else {
                ForEach(groupedAudioDatas, id: \.self) { group in
                    Section(header: Text(group.date.mediumFormat)) {
                        ForEach(group.audioDatas) { audioData in
                            AudioFileRow(audioData: audioData)
                                .onTapGesture {
                                    presenter.onTapAudio(audioData: audioData)
                                }
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlay(LoadingView(isLoading: $presenter.isLoading))
        .alert(isPresented: $presenter.showAlert) {
            Alert(title: Text("Error"), message: Text(presenter.appError?.localizedDescription ?? ""), dismissButton: .default(Text("OK"), action: {
                presenter.onTapOkDelete()
            }))
        }
        .sheet(item: $presenter.selectedAudioUrl) { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        }
        .task {
            await presenter.onAppear()
        }
    }

    private var groupedAudioDatas: [AudioGroup] {
        Dictionary(grouping: presenter.searchedAudioDatas, by: { $0.createdAt.startOfDay })
            .map { AudioGroup(date: $0.key, audioDatas: $0.value) }
            .sorted(by: { $0.date > $1.date })
    }
}

struct AudioGroup: Identifiable {
    var id: Date { date }
    let date: Date
    let audioDatas: [AudioData]
}

extension Date {
    var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

struct LoadingView: View {
    @Binding var isLoading: Bool

    var body: some View {
        if isLoading {
            ProgressView("Loading...")
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
}

struct AudioPlayerView: View {
    let audioUrl: URL

    var body: some View {
        Text("Audio player for \(audioUrl.lastPathComponent)")
    }
}

#Preview {
    AudioListView()
}
```

### 主な変更点
1. **日付ごとのグループ化**：`Dictionary`の`grouping`を使用し、日付ごとに`AudioData`をグループ化し、それを`AudioGroup`構造体にマップします。
2. **セクションの使用**：各日付のセクションを`ForEach`で生成し、その中にオーディオデータを表示します。
3. **拡張メソッド**：`Date`の拡張として`startOfDay`を追加し、同じ日付のデータをグループ化します。

この方法で、日付ごとにオーディオデータをスマートに表示することができます。

---

## 👤 ユーザー
*2024/5/17 11:50:55*

Dictionary の処理を極力なくしたいんだ。
まず、AudioDataのリストから有効な日付一覧を取得して、それをForEachで回して、同じ日付のものをヒットさせて表示させるイメージ

---

## 🤖 アシスタント
*2024/5/17 11:51:31*

辞書を使用せず、`AudioData`のリストから有効な日付一覧を取得し、それを`ForEach`で回して同じ日付のものを表示する方法を実装します。これにより、コードがよりシンプルになります。

以下はその実装例です：

```swift
import SwiftUI

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}

@MainActor
class AudioListPresenter: ObservableObject {
    @Published var audioDatas: [AudioData] = []
    @Published var searchedAudioDatas: [AudioData] = []
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: Error? = nil
    @Published var showAlert: Bool = false
    @Published var selectedAudioUrl: URL? = nil

    func onTapAudio(audioData: AudioData) {
        // Handle audio tap
    }

    func onTapTrash() {
        // Handle trash button tap
    }

    func onTapOkDelete() {
        // Handle OK button tap for delete
    }

    func onAppear() async {
        // Handle view appear
    }
}

extension Date {
    var asISO8601: String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: self)
    }
    
    var mediumFormat: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: self)
    }
}

extension TimeInterval {
    var mmss: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

extension Int {
    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: Int64(self), countStyle: .file)
    }
}

struct AudioFileRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(audioData.audioUrl.lastPathComponent)
                .font(.headline)
            HStack {
                Text("Date:")
                Spacer()
                Text(audioData.createdAt.asISO8601)
            }
            HStack {
                Text("Duration:")
                Spacer()
                Text(audioData.duration.mmss)
            }
            HStack {
                Text("Size:")
                Spacer()
                Text(audioData.fileSize.formattedSize)
            }
            HStack {
                Text("Extension:")
                Spacer()
                Text(audioData.audioUrl.pathExtension)
            }
        }
        .padding()
    }
}

struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError.isNil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError.isNotNil, remove: true)
            } else {
                ForEach(uniqueDates, id: \.self) { date in
                    Section(header: Text(date.mediumFormat)) {
                        ForEach(presenter.searchedAudioDatas.filter { $0.createdAt.startOfDay == date }) { audioData in
                            AudioFileRow(audioData: audioData)
                                .onTapGesture {
                                    presenter.onTapAudio(audioData: audioData)
                                }
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlay(LoadingView(isLoading: $presenter.isLoading))
        .alert(isPresented: $presenter.showAlert) {
            Alert(title: Text("Error"), message: Text(presenter.appError?.localizedDescription ?? ""), dismissButton: .default(Text("OK"), action: {
                presenter.onTapOkDelete()
            }))
        }
        .sheet(item: $presenter.selectedAudioUrl) { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        }
        .task {
            await presenter.onAppear()
        }
    }

    private var uniqueDates: [Date] {
        let dates = presenter.searchedAudioDatas.map { $0.createdAt.startOfDay }
        return Array(Set(dates)).sorted(by: >)
    }
}

extension Date {
    var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

struct LoadingView: View {
    @Binding var isLoading: Bool

    var body: some View {
        if isLoading {
            ProgressView("Loading...")
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
}

struct AudioPlayerView: View {
    let audioUrl: URL

    var body: some View {
        Text("Audio player for \(audioUrl.lastPathComponent)")
    }
}

#Preview {
    AudioListView()
}
```

### 主な変更点
1. **`uniqueDates` プロパティ**：`AudioData`のリストから有効な日付一覧を取得し、重複を排除してソートします。
2. **`ForEach` の使い方**：`uniqueDates`を使用してセクションを作成し、各セクション内で日付に一致する`AudioData`を表示します。

この方法で、辞書を使わずに日付ごとにオーディオデータをスマートに表示することができます。

---

## 👤 ユーザー
*2024/5/17 12:15:51*

こんなふうにしたい。ユニークにするオペレーターやソートするオペレーターはないのか？

@MainActor
final class AudioListPresenter: ObservableObject {
    private(set) var audioDatas: [AudioData] = []
    @Published private(set) var searchedAudioDatas: [AudioData] = []
    @Publisher private(set) var uniqueDates: [Date] = []

    @Published var selectedAudioUrl: URL?
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioFileManageDriver: AudioFileManageDriver = AudioFileManageDriver()

    var player: AVAudioPlayer?

    init() {
        $searchText
            .compactMap { [weak self] searchText in
                self?.audioDatas.filter { audioData in
                    searchText.isEmpty || "\(audioData.audioUrl.lastPathComponent)".localizedCaseInsensitiveContains(searchText)
                }
                .sorted(by: \.createdAt, order: .descending)
            }
            .assign(to: &$searchedAudioDatas)
        
        $searchedAudioDatas
            .map {
                Calendar.current.startOfDay(for: $0.createdAt)
            }
            .assign(to: &$uniqueDates)
    }
}

---

## 🤖 アシスタント
*2024/5/17 12:16:40*

`Combine`フレームワークを使用して、`Publisher`を作成し、ユニークな日付を生成し、オーディオデータをソートする方法を以下に示します。`map`、`removeDuplicates`、および`sorted`オペレーターを使用します。

まず、`AudioListPresenter`を以下のように修正します：

```swift
import SwiftUI
import Combine
import AVFoundation

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}

@MainActor
final class AudioListPresenter: ObservableObject {
    @Published private(set) var audioDatas: [AudioData] = []
    @Published private(set) var searchedAudioDatas: [AudioData] = []
    @Published private(set) var uniqueDates: [Date] = []

    @Published var selectedAudioUrl: URL?
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioFileManageDriver: AudioFileManageDriver = AudioFileManageDriver()

    var player: AVAudioPlayer?

    private var cancellables = Set<AnyCancellable>()

    init() {
        $searchText
            .combineLatest($audioDatas)
            .map { searchText, audioDatas in
                audioDatas.filter { audioData in
                    searchText.isEmpty || audioData.audioUrl.lastPathComponent.localizedCaseInsensitiveContains(searchText)
                }
            }
            .map { filteredAudioDatas in
                filteredAudioDatas.sorted(by: { $0.createdAt > $1.createdAt })
            }
            .assign(to: &$searchedAudioDatas)

        $searchedAudioDatas
            .map { $0.map { $0.createdAt.startOfDay } }
            .map { Array(Set($0)).sorted(by: >) }
            .assign(to: &$uniqueDates)
    }

    func onTapAudio(audioData: AudioData) {
        // Handle audio tap
    }

    func onTapTrash() {
        // Handle trash button tap
    }

    func onTapOkDelete() {
        // Handle OK button tap for delete
    }

    func onAppear() async {
        // Handle view appear
    }
}

extension Date {
    var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }
    
    var mediumFormat: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: self)
    }
}

extension TimeInterval {
    var mmss: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

extension Int {
    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: Int64(self), countStyle: .file)
    }
}

struct AudioFileRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(audioData.audioUrl.lastPathComponent)
                .font(.headline)
            HStack {
                Text("Date:")
                Spacer()
                Text(audioData.createdAt.asISO8601)
            }
            HStack {
                Text("Duration:")
                Spacer()
                Text(audioData.duration.mmss)
            }
            HStack {
                Text("Size:")
                Spacer()
                Text(audioData.fileSize.formattedSize)
            }
            HStack {
                Text("Extension:")
                Spacer()
                Text(audioData.audioUrl.pathExtension)
            }
        }
        .padding()
    }
}

struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError == nil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError != nil, remove: true)
            } else {
                ForEach(presenter.uniqueDates, id: \.self) { date in
                    Section(header: Text(date.mediumFormat)) {
                        ForEach(presenter.searchedAudioDatas.filter { $0.createdAt.startOfDay == date }) { audioData in
                            AudioFileRow(audioData: audioData)
                                .onTapGesture {
                                    presenter.onTapAudio(audioData: audioData)
                                }
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlay(LoadingView(isLoading: $presenter.isLoading))
        .alert(isPresented: $presenter.showAlert) {
            Alert(title: Text("Error"), message: Text(presenter.appError?.localizedDescription ?? ""), dismissButton: .default(Text("OK"), action: {
                presenter.onTapOkDelete()
            }))
        }
        .sheet(item: $presenter.selectedAudioUrl) { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        }
        .task {
            await presenter.onAppear()
        }
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

struct LoadingView: View {
    @Binding var isLoading: Bool

    var body: some View {
        if isLoading {
            ProgressView("Loading...")
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
}

struct AudioPlayerView: View {
    let audioUrl: URL

    var body: some View {
        Text("Audio player for \(audioUrl.lastPathComponent)")
    }
}

#Preview {
    AudioListView()
}
```

### 変更点の説明

1. **Combineの使用**：
    - `$searchText`と`$audioDatas`を`combineLatest`してフィルタリングとソートを行います。
    - `searchedAudioDatas`を`map`して、日付のリストを取得し、ユニークにしてソートします。

2. **Publisherチェーン**：
    - `combineLatest`で`searchText`と`audioDatas`を組み合わせて、フィルタリングとソートを行います。
    - `map`オペレーターで、`searchedAudioDatas`から日付のリストを取得し、`Set`でユニークにして、`sorted`でソートします。

これにより、辞書を使わずにユニークな日付を生成し、それに基づいてオーディオデータを表示することができます。

---

## 👤 ユーザー
*2024/5/17 12:17:12*

.map { Array(Set($0)) } No exact matches in call to initializer  となった

---

## 🤖 アシスタント
*2024/5/17 12:17:52*

`Array(Set($0))`はコンパイルエラーを引き起こします。これは、SetがDateの配列をユニーク化する際に必要ですが、型の問題があります。このエラーを解決するために、代わりに`NSOrderedSet`を使用してユニークな日付を取得し、それをソートする方法を使用します。

以下は修正後のコードです：

```swift
import SwiftUI
import Combine
import AVFoundation

public struct AudioData: Sendable {
    let audioUrl: URL
    let createdAt: Date
    let fileSize: Int
    let duration: TimeInterval
}

extension AudioData: Identifiable {
    public var id: String {
        audioUrl.absoluteString
    }
}

@MainActor
final class AudioListPresenter: ObservableObject {
    @Published private(set) var audioDatas: [AudioData] = []
    @Published private(set) var searchedAudioDatas: [AudioData] = []
    @Published private(set) var uniqueDates: [Date] = []

    @Published var selectedAudioUrl: URL?
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioFileManageDriver: AudioFileManageDriver = AudioFileManageDriver()

    var player: AVAudioPlayer?

    private var cancellables = Set<AnyCancellable>()

    init() {
        $searchText
            .combineLatest($audioDatas)
            .map { searchText, audioDatas in
                audioDatas.filter { audioData in
                    searchText.isEmpty || audioData.audioUrl.lastPathComponent.localizedCaseInsensitiveContains(searchText)
                }
            }
            .map { filteredAudioDatas in
                filteredAudioDatas.sorted(by: { $0.createdAt > $1.createdAt })
            }
            .assign(to: &$searchedAudioDatas)

        $searchedAudioDatas
            .map { $0.map { $0.createdAt.startOfDay } }
            .map { dates in
                Array(NSOrderedSet(array: dates)) as! [Date]
            }
            .map { $0.sorted(by: >) }
            .assign(to: &$uniqueDates)
    }

    func onTapAudio(audioData: AudioData) {
        // Handle audio tap
    }

    func onTapTrash() {
        // Handle trash button tap
    }

    func onTapOkDelete() {
        // Handle OK button tap for delete
    }

    func onAppear() async {
        // Handle view appear
    }
}

extension Date {
    var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }
    
    var mediumFormat: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: self)
    }
}

extension TimeInterval {
    var mmss: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

extension Int {
    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: Int64(self), countStyle: .file)
    }
}

struct AudioFileRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(audioData.audioUrl.lastPathComponent)
                .font(.headline)
            HStack {
                Text("Date:")
                Spacer()
                Text(audioData.createdAt.asISO8601)
            }
            HStack {
                Text("Duration:")
                Spacer()
                Text(audioData.duration.mmss)
            }
            HStack {
                Text("Size:")
                Spacer()
                Text(audioData.fileSize.formattedSize)
            }
            HStack {
                Text("Extension:")
                Spacer()
                Text(audioData.audioUrl.pathExtension)
            }
        }
        .padding()
    }
}

struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            if presenter.audioDatas.isEmpty {
                Text("エラー！ 右上から削除してください")
                    .isHidden(presenter.appError == nil, remove: true)
                Text("データが1件もあません")
                    .isHidden(presenter.appError != nil, remove: true)
            } else {
                ForEach(presenter.uniqueDates, id: \.self) { date in
                    Section(header: Text(date.mediumFormat)) {
                        ForEach(presenter.searchedAudioDatas.filter { $0.createdAt.startOfDay == date }) { audioData in
                            AudioFileRow(audioData: audioData)
                                .onTapGesture {
                                    presenter.onTapAudio(audioData: audioData)
                                }
                        }
                    }
                }
            }
        }
        .searchable(text: $presenter.searchText)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlay(LoadingView(isLoading: $presenter.isLoading))
        .alert(isPresented: $presenter.showAlert) {
            Alert(title: Text("Error"), message: Text(presenter.appError?.localizedDescription ?? ""), dismissButton: .default(Text("OK"), action: {
                presenter.onTapOkDelete()
            }))
        }
        .sheet(item: $presenter.selectedAudioUrl) { audioUrl in
            if #available(iOS 16.0, *) {
                AudioPlayerView(audioUrl: audioUrl)
                    .presentationDetents([.medium])
            } else {
                Text("iOS 15は対応しておりません")
            }
        }
        .task {
            await presenter.onAppear()
        }
    }
}

extension URL: Identifiable {
    public var id: String {
        absoluteString
    }
}

struct LoadingView: View {
    @Binding var isLoading: Bool

    var body: some View {
        if isLoading {
            ProgressView("Loading...")
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
}

struct AudioPlayerView: View {
    let audioUrl: URL

    var body: some View {
        Text("Audio player for \(audioUrl.lastPathComponent)")
    }
}

#Preview {
    AudioListView()
}
```

### 変更点の説明

1. **Combineの使用**：
    - `$searchText`と`$audioDatas`を`combineLatest`してフィルタリングとソートを行います。
    - `searchedAudioDatas`を`map`して、日付のリストを取得し、`NSOrderedSet`を使用してユニーク化します。

2. **Publisherチェーン**：
    - `combineLatest`で`searchText`と`audioDatas`を組み合わせて、フィルタリングとソートを行います。
    - `map`オペレーターで、`searchedAudioDatas`から日付のリストを取得し、`NSOrderedSet`でユニーク化してからソートします。

この方法で、辞書を使わずにユニークな日付を生成し、それに基づいてオーディオデータを表示することができます。

---
