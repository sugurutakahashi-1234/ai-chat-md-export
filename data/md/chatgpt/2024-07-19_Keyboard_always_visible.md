# Keyboard always visible

日付: 2024-07-19

---

## 👤 ユーザー
*2024/7/19 13:34:21*

常にキーボードを立ち上げた状態にしたい

// MARK: - View

public struct PhoneNumberInputView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: PhoneNumberInputPresenter&lt;Dependency&gt;

    public init(dependency: Dependency) {
        self.dependency = dependency
        \_presenter = .init(wrappedValue: PhoneNumberInputPresenter(dependency: dependency))
    }

    public var body: some View {
        VStack {
            TextField("09012345678", text: $presenter.rawPhoneNumber)
                .keyboardType(.numberPad)
            
            Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")
                .isHidden(presenter.isHiddenInvalidMessage)

            Button {
                presenter.onTapNext()
            } label: {
                Text("次へ")
            }
            .disabled(!presenter.isValidPhoneNumber)
        }
        .navigationTitle("電話番号入力")
        .navigationDestination(isPresented: $presenter.showConfirmationCodeInput, destination: {
            ConfirmationCodeInputView(dependency: dependency)
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 アシスタント
*2024/7/19 13:34:35*

常にキーボードを立ち上げた状態にするためには、SwiftUIでは通常の方法では難しいですが、`UIViewControllerRepresentable`を使用してカスタムのビューを作成し、キーボードを強制的に表示させることができます。以下はその方法の例です。

まず、キーボードを表示するためのカスタムビューを作成します。

```swift
import SwiftUI
import UIKit

struct AlwaysFocusedTextField: UIViewRepresentable {
    @Binding var text: String

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: AlwaysFocusedTextField

        init(parent: AlwaysFocusedTextField) {
            self.parent = parent
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            parent.text = textField.text ?? ""
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.text = text
        textField.delegate = context.coordinator
        textField.keyboardType = .numberPad
        textField.becomeFirstResponder() // キーボードを常に表示
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = text
    }
}
```

次に、このカスタムビューを`PhoneNumberInputView`内で使用します。

```swift
// MARK: - View

public struct PhoneNumberInputView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: PhoneNumberInputPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: PhoneNumberInputPresenter(dependency: dependency))
    }

    public var body: some View {
        VStack {
            AlwaysFocusedTextField(text: $presenter.rawPhoneNumber)

            Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")
                .isHidden(presenter.isHiddenInvalidMessage)

            Button {
                presenter.onTapNext()
            } label: {
                Text("次へ")
            }
            .disabled(!presenter.isValidPhoneNumber)
        }
        .navigationTitle("電話番号入力")
        .navigationDestination(isPresented: $presenter.showConfirmationCodeInput, destination: {
            ConfirmationCodeInputView(dependency: dependency)
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

これにより、`PhoneNumberInputView`が表示されると常にキーボードが立ち上がった状態になります。この方法は、`UITextField`をラップすることでSwiftUIでキーボードの表示を強制することができます。

---
