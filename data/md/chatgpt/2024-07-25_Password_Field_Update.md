# Password Field Update

Date: 2024-07-25

---

## 👤 User
*2024-07-25 15:17:57*

.onChange(of: text) { oldValue, newValue in
            if newValue.count == 1 && isFirstEntryAfterToggle {
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                text = oldValue + newValue
            }
            isFirstEntryAfterToggle = false
        }
このような実装を入れたい。iOS16以降です。

struct PasswordField: View {
    let titleKey: LocalizedStringKey
    @Binding var text: String
    
    @State var isShowSecure = false
    @FocusState var isTextFieldFocused: Bool
    @FocusState var isSecureFieldFocused: Bool
    @State var isFirstEntryAfterToggle = false
    
    init(_ titleKey: LocalizedStringKey, text: Binding&lt;String&gt;) {
        self.titleKey = titleKey
        _text = text
    }
    
    var body: some View {
        HStack {
            ZStack {
                TextField(titleKey, text: $text)
                    .focused($isTextFieldFocused)
                    .keyboardType(.asciiCapable)
                    .autocorrectionDisabled(true)
                    .textInputAutocapitalization(.none)
                    .opacity(isShowSecure ? 1 : 0)
                
                SecureField(titleKey, text: $text)
                    .focused($isSecureFieldFocused)
                    .opacity(isShowSecure ? 0 : 1)
            }
            
            Button {
                if isShowSecure {
                    isShowSecure = false
                    isSecureFieldFocused = true
                    if !text.isEmpty {
                        isFirstEntryAfterToggle = true
                    }
                } else {
                    isShowSecure = true
                    isTextFieldFocused = true
                    isFirstEntryAfterToggle = false
                }
                
            } label: {
                Image(systemName: isShowSecure ? "eye" : "eye.slash")
            }
            .buttonStyle(.plain)
        }
        .padding()
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.primary, lineWidth: 1)
        )

    }
}

---

## 🤖 Assistant
*2024-07-25 15:18:14*

以下のコードを `PasswordField` に追加することで、 `text` が変更されたときに通知フィードバックを生成する機能を追加できます。 `.onChange(of:)` モディファイアを使い、 `text` の変更を監視します。

```swift
import SwiftUI

struct PasswordField: View {
    let titleKey: LocalizedStringKey
    @Binding var text: String
    
    @State var isShowSecure = false
    @FocusState var isTextFieldFocused: Bool
    @FocusState var isSecureFieldFocused: Bool
    @State var isFirstEntryAfterToggle = false
    
    init(_ titleKey: LocalizedStringKey, text: Binding<String>) {
        self.titleKey = titleKey
        _text = text
    }
    
    var body: some View {
        HStack {
            ZStack {
                TextField(titleKey, text: $text)
                    .focused($isTextFieldFocused)
                    .keyboardType(.asciiCapable)
                    .autocorrectionDisabled(true)
                    .textInputAutocapitalization(.none)
                    .opacity(isShowSecure ? 1 : 0)
                
                SecureField(titleKey, text: $text)
                    .focused($isSecureFieldFocused)
                    .opacity(isShowSecure ? 0 : 1)
            }
            
            Button {
                if isShowSecure {
                    isShowSecure = false
                    isSecureFieldFocused = true
                    if !text.isEmpty {
                        isFirstEntryAfterToggle = true
                    }
                } else {
                    isShowSecure = true
                    isTextFieldFocused = true
                    isFirstEntryAfterToggle = false
                }
            } label: {
                Image(systemName: isShowSecure ? "eye" : "eye.slash")
            }
            .buttonStyle(.plain)
        }
        .padding()
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.primary, lineWidth: 1)
        )
        .onChange(of: text) { oldValue, newValue in
            if newValue.count == 1 && isFirstEntryAfterToggle {
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                text = oldValue + newValue
            }
            isFirstEntryAfterToggle = false
        }
    }
}

struct ContentView: View {
    @State private var password = ""

    var body: some View {
        PasswordField("Password", text: $password)
            .padding()
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードでは、 `PasswordField` コンポーネント内で `text` の変更を監視し、条件が満たされた場合に通知フィードバックを生成します。 `isFirstEntryAfterToggle` フラグを使って、トグル後の最初のエントリを追跡します。

---

## 👤 User
*2024-07-25 15:18:50*

@available(iOS 17.0, *) となってしまう、

---

## 🤖 Assistant
*2024-07-25 15:19:12*

以下は、iOS 16 以降でも動作するように修正したコードです。`UITextField` のデリゲートメソッドを使って変更を監視し、 `UINotificationFeedbackGenerator` を呼び出します。

```swift
import SwiftUI
import UIKit

struct PasswordField: UIViewRepresentable {
    let titleKey: LocalizedStringKey
    @Binding var text: String
    @State var isShowSecure = false
    @State var isFirstEntryAfterToggle = false

    init(_ titleKey: LocalizedStringKey, text: Binding<String>) {
        self.titleKey = titleKey
        _text = text
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: PasswordField

        init(parent: PasswordField) {
            self.parent = parent
        }

        func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
            let newText = (textField.text! as NSString).replacingCharacters(in: range, with: string)
            if string.count == 1 && parent.isFirstEntryAfterToggle {
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                textField.text = parent.text + string
                parent.text = textField.text!
                parent.isFirstEntryAfterToggle = false
                return false
            }
            parent.text = newText
            return true
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.isSecureTextEntry = !isShowSecure
        textField.delegate = context.coordinator
        textField.addTarget(context.coordinator, action: #selector(context.coordinator.textFieldDidChange(_:)), for: .editingChanged)
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = text
        uiView.isSecureTextEntry = !isShowSecure
    }
}

struct ContentView: View {
    @State private var password = ""
    @State private var isShowSecure = false

    var body: some View {
        VStack {
            PasswordField("Password", text: $password, isShowSecure: $isShowSecure, isFirstEntryAfterToggle: $isFirstEntryAfterToggle)
                .padding()

            Button(action: {
                isShowSecure.toggle()
                isFirstEntryAfterToggle = true
            }) {
                Image(systemName: isShowSecure ? "eye" : "eye.slash")
            }
            .buttonStyle(.plain)
        }
        .padding()
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.primary, lineWidth: 1)
        )
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードでは、`UITextField` を使用してテキストの変更を監視し、必要な通知フィードバックを生成します。これにより、iOS 16 以降でも動作します。

---
