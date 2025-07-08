# SwiftUI Preview Adjustment

Date: 2024-10-28

---

## 👤 User
*2024-10-28 13:34:37*

#available(iOS 17.0, *)
#Preview {
    @Previewable @State var text: String = ""
    return VStack {
        QuestionnaireContentsView.NickNameInputView(text: text, onValueChanged: { _ in })
            .padding(.horizontal, 20)
    }
}

---

## 🤖 Assistant
*2024-10-28 13:34:43*

The `#Preview` snippet you provided can be modified to conform more closely to SwiftUI's standard `#Preview` and ensure a clean and functional SwiftUI preview. Here's a revised version:

```swift
import SwiftUI

#available(iOS 17.0, *)
#Preview {
    @State var text: String = ""

    VStack {
        QuestionnaireContentsView.NickNameInputView(text: $text, onValueChanged: { _ in })
            .padding(.horizontal, 20)
    }
}
```

### Key Changes:
1. **`@State var text: String = ""` outside `#Preview`:** SwiftUI’s preview environment requires `@State` variables to be declared outside the body of the preview.
2. **Pass the `@State` variable as a binding** to the `NickNameInputView` using `$text` to ensure changes are reflected correctly.
3. **Import SwiftUI:** Added the necessary `import SwiftUI` statement to ensure the preview renders correctly. 

This should now work correctly in the SwiftUI preview. Let me know if you need further adjustments!

---

## 👤 User
*2024-10-28 13:34:58*

#available(iOS 17.0, *) の書き方が間違っている

---

## 🤖 Assistant
*2024-10-28 13:35:03*

`#available(iOS 17.0, *)` は、条件付きコンパイルディレクティブではなく、関数やビューの中で使用する条件文です。プレビューでは次のように書く必要があります。

修正したコードは以下のとおりです：

```swift
import SwiftUI

@available(iOS 17.0, *)
struct NickNameInputView_Previews: PreviewProvider {
    static var previews: some View {
        @State var text: String = ""
        
        VStack {
            QuestionnaireContentsView.NickNameInputView(text: $text, onValueChanged: { _ in })
                .padding(.horizontal, 20)
        }
    }
}
```

### 変更点
- **`@available(iOS 17.0, *)` をプレビュー用の構造体に追加**: プレビュー全体をiOS 17.0以上に限定するために使用しています。
- **`PreviewProvider` を使用**: SwiftUIのプレビューは `PreviewProvider` に準拠する必要があります。

これでプレビューが正しく動作するはずです。

---
