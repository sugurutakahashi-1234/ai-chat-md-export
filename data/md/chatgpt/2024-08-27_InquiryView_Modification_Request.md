# InquiryView Modification Request

日付: 2024-08-27

---

## 👤 ユーザー
*2024/08/27 19:50:36*

InquirySendViewについて、ニックネームとメールアドレスと電話番号を追加して欲しい

public struct InquiryView: View {
    @StateObject private var presenter: InquiryPresenter
    @Environment(\.dismiss) private var dismiss

    public init() {
        _presenter = .init(wrappedValue: InquiryPresenter())
    }

    public var body: some View {
        ScrollView {
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 16)

            TextField("入力してください", text: $presenter.nickname)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            
            HStack {
                Text("メールアドレス")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)

            TextField("入力してください", text: $presenter.mailAddress)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            
            HStack {
                Text("電話番号")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)

            TextField("09012345678", text: $presenter.phoneNumber)
                .keyboardType(.numberPad)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
            
            List {
                Picker(selection: $presenter.selectedInquiryType) {
                    ForEach(InquiryType.allCases, id: \.self) { type in
                        Text("\(type.displayName)")
                            .tag(type)
                    }
                } label: {
                    Text("問い合わせ種別")
                        .font(.headline)
                }
                .pickerStyle(.navigationLink)
                .accentColor(.gray)
                .listRowSeparator(.hidden)
                .padding(.trailing)
            }
            .listStyle(.inset)
            .scrollDisabled(true)
            .scrollContentBackground(.hidden)
            .frame(height: 40)
            .padding(.vertical)

            HStack {
                Text("問い合わせ詳細")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)

            TextEditor(text: $presenter.inquiryDetailText)
                .frame(height: 150)
                .padding(.all, 4)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)

