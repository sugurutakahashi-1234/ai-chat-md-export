# Session Expired Dialog

Date: 2025-01-23

---

## 👤 User
*2025-01-23 20:27:21*

アクセストークンが切れたので強制ログアウトするようなポップアップを出したい

---

## 🤖 Assistant
*2025-01-23 20:27:22*

アクセストークンの有効期限が切れたときに、強制ログアウトを行い、適切なポップアップを表示するには、以下のような実装方法を検討できます。SwiftUIを前提とした例を挙げます。

---

### 1. **ポップアップを管理するための状態を用意**
アクセストークンが無効になった際にポップアップを表示するため、アプリ全体でポップアップを管理する状態を用意します。

```swift
class AuthState: ObservableObject {
    @Published var isTokenInvalid: Bool = false
}
```

---

### 2. **アクセストークンの有効期限をチェック**
API呼び出しなどの認証処理で、アクセストークンが無効になった場合に `isTokenInvalid` を更新します。

```swift
func handleAPIResponse(response: URLResponse?) {
    if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 401 {
        // アクセストークン無効
        DispatchQueue.main.async {
            authState.isTokenInvalid = true
        }
    }
}
```

---

### 3. **SwiftUIでポップアップを表示**
`isTokenInvalid` が `true` のときに、ポップアップを表示してログアウト処理を実行します。

```swift
struct ContentView: View {
    @EnvironmentObject var authState: AuthState
    
    var body: some View {
        NavigationView {
            VStack {
                Text("メインコンテンツ")
            }
            .alert(isPresented: $authState.isTokenInvalid) {
                Alert(
                    title: Text("セッションの有効期限が切れました"),
                    message: Text("もう一度ログインしてください"),
                    dismissButton: .default(Text("ログイン画面へ")) {
                        handleLogout()
                    }
                )
            }
        }
    }
    
    func handleLogout() {
        // ログアウト処理
        // 必要に応じてトークンをクリア、ログイン画面への遷移などを実行
        print("ログアウト処理を実行")
    }
}
```

---

### 4. **ログイン画面への遷移**
ログイン画面に遷移する場合は、例えば `NavigationStack` を使用してアプリ全体の画面遷移を制御します。

```swift
struct RootView: View {
    @StateObject var authState = AuthState()
    @State private var isLoggedIn: Bool = true // ログイン状態を管理
    
    var body: some View {
        if isLoggedIn {
            ContentView()
                .environmentObject(authState)
                .onChange(of: authState.isTokenInvalid) { newValue in
                    if newValue {
                        isLoggedIn = false
                    }
                }
        } else {
            LoginView()
        }
    }
}
```

---

### ポイント

- **セキュリティの考慮**: トークンが切れた場合は、必ず即座にトークンやキャッシュされた認証情報をクリアしてください。
- **グローバル状態の管理**: `ObservableObject` を活用してアプリ全体の認証状態を管理することで、どの画面からでも状態変化を検知できるようにします。
- **ユーザー体験の向上**: ポップアップの文言をユーザーが分かりやすい内容にすることで、スムーズに再ログインを促します。

必要に応じてカスタマイズしてご利用ください！

---
