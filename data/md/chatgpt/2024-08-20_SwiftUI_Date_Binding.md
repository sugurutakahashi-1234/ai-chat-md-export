# SwiftUI Date Binding

Date: 2024-08-20

---

## 👤 User
*2024-08-20 16:16:48*

public struct Account: Codable, Sendable, Hashable {
    public let id: Int
    public let imageUrl: URL
    public let name: String
    public let nickname: String
    public let birthDay: Date
    public let gender: Gender
    public let email: String
    public let address: Address
    public let phone: String
    public let website: String
    public let company: Company
}

これのbirthDayをswiftUIでバインディングさせたい

---

## 🤖 Assistant
*2024-08-20 16:17:19*

`birthDay`をSwiftUIでバインディングさせるためには、`@State`または`@Binding`を使用して日付を管理し、SwiftUIのDatePickerなどのビューと連携させることができます。以下のように実装してみてください。

### 1. `Account`構造体の使用例
まず、`Account`構造体の`birthDay`プロパティをSwiftUIビューでバインディングする方法を示します。例として、`AccountView`というSwiftUIのビューを作成します。

```swift
import SwiftUI

struct AccountView: View {
    @State private var account: Account
    
    init(account: Account) {
        _account = State(initialValue: account)
    }
    
    var body: some View {
        Form {
            DatePicker("Birthday", selection: $account.birthDay, displayedComponents: .date)
                .datePickerStyle(WheelDatePickerStyle()) // スタイルはお好みで
        }
    }
}

// テスト用のプレビュー
struct AccountView_Previews: PreviewProvider {
    static var previews: some View {
        let sampleAccount = Account(
            id: 1,
            imageUrl: URL(string: "https://example.com/image.png")!,
            name: "John Doe",
            nickname: "Johnny",
            birthDay: Date(),
            gender: .male,
            email: "john@example.com",
            address: Address(city: "Tokyo", street: "Chiyoda"),
            phone: "123-456-7890",
            website: "https://example.com",
            company: Company(name: "Example Inc.", address: Address(city: "Tokyo", street: "Chiyoda"))
        )
        AccountView(account: sampleAccount)
    }
}
```

### 2. Bindingを使用する場合
親ビューから`Account`の`birthDay`をバインディングしたい場合、以下のように`@Binding`を使用してバインディングを受け取ります。

```swift
import SwiftUI

struct AccountView: View {
    @Binding var birthDay: Date

    var body: some View {
        Form {
            DatePicker("Birthday", selection: $birthDay, displayedComponents: .date)
                .datePickerStyle(WheelDatePickerStyle()) // スタイルはお好みで
        }
    }
}

// 親ビューでの使用例
struct ContentView: View {
    @State private var account: Account = Account(
        id: 1,
        imageUrl: URL(string: "https://example.com/image.png")!,
        name: "John Doe",
        nickname: "Johnny",
        birthDay: Date(),
        gender: .male,
        email: "john@example.com",
        address: Address(city: "Tokyo", street: "Chiyoda"),
        phone: "123-456-7890",
        website: "https://example.com",
        company: Company(name: "Example Inc.", address: Address(city: "Tokyo", street: "Chiyoda"))
    )

    var body: some View {
        AccountView(birthDay: $account.birthDay)
    }
}
```

この方法で、SwiftUIビュー内で`birthDay`の変更が他の部分に伝搬され、双方向のデータバインディングが行えます。

---

## 👤 User
*2024-08-20 16:17:44*

こういう場合になっているときはどうしたらいいか？
final class ProfileEditPresenter: ObservableObject {
    @Published var account: Account?

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    
    private let logDriver: any LogDriverProtocol
    private let apiRequestDriver: any ApiRequestDriverProtocol

    init(logDriver: any LogDriverProtocol = LogDriver(), apiRequestDriver: any ApiRequestDriverProtocol = ApiRequestDriver()) {
        self.logDriver = logDriver
        self.apiRequestDriver = apiRequestDriver

        logDriver.initLog()
    }

    deinit {
        logDriver.deinitLog()
    }

