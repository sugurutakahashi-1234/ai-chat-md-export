# Random Nickname and Notification

日付: 2024-07-12

---

## 👤 ユーザー
*2024/07/12 15:34:16*

randomNickname のように SNSのサービスのrandomNotificationTitle を定義してほしい。

extension String {
    public static var randomNickname: String {
        let names = [
            "たっくん", "ケンタ", "りょうちゃん123", "みっちゃん",
            "ユウタ", "まゆみん", "いっちゃん2世", "アヤ",
        ]
        return names.randomElement()!
    }
}

---

## 🤖 アシスタント
*2024/07/12 15:34:22*

以下のように `randomNotificationTitle` を定義できます。

```swift
extension String {
    public static var randomNickname: String {
        let names = [
            "たっくん", "ケンタ", "りょうちゃん123", "みっちゃん",
            "ユウタ", "まゆみん", "いっちゃん2世", "アヤ",
        ]
        return names.randomElement()!
    }
    
    public static var randomNotificationTitle: String {
        let titles = [
            "新しい友達リクエストがあります",
            "あなたの投稿にコメントがつきました",
            "新しいメッセージがあります",
            "グループに招待されました",
            "あなたのプロフィールが更新されました",
            "新しいフォロワーがいます",
            "投稿がシェアされました",
            "あなたの写真がタグ付けされました"
        ]
        return titles.randomElement()!
    }
}
```

これで `String.randomNotificationTitle` を使うと、ランダムな通知タイトルが取得できます。

---
