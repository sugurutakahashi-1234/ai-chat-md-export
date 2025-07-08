# Refactoring CloudStorage

日付: 2023-06-14

---

## 👤 ユーザー
*2023/06/14 20:03:50*

以下のコードをリファクタリングしてほしい。
特にCloudStorageUploadInteractorの中の記述が冗長のなので、extensionしたり、処理を共通化できないかを考えている


import Amplify
import AWSS3StoragePlugin
import EmomilCore
import Foundation

public class AmplifyStorageManager: CloudStorageManagerProtocol {
    public init() {}

    public func upload(key: String, data: Data) async throws {
        do {
            let uploadTask = Amplify.Storage.uploadData(key: key, data: data)
            Task {
                for await progress in await uploadTask.progress {
                    print("Progress: \(progress)")
                }
            }
            try await print("Completed: \(uploadTask.value)")
        } catch {
            throw error
        }
    }
}

public protocol DataKey {
    var path: String { get }
}

public struct AnchorDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/anchors/measurements/\(measurementId)/users/\(userId)"
    }
}

public struct EmotionDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/emotions/measurements/\(measurementId)/users/\(userId)"
    }
}

public struct InteractionDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/interactions/measurements/\(measurementId)/users/\(userId)"
    }
}

public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: Any)
    case emotion(key: EmotionDataKey, data: Any)
    case interaction(key: InteractionDataKey, data: Any)
}

public struct AnchorConverter {
    static func convertToData(_: Any) async throws -&gt; Anchor {
        Anchor()
    }
}

public struct EmotionConverter {
    static func convertToData(_: Any) async throws -&gt; Emotions {
        Emotions()
    }
}

public struct InteractionConverter {
    static func convertToData(_: Any) async throws -&gt; Interaction {
        Interaction()
    }
}

public protocol CloudStorageManagerProtocol {
    func upload(key: String, data: Data) async throws
}

public protocol CloudStorageUploadInteractorProtocol {
    func upload(request: CloudStorageUploadRequest) async throws
}

public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        switch request {
        case .anchor(let key, let data):
            let convertedData = try await AnchorConverter.convertToData(data)
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: [convertedData], serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        case .emotion(let key, let data):
            let convertedData = try await EmotionConverter.convertToData(data)
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: [convertedData], serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        case .interaction(let key, let data):
            let convertedData = try await InteractionConverter.convertToData(data)
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: [convertedData], serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        }
    }
}

extension CloudStorageUploadRequest {
    var fileName: String {
        switch self {
        case .anchor:
            return "anchor"
        case .emotion:
            return "emotion"
        case .interaction:
            return "interaction"
        }
    }
}

import SwiftProtobuf
import SwiftProtobufPluginLibrary

enum EncodingError: Error {
    case encodingFailed(Error)
}

enum SerializationMethod {
    case binaryDelimited
    case json
    
    var fileExtension: String {
        switch self {
        case .binaryDelimited:
            return ".bin"
        case .json:
            return ".json"
        }
    }
}

func serializeToData&lt;T: Message&gt;(messages: [T], serializationMethod: SerializationMethod) throws -&gt; Data {
    let data: Data
    switch serializationMethod {
    case .binaryDelimited:
        data = try serializeToBinaryData(messages: messages)
    case .json:
        data = try serializeToJSONData(messages: messages)
    }
    return data
}

func saveDataToLocal(data: Data, fileName: String, serializationMethod: SerializationMethod) throws {
    let filePath = FileManager.default.directoryURL(directory: .document).appendingPathComponent(fileName).appendingPathExtension(serializationMethod.fileExtension)

    do {
        try data.write(to: filePath, options: .atomic)
    } catch {
        throw error
    }
}

func serializeToBinaryData&lt;T: Message&gt;(messages: [T]) throws -&gt; Data {
    let outputStream = OutputStream.toMemory()
    outputStream.open()

    // エラーを throw するため forEach などは使えない
    for message in messages {
        do {
            try BinaryDelimited.serialize(message: message, to: outputStream)
        } catch {
            throw EncodingError.encodingFailed(error)
        }
    }

    outputStream.close()

    guard let data = outputStream.property(forKey: .dataWrittenToMemoryStreamKey) as? Data else {
        throw EncodingError.encodingFailed(NSError(domain: "EncodingError", code: -1, userInfo: [NSLocalizedDescriptionKey : "Failed to retrieve data from OutputStream"]))
    }

    return data
}

func serializeToJSONData&lt;T: Message&gt;(messages: [T]) throws -&gt; Data {
    var jsonData = Data()

    // エラーを throw するため forEach などは使えない
    for message in messages {
        do {
            let stringData = try message.jsonUTF8Data()
            jsonData.append(stringData)
        } catch {
            throw EncodingError.encodingFailed(error)
        }
    }

    return jsonData
}