    func onAppear() async {
        
        do {
            account = try await apiRequestDriver.getAccount()
        } catch {
            logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
        
    }
}

---

## 🤖 Assistant
*2024-08-20 16:18:12*

この場合、`ProfileEditPresenter`クラスの`account`プロパティはオプショナルな`Account?`型として定義されています。そのため、SwiftUIビューで`account`の`birthDay`にバインディングさせるには、オプショナルバインディングを考慮する必要があります。

`account`が非オプショナルになるまで待つか、適切に処理する必要があります。以下は、その方法の一例です。

### 1. `AccountView`を使ったバインディングの例

`AccountView`で`birthDay`にバインディングさせるために、`guard let`や`if let`を使って`account`の存在を確認し、存在する場合のみバインディングを行います。

```swift
import SwiftUI

struct AccountView: View {
    @ObservedObject var presenter: ProfileEditPresenter

    var body: some View {
        Group {
            if let account = presenter.account {
                Form {
                    DatePicker("Birthday", selection: Binding(
                        get: { account.birthDay },
                        set: { newDate in
                            presenter.account?.birthDay = newDate
                        }
                    ), displayedComponents: .date)
                    .datePickerStyle(WheelDatePickerStyle()) // スタイルはお好みで
                }
            } else {
                Text("Loading...")
            }
        }
        .onAppear {
            Task {
                await presenter.onAppear()
            }
        }
    }
}

// 親ビューでの使用例
struct ContentView: View {
    @StateObject private var presenter = ProfileEditPresenter()

    var body: some View {
        AccountView(presenter: presenter)
    }
}
```

### 2. `Binding`を使う方法

オプショナルの`account`をバインディングしたい場合は、`Binding`を使って安全にアクセスできるようにします。

```swift
import SwiftUI

struct AccountView: View {
    @ObservedObject var presenter: ProfileEditPresenter

    var body: some View {
        Group {
            if let _ = presenter.account {
                Form {
                    DatePicker("Birthday", selection: Binding(
                        get: { presenter.account?.birthDay ?? Date() }, // デフォルト値を設定
                        set: { newDate in
                            presenter.account?.birthDay = newDate
                        }
                    ), displayedComponents: .date)
                    .datePickerStyle(WheelDatePickerStyle()) // スタイルはお好みで
                }
            } else {
                Text("Loading...")
            }
        }
        .onAppear {
            Task {
                await presenter.onAppear()
            }
        }
    }
}

// 親ビューでの使用例
struct ContentView: View {
    @StateObject private var presenter = ProfileEditPresenter()

    var body: some View {
        AccountView(presenter: presenter)
    }
}
```

### ポイント

- `Binding`の`get`と`set`で、オプショナル型を安全に取り扱います。
- `account`が`nil`の場合、デフォルト値として`Date()`を使用していますが、適切な初期値に変更できます。
- `onAppear`で非同期にデータをフェッチし、データが取得された後にビューを更新します。

この実装により、`account`がフェッチされていない状態でもSwiftUIのビューが正しく動作し、`account`が取得されるとビューが自動的に更新されます。

---

## 👤 User
*2024-08-20 16:18:30*

1と2はどちらのほうがいいか？

---

## 🤖 Assistant
*2024-08-20 16:19:00*

1と2の方法にはそれぞれメリットとデメリットがありますが、状況に応じてどちらが適切かが変わります。以下にそれぞれの利点をまとめます。

### 1. `if let`を使用する方法

#### メリット:
- **シンプルで直感的**: `account`が存在するかどうかを明示的に確認し、その後の処理を安全に行います。コードが読みやすく、理解しやすいです。
- **SwiftUIの設計にマッチ**: SwiftUIのビューが常にアプリケーションの状態に基づいて表示を更新するという設計思想に合っています。`account`がロードされていない状態ではローディングUIを表示するなどの対応が容易です。

#### デメリット:
- **デフォルト値の設定がない**: `account`が`nil`のときにデフォルト値を使用しないため、全てのアクセスで`if let`のチェックが必要です。

### 2. `Binding`を使用する方法

#### メリット:
- **柔軟性**: `Binding`を使って安全に`account`のプロパティにアクセスでき、デフォルト値を設定することでオプショナルを扱いやすくしています。これは、ビューのリロードが頻繁に発生する場合や、UIが常に表示されている必要がある場合に有効です。
- **コードの再利用性が高い**: `Binding`のget/setパターンを使うことで、再利用可能なコンポーネントとして構築できます。

#### デメリット:
- **デフォルト値のリスク**: `account`が`nil`のときにデフォルトの`Date()`を使う場合、ユーザーが意図しないデフォルトのデータを操作してしまうリスクがあります。このデフォルト値が意図的でない場合、バグの原因になる可能性があります。
- **やや複雑**: `Binding`の`get`と`set`を適切に管理するため、コードが若干複雑になります。特に、`account`が`nil`のときの処理を間違うと予期しない動作を引き起こす可能性があります。

### どちらが良いか？

- **1の方法**が良いケース:
  - `account`が`nil`の状態が意味を持つ場合（例: ローディング中やエラー時などにUIで何か特別な表示をする場合）。
  - シンプルで直感的な実装を好む場合。
  - SwiftUIの状態管理に慣れていない、またはコードの可読性を優先したい場合。

- **2の方法**が良いケース:
  - `account`が存在しないときにデフォルト値を使用しても問題ない場合。
  - 柔軟性を持たせた再利用可能なコンポーネントを構築したい場合。
  - プロパティの更新ロジックを細かく管理したい場合。

総合的には、**シンプルさと直感的なコードを優先する場合は1**を、**柔軟性や再利用性を重視する場合は2**を選ぶのが良いでしょう。

---

## 👤 User
*2024-08-20 16:27:05*

以下を1の方法でバインディングして欲しい

