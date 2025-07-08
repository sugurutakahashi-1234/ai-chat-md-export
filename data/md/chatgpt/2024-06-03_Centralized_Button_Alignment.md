# Centralized Button Alignment

日付: 2024-06-03

---

## 👤 ユーザー
*2024/06/03 18:14:02*

以下のコードはもっと簡素に書けないのか？中央に配置したいだけなんだ。

                HStack {
                    Spacer()
                    Button {
                        Task {
                            await presenter.onTapPlay()
                        }
                    } label: {
                        HStack {
                            Text("Request")
                            SFSymbols.arrowUpSquare.image
                                .imageScale(.large)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    Spacer()
                }

---

## 🤖 アシスタント
*2024/06/03 18:14:07*

以下のように簡素化できます。`HStack`を`frame(maxWidth: .infinity, alignment: .center)`で中央揃えにして、`Spacer`を削除します。

```swift
HStack {
    Button {
        Task {
            await presenter.onTapPlay()
        }
    } label: {
        HStack {
            Text("Request")
            SFSymbols.arrowUpSquare.image
                .imageScale(.large)
        }
    }
    .buttonStyle(.borderedProminent)
}
.frame(maxWidth: .infinity, alignment: .center)
```

これで中央揃えが実現できます。

---