---

## 🤖 アシスタント
*2023/06/14 20:05:04*

まず、CloudStorageUploadInteractorのuploadメソッドにある冗長な部分を解消します。冗長性を引き起こしている主な理由は、各データタイプに対して全く同じ操作を繰り返しているからです。これは関数として切り出すことで、コードの重複を避けることができます。

次に、データの変換とシリアライズの部分も共通化します。各変換メソッドが同じシグネチャを持つため、これらを統合するための新しいプロトコルを作成します。これにより、リクエストタイプに応じて適切な変換メソッドを選択することができます。

以下にリファクタリングしたコードを提供します:

```swift
// データ変換用のプロトコルを定義します
public protocol DataConverter {
    associatedtype DataType
    static func convertToData(_: Any) async throws -&gt; DataType
}

// 既存のデータ変換クラスを新しいプロトコルに適合させます
public struct AnchorConverter: DataConverter {
    public typealias DataType = Anchor
    static func convertToData(_: Any) async throws -&gt; DataType {
        Anchor()
    }
}

public struct EmotionConverter: DataConverter {
    public typealias DataType = Emotions
    static func convertToData(_: Any) async throws -&gt; DataType {
        Emotions()
    }
}

public struct InteractionConverter: DataConverter {
    public typealias DataType = Interaction
    static func convertToData(_: Any) async throws -&gt; DataType {
        Interaction()
    }
}

public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: Any)
    case emotion(key: EmotionDataKey, data: Any)
    case interaction(key: InteractionDataKey, data: Any)

    // リクエストタイプに応じて適切なデータ変換メソッドを提供するためのコンピューテッドプロパティを追加します
    var converter: AnyDataConverter {
        switch self {
        case .anchor:
            return AnyDataConverter(converter: AnchorConverter.self)
        case .emotion:
            return AnyDataConverter(converter: EmotionConverter.self)
        case .interaction:
            return AnyDataConverter(converter: InteractionConverter.self)
        }
    }
}

// associatedtypeを含むプロトコルを型消去するためのラッパークラスを作成します
public struct AnyDataConverter {
    private let _convertToData: (Any) async throws -&gt; Message

    init&lt;Converter: DataConverter&gt;(converter: Converter.Type) where Converter.DataType: Message {
        self._convertToData = { try await converter.convertToData($0) }
    }

    func convertToData(_ data: Any) async throws -&gt; Message {
        try await _convertToData(data)
    }
}

public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    // ...

    public func upload(request: CloudStorageUploadRequest) async throws

---

## 👤 ユーザー
*2023/06/14 20:05:11*

つづき

---

## 🤖 アシスタント
*2023/06/14 20:05:56*

申し訳ありませんが、前回のメッセージが途切れてしまったようです。以下にコードを続けます。

```swift
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited

        // データを変換し、シリアライズします
        let convertedData = try await request.converter.convertToData(data)
        let serializedData = try serializeToData(messages: [convertedData], serializationMethod: serializationMethod)
        
        // ローカルバックアップが有効な場合、データをローカルに保存します
        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
        }
        
        // データをクラウドストレージにアップロードします
        try await cloudStorageManager.upload(key: request.key.path, data: serializedData)
    }
}
```

このようにすることで、`upload` メソッドの冗長性が大幅に解消され、さらに `CloudStorageUploadRequest` エンティティに対して単一の処理フローが適用できるようになります。各タイプのデータ変換ロジックは、個々の `DataConverter` クラスと `CloudStorageUploadRequest` エンティティの `converter` プロパティにカプセル化されています。

また、本リファクタリングはあくまで一例であり、必ずしも最善の方法とは限らない点にご注意ください。プロジェクトの具体的な要件やコーディングスタイルなどにより、最適なリファクタリング方法は変わる可能性があります。

---

## 👤 ユーザー
*2023/06/14 20:11:56*

ちょっと修正してほしくて、Any型は仮であって、以下に修正した。
こちらでリファクタリングしてほしい。

public class AmplifyStorageManager: CloudStorageManagerProtocol {
    public init() {}

    public func upload(key: String, data: Data) async throws {
        do {
            let uploadTask = Amplify.Storage.uploadData(key: key, data: data)
            Task {
                for await progress in await uploadTask.progress {
                    print("Progress: \(progress)")
                }
            }
            try await print("Completed: \(uploadTask.value)")
        } catch {
            throw error
        }
    }
}

public protocol DataKey {
    var path: String { get }
}

public struct AnchorDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/anchors/measurements/\(measurementId)/users/\(userId)"
    }
}

public struct EmotionDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/emotions/measurements/\(measurementId)/users/\(userId)"
    }
}

public struct InteractionDataKey: DataKey {
    private let measurementId: String
    private let userId: String

    public init(measurementId: String, userId: String) {
        self.measurementId = measurementId
        self.userId = userId
    }

    public var path: String {
        "/raw/interactions/measurements/\(measurementId)/users/\(userId)"
    }
}

public struct DomainAnchor {}
public struct DomainEmotion {}
public struct DomainInteraction {}

public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: [DomainAnchor])
    case emotion(key: EmotionDataKey, data: [DomainEmotion])
    case interaction(key: InteractionDataKey, data: [DomainInteraction])
}

public struct AnchorConverter {
    static func convertToData(_: DomainAnchor) throws -&gt; Anchor {
        Anchor()
    }
}

public struct EmotionConverter {
    static func convertToData(_: DomainEmotion) throws -&gt; Emotions {
        Emotions()
    }
}

public struct InteractionConverter {
    static func convertToData(_: DomainInteraction) throws -&gt; Interaction {
        Interaction()
    }
}

public protocol CloudStorageManagerProtocol {
    func upload(key: String, data: Data) async throws
}

public protocol CloudStorageUploadInteractorProtocol {
    func upload(request: CloudStorageUploadRequest) async throws
}

public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        switch request {
        case .anchor(let key, let data):
            let convertedData = try data.map { try AnchorConverter.convertToData($0) }
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        case .emotion(let key, let data):
            let convertedData = try data.map { try EmotionConverter.convertToData($0) }
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        case .interaction(let key, let data):
            let convertedData = try data.map { try InteractionConverter.convertToData($0) }
            let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
            let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
            if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
                try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
            }
            try await cloudStorageManager.upload(key: key.path, data: serializedData)
        }
    }
}

extension CloudStorageUploadRequest {
    var fileName: String {
        switch self {
        case .anchor:
            return "anchor"
        case .emotion:
            return "emotion"
        case .interaction:
            return "interaction"
        }
    }
}

import SwiftProtobuf
import SwiftProtobufPluginLibrary

enum EncodingError: Error {
    case encodingFailed(Error)
}

enum SerializationMethod {
    case binaryDelimited
    case json
    
    var fileExtension: String {
        switch self {
        case .binaryDelimited:
            return ".bin"
        case .json:
            return ".json"
        }
    }
}

func serializeToData&lt;T: Message&gt;(messages: [T], serializationMethod: SerializationMethod) throws -&gt; Data {
    let data: Data
    switch serializationMethod {
    case .binaryDelimited:
        data = try serializeToBinaryData(messages: messages)
    case .json:
        data = try serializeToJSONData(messages: messages)
    }
    return data
}

func saveDataToLocal(data: Data, fileName: String, serializationMethod: SerializationMethod) throws {
    let filePath = FileManager.default.directoryURL(directory: .document).appendingPathComponent(fileName).appendingPathExtension(serializationMethod.fileExtension)

    do {
        try data.write(to: filePath, options: .atomic)
    } catch {
        throw error
    }
}

func serializeToBinaryData&lt;T: Message&gt;(messages: [T]) throws -&gt; Data {
    let outputStream = OutputStream.toMemory()
    outputStream.open()

    // エラーを throw するため forEach などは使えない
    for message in messages {
        do {
            try BinaryDelimited.serialize(message: message, to: outputStream)
        } catch {
            throw EncodingError.encodingFailed(error)
        }
    }

    outputStream.close()

    guard let data = outputStream.property(forKey: .dataWrittenToMemoryStreamKey) as? Data else {
        throw EncodingError.encodingFailed(NSError(domain: "EncodingError", code: -1, userInfo: [NSLocalizedDescriptionKey : "Failed to retrieve data from OutputStream"]))
    }

    return data
}

func serializeToJSONData&lt;T: Message&gt;(messages: [T]) throws -&gt; Data {
    var jsonData = Data()

    // エラーを throw するため forEach などは使えない
    for message in messages {
        do {
            let stringData = try message.jsonUTF8Data()
            jsonData.append(stringData)
        } catch {
            throw EncodingError.encodingFailed(error)
        }
    }

    return jsonData
}

---

## 🤖 アシスタント
*2023/06/14 20:13:43*

コードを見ると、CloudStorageUploadRequestの各ケースに対してほとんど同じ操作を行っていることがわかります。これはコードの重複を示しており、DRY（Don't Repeat Yourself）の原則に反しています。この部分をリファクタリングすることで、コードのメンテナンス性を向上させることができます。

まず、データの変換とシリアライズ処理を行うDataConverterProtocolを定義しましょう。このプロトコルは、DomainデータをProtobufのメッセージに変換する責務を持ちます。

```swift
public protocol DataConverterProtocol {
    associatedtype DomainData
    associatedtype MessageData: Message

