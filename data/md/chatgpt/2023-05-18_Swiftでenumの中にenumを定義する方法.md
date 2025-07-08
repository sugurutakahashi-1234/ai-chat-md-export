# Swiftでenumの中にenumを定義する方法

日付: 2023-05-18

---

## 👤 ユーザー
*2023/05/18 18:44:52*

swift で enum の中に enum を定義する場合はどんな順番で記述するのが見やすいでしょうか？
以下を見やすい方法で修正して欲しい

```swift
private enum CustomWeight {
    enum HiraginoSansFontWeight {
        case w4, w7

        var fontWeight: Font.Weight {
            switch self {
            case .w4: return .regular
            case .w7: return .bold
            }
        }
    }

    case font(Font.Weight)
    case hiraginoSans(HiraginoSansFontWeight)

    var fontWeight: Font.Weight {
        switch self {
        case .font(let fontWeight):
            return fontWeight
        case .hiraginoSans(let hiraginoSansFontWeight):
            return hiraginoSansFontWeight.fontWeight
        }
    }
}
```

---

## 🤖 アシスタント
*2023/05/18 18:46:27*

提供されたコードはすでに非常に読みやすいと感じますが、個々の`enum`の定義に注釈を追加し、その役割と使い方を明確にすることが可読性を向上させる一つの方法です。以下にその一例を示します：

```swift
// プライベートなカスタム重さの列挙型を定義します。
private enum CustomWeight {
    // HiraginoSansフォントの重さを定義する列挙型を定義します。
    enum HiraginoSansFontWeight {
        case w4, w7

        // フォントの重さをFont.Weight型で返します。
        var fontWeight: Font.Weight {
            switch self {
            case .w4: return .regular
            case .w7: return .bold
            }
        }
    }

    case font(Font.Weight)
    case hiraginoSans(HiraginoSansFontWeight)

    // CustomWeightのインスタンスのフォントの重さをFont.Weight型で返します。
    var fontWeight: Font.Weight {
        switch self {
        case .font(let fontWeight):
            return fontWeight
        case .hiraginoSans(let hiraginoSansFontWeight):
            return hiraginoSansFontWeight.fontWeight
        }
    }
}
```

このように注釈を追加することで、各部分の役割と使い方が明確になります。このようなドキュメンテーションコメントは特に大規模なプロジェクトや複数人での開発時に有用です。ただし、コメントを追加することはコード自体が読みやすく、自己説明的であるべきという原則に反する場合もあるので注意が必要です。

また、コードの整形やインデントの規則性もコードの可読性に大きな影響を与えます。あなたが提供したコードはこれらの点についても適切に管理されています。

---
