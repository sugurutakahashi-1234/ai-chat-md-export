# URLをStringに変換

日付: 2024-10-10

---

## 👤 ユーザー
*2024/10/10 16:39:20*

Stringに変えてほしい

        private var urlString: String {
            switch self {
            case .promotionVideo:
                #if DEBUG
                URL(string: "https://dev.static.progrit.work/diatalk/onboarding\_movie.mp4")!
                #else
                URL(string: "https://static.progrit.work/diatalk/onboarding\_movie.mp4")!
                #endif
            case .termsOfService:
                URL(string: "https://www.diatalk.com/terms/")!
            case .privacyPolicy:
                URL(string: "https://www.progrit.co.jp/privacy/")!
            case .cancelSubscription:
                // TODO: #557 適切な値に修正する
                "https://sugurutakahashi-1234.github.io/redirect-sample-web-page/"
            }
        }

---

## 🤖 アシスタント
*2024/10/10 16:39:26*

こちらのコードを `String` に変換しました：

```swift
private var urlString: String {
    switch self {
    case .promotionVideo:
        #if DEBUG
        return "https://dev.static.progrit.work/diatalk/onboarding_movie.mp4"
        #else
        return "https://static.progrit.work/diatalk/onboarding_movie.mp4"
        #endif
    case .termsOfService:
        return "https://www.diatalk.com/terms/"
    case .privacyPolicy:
        return "https://www.progrit.co.jp/privacy/"
    case .cancelSubscription:
        // TODO: #557 適切な値に修正する
        return "https://sugurutakahashi-1234.github.io/redirect-sample-web-page/"
    }
}
```

`URL(string: "URL")!` の部分を `return "URL"` に置き換えました。

---
