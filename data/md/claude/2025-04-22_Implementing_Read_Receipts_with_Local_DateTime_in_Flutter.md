# Implementing Read Receipts with Local DateTime in Flutter

日付: 2025-04-22

---

## 👤 ユーザー
*2025/4/22 14:43:53*

Fluuter で既読管理をしたいのだけれどもDatetime型をローカルで保持したい。既読済み時間をDatetime で最も小さい値にしたい

---

## 🤖 アシスタント
*2025/4/22 14:44:23*

お問い合わせありがとうございます。Flutterで既読管理をする際にDatetime型をローカルで保持し、未読メッセージの場合は最小値を設定したいということですね。

これを実装するには、Dartの`DateTime`クラスの最小値（エポック時間の始まり）を使用するのが良いでしょう。以下にコード例を示します：

```dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class Message {
  final String id;
  final String content;
  final DateTime sentAt;
  DateTime? readAt;

  // 未読のメッセージの場合はreadAtがnull
  Message({
    required this.id,
    required this.content,
    required this.sentAt,
    this.readAt,
  });

  // メッセージを既読にするメソッド
  void markAsRead() {
    readAt = DateTime.now();
  }

  // メッセージが既読かどうかを判断するメソッド
  bool isRead() {
    return readAt != null;
  }

  // 保存用に既読状態をマップに変換
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'content': content,
      'sentAt': sentAt.millisecondsSinceEpoch,
      // 未読の場合は0（DateTime型の最小値）を保存
      'readAt': readAt?.millisecondsSinceEpoch ?? 0,
    };
  }

  // マップから復元するファクトリコンストラクタ
  factory Message.fromMap(Map<String, dynamic> map) {
    return Message(
      id: map['id'],
      content: map['content'],
      sentAt: DateTime.fromMillisecondsSinceEpoch(map['sentAt']),
      // 0（最小値）の場合はnullとして扱う
      readAt: map['readAt'] == 0 ? null : DateTime.fromMillisecondsSinceEpoch(map['readAt']),
    );
  }
}
```

この実装では：

1. 未読のメッセージは `readAt` が `null` になっています
2. ローカルストレージ（例：SharedPreferences、SQLite、Hive）に保存する際は：
   - 既読済みの場合は実際の既読時間のミリ秒値を保存
   - 未読の場合は `0`（Unix時間の始まり、つまり1970年1月1日）を保存

これにより、ソート時に未読メッセージ（DateTime型の最小値）が優先されるような実装が可能です。例えば：

```dart
// メッセージを既読状態でソートする（未読が先頭に来るようにする）
void sortMessagesByReadStatus(List<Message> messages) {
  messages.sort((a, b) {
    final aReadTime = a.readAt?.millisecondsSinceEpoch ?? 0;
    final bReadTime = b.readAt?.millisecondsSinceEpoch ?? 0;
    return aReadTime.compareTo(bReadTime);
  });
}
```

他のローカルストレージオプションとしては、Hive、Shared Preferences、SQLiteなどがあります。例えば、SharedPreferencesを使った保存と読み込みの例を示します：

```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

// メッセージをローカルに保存
Future<void> saveMessages(List<Message> messages) async {
  final prefs = await SharedPreferences.getInstance();
  final List<String> jsonMessages = messages.map(
    (msg) => jsonEncode(msg.toMap())
  ).toList();
  
  await prefs.setStringList('messages', jsonMessages);
}

// メッセージをローカルから読み込み
Future<List<Message>> loadMessages() async {
  final prefs = await SharedPreferences.getInstance();
  final List<String>? jsonMessages = prefs.getStringList('messages');
  
  if (jsonMessages == null) return [];
  
  return jsonMessages.map((jsonMsg) {
    final map = jsonDecode(jsonMsg) as Map<String, dynamic>;
    return Message.fromMap(map);
  }).toList();
}
```

これでFlutterアプリにおいて、DateTime型を使った既読管理機能を実装できます。何か質問があればお知らせください。

---