    static func convertToMessage(_ domainData: DomainData) throws -> MessageData
}
```

次に、各データの変換を行うAnchorConverter、EmotionConverter、InteractionConverterをDataConverterProtocolに適合させます。

```swift
public struct AnchorConverter: DataConverterProtocol {
    public typealias DomainData = DomainAnchor
    public typealias MessageData = Anchor

    public static func convertToMessage(_ domainData: DomainData) throws -> MessageData {
        Anchor()
    }
}

public struct EmotionConverter: DataConverterProtocol {
    public typealias DomainData = DomainEmotion
    public typealias MessageData = Emotions

    public static func convertToMessage(_ domainData: DomainData) throws -> MessageData {
        Emotions()
    }
}

public struct InteractionConverter: DataConverterProtocol {
    public typealias DomainData = DomainInteraction
    public typealias MessageData = Interaction

    public static func convertToMessage(_ domainData: DomainData) throws -> MessageData {
        Interaction()
    }
}
```

次に、CloudStorageUploadRequestにDataKeyとDataConverterProtocolを結びつけます。

```swift
public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: [DomainAnchor], converter: AnchorConverter.Type)
    case emotion(key: EmotionDataKey, data: [DomainEmotion], converter: EmotionConverter.Type)
    case interaction(key: InteractionDataKey, data: [DomainInteraction], converter: InteractionConverter.Type)
}
```

これにより、CloudStorageUploadInteractorのuploadメソッドのリファクタリングが可能になります。

```swift
public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        let (key, data, converter) = try getParameters(request: request)

        let convertedData = try data.map { try converter.convertToMessage($0) }
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        
        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
        }
        
        try await cloudStorageManager

