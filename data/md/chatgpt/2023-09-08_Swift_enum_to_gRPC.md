# Swift enum to gRPC

Date: 2023-09-08

---

## 👤 User
*2023-09-08 23:28:24*

grpc はSwfitの連想値を持つenum対応しているのか？

---

## 🤖 Assistant
*2023-09-08 23:29:13*

gRPCはプロトコルであり、実際のデータのシリアライズとデシリアライズはProtocol Buffers (protobuf)を使って行われます。Swiftの連想値を持つenum（associated valuesを持つenum）は非常に強力な機能であり、Swift特有のものです。

Protocol Buffersのデフォルトの仕様では、Swiftの連想値を持つenumを直接サポートしているわけではありません。ただし、特定のenumのケースとそれに関連するデータを表現するためのワークアラウンドは存在します。

例えば、Swiftで以下のような連想値を持つenumがあるとします:

```swift
enum Message {
    case text(String)
    case image(URL)
}
```

これをProtocol Buffersで表現する場合の一つの方法は、各ケースをメッセージとして定義し、それをワンオフフィールドとして含むメッセージを作成することです。

```proto
message TextMessage {
    string content = 1;
}

message ImageMessage {
    string url = 1;
}

message Message {
    oneof content {
        TextMessage text = 1;
        ImageMessage image = 2;
    }
}
```

上記のように定義することで、Swiftの連想値を持つenumと同じようなデータ構造をProtocol Buffersで表現することができます。ただし、Swift側でのデコードやエンコードの際には、この変換を手動で行う必要があります。

---

## 👤 User
*2023-09-08 23:29:36*

それを書いてほしい

---

## 🤖 Assistant
*2023-09-08 23:30:34*

了解しました。Swiftの連想値を持つenumをgRPCのProtocol Buffersと相互変換するためのサンプルコードを提供します。

まず、上記の`.proto`定義に基づくgRPCから生成されるSwiftのクラスと、自前のSwift enumを用意します：

```swift
// gRPCから生成されるクラス (この部分は実際にはgRPCツールから自動生成されます)
class TextMessage {
    var content: String
    // ... initializer, etc.
}

class ImageMessage {
    var url: String
    // ... initializer, etc.
}

class Message {
    enum Content {
        case text(TextMessage)
        case image(ImageMessage)
    }
    var content: Content?
    // ... initializer, etc.
}

// 自前のSwift enum
enum CustomMessage {
    case text(String)
    case image(URL)
}
```

次に、`CustomMessage`とgRPCの`Message`クラスとの間の変換関数を提供します：

```swift
extension CustomMessage {
    init?(from grpcMessage: Message) {
        switch grpcMessage.content {
        case .text(let textMessage):
            self = .text(textMessage.content)
        case .image(let imageMessage):
            guard let url = URL(string: imageMessage.url) else {
                return nil
            }
            self = .image(url)
        default:
            return nil
        }
    }

    func toGRPCMessage() -> Message {
        let grpcMessage = Message()
        switch self {
        case .text(let text):
            let textMessage = TextMessage()
            textMessage.content = text
            grpcMessage.content = .text(textMessage)
        case .image(let url):
            let imageMessage = ImageMessage()
            imageMessage.url = url.absoluteString
            grpcMessage.content = .image(imageMessage)
        }
        return grpcMessage
    }
}
```

これで、`CustomMessage`とgRPCの`Message`を相互に変換するためのメソッドが用意されました。これにより、Swiftの連想値を持つenumとgRPCのメッセージとの間でのデータの変換が可能となります。

---
