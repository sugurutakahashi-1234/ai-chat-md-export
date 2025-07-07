# Button with Chevron Row

日付: 2024-07-23

---

## 👤 ユーザー
*2024/7/23 15:05:13*

SwiftUIのListでnavigationLinkにすると自動的にシェブロン付きのrowがViewで表現されるがbuttonでも同様のUIを実装したい

---

## 🤖 アシスタント
*2024/7/23 15:05:28*

SwiftUIのListで `NavigationLink` を使用すると、自動的にシェブロン付きの行が作成されます。これと同様のUIを `Button` を使用して実装するには、`HStack` と `Spacer` を組み合わせてカスタム行を作成し、右端にシェブロンを表示することができます。

以下のコードスニペットは、`Button` を使用して `NavigationLink` と同様の見た目の行を実装する方法を示しています。

```swift
import SwiftUI

struct CustomRowView: View {
    var title: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Text(title)
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
            }
            .contentShape(Rectangle()) // Button全体をタップ領域にする
        }
        .buttonStyle(PlainButtonStyle()) // Buttonのデフォルトスタイルを解除
    }
}

struct ContentView: View {
    var body: some View {
        NavigationView {
            List {
                CustomRowView(title: "Row 1") {
                    print("Row 1 tapped")
                    // Navigation code here
                }
                CustomRowView(title: "Row 2") {
                    print("Row 2 tapped")
                    // Navigation code here
                }
                CustomRowView(title: "Row 3") {
                    print("Row 3 tapped")
                    // Navigation code here
                }
            }
            .navigationTitle("Custom List")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、`CustomRowView` コンポーネントを作成し、`Button` のアクションとシェブロンアイコンを持つ行を定義しています。`Button` のスタイルを `PlainButtonStyle` に設定することで、デフォルトのボタンスタイルを解除し、カスタムな見た目を実現しています。これにより、リストの行をタップ可能にし、シェブロンアイコンを右端に表示することができます。

---

## 👤 ユーザー
*2024/7/23 15:06:28*

実際はシェブロンはもうちょっと小さくて、薄くて太い気がする

---

## 🤖 アシスタント
*2024/7/23 15:06:41*

シェブロンのアイコンをもう少し小さく、薄く、太く見せるためには、フォントサイズ、フォントウェイト、カラーを調整する必要があります。以下のように修正してみてください：

```swift
import SwiftUI

struct CustomRowView: View {
    var title: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Text(title)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.gray)
            }
            .contentShape(Rectangle()) // Button全体をタップ領域にする
        }
        .buttonStyle(PlainButtonStyle()) // Buttonのデフォルトスタイルを解除
    }
}

struct ContentView: View {
    var body: some View {
        NavigationView {
            List {
                CustomRowView(title: "Row 1") {
                    print("Row 1 tapped")
                    // Navigation code here
                }
                CustomRowView(title: "Row 2") {
                    print("Row 2 tapped")
                    // Navigation code here
                }
                CustomRowView(title: "Row 3") {
                    print("Row 3 tapped")
                    // Navigation code here
                }
            }
            .navigationTitle("Custom List")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この変更点では、シェブロンアイコンのフォントサイズを `14` に設定し、フォントウェイトを `bold` にすることで、アイコンを少し太く見せています。また、アイコンの色を `.gray` に設定して、薄く見えるように調整しています。このようにすることで、`NavigationLink` と同様の見た目を実現できます。

---
