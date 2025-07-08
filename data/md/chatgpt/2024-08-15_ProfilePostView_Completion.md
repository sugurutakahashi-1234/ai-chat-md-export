# ProfilePostView Completion

日付: 2024-08-15

---

## 👤 ユーザー
*2024/08/15 12:46:19*

足りない処理を埋めて欲しい

public enum Gender: SwiftUIForEachable {
    case male
    case female
    case other
    case noSelect
}

@MainActor
final class ProfilePostPresenter: ObservableObject {
    @Published var nickname: String = ""
    @Published var birthDay: Date = Date()
    @Published var gender: Gender = .noSelect
    
    @Published var isValid: Bool = false
    
    private let logDriver: any LogDriverProtocol
    
    init(logDriver: any LogDriverProtocol = LogDriver()) {
        self.logDriver = logDriver
        
        logDriver.initLog()

        $nickname
            .combineLatest($birthDay, $gender)
            .map { nickname, birthDay, gender in
                nickname.isNotEmpty && birthDay.isPast && gender != .noSelect
            }
            .assign(to: &$isValid)
    }
    
    deinit {
        logDriver.deinitLog()
    }
    
    func onAppear() async {
        logDriver.onAppearLog()
    }
    
    func onDisappear() {
        logDriver.onDisappearLog()
    }
    
    func onTapDone() {
        // TODO
    }
}

public struct ProfilePostView: View {
    @StateObject private var presenter: ProfilePostPresenter
    @FocusState private var isFocused: Bool

    public init() {
        _presenter = .init(wrappedValue: ProfilePostPresenter())
    }

    public var body: some View {
        VStack {
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)
            
            VStack(spacing: 5) {
                TextField("あとで変更できます", text: $presenter.nickname)
                    .focused($isFocused)

                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.gray)
            }
            
            HStack {
                Text("誕生日")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)
            
            HStack {
                Text("性別")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)

            Button {
                presenter.onTapDone()
            } label: {
                Text("完了")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .disabled(!presenter.isValid)

            Spacer()
        }
        .padding(.horizontal, 32)
        .navigationTitle("プロフィール")
        .task {
            await presenter.onAppear()
        }
        .onAppear {
            isFocused = true
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 アシスタント
*2024/08/15 12:46:29*

`ProfilePostPresenter` の `onTapDone` メソッドの処理を埋める場合、例えばユーザーが入力したプロフィール情報を保存する処理を追加することが考えられます。以下に `onTapDone` メソッドの実装例を示します。

```swift
func onTapDone() {
    logDriver.log("Done tapped with nickname: \(nickname), birthDay: \(birthDay), gender: \(gender)")

    // Save profile information
    let profile = Profile(nickname: nickname, birthDay: birthDay, gender: gender)
    saveProfile(profile)
    
    // Navigate back or show success message
    // ここで画面遷移や成功メッセージの表示を行います。
}

private func saveProfile(_ profile: Profile) {
    // 実際の保存処理を実装します。例えばUserDefaultsやCoreDataなどを使用します。
    UserDefaults.standard.set(profile.nickname, forKey: "nickname")
    UserDefaults.standard.set(profile.birthDay, forKey: "birthDay")
    UserDefaults.standard.set(profile.gender.rawValue, forKey: "gender")
    
    logDriver.log("Profile saved: \(profile)")
}
```

`Profile` 構造体を定義して、プロフィール情報をまとめて管理し、その保存処理を行う形にしました。保存処理は `UserDefaults`

---
