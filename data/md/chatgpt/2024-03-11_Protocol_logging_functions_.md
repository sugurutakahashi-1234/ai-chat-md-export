# Protocol logging functions.

Date: 2024-03-11

---

## 👤 User
*2024-03-11 13:45:31*

以下をprotocolで定義してほしい。

public func debugLog(_ message: String = "", level: LogLevel = .info, file: String = #filePath, function: String = #function, line: Int = #line) {
        log(.debug(.init(message: message)), level: level, file: file, function: function, line: line)
    }

    public func initLog(level: LogLevel = .info, file: String = #filePath, function: String = #function, line: Int = #line) {
        log(.`init`(.init(instanceName: file.fileNameWithoutExtension)), level: level, file: file, function: function, line: line)
    }

    public func deinitLog(level: LogLevel = .info, file: String = #filePath, function: String = #function, line: Int = #line) {
        log(.deinit(.init(instanceName: file.fileNameWithoutExtension)), level: level, file: file, function: function, line: line)
    }

    public func onAppearLog(level: LogLevel = .info, file: String = #filePath, function: String = #function, line: Int = #line) {
        log(.appearScreen(.init(screenName: file.lastPathComponent.replacingOccurrences(of: "Presenter.swift", with: "").toSnakeCase)), level: level, file: file, function: function, line: line)
    }

    public func onDisappearLog(level: LogLevel = .info, file: String = #filePath, function: String = #function, line: Int = #line) {
        log(.disappearScreen(.init(screenName: file.lastPathComponent.replacingOccurrences(of: "Presenter.swift", with: "").toSnakeCase)), level: level, file: file, function: function, line: line)
    }

    public func errorLog(_ appError: AppError?, level: LogLevel = .error, file: String = #filePath, function: String = #function, line: Int = #line) {
        guard let appError else {
            return
        }
        log(.error(.init(appError: appError, errorName: appError.name)), level: level, file: file, function: function, line: line)
    }

    public func errorLog(_ message: String, level: LogLevel = .error, file: String = #filePath, function: String = #function, line: Int = #line) {
        let appError: AppError = .customError(message)
        log(.error(.init(appError: appError, errorName: appError.name)), level: level, file: file, function: function, line: line)
    }

---

## 🤖 Assistant
*2024-03-11 13:45:33*

以下は、要求された関数をプロトコルで定義したものです。

```swift
protocol Logging {
    func debugLog(_ message: String, level: LogLevel, file: String, function: String, line: Int)
    func initLog(level: LogLevel, file: String, function: String, line: Int)
    func deinitLog(level: LogLevel, file: String, function: String, line: Int)
    func onAppearLog(level: LogLevel, file: String, function: String, line: Int)
    func onDisappearLog(level: LogLevel, file: String, function: String, line: Int)
    func errorLog(_ appError: AppError?, level: LogLevel, file: String, function: String, line: Int)
    func errorLog(_ message: String, level: LogLevel, file: String, function: String, line: Int)
}
```

これで、このプロトコルを適用したクラスや構造体でこれらのメソッドを実装することができます。

---

## 👤 User
*2024-03-11 14:00:49*

Swiftでxxxの変数を保持している protocol名を考えてほしい。LogDriverInterface であまりしっくりきていない。

protocol LogDriverInterface: LogDriverDependency {
    associatedtype HogeLogDriverProtocolAT: HogeLogDriverProtocol

    var logDriver: HogeLogDriverProtocolAT { get }
}

---

## 🤖 Assistant
*2024-03-11 14:00:50*

提案として、"Loggable" という名前のプロトコルを考えてみます。このプロトコルはログ関連の操作や振る舞いを定義します。

```swift
protocol Loggable {
    associatedtype LogDriverType: LogDriverProtocol
    
    var logDriver: LogDriverType { get }
}
```

このようにすることで、適切なログドライバーを実装するためのプロトコルとして使用できます。

---
