# UIViewRepresentable onAppear

日付: 2023-05-12

---

## 👤 ユーザー
*2023/5/12 14:49:24*

UIViewRepresentable で onAppear を実装する方法

---

## 🤖 アシスタント
*2023/5/12 14:49:35*

SwiftUIでは、`UIViewRepresentable`を使用してUIKitのViewをラップし、SwiftUIのViewとして使用することができます。`UIViewRepresentable`を使用して`UIView`を表示する場合、`onAppear`と同様の機能を実装するには、`makeUIView`メソッド内で処理を行うことができます。

以下に、`UIViewRepresentable`で`onAppear`のような機能を実装する例を示します。

```swift
import SwiftUI

struct CustomView: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        // UIViewの設定や初期化処理を行う

        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        // UIViewが更新されたときの処理を行う
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    class Coordinator {
        var didAppear = false
        
        @objc func onViewDidAppear() {
            if !didAppear {
                // UIViewが表示されたときの処理を行う
                didAppear = true
            }
        }
    }
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        view.backgroundColor = .red
        
        // UIViewの表示イベントに対して処理を追加する
        DispatchQueue.main.async {
            context.coordinator.didAppear = false
            view.superview?.subviews.first?.addObserver(context.coordinator, forKeyPath: "subviews", options: .new, context: nil)
        }
        
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        // UIViewが更新されたときの処理を行う
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
}

struct ContentView: View {
    var body: some View {
        CustomView()
            .onDisappear {
                // UIViewが非表示になったときの処理を行う
            }
    }
}
```

この例では、`CustomView`は`UIViewRepresentable`プロトコルを準拠し、`makeUIView`メソッド内で`UIView`の初期化や設定を行っています。また、`makeCoordinator`メソッドを使用して、UIViewの表示イベントを監視するための`Coordinator`オブジェクトを作成しています。

`makeUIView`メソッド内で、`DispatchQueue.main.async`を使用して、表示イベントに対して処理を追加しています。具体的には、`view.superview?.subviews.first?.addObserver`を使用して、`subviews`の変更を監視し、`Coordinator`オブジェクトの`onViewDidAppear`メソッドを呼び出します。`Coordinator`クラス内では、`didAppear`フラグを使用して初回の表示イベントのみ処理を行うようにしています。

また、`ContentView`で`CustomView`を使用する際に、`onDisappear`ブロックを使用して

---
