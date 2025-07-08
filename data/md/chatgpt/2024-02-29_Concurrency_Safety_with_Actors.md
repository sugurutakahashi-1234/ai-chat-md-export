# Concurrency Safety with Actors

Date: 2024-02-29

---

## 👤 User
*2024-03-01 01:36:40*

こちらで、

Static property 'loggers' is not concurrency-safe because it is non-isolated global shared mutable state; this is an error in Swift 6

このようなエラーが発生している。

public protocol LoggerContainable {
    func log(_: LogEventType, level: LogLevel, file: String, function: String, line: Int)
}

public struct LoggerContainer {
    private static var loggers: [any LoggerContainable] = []

    public static func append(logger: some LoggerContainable) {
        loggers.append(logger)
    }

    public static func log(_ event: LogEventType, level: LogLevel = .notice, file: String = #file, function: String = #function, line: Int = #line) {
        loggers.forEach { $0.log(event, level: level, file: file.lastPathComponent, function: function, line: line) }
    }
}

---

## 🤖 Assistant
*2024-03-01 01:37:38*

Swift 6で導入された、グローバル共有の可変状態に対する新しい並行性の安全性の要件により、`LoggerContainer`内の`loggers`静的プロパティがエラーを引き起こしています。このエラーは、`loggers`が複数のスレッドから同時にアクセスされ、変更される可能性があるため、データ競合やその他の並行性の問題を引き起こす可能性があることを示しています。

Swiftの並行性モデルは、データの安全なアクセスを保証するために、特定のパターンやプラクティスを採用しています。この問題を解決するためには、共有状態へのアクセスを同期する必要があります。Swiftには、この目的のために`Actor`が導入されています。`Actor`は、特定のスレッドや実行コンテキストに縛られず、内部状態への安全な非同期アクセスを提供します。

以下は、`LoggerContainer`を`Actor`に変換して、`loggers`へのアクセスを同期する方法の一例です。

```swift
public protocol LoggerContainable {
    func log(_: LogEventType, level: LogLevel, file: String, function: String, line: Int)
}

// LoggerContainerをactorに変更
public actor LoggerContainer {
    private static var loggers: [any LoggerContainable] = []

    public static func append(logger: some LoggerContainable) {
        loggers.append(logger)
    }

    public static func log(_ event: LogEventType, level: LogLevel = .notice, file: String = #file, function: String = #function, line: Int = #line) {
        // loggers.forEachを非同期で安全に実行
        Task {
            for logger in loggers {
                await logger.log(event, level: level, file: file.lastPathComponent, function: function, line: line)
            }
        }
    }
}
```

この変更により、`LoggerContainer`は`Actor`になり、`loggers`へのアクセスは自動的に同期されます。ただし、`LoggerContainable`プロトコルの`log`メソッドが非同期である必要があるか、非同期コンテキストで安全に呼び出せるようにする必要があります。これは、`await`キーワードを使用して`log`メソッドを呼び出すことで実現されます。

注意点として、この変更により`LoggerContainer`の使用方法が少し変わります。`append`や`log`メソッドを呼び出す際には、これらのメソッドが非同期であるため、適切な非同期コンテキスト（例えば、`Task`や`async`関数内）で呼び出す必要があります。

---