---

## 🤖 アシスタント
*2023/06/14 20:14:20*

.upload(key: key.path, data: serializedData)
    }

    private func getParameters(request: CloudStorageUploadRequest) throws -&gt; (DataKey, [Any], DataConverterProtocol.Type) {
        switch request {
        case .anchor(let key, let data, let converter):
            return (key, data, converter)
        case .emotion(let key, let data, let converter):
            return (key, data, converter)
        case .interaction(let key, let data, let converter):
            return (key, data, converter)
        }
    }
}
```

このようにリファクタリングを行うことで、各種のuploadリクエストに対して共通の処理フローを適用することが可能となり、コードの可読性とメンテナンス性を向上させることができます。ただし、具体的なリファクタリングの方法はプロジェクトの要件やコーディングスタイルによりますので、適宜修正を行ってください。

---

## 👤 ユーザー
*2023/06/14 20:15:46*

想定ではConverterはフレームワーク層としたくて、CloudStorageUploadRequestの段階で、どのConverterを使うかは知りたくなくて、CloudStorageUploadInteractorでどのConverterを使うかを適応したいんだ。

---

## 🤖 アシスタント
*2023/06/14 20:16:59*

それなら、それぞれの`CloudStorageUploadRequest`ケースごとに、対応するコンバータタイプを推測するメソッドを実装することができます。それらは`CloudStorageUploadInteractor`内に実装されます。以下に例を示します:

```swift
public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        let (key, data, converterType) = try getParameters(request: request)

        let convertedData = try data.map { try converterType.convertToMessage($0) }
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        
        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: request.fileName, serializationMethod: serializationMethod)
        }
        
        try await cloudStorageManager.upload(key: key.path, data: serializedData)
    }

    private func getParameters(request: CloudStorageUploadRequest) throws -> (DataKey, [Any], DataConverterProtocol.Type) {
        switch request {
        case .anchor(let key, let data):
            return (key, data, AnchorConverter.self)
        case .emotion(let key, let data):
            return (key, data, EmotionConverter.self)
        case .interaction(let key, let data):
            return (key, data, InteractionConverter.self)
        }
    }
}
```

ただし、`DataConverterProtocol`が型を保持しているため、このプロトコルを型消去するためのボックス化クラス（AnyDataConverter）が必要になります。

```swift
public class AnyDataConverter<DomainData, MessageData: Message>: DataConverterProtocol {
    private let _convertToMessage: (DomainData) throws -> MessageData

    public init<T: DataConverterProtocol>(_ converter: T) where T.DomainData == DomainData, T.MessageData == MessageData {
        self._convertToMessage = converter.convertToMessage
    }