                List {
                    NavigationLink {
                        TextInputView(inputText: account.nickname, title: "ニックネーム", placeholder: "あとで変更できます")
                    } label: {
                        HStack {
                            Spacer()
                            Text(presenter.nickname == "" ? "入力してください" : presenter.nickname)
                                .foregroundStyle(.gray)
                        }
                    }
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)

                HStack {
                    Text("誕生日")
                        .font(.headline)
                    Spacer()
                }

                .padding(.horizontal, 32)

                DatePicker(
                    "",
                    selection: account.birthDay,
                    in: ...Date(),
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
                .labelsHidden()

                HStack {
                    Text("性別")
                        .font(.headline)
                    Spacer()
                }
                .padding(.horizontal, 32)

                List {
                    Picker("", selection: account.gender) {
                        ForEach(Gender.allCases, id: \.self) { gender in
                            Text("\(gender.displayName)")
                                .tag(gender)
                        }
                    }
                    .pickerStyle(.navigationLink)
                    .labelsHidden()
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)

---

## 🤖 Assistant
*2024-08-20 16:27:36*

以下は、1の方法で`ProfileEditPresenter`の`account`プロパティを利用してバインディングしたSwiftUIのコードです。このコードでは、`if let`を使用してオプショナルの`account`プロパティが存在する場合にのみビューを表示します。

```swift
import SwiftUI

struct ProfileEditView: View {
    @ObservedObject var presenter: ProfileEditPresenter

    var body: some View {
        VStack {
            if let account = presenter.account {
                List {
                    NavigationLink {
                        TextInputView(inputText: account.nickname, title: "ニックネーム", placeholder: "あとで変更できます")
                    } label: {
                        HStack {
                            Spacer()
                            Text(account.nickname.isEmpty ? "入力してください" : account.nickname)
                                .foregroundStyle(.gray)
                        }
                    }
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)

                HStack {
                    Text("誕生日")
                        .font(.headline)
                    Spacer()
                }
                .padding(.horizontal, 32)

                DatePicker(
                    "",
                    selection: Binding(
                        get: { account.birthDay },
                        set: { newDate in
                            presenter.account?.birthDay = newDate
                        }
                    ),
                    in: ...Date(),
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
                .labelsHidden()

                HStack {
                    Text("性別")
                        .font(.headline)
                    Spacer()
                }
                .padding(.horizontal, 32)

                List {
                    Picker("", selection: Binding(
                        get: { account.gender },
                        set: { newGender in
                            presenter.account?.gender = newGender
                        }
                    )) {
                        ForEach(Gender.allCases, id: \.self) { gender in
                            Text("\(gender.displayName)")
                                .tag(gender)
                        }
                    }
                    .pickerStyle(.navigationLink)
                    .labelsHidden()
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)
            } else {
                Text("Loading...")
            }
        }
        .onAppear {
            Task {
                await presenter.onAppear()
            }
        }
    }
}

// 親ビューでの使用例
struct ContentView: View {
    @StateObject private var presenter = ProfileEditPresenter()

    var body: some View {
        ProfileEditView(presenter: presenter)
    }
}
```

### 説明:
- **ListおよびNavigationLink**: `NavigationLink`内のテキストは、`account.nickname`を表示します。`account.nickname`が空の場合、「入力してください」というプレースホルダーテキストが表示されます。
- **DatePicker**: `account.birthDay`のバインディングを作成し、日付を変更すると`account.birthDay`が更新されます。
- **Picker**: `Gender`のピッカーは、`account.gender`をバインドし、選択を変更すると`account.gender`が更新されます。

この方法により、`ProfileEditPresenter`の`account`プロパティが`nil`でない場合にのみUIが表示され、各プロパティがバインドされます。`account`が`nil`の場合、ローディングメッセージが表示されます。

---

## 👤 User
*2024-08-20 16:27:38*

以下もバインディングが必要


struct TextInputView: View {
    @Binding var inputText: String
    @Environment(\.dismiss) var dismiss
    @FocusState private var isFocused: Bool

    var title: String
    var placeholder: String

    var body: some View {
        GeometryReader { _ in
            VStack {
                Spacer()

                VStack(spacing: 0) {
                    HStack {
                        TextField(placeholder, text: $inputText)
                            .focused($isFocused)
                            .padding(.vertical, 10)

                        Button {
                            inputText = ""
                        } label: {
                            SFSymbols.xmarkCircleFill.image
                                .foregroundColor(.gray)
                        }
                        .padding(.trailing, 10)
                    }
                    .padding(.horizontal, 20)

                    Divider()
                        .background(.gray)
                        .padding(.horizontal, 20)
                }

                Spacer()

                Spacer()
            }
        }
        .ignoresSafeArea(.keyboard, edges: .bottom)
        .navigationTitle(title)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("完了") {
                    dismiss.callAsFunction()
                }
            }
        }
        .onAppear {
            isFocused = true
        }
    }
}

