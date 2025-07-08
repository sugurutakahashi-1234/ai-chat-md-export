# Swift Dummy Data

日付: 2023-06-27

---

## 👤 ユーザー
*2023/06/27 22:08:55*

Swiftで以下のprotoデータを元にのダミーデータを作って欲しい

syntax = "proto3";

import "google/protobuf/struct.proto";
import "google/protobuf/timestamp.proto";

message Interaction {
  google.protobuf.Timestamp timestamp = 1;
  string event_type = 2;
  map&lt;string, google.protobuf.Value&gt; parameters = 3;
}

message PageView {
  string url = 1;
  string title = 2;
  string referrer = 3;
}

message Click {
  string target = 1;
  double left = 2;
  double top = 3;
}

message Scroll {
  string target = 1;
  double left = 2;
  double top = 3;
}

message VideoPlay {
  string source = 1;
}

message VideoPause {
  string source = 1;
}

message VideoEnded {
  string source = 1;
}

message VideoSkipped {
  // 動画の現在の再生時間（秒）
  // AVPlayer.currentTime().seconds
  double current_time = 1;
}

---

## 🤖 アシスタント
*2023/06/27 22:09:08*

SwiftではGoogleのProtocol Buffers（ProtoBuf）の使用には`SwiftProtobuf`ライブラリが必要となります。このライブラリを用いてダミーデータを作成します。

まず、インストール方法は以下の通りです。

1. `Swift Package Manager`を使用する場合、次の依存関係を`Package.swift`に追加します：

```swift
// swift-tools-version:5.1
import PackageDescription

---