    public func convertToMessage(_ domainData: DomainData) throws -> MessageData {
        return try _convertToMessage(domainData)
    }
}
```

これにより、各データタイプごとに異なる変換方法を持つことができ、それぞれのデータタイプに対する変換処理を`CloudStorageUploadInteractor`の外に持つことができます。また、それぞれの`CloudStorageUploadRequest`ケースはどのコンバーターを使用するかを知る必要がなくなります。

---

## 👤 ユーザー
*2023/06/14 20:17:17*

AnyDataConverterみたいなことをしたくないんだ。この処理はパフォーマンスを最優先にしたいんだ

---

## 🤖 アシスタント
*2023/06/14 20:18:25*

理解しました。型消去によるパフォーマンスのオーバーヘッドを避けたいのであれば、各データ型に直接関連するメソッドをCloudStorageUploadInteractorに実装することを検討できます。この方法ではジェネリックやプロトコルは使用せず、個々のケースで特定の変換を適用します。

以下にその一例を示します:

```swift
public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        switch request {
        case .anchor(let key, let data):
            try await uploadAnchorData(key: key, data: data)
        case .emotion(let key, let data):
            try await uploadEmotionData(key: key, data: data)
        case .interaction(let key, let data):
            try await uploadInteractionData(key: key, data: data)
        }
    }

    private func uploadAnchorData(key: AnchorDataKey, data: [DomainAnchor]) async throws {
        let convertedData = try data.map { try AnchorConverter.convertToData($0) }
        try await uploadData(key: key, data: convertedData)
    }

    private func uploadEmotionData(key: EmotionDataKey, data: [DomainEmotion]) async throws {
        let convertedData = try data.map { try EmotionConverter.convertToData($0) }
        try await uploadData(key: key, data: convertedData)
    }

    private func uploadInteractionData(key: InteractionDataKey, data: [DomainInteraction]) async throws {
        let convertedData = try data.map { try InteractionConverter.convertToData($0) }
        try await uploadData(key: key, data: convertedData)
    }

    private func uploadData<T: Message>(key: DataKey, data: [T]) async throws {
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let serializedData = try serializeToData(messages: data, serializationMethod: serializationMethod)
        
        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: key.path, serializationMethod: serializationMethod)
        }
        
        try await cloudStorageManager.upload(key: key.path, data: serializedData)
    }
}
```

この方法であれば、パフォーマンスが最優先され、各ケースごとにどのコンバーターを使用するかを明示的に定義しています。ただし、この方法では新しいデータタイプが追加されるたびに新しいメソッドを追加する必要があり、それが重複する可能性があります。このコードの一部は抽象化して再利用できますが、完全な抽象化は型消去という形でのパフォーマンスのコストが発生するため避けています。

---

## 👤 ユーザー
*2023/06/14 20:19:00*

private func uploadAnchorData とか2行しかないので、switch request {の中の処理でもいいかも

---

## 🤖 アシスタント
*2023/06/14 20:19:42*

確かにその通りです。具体的な`uploadXXXData`関数がそれほど複雑ではない場合、それらの処理を直接`upload(request:)`関数内の`switch`文に含めることができます。以下のようになります：

```swift
public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let key: DataKey
        let convertedData: [Message]

        switch request {
        case .anchor(let anchorKey, let data):
            key = anchorKey
            convertedData = try data.map { try AnchorConverter.convertToData($0) }
        case .emotion(let emotionKey, let data):
            key = emotionKey
            convertedData = try data.map { try EmotionConverter.convertToData($0) }
        case .interaction(let interactionKey, let data):
            key = interactionKey
            convertedData = try data.map { try InteractionConverter.convertToData($0) }
        }

        let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)

        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: key.path, serializationMethod: serializationMethod)
        }

        try await cloudStorageManager.upload(key: key.path, data: serializedData)
    }
}
```

これで、各タイプに対するアップロードのロジックが直接`upload(request:)`関数内に含まれ、コードがさらにシンプルになりました。

---

## 👤 ユーザー
*2023/06/14 20:21:56*

let serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)で以下のエラーになった
Type 'any Message' cannot conform to 'Message'

---

## 🤖 アシスタント
*2023/06/14 20:22:46*

それは型安全性を確保するためのSwiftの特性です。具体的な型が`Message`プロトコルに準拠していることを確認できない場合、Swiftはエラーを投げます。

`Any`や`AnyObject`のような型を避け、具体的な型を使用することでこの問題を解決することができます。しかし、あなたのコードでは、さまざまな型のデータを扱う必要があるため、その解決は難しいかもしれません。

この問題を解決する一つの方法は、`DomainAnchor`, `DomainEmotion`, `DomainInteraction`が共通のプロトコルを実装するようにして、そのプロトコルに対するコンバータを作成することです。しかし、これはあなたのコードの構造を大きく変える必要があります。

また、別の解決策として、`serializeToData`関数をジェネリック関数にすることも考えられます。ジェネリックを使用すると、関数は特定の型に制約されず、呼び出し時に具体的な型を指定することができます。

```swift
func serializeToData<T: Message>(messages: [T], serializationMethod: SerializationMethod) throws -> Data {
    let data: Data
    switch serializationMethod {
    case .binaryDelimited:
        data = try serializeToBinaryData(messages: messages)
    case .json:
        data = try serializeToJSONData(messages: messages)
    }
    return data
}
```

ただし、これらの解決策はあくまで提案であり、実際のプロジェクトの要件やコードの構造によって最適な解決策は変わる可能性があります。

---

## 👤 ユーザー
*2023/06/14 20:24:25*

ちょっと冗長だけど以下のように修正した

public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let key: DataKey
        let serializedData: Data

        switch request {
        case .anchor(let anchorKey, let data):
            key = anchorKey
            let convertedData = try data.map { try AnchorConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        case .emotion(let emotionKey, let data):
            key = emotionKey
            let convertedData = try data.map { try EmotionConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        case .interaction(let interactionKey, let data):
            key = interactionKey
            let convertedData = try data.map { try InteractionConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        }

        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: key.path, serializationMethod: serializationMethod)
        }

        try await cloudStorageManager.upload(key: key.path, data: serializedData)
    }
}

---

## 🤖 アシスタント
*2023/06/14 20:24:45*

あなたの修正はコードの冗長性を増すかもしれませんが、それはより型安全性を向上させるためのものであり、またコードの可読性を高めています。それぞれのcaseで行っている操作が明確になり、エラーが発生したときに問題を特定しやすくなります。

したがって、あなたの修正は適切だと思います。将来的には、さらなるリファクタリングにより冗長性を減らすことが可能かもしれませんが、現時点では、コードの安全性と可読性が優先されるべきだと考えます。

---

## 👤 ユーザー
*2023/06/14 21:15:28*

ちなみに今のコードを使って3つのリクエストをするコードを書いて欲しい

---

## 🤖 アシスタント
*2023/06/14 21:16:42*

以下に、3つのリクエストを生成してそれぞれをアップロードする例を示します。

```swift
// CloudStorageUploadInteractor のインスタンスを作成します。
let interactor = CloudStorageUploadInteractor()

