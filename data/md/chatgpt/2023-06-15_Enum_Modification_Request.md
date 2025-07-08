# Enum Modification Request

Date: 2023-06-15

---

## 👤 User
*2023-06-15 20:04:15*

enum で排他制御になっているところをoptionalとしてeye_movementとblinkを同じ階層で持って欲しい

syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Anchor {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;
  oneof type {
    EyeMovement eye_movement = 2;
    Blink blink = 3;
  }
}

message EyeMovement {
  // 目線のx座標
  double left = 1;
  // 目線のy座標
  double top = 2;
  // 眼球運動状態
  EyeMovementState eye_movement_state = 3;
}

enum EyeMovementState {
  FIXATION = 0;
  SACCADE = 1;
  UNKNOWN = 2;
}

message Blink {
  // 右目の瞬き
  bool blink_right = 1;
  // 左目の瞬き
  bool blink_left = 2;
  // TODO(rnarkk)
  // double eye_openness = 3;
}

---

## 🤖 Assistant
*2023-06-15 20:05:00*

あなたのリクエストに基づき、`EyeMovement`と`Blink`を同じ階層で`optional`として持つように`Anchor`メッセージを変更します。 `oneof`を削除して、メッセージの両方をオプショナル（非必須）フィールドとして定義します。これにより、これらのフィールドのどちらも、どちらか一方、または両方を持つことができます。

更新されたprotobufは以下の通りです：

```protobuf
syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Anchor {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;

  // 目の動き情報
  EyeMovement eye_movement = 2;

  // まばたき情報
  Blink blink = 3;
}

message EyeMovement {
  // 目線のx座標
  double left = 1;
  // 目線のy座標
  double top = 2;
  // 眼球運動状態
  EyeMovementState eye_movement_state = 3;
}

enum EyeMovementState {
  FIXATION = 0;
  SACCADE = 1;
  UNKNOWN = 2;
}

message Blink {
  // 右目の瞬き
  bool blink_right = 1;
  // 左目の瞬き
  bool blink_left = 2;
  // TODO(rnarkk)
  // double eye_openness = 3;
}
```
上記の修正で、`Anchor`メッセージは、`EyeMovement`と`Blink`を同時に含むことが可能になりました。どちらも省略可能で、どちらか一方だけを含むことも可能です。

---

## 👤 User
*2023-06-15 20:07:51*

どこにオプショナルの設定があるのでしょうか？

---

## 🤖 Assistant
*2023-06-15 20:08:22*

`proto3` の構文では、すべてのフィールドはデフォルトで「オプショナル（optional）」となります。つまり、メッセージに存在してもしなくても良いという意味です。明示的に `optional` キーワードを使ってマークする必要はありません。したがって、以下のようなコード：

```protobuf
message Anchor {
  google.protobuf.Timestamp timestamp = 1;
  EyeMovement eye_movement = 2;
  Blink blink = 3;
}
```

ここでは、`EyeMovement` と `Blink` はそれぞれオプショナル（非必須）フィールドとなります。これらのフィールドは、`Anchor` メッセージが送信されるときに含まれているか、または含まれていないかにかかわらず、正常にデコードできます。

なお、これは `proto3` の挙動であり、 `proto2` 構文では、明示的に `optional` キーワードを使用してフィールドをオプショナルに設定する必要があります。

---
