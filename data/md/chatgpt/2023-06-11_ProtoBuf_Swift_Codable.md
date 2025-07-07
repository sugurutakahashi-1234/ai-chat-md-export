# ProtoBuf Swift Codable

日付: 2023-06-11

---

## 👤 ユーザー
*2023/6/11 19:26:35*

以下のprotoBuf定義からSwiftでCodable適応したenumとstructを出力して欲しい。変数はvarではなくletにしてほしい。



syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Anchor {
  // 作成日時
  google.protobuf.Timestamp timestamp = 0;
  oneof type {
    EyeMovement eye\_movement = 1;
    Blink blink = 2;
  }
}

message EyeMovement {
  // 目線のx座標
  double left = 0;
  // 目線のy座標
  double top = 1;
  // 眼球運動状態
  EyeMovementState eye\_movement\_state = 2;
}

enum EyeMovementState {
  FIXATION = 0;
  SACCADE = 1;
  UNKNOWN = 2;
}

message Blink {
  // 右目の瞬き
  bool blink\_right = 0;
  // 左目の瞬き
  bool blink\_left = 1;
  // TODO(rnarkk)
  // double eye\_openness = 2;
}

---
