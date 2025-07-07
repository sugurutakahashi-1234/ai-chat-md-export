# Display Cache File Details

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 17:29:12*

ファイル名だけではなく、保存日時とか知りたい

import SwiftUI
import DomainLayer

struct CacheFileListView: View {
    @State private var stampFiles: \[(path: String, image: UIImage?)\] = \[\]
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles, id: \\.path) { file in
                    HStack {
                        if let image = file.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                                .frame(width: 50, height: 50)
                        }
                        Text(file.path)
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: \[.png\])
            stampFiles = try fileUrls.map { fileUrl in
                // lastPathComponent だけだと拡張子が入ってしまうため、deletingPathExtension で除かなければならない
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                return (path: fileUrl.lastPathComponent, image: image)
            }
        } catch {
            print("Error while enumerating files \\(directoryType.directoryUrl.path): \\(error.localizedDescription)")
        }
    }
}

#Preview {
    CacheFileListView()
        .navigationStacked()
}

---

## 🤖 アシスタント
*2024/7/4 17:29:40*

ファイル名だけでなく、保存日時も表示するために、ファイルの作成日時や変更日時を取得して表示するように `stampFiles` の構造を拡張しましょう。以下は、保存日時を含むように修正したコードです：

```swift
import SwiftUI
import DomainLayer

struct CacheFileListView: View {
    @State private var stampFiles: [(path: String, image: UIImage?, date: Date)] = []
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles, id: \.path) { file in
                    HStack {
                        if let image = file.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                                .frame(width: 50, height: 50)
                        }
                        VStack(alignment: .leading) {
                            Text(file.path)
                            Text("\(file.date, formatter: dateFormatter)")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: [.png])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes[.creationDate] as? Date ?? Date()
                return (path: fileUrl.lastPathComponent, image: image, date: creationDate)
            }
        } catch {
            print("Error while enumerating files \(directoryType.directoryUrl.path): \(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

#Preview {
    CacheFileListView()
        .navigationStacked()
}
```

この修正点により、以下のことが達成されます：
1. `stampFiles` タプルに保存日時を追加。
2. ファイルの属性を取得して、作成日時を読み取る。
3. 保存日時をリストに表示する。

これで、各ファイルのパスと保存日時が表示されるようになります。

---

## 👤 ユーザー
*2024/7/4 17:31:42*

タプルではなくて、こんな感じの型を作成して、ほしい。項目も追加してほしい

public struct ImageData: Sendable {
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
}

---

## 🤖 アシスタント
*2024/7/4 17:32:20*

`ImageData` 構造体を作成し、ファイルの情報を管理するように修正します。また、ファイルサイズも取得して表示するようにします。

以下が修正したコードです：

```swift
import SwiftUI
import DomainLayer

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

struct CacheFileListView: View {
    @State private var stampFiles: [ImageData] = []
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles) { file in
                    HStack {
                        if let image = file.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                                .frame(width: 50, height: 50)
                        }
                        VStack(alignment: .leading) {
                            Text(file.imageUrl.lastPathComponent)
                            Text("\(file.createdAt, formatter: dateFormatter)")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Text("\(file.fileSize) bytes")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: [.png])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes[.creationDate] as? Date ?? Date()
                let fileSize = attributes[.size] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \(directoryType.directoryUrl.path): \(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

#Preview {
    CacheFileListView()
        .navigationStacked()
}
```

この修正点により、以下のことが達成されます：
1. `ImageData` 構造体を作成して、必要なファイル情報（URL、作成日時、ファイルサイズ、画像）を保持。
2. `stampFiles` を `ImageData` 型の配列として定義。
3. `loadCacheFiles` 関数でファイル属性を取得し、`ImageData` のインスタンスを作成して配列に追加。
4. リスト内でファイル名、作成日時、ファイルサイズを表示。

---

## 👤 ユーザー
*2024/7/4 17:35:09*

更新日時がアタ楽なるように並び替えてほしい。また、labelを使ってアイコンも多く使ってほしい。

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

