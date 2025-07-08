# 角丸 TextEditor の方法

Date: 2024-08-16

---

## 👤 User
*2024-08-16 18:52:44*

角丸にして欲しい

            TextEditor(text: $presenter.inquiryDetailText)
                .frame(height: 150)
                .border(.gray, width: 1)
                .padding(.horizontal, 20)

---

## 🤖 Assistant
*2024-08-16 18:52:52*

角丸にするためには、`TextEditor` にカスタムな背景ビューを追加し、角を丸めることができます。以下のように修正すると、`TextEditor` に角丸を適用できます。

```swift
TextEditor(text: $presenter.inquiryDetailText)
    .frame(height: 150)
    .padding(.horizontal, 20)
    .background(
        RoundedRectangle(cornerRadius: 10)
            .stroke(.gray, lineWidth: 1)
    )
    .padding(.horizontal, 20)
```

これにより、`TextEditor` の周りに灰色のボーダーが表示され、角が丸くなります。 `cornerRadius` の値はお好みで調整してください。

---
