# Crear pantalla de selección.

日付: 2023-10-06

---

## 👤 ユーザー
*2023/10/6 17:03:28*

以下のenumをSwiftUIで選択する画面を作成してほしいあ

---

## 🤖 アシスタント
*2023/10/6 17:03:47*

了解しました。まず、Swiftのenumを作成します。以下の例では、食べ物の種類をenumで定義しています。

```swift
enum Food: String, CaseIterable, Identifiable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"

    var id: String { self.rawValue }
}
```

SwiftUIでこのenumを選択するための画面を以下のように作成します：

```swift
import SwiftUI

struct FoodSelectionView: View {
    @State private var selectedFood: Food? = nil
    
    var body: some View {
        NavigationView {
            List(Food.allCases, id: \.self) { food in
                HStack {
                    Text(food.rawValue)
                    Spacer()
                    if food == selectedFood {
                        Image(systemName: "checkmark")
                    }
                }
                .onTapGesture {
                    selectedFood = food
                }
            }
            .navigationTitle("Choose a Food")
        }
    }
}

struct FoodSelectionView_Previews: PreviewProvider {
    static var previews: some View {
        FoodSelectionView()
    }
}
```

上記のコードでは、`Food` enumの全てのケースをリストで表示しています。選択された食べ物の隣にはチェックマークが表示されます。

このような基本的な画面をベースに、さらにカスタマイズや追加の機能を付けることができます。必要な情報や詳細がありましたら、お知らせください。

---
