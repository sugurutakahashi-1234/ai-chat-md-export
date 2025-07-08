# Remove 'any' LoggerContainer

日付: 2024-03-04

---

## 👤 ユーザー
*2024/3/4 15:17:53*

これをanyを外したい

public actor LoggerContainer {
    private static var osLogDriver: (any OSLogDriverProtocol)?
    
    public static func append(osLogDriver: any OSLogDriverProtocol) {
        self.osLogDriver = osLogDriver
    }
    
    public static func log(_ event: LogEventType, level: LogLevel = .notice, file: String = #filePath, function: String = #function, line: Int = #line) {
        osLogDriver?.log(event, level: level, file: file.lastPathComponent, function: function, line: line)
    }
}

---
