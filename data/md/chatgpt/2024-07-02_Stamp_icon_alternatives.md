# Stamp icon alternatives

Date: 2024-07-02

---

## 👤 User
*2024-07-02 15:16:21*

SFSymbolでスタンプのアイコン

---

## 🤖 Assistant
*2024-07-02 15:16:40*

SFSymbolsには、具体的にスタンプ（印鑑やスタンプ台）のアイコンはありませんが、似たような用途に使えるアイコンがいくつかあります。以下のようなアイコンを代わりに使用することができます。

1. **checkmark.seal**: 丸いシールにチェックマークが付いたアイコン
2. **checkmark.seal.fill**: 塗りつぶされたバージョンの丸いシールにチェックマークが付いたアイコン
3. **seal**: 丸いシールのアイコン
4. **seal.fill**: 塗りつぶされたバージョンの丸いシールのアイコン
5. **doc.text.viewfinder**: ドキュメントに関連するアイコンで、スタンプを押すイメージに近い

これらのアイコンは次のように使うことができます：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "checkmark.seal")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .padding()

            Image(systemName: "checkmark.seal.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .padding()

            Image(systemName: "seal")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .padding()

            Image(systemName: "seal.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .padding()

            Image(systemName: "doc.text.viewfinder")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .padding()
        }
    }
}
```

これらのアイコンの中から、用途に最も適したものを選んで使用してください。

---
