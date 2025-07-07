# UserDefaultsとMVVM

日付: 2023-05-29

---

## 👤 ユーザー
*2023/5/29 13:42:53*

以下のようなコードを使って、SwiftでMVVMの構成で画面を作ろうとしている。
やりたいことは主に以下の3つである。

(1)UserDefaults を管理している場所を1箇所にまとめたい。
(2)ViewModelにUserDefaults またはUserDefaultsを1箇所にまとめたstructやclassを注入して、テストコードを書きたい。
(3)Viewを制御する変数はViewModel側に寄せたい。

これらを踏まえてコードを追加したり修正してほしい。
```swift
extension Bool: UserDefaultsCodable {}
extension Int: UserDefaultsCodable {}

public enum UserDefaultsKeys: String {
    case isFirstLogin
    case loginCount
}

public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

extension UserDefaultsCodable {
    public static var decoder: JSONDecoder {
        JSONDecoder()
    }

    public static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

@propertyWrapper
public struct UserDefaultsWrapper<T: UserDefaultsCodable> {
    private let key: UserDefaultsKeys
    private let defaultValue: T
    private let userDefaults: UserDefaults

    public init(key: UserDefaultsKeys, defaultValue: T, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                return defaultValue
            }
            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                return decodedValue
            } catch {
                assertionFailure("Failed to decode \(key): \(error)")
                return defaultValue
            }
        }
        set {
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
            } catch {
                assertionFailure("Failed to encode \(key): \(error)")
            }
        }
    }
}

```

---

## 🤖 アシスタント
*2023/5/29 13:43:37*

提供されたコードでは、UserDefaultsに対するアクセスを簡易化し、抽象化しています。このコードによりUserDefaultsに保存されているデータを容易にアクセスできるようになります。

しかしながら、MVVMアーキテクチャを適用するには、まずModel, View, ViewModel の3つのコンポーネントを明確に分離しなければなりません。以下に、それぞれの役割とコード例を記載します。

Model:
Modelはアプリケーションのデータとビジネスロジックを管理します。例えば、ユーザーのログイン情報などを管理します。

```swift
struct User {
    @UserDefaultsWrapper(key: .isFirstLogin, defaultValue: false)
    var isFirstLogin: Bool
    
    @UserDefaultsWrapper(key: .loginCount, defaultValue: 0)
    var loginCount: Int
}
```

ViewModel:
ViewModelはViewとModelの間の連絡係となります。Viewからの入力をModelに伝え、ModelのデータをViewに渡す役割を果たします。ViewModelはViewに依存せず、単体テストが可能な形で設計することが好まれます。

```swift
class UserViewModel {
    private var user: User

    init(user: User) {
        self.user = user
    }
    
    var isFirstLogin: Bool {
        return user.isFirstLogin
    }
    
    var loginCount: Int {
        return user.loginCount
    }
    
    func login() {
        user.loginCount += 1
        if user.loginCount == 1 {
            user.isFirstLogin = true
        }
    }
}
```

View:
ViewはUIの表示を担当し、ユーザーからの入力をViewModelに伝えます。Viewは通常、ViewControllerや SwiftUIのViewなどで表現されます。

```swift
class LoginViewController: UIViewController {
    private var viewModel: UserViewModel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // initialize ViewModel
        let user = User()
        viewModel = UserViewModel(user: user)
        
        // login user
        viewModel.login()
        
        print("Is first login: \(viewModel.isFirstLogin)")
        print("Login count: \(viewModel.loginCount)")
    }
}
```

この例では、UserDefaultsにアクセスするためのModelを作成し、そのModelをViewModelを通じてViewが利用する形にしています。これにより、UserDefaultsの扱いを1箇所にまとめるとともに、ViewModelを介してViewが制御されるという要件も満たしています。また、ViewModelの注入も可能になり、テストコードの書きやすさも向上します。

なお、ViewModelがUserDefaultsを直接扱わない設計にすることで、ViewModelの単体テストが容易になります。

---