// Anchor、Emotion、Interactionの各データを準備します。
let anchorData = [DomainAnchor(), DomainAnchor(), DomainAnchor()] // 実際のデータに置き換えてください。
let emotionData = [DomainEmotion(), DomainEmotion(), DomainEmotion()] // 実際のデータに置き換えてください。
let interactionData = [DomainInteraction(), DomainInteraction(), DomainInteraction()] // 実際のデータに置き換えてください。

// 各DataKeyを作成します。
let anchorKey = AnchorDataKey(measurementId: "measurement1", userId: "user1") // 実際の値に置き換えてください。
let emotionKey = EmotionDataKey(measurementId: "measurement2", userId: "user2") // 実際の値に置き換えてください。
let interactionKey = InteractionDataKey(measurementId: "measurement3", userId: "user3") // 実際の値に置き換えてください。

// Anchor, Emotion, Interaction のリクエストを作成します。
let anchorRequest = CloudStorageUploadRequest.anchor(key: anchorKey, data: anchorData)
let emotionRequest = CloudStorageUploadRequest.emotion(key: emotionKey, data: emotionData)
let interactionRequest = CloudStorageUploadRequest.interaction(key: interactionKey, data: interactionData)

// アップロードします。
Task {
    do {
        try await interactor.upload(request: anchorRequest)
        try await interactor.upload(request: emotionRequest)
        try await interactor.upload(request: interactionRequest)
    } catch {
        // エラーハンドリング
        print("Failed to upload data: \(error)")
    }
}
```

このコードは非同期のため、それぞれのアップロードは別のタスクで行われます。これにより、一つのアップロードが失敗しても他のアップロードは影響を受けません。

ただし、エラーハンドリングは適切に行うことが重要で、上記のコードではシンプルにエラーを出力していますが、実際のアプリケーションでは適切なエラーハンドリング（ユーザーへの通知、リトライメカニズムの実装など）が必要になります。

---

## 👤 ユーザー
*2023/06/15 01:01:34*

以下のインタラクターのclass名の候補を考えて欲しい

public class CloudStorageUploadInteractor: CloudStorageUploadInteractorProtocol {
    private let cloudStorageManager: CloudStorageManagerProtocol

    public init(cloudStorageManager: CloudStorageManagerProtocol = AmplifyStorageManager()) {
        self.cloudStorageManager = cloudStorageManager
    }

    public func upload(request: CloudStorageUploadRequest) async throws {
        let serializationMethod: SerializationMethod = UserDefaults.standard.bool(forKey: "isEnableJSONEncode") ? .json : .binaryDelimited
        let key: DataKey
        let serializedData: Data

        switch request {
        case .anchor(let anchorKey, let data):
            key = anchorKey
            let convertedData = try data.map { try AnchorConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        case .emotion(let emotionKey, let data):
            key = emotionKey
            let convertedData = try data.map { try EmotionConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        case .interaction(let interactionKey, let data):
            key = interactionKey
            let convertedData = try data.map { try InteractionConverter.convertToData($0) }
            serializedData = try serializeToData(messages: convertedData, serializationMethod: serializationMethod)
        }

        if UserDefaults.standard.bool(forKey: "isEnableLocalBackup") {
            try saveDataToLocal(data: serializedData, fileName: key.path, serializationMethod: serializationMethod)
        }

        try await cloudStorageManager.upload(key: key.path, data: serializedData)
    }
}

---

## 🤖 アシスタント
*2023/06/15 01:02:00*

このインタラクタークラスは、クラウドストレージへのデータのアップロードを担当しており、さらに、それぞれのデータ型（Anchor, Emotion, Interaction）を適切な形にシリアライズする責任も担っています。それを反映した名前の候補を以下に挙げてみます：

1. `CloudDataUploader`
2. `DataUploadInteractor`
3. `CloudStorageSerializerUploader`
4. `CloudStorageDataHandler`
5. `CloudDataSerializationUploader`
6. `MultiDataTypeUploader`
7. `CloudStorageDataPublisher`

これらの名前はクラスの役割をより具体的に示すもので、それぞれがクラスが担当する責任を適切に反映していると考えます。適切な名前を選ぶことで、クラスの役割を理解するのが容易になります。

---

## 👤 ユーザー
*2023/06/15 01:03:33*

Serializa Data Upload Interactor この4単語の派生語を入れたい

---

## 🤖 アシスタント
*2023/06/15 01:04:00*

指定された4つの単語を基に派生したクラス名の候補を以下に挙げます：

1. `DataSerializationUploadInteractor`
2. `UploadDataSerializerInteractor`
3. `InteractorForUploadAndSerializeData`
4. `DataUploadSerializationInteractor`
5. `InteractorForDataSerializationAndUpload`
6. `DataUploadingAndSerializationInteractor`
7. `UploadAndSerializeDataInteractor`
8. `SerializedDataUploadInteractor`
9. `InteractorForSerializedDataUploading`

これらの名前は、クラスがデータのシリアライゼーションとアップロードを担当していることを反映しています。適切な名前を選ぶことで、クラスの役割を理解しやすくなります。

---

## 👤 ユーザー
*2023/06/15 01:05:31*

シリアライゼーションとアップロードを担当していること、が伝わるようにして、xxxxInteractorがいい

---

## 🤖 アシスタント
*2023/06/15 01:05:48*

"シリアライゼーションとアップロード"というアクションが伝わるような形で、最後に "Interactor" とつけたいとのこと、了解しました。以下にいくつかの名前の候補を挙げてみます。

1. `SerializationAndUploadInteractor`
2. `DataSerializerAndUploaderInteractor`
3. `UploadAfterSerializationInteractor`
4. `SerializedDataUploaderInteractor`

それぞれの名前はデータのシリアライゼーションとアップロードの役割を伝えるように設計されています。

---

## 👤 ユーザー
*2023/06/15 01:07:57*

もろもろ命名に違和感があるんだけどどう思う❓

public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: [DomainAnchor])
    case emotion(key: EmotionDataKey, data: [DomainEmotion])
    case interaction(key: InteractionDataKey, data: [DomainInteraction])
}

public protocol SerializedDataUploaderInteractorProtocol {
    func upload(request: CloudStorageUploadRequest) async throws
}

public class SerializedDataUploaderInteractor: SerializedDataUploaderInteractorProtocol {}

---

## 🤖 アシスタント
*2023/06/15 01:08:43*

あなたが提出した名前は明確で、その役割と目的を正確に表現していると思います。しかし、細かな点でいくつか提案があります：

1. `CloudStorageUploadRequest`：この名前は、特定の「クラウドストレージ」へのアップロードリクエストを指しているように見えます。しかし、リクエストの中身（アンカー、エモーション、インタラクション）は特定のクラウドストレージサービスに特化しているわけではないように見えます。もし異なるストレージソリューションでこのリクエストを使用する可能性があるなら、`DataUploadRequest`のような汎用的な名前を考えてみても良いでしょう。

2. `SerializedDataUploaderInteractorProtocol`と`SerializedDataUploaderInteractor`：これらの名前はとても明確で、その役割を正確に示しています。一般的に、Interactorは「ユースケース」を表現します。これらの名前は、データをシリアライズしてアップロードするという特定のユースケースを示しているため、適切だと思います。

これらはあくまで提案であり、あなたのコードの具体的なコンテキストや既存の命名規則に合わせて適切に調整してください。

---

## 👤 ユーザー
*2023/06/15 01:08:58*

CloudStorageUploadRequestやDataUploadRequestよりもよいenum名をけんとうしてほしい

---

## 🤖 アシスタント
*2023/06/15 01:09:43*

リクエストの具体的な内容を考慮すると、以下のようなオプションが考えられます：

1. `DataSerializationRequest`: データのシリアライゼーションとその種類（アンカー、エモーション、インタラクション）に焦点を当てた名前です。

2. `DataPackageRequest`: この名前は、各種類のデータを「パッケージ」としてまとめることに焦点を当てています。

3. `DataTypeUploadRequest`: これはリクエストがどの種類のデータ（アンカー、エモーション、インタラクション）のアップロードを要求しているかに焦点を当てています。

4. `SerializedDataRequest`: この名前は、シリアライゼーションの観点からデータに焦点を当てています。

これらの名前は、リクエストが行う主要な動作やその内容をより具体的に表現するためのものです。適切な名前は、あなたのコードの具体的なコンテキストと既存の命名規則に大きく依存しますので、これらの提案を参考に最適な選択をしてください。

---

## 👤 ユーザー
*2023/06/15 01:09:49*

語尾にRequestをつけなくてもいいんだ。要するにuploadの対象なだけなんだ

---

## 🤖 アシスタント
*2023/06/15 01:10:28*

アップロード対象であることを強調したいという理解であれば、以下のような名前が考えられます：

1. `UploadableData`: アップロード可能なデータであることを強調する名前です。

2. `UploadTarget`: アップロードの対象であることを明確に示しています。

3. `DataBundle`: データが一緒にまとめられた"バンドル"であることを示しています。

4. `UploadPayload`: "payload"とは通常、伝送または輸送の対象となるデータや情報を指すので、この名前はアップロードの対象データであることを強調します。

5. `DataContainer`: これは単にデータを含む「コンテナ」であることを示しています。

これらの名前はあくまで提案であり、具体的な要件やコードのコンテキストによって適切な名前は変わる可能性があります。このリストから最も適切なものを選んでいただくか、これをベースに新たな名前を考えてみてください。

---

## 👤 ユーザー
*2023/06/15 01:13:39*

Interactor名に合わせて、SerializationAndUploadInteractorProtocolの関数名やCloudStorageUploadRequestのenum名をかえてほしい

public enum CloudStorageUploadRequest {
    case anchor(key: AnchorDataKey, data: [DomainAnchor])
    case emotion(key: EmotionDataKey, data: [DomainEmotion])
    case interaction(key: InteractionDataKey, data: [DomainInteraction])
}

public protocol SerializationAndUploadInteractorProtocol {
    func upload(request: CloudStorageUploadRequest) async throws
}

public class SerializationAndUploadInteractor: SerializationAndUploadInteractorProtocol {}

---

## 🤖 アシスタント
*2023/06/15 01:14:15*

以下に、Interactor名に合わせて`SerializationAndUploadInteractorProtocol`の関数名と`CloudStorageUploadRequest`のenum名を変更したバージョンを提供します。

InteractorProtocol内の関数名は、データをシリアライズしてアップロードするためのアクションをより明確に反映するように`serializeAndUpload()`に変更します。

また、enum名は`UploadableData`に変更し、それがアップロードの対象であることを強調します。

```swift
public enum UploadableData {
    case anchor(key: AnchorDataKey, data: [DomainAnchor])
    case emotion(key: EmotionDataKey, data: [DomainEmotion])
    case interaction(key: InteractionDataKey, data: [DomainInteraction])
}