            Button {
                presenter.onTapCofirmInquiry()
            } label: {
                Text("内容を確認する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
            .disabled(!presenter.isValid)
        }
 
        .navigationTitle("問い合わせ")
        .navigationDestination(isPresented: $presenter.showInquirySendView) {
            InquirySendView(selectedInquiryType: presenter.selectedInquiryType, inquiryDetailText: presenter.inquiryDetailText, onTapSend: presenter.onTapSend, shouldDismiss: $presenter.shouldDismiss)
        }
        .onChange(of: presenter.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

struct InquirySendView: View {
    let selectedInquiryType: InquiryType
    let inquiryDetailText: String
    let onTapSend: () -&gt; Void
    @Binding var shouldDismiss: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(.vertical) {
            HStack {
                Text("問い合わせ種別")
                    .font(.headline)
                Spacer()
                
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text("\(selectedInquiryType.displayName)")
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            HStack {
                Text("問い合わせ詳細")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text(inquiryDetailText)
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            Button {
                onTapSend()
            } label: {
                Text("送信する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
        }
        .navigationTitle("問い合わせ")
        .onChange(of: shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/08/27 19:51:20*

`InquiryView` と `InquirySendView` にニックネーム、メールアドレス、電話番号を追加するには、`InquirySendView` にもそれらの項目を表示するように調整し、`InquiryPresenter` に関連するプロパティを追加する必要があります。以下に修正後のコードを示します。

```swift
public struct InquiryView: View {
    @StateObject private var presenter: InquiryPresenter
    @Environment(\.dismiss) private var dismiss

    public init() {
        _presenter = .init(wrappedValue: InquiryPresenter())
    }

    public var body: some View {
        ScrollView {
            // ニックネーム入力フィールド
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 16)

            TextField("入力してください", text: $presenter.nickname)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            
            // メールアドレス入力フィールド
            HStack {
                Text("メールアドレス")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)

            TextField("入力してください", text: $presenter.mailAddress)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            
            // 電話番号入力フィールド
            HStack {
                Text("電話番号")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)

            TextField("09012345678", text: $presenter.phoneNumber)
                .keyboardType(.numberPad)
                .padding(.all, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
            
            // 問い合わせ種別 Picker
            List {
                Picker(selection: $presenter.selectedInquiryType) {
                    ForEach(InquiryType.allCases, id: \.self) { type in
                        Text("\(type.displayName)")
                            .tag(type)
                    }
                } label: {
                    Text("問い合わせ種別")
                        .font(.headline)
                }
                .pickerStyle(.navigationLink)
                .accentColor(.gray)
                .listRowSeparator(.hidden)
                .padding(.trailing)
            }
            .listStyle(.inset)
            .scrollDisabled(true)
            .scrollContentBackground(.hidden)
            .frame(height: 40)
            .padding(.vertical)

            HStack {
                Text("問い合わせ詳細")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)

            TextEditor(text: $presenter.inquiryDetailText)
                .frame(height: 150)
                .padding(.all, 4)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(.black, lineWidth: 1)
                )
                .padding(.horizontal, 20)
                .padding(.bottom, 24)

            Button {
                presenter.onTapCofirmInquiry()
            } label: {
                Text("内容を確認する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
            .disabled(!presenter.isValid)
        }
 
        .navigationTitle("問い合わせ")
        .navigationDestination(isPresented: $presenter.showInquirySendView) {
            InquirySendView(
                nickname: presenter.nickname,
                mailAddress: presenter.mailAddress,
                phoneNumber: presenter.phoneNumber,
                selectedInquiryType: presenter.selectedInquiryType,
                inquiryDetailText: presenter.inquiryDetailText,
                onTapSend: presenter.onTapSend,
                shouldDismiss: $presenter.shouldDismiss
            )
        }
        .onChange(of: presenter.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

struct InquirySendView: View {
    let nickname: String
    let mailAddress: String
    let phoneNumber: String
    let selectedInquiryType: InquiryType
    let inquiryDetailText: String
    let onTapSend: () -> Void
    @Binding var shouldDismiss: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(.vertical) {
            // ニックネーム表示
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text(nickname)
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            // メールアドレス表示
            HStack {
                Text("メールアドレス")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text(mailAddress)
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            // 電話番号表示
            HStack {
                Text("電話番号")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text(phoneNumber)
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            // 問い合わせ種別表示
            HStack {
                Text("問い合わせ種別")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text("\(selectedInquiryType.displayName)")
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            // 問い合わせ詳細表示
            HStack {
                Text("問い合わせ詳細")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical)

            HStack {
                Text(inquiryDetailText)
                    .padding(.horizontal, 20)
                    .padding(.bottom)
                Spacer()
            }
            
            Button {
                onTapSend()
            } label: {
                Text("送信する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
        }
        .navigationTitle("問い合わせ")
        .onChange(of: shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
    }
}
```

### 変更点

1. `InquirySendView` に `nickname`, `mailAddress`, `phoneNumber` の引数を追加し、それらを表示するラベルを追加しました。
2. `InquiryPresenter` クラスには、新しく追加されたプロパティ `nickname`, `mailAddress`, `phoneNumber` に対応する @Published プロパティを追加する必要があります。

これにより、問い合わせ確認画面にニックネーム、メールアドレス、電話番号が表示されるようになります。

---

## 👤 ユーザー
*2024/08/27 20:09:58*

ちなみに以下を使って、メールアプリを立ち上げたい。
また、本文について、入力された内容を表示させたい

UIApplication.shared.open()

---

## 🤖 アシスタント
*2024/08/27 20:10:20*

メールアプリを立ち上げて、入力された内容を本文に表示させるには、`UIApplication.shared.open()`を使ってメールアプリのURLスキームを利用することができます。以下のコード例では、`InquirySendView` から送信ボタンを押した際にメールアプリを開くように実装しています。

```swift
import SwiftUI

struct InquirySendView: View {
    let nickname: String
    let mailAddress: String
    let phoneNumber: String
    let selectedInquiryType: InquiryType
    let inquiryDetailText: String
    let onTapSend: () -> Void
    @Binding var shouldDismiss: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(.vertical) {
            // 各入力フィールドの表示コード（省略）

            Button {
                sendEmail()
            } label: {
                Text("送信する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
        }
        .navigationTitle("問い合わせ")
        .onChange(of: shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
    }
    
    private func sendEmail() {
        // メール本文の生成
        let emailBody = """
        ニックネーム: \(nickname)
        メールアドレス: \(mailAddress)
        電話番号: \(phoneNumber)
        問い合わせ種別: \(selectedInquiryType.displayName)
        問い合わせ詳細:
        \(inquiryDetailText)
        """
        
        // メールURLの生成
        let emailURLString = "mailto:?subject=お問い合わせ&body=\(emailBody)".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
        
        if let emailURL = URL(string: emailURLString ?? "") {
            UIApplication.shared.open(emailURL)
        }
    }
}
```

### 変更点の説明

1. **`sendEmail` メソッド**: メールアプリを開いて、入力された内容を本文として設定するメソッドを追加しました。メールの本文 (`emailBody`) は、各入力フィールドの内容を使用して構成されます。
2. **`UIApplication.shared.open(emailURL)`**: メールアプリを開くために `UIApplication.shared.open()` を使用しています。メールアドレスや本文の内容はURLスキームを使って設定されます。
3. **エンコーディング**: メール本文などに特殊文字が含まれる場合に備えて、`addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)` を使ってURLエンコーディングしています。

これで、「送信する」ボタンを押すと、ユーザーのデフォルトのメールアプリが立ち上がり、指定された内容が入力された状態で新しいメールを作成する画面が表示されます。

---

## 👤 ユーザー
*2024/08/27 20:14:15*

InquirySendView となるべく同じような表示になるように改行とか見出しをつけて欲しい

---

## 🤖 アシスタント
*2024/08/27 20:14:44*

`InquirySendView` に表示される内容と同様の形式で、メールアプリの本文に改行や見出しを付けるように修正します。これにより、メール本文も視覚的に見やすくなります。

以下のコード例で、`sendEmail` メソッドを修正しました。

```swift
import SwiftUI

struct InquirySendView: View {
    let nickname: String
    let mailAddress: String
    let phoneNumber: String
    let selectedInquiryType: InquiryType
    let inquiryDetailText: String
    let onTapSend: () -> Void
    @Binding var shouldDismiss: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(.vertical) {
            // 各入力フィールドの表示コード（省略）

            Button {
                sendEmail()
            } label: {
                Text("送信する")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .padding(.horizontal, 32)
        }
        .navigationTitle("問い合わせ")
        .onChange(of: shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
    }
    
    private func sendEmail() {
        // メール本文の生成（見出しと改行を追加）
        let emailBody = """
        問い合わせ内容:

        ニックネーム:
        \(nickname)

        メールアドレス:
        \(mailAddress)

        電話番号:
        \(phoneNumber)

        問い合わせ種別:
        \(selectedInquiryType.displayName)

        問い合わせ詳細:
        \(inquiryDetailText)
        """
        
        // メールURLの生成
        let emailURLString = "mailto:?subject=お問い合わせ&body=\(emailBody)".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
        
        if let emailURL = URL(string: emailURLString ?? "") {
            UIApplication.shared.open(emailURL)
        }
    }
}
```

### 修正内容

1. **メール本文のフォーマット**: `emailBody` 変数の内容を見出しと改行を使用してフォーマットしました。各項目の前に見出しを追加し、その下に対応する情報を記述しています。項目間には空行を追加して、メール本文が見やすくなっています。
   
2. **本文内容の調整**: `InquirySendView` に表示される内容とできる限り一致させるために、各フィールドのラベルとその下に実際の内容を記載しました。

これで、「送信する」ボタンを押すと、メールアプリに表示される本文が `InquirySendView` の表示に近い形式で整形され、読みやすくなります。

---
