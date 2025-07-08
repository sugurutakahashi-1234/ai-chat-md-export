# SwiftUI BMI MVVM Model

Date: 2024-02-20

---

## 👤 User
*2024-02-21 01:03:16*

SwiftUI で身長と体重を入力して、そこからBMIを計算する処理を書きたい.

---

## 🤖 Assistant
*2024-02-21 01:04:51*

SwiftUIで身長と体重を入力してBMIを計算する処理を作成するには、以下のステップに従います。

1. **ユーザーインターフェイスの作成**: 身長と体重を入力するためのTextFieldと、BMIを表示するためのTextビューを含むUIを設計します。
2. **バインディング変数の定義**: ユーザーが入力した身長と体重を保持するためのバインディング変数を定義します。
3. **BMI計算ロジックの実装**: 身長と体重からBMIを計算するロジックを実装します。
4. **ビューの更新**: 計算されたBMIをビューに表示します。

以下は、このプロセスを実装する基本的なコード例です。

```swift
import SwiftUI

struct BMIView: View {
    @State private var height: String = ""
    @State private var weight: String = ""
    @State private var bmi: Double = 0.0

    var body: some View {
        VStack {
            TextField("身長(cm)", text: $height)
                .keyboardType(.decimalPad)
                .padding()
            
            TextField("体重(kg)", text: $weight)
                .keyboardType(.decimalPad)
                .padding()
            
            Button("BMIを計算") {
                calculateBMI()
            }
            .padding()

            Text(bmi > 0 ? "あなたのBMI: \(bmi, specifier: "%.2f")" : "BMIを入力してください")
                .padding()
        }
        .padding()
    }
    
    func calculateBMI() {
        guard let heightMeters = Double(height), let weightKg = Double(weight) else {
            return
        }
        
        let heightInMeters = heightMeters / 100 // cmからmへ変換
        bmi = weightKg / (heightInMeters * heightInMeters)
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            BMIView()
        }
    }
}
```

このコードでは、SwiftUIの`TextField`を使用して身長と体重の入力を受け取り、`Button`でBMIの計算をトリガーしています。`calculateBMI`関数内でBMIの計算を行い、その結果を`Text`ビューで表示しています。

この例では、身長と体重は文字列として扱われているため、Doubleへの変換を試みる前に適切な入力があることを確認する必要があります。また、UIデザインをさらに洗練させたり、入力値のバリデーションを強化したりすることも可能です。

---