---

## 🤖 Assistant
*2024-08-20 16:27:52*

`TextInputView`の`inputText`プロパティをバインディングするために、`NavigationLink`で`TextInputView`を呼び出す際に`account.nickname`のバインディングを渡すようにします。これにより、`TextInputView`でのテキスト入力が`account.nickname`に反映されます。

以下は、バインディングを適用したコードです。

### `ProfileEditView`の更新

```swift
struct ProfileEditView: View {
    @ObservedObject var presenter: ProfileEditPresenter

    var body: some View {
        VStack {
            if let account = presenter.account {
                List {
                    NavigationLink {
                        TextInputView(inputText: Binding(
                            get: { account.nickname },
                            set: { newNickname in
                                presenter.account?.nickname = newNickname
                            }
                        ), title: "ニックネーム", placeholder: "あとで変更できます")
                    } label: {
                        HStack {
                            Spacer()
                            Text(account.nickname.isEmpty ? "入力してください" : account.nickname)
                                .foregroundStyle(.gray)
                        }
                    }
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)

                // その他のUI要素 (DatePicker, Picker など) は前の実装のまま
            } else {
                Text("Loading...")
            }
        }
        .onAppear {
            Task {
                await presenter.onAppear()
            }
        }
    }
}
```

### `TextInputView`の使用方法

`TextInputView`には`inputText`を`@Binding`で渡すので、`NavigationLink`の中で`account.nickname`をバインディングしています。

### まとめ

この方法により、`TextInputView`での入力が`account.nickname`にバインドされ、変更が即座に反映されるようになります。`TextInputView`の使い方は変わらず、`inputText`が`@Binding`として渡され、他のプロパティも問題なく動作します。

---

## 👤 User
*2024-08-20 16:48:20*

Cannot assign to property: 'nickname' is a 'let' constant こうなる

---

## 🤖 Assistant
*2024-08-20 16:48:47*

`Account`構造体のプロパティが`let`で定義されているため、バインドして値を変更しようとするとエラーが発生します。この問題を解決するには、`Account`構造体のプロパティを`var`に変更するか、`Account`のインスタンス自体を`var`として保持し、プロパティの変更が可能になるようにします。

ここでは、`Account`構造体のプロパティを`var`に変更し、ビューでバインドできるようにします。

### 1. `Account`構造体の更新

```swift
public struct Account: Codable, Sendable, Hashable {
    public var id: Int
    public var imageUrl: URL
    public var name: String
    public var nickname: String
    public var birthDay: Date
    public var gender: Gender
    public var email: String
    public var address: Address
    public var phone: String
    public var website: String
    public var company: Company
}
```

### 2. `ProfileEditView`でのバインディング

上記の構造体変更により、`ProfileEditView`でバインディングを使用してプロパティを変更できるようになります。

```swift
struct ProfileEditView: View {
    @ObservedObject var presenter: ProfileEditPresenter

    var body: some View {
        VStack {
            if let account = presenter.account {
                List {
                    NavigationLink {
                        TextInputView(inputText: Binding(
                            get: { account.nickname },
                            set: { newNickname in
                                presenter.account?.nickname = newNickname
                            }
                        ), title: "ニックネーム", placeholder: "あとで変更できます")
                    } label: {
                        HStack {
                            Spacer()
                            Text(account.nickname.isEmpty ? "入力してください" : account.nickname)
                                .foregroundStyle(.gray)
                        }
                    }
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                    .padding(.trailing)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .scrollContentBackground(.hidden)
                .frame(height: 40)

                // その他のUI要素 (DatePicker, Picker など) は前の実装のまま
            } else {
                Text("Loading...")
            }
        }
        .onAppear {
            Task {
                await presenter.onAppear()
            }
        }
    }
}
```

### まとめ

`Account`構造体のプロパティを`var`に変更することで、プロパティに対して変更が可能になり、SwiftUIのビューでバインディングが正常に機能します。この変更により、ビュー内で`account.nickname`を変更できるようになります。

---