public protocol SerializationAndUploadInteractorProtocol {
    func serializeAndUpload(data: UploadableData) async throws
}

public class SerializationAndUploadInteractor: SerializationAndUploadInteractorProtocol {
    // Implementation here
}
```

これらの変更は、コードの各部分が何を行っているのかをより明確に表現するのに役立つと思います。

---

## 👤 ユーザー
*2023/06/15 01:17:43*

UploadableDataはちょっと微妙な気がする

---

## 🤖 アシスタント
*2023/06/15 01:18:14*

理解しました。その場合、`SerializableUploadTarget`や`UploadDataTarget`などはいかがでしょうか？

以下に修正したコードを示します：

```swift
public enum SerializableUploadTarget {
    case anchor(key: AnchorDataKey, data: [DomainAnchor])
    case emotion(key: EmotionDataKey, data: [DomainEmotion])
    case interaction(key: InteractionDataKey, data: [DomainInteraction])
}

public protocol SerializationAndUploadInteractorProtocol {
    func serializeAndUpload(target: SerializableUploadTarget) async throws
}

public class SerializationAndUploadInteractor: SerializationAndUploadInteractorProtocol {
    // Implementation here
}
```

この`SerializableUploadTarget`は、アップロードの対象であり、かつシリアライズ可能であることを強調します。それぞれのケース（アンカー、エモーション、インタラクション）は、その目的に応じてシリアライズしてアップロードするべきデータを表します。

---