struct CacheFileListView: View {
    @State private var stampFiles: \[ImageData\] = \[\]
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles) { file in
                    HStack {
                        if let image = file.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                                .frame(width: 50, height: 50)
                        }
                        VStack(alignment: .leading) {
                            Text(file.imageUrl.lastPathComponent)
                            Text("\\(file.createdAt, formatter: dateFormatter)")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Text(file.fileSize.formattedSize)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: \[.png\])
            stampFiles = try fileUrls.map { fileUrl in
                // lastPathComponent だけだと拡張子が入ってしまうため、deletingPathExtension で除かなければならない
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes\[.creationDate\] as? Date ?? Date()
                let fileSize = attributes\[.size\] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \\(directoryType.directoryUrl.path): \\(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

#Preview {
    CacheFileListView()
        .navigationStacked()
}

---

## 🤖 アシスタント
*2024/7/4 17:35:51*

ファイルを更新日時で並び替え、表示に `Label` を多用するようにします。また、ファイルサイズのフォーマットを改善します。

以下は修正したコードです：

```swift
import SwiftUI
import DomainLayer

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

struct CacheFileListView: View {
    @State private var stampFiles: [ImageData] = []
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles.sorted(by: { $0.createdAt > $1.createdAt })) { file in
                    HStack {
                        if let image = file.image {
                            Label {
                                VStack(alignment: .leading) {
                                    Text(file.imageUrl.lastPathComponent)
                                    Text("\(file.createdAt, formatter: dateFormatter)")
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                    Text(file.fileSize.formattedSize)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                            } icon: {
                                Image(uiImage: image)
                                    .resizable()
                                    .frame(width: 50, height: 50)
                                    .aspectRatio(contentMode: .fit)
                            }
                        } else {
                            Label {
                                VStack(alignment: .leading) {
                                    Text(file.imageUrl.lastPathComponent)
                                    Text("\(file.createdAt, formatter: dateFormatter)")
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                    Text(file.fileSize.formattedSize)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                            } icon: {
                                Rectangle()
                                    .foregroundColor(.gray)
                                    .frame(width: 50, height: 50)
                            }
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: [.png])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes[.creationDate] as? Date ?? Date()
                let fileSize = attributes[.size] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \(directoryType.directoryUrl.path): \(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

extension Int {
    var formattedSize: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(self))
    }
}

#Preview {
    CacheFileListView()
        .navigationStacked()
}
```

この修正点により、以下のことが達成されます：
1. `ImageData` 構造体を使用して、ファイル情報を管理。
2. ファイルを更新日時で並び替え。
3. `Label` を使ってファイル名、更新日時、ファイルサイズを表示。
4. ファイルサイズのフォーマットを改善するために、拡張関数 `formattedSize` を追加。

---

## 👤 ユーザー
*2024/7/4 17:37:37*

違って、ラベルでのアイコンはファイル名、作成日、ファイルサイズそれぞれに設定して星。

import SwiftUI
import DomainLayer

// MARK: - Entity

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

// MARK: - View

struct CacheFileListView: View {
    @State private var stampFiles: \[ImageData\] = \[\]
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles.sorted(by: { $0.createdAt &gt; $1.createdAt })) { file in
                    HStack {
                        if let image = file.image {
                            Label {
                                VStack(alignment: .leading) {
                                    Text(file.imageUrl.lastPathComponent)
                                    Text("\\(file.createdAt, formatter: dateFormatter)")
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                    Text(file.fileSize.formattedSize)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                            } icon: {
                                Image(uiImage: image)
                                    .resizable()
                                    .frame(width: 50, height: 50)
                                    .aspectRatio(contentMode: .fit)
                            }
                        } else {
                            Label {
                                VStack(alignment: .leading) {
                                    Text(file.imageUrl.lastPathComponent)
                                    Text("\\(file.createdAt, formatter: dateFormatter)")
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                    Text(file.fileSize.formattedSize)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                            } icon: {
                                Rectangle()
                                    .foregroundColor(.gray)
                                    .frame(width: 50, height: 50)
                            }
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: \[.png\])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes\[.creationDate\] as? Date ?? Date()
                let fileSize = attributes\[.size\] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \\(directoryType.directoryUrl.path): \\(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

// MARK: - Preview

#Preview {
    CacheFileListView()
        .navigationStacked()
}

---

## 🤖 アシスタント
*2024/7/4 17:38:18*

ファイル名、作成日、ファイルサイズそれぞれにアイコンを設定し、ラベルを使用して表示するように修正します。

以下が修正したコードです：

```swift
import SwiftUI
import DomainLayer

// MARK: - Entity

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

// MARK: - View

struct CacheFileListView: View {
    @State private var stampFiles: [ImageData] = []
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles.sorted(by: { $0.createdAt > $1.createdAt })) { file in
                    VStack(alignment: .leading) {
                        Label {
                            Text(file.imageUrl.lastPathComponent)
                        } icon: {
                            Image(systemName: "doc.text")
                                .foregroundColor(.blue)
                        }
                        Label {
                            Text("\(file.createdAt, formatter: dateFormatter)")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        } icon: {
                            Image(systemName: "calendar")
                                .foregroundColor(.blue)
                        }
                        Label {
                            Text(file.fileSize.formattedSize)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        } icon: {
                            Image(systemName: "archivebox")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: [.png])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes[.creationDate] as? Date ?? Date()
                let fileSize = attributes[.size] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \(directoryType.directoryUrl.path): \(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

extension Int {
    var formattedSize: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(self))
    }
}

// MARK: - Preview

#Preview {
    CacheFileListView()
        .navigationStacked()
}
```

この修正により、以下のことが達成されます：
1. ファイル名、作成日、ファイルサイズに対してそれぞれアイコンを設定。
2. 各ファイル情報を `Label` で表示し、アイコンを含めたラベルを使用。

---

## 👤 ユーザー
*2024/7/4 17:41:03*

全然関係なんだけどこんなイメージでした

struct AudioRow: View {
    let audioData: AudioData

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            HStack {
                SFSymbols.waveform.image
                Text(audioData.audioUrl.lastPathComponent)
            }

            HStack(spacing: 10) {
                HStack {
                    SFSymbols.clock.image
                    Text(audioData.duration.mmss)
                }

                HStack {
                    SFSymbols.archivebox.image
                    Text(audioData.fileSize.formattedSize)
                }
            }
            .foregroundStyle(.secondary)
            .font(.subheadline)
        }
    }
}

---

## 🤖 アシスタント
*2024/7/4 17:41:41*

理解しました。それでは、同様のスタイルで `CacheFileListView` に適用するように修正します。以下が修正したコードです：

```swift
import SwiftUI
import DomainLayer

// MARK: - Entity

public struct ImageData: Identifiable, Sendable {
    public let id = UUID()
    public let imageUrl: URL
    public let createdAt: Date
    public let fileSize: Int
    public let image: UIImage?

    public init(imageUrl: URL, createdAt: Date, fileSize: Int, image: UIImage?) {
        self.imageUrl = imageUrl
        self.createdAt = createdAt
        self.fileSize = fileSize
        self.image = image
    }
}

// MARK: - View

struct CacheFileListView: View {
    @State private var stampFiles: [ImageData] = []
    let directoryType: LocalDirectoryType = .caches

    var body: some View {
        List {
            Section("Stamp") {
                ForEach(stampFiles.sorted(by: { $0.createdAt > $1.createdAt })) { file in
                    HStack {
                        if let image = file.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .aspectRatio(contentMode: .fit)
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                                .frame(width: 50, height: 50)
                        }
                        VStack(alignment: .leading, spacing: 5) {
                            HStack {
                                Image(systemName: "doc.text")
                                Text(file.imageUrl.lastPathComponent)
                            }
                            HStack(spacing: 10) {
                                HStack {
                                    Image(systemName: "calendar")
                                    Text("\(file.createdAt, formatter: dateFormatter)")
                                }
                                HStack {
                                    Image(systemName: "archivebox")
                                    Text(file.fileSize.formattedSize)
                                }
                            }
                            .foregroundStyle(.secondary)
                            .font(.subheadline)
                        }
                    }
                }
            }
            .textCase(.none)
        }
        .navigationTitle("Cache Files")
        .onAppear {
            loadCacheFiles()
        }
    }

    func loadCacheFiles() {
        do {
            let fileUrls = try FileManageDriver.getFiles(directory: Constants.FilePath.stampDirectory, extensions: [.png])
            stampFiles = try fileUrls.map { fileUrl in
                let image = try FileManageDriver.loadImageFromCache(fileName: fileUrl.deletingPathExtension().lastPathComponent, directory: Constants.FilePath.stampDirectory)
                let attributes = try FileManager.default.attributesOfItem(atPath: fileUrl.path)
                let creationDate = attributes[.creationDate] as? Date ?? Date()
                let fileSize = attributes[.size] as? Int ?? 0
                return ImageData(imageUrl: fileUrl, createdAt: creationDate, fileSize: fileSize, image: image)
            }
        } catch {
            print("Error while enumerating files \(directoryType.directoryUrl.path): \(error.localizedDescription)")
        }
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }
}

extension Int {
    var formattedSize: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(self))
    }
}

// MARK: - Preview

#Preview {
    CacheFileListView()
        .navigationStacked()
}
```

この修正点により、以下のことが達成されます：
1. 各ファイル情報を `HStack` と `VStack` を使って整理。
2. ファイル名、作成日、ファイルサイズにそれぞれアイコンを設定。
3. 各情報を整然と表示するためにスタイルを調整。

---

## 👤 ユーザー
*2024/7/4 17:43:33*

すこしだけどパラメーターにが欲しい

---

## 🤖 アシスタント
*2024/7/4 17:43:35*

了解しました。それでは、少しパラメーターに変更を加えた上

---
