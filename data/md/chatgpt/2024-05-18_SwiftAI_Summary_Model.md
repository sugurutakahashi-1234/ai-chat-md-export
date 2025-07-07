# SwiftAI Summary Model

日付: 2024-05-18

---

## 👤 ユーザー
*2024/5/18 19:00:31*

Swift で 文字列をAIによるようやくをしてもらいたい

どういう手段があるか？

---

## 🤖 アシスタント
*2024/5/18 19:00:52*

Swiftで文字列を要約するためのAIを活用するには、いくつかの方法があります。以下の手段が考えられます：

### 1. **OpenAI API（ChatGPTやGPT-3）を利用する**
OpenAIのAPIを使用して、テキストを要約することができます。以下はその基本的な手順です：

1. **APIキーの取得**：OpenAIの公式サイトでAPIキーを取得します。
2. **HTTPリクエストを送信**：SwiftでHTTPリクエストを作成し、テキスト要約のリクエストを送信します。

例：
```swift
import Foundation

let apiKey = "YOUR_API_KEY"
let endpoint = "https://api.openai.com/v1/engines/davinci-codex/completions"

func summarizeText(text: String, completion: @escaping (String?) -> Void) {
    var request = URLRequest(url: URL(string: endpoint)!)
    request.httpMethod = "POST"
    request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let parameters: [String: Any] = [
        "prompt": "以下のテキストを要約してください:\n\n\(text)\n\n要約:",
        "max_tokens": 60
    ]
    
    request.httpBody = try? JSONSerialization.data(withJSONObject: parameters, options: [])
    
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data, error == nil else {
            print("Error: \(error?.localizedDescription ?? "Unknown error")")
            completion(nil)
            return
        }
        
        if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
           let choices = json["choices"] as? [[String: Any]],
           let text = choices.first?["text"] as? String {
            completion(text.trimmingCharacters(in: .whitespacesAndNewlines))
        } else {
            completion(nil)
        }
    }
    task.resume()
}
```

### 2. **Hugging FaceのTransformers APIを利用する**
Hugging FaceのTransformers APIも、テキストの要約に利用できます。同様にHTTPリクエストを使用して、要約を行います。

### 3. **ローカルモデルを使用する**
AppleのCoreMLを利用して、事前にトレーニングされた要約モデルをローカルで実行することも可能です。以下の手順を参考にしてください：

1. **モデルの取得**：事前にトレーニングされた要約モデルをHugging Faceや他のリソースから取得します。
2. **CoreMLに変換**：モデルをCoreML形式に変換します。
3. **CoreMLを使用して要約**：SwiftでCoreMLモデルを使用してテキストを要約します。

### 4. **サードパーティのライブラリを利用する**
例えば、Swiftのサードパーティライブラリを使用して要約することも可能です。具体的なライブラリは用途に応じて選択します。

### 5. **カスタムサーバーを構築する**
バックエンドでPythonなどの言語を使用して、要約モデルをホストし、Swiftアプリからそのサーバーにリクエストを送信することも考えられます。

### まとめ
これらの方法を組み合わせて、必要に応じて最適な要約手段を選択してください。どの方法を選ぶかは、要約の精度、レスポンス速度、実装の容易さなどに依存します。

---

## 👤 ユーザー
*2024/5/18 19:01:22*

CoreMLで公式から公開されてる要約に使えるSDKはないか？

---

## 🤖 アシスタント
*2024/5/18 19:01:43*

現時点でAppleが公式に提供しているCoreMLモデルの中には、テキスト要約に特化したものはありません。ただし、CoreMLを利用してHugging Faceなどの外部リソースから事前にトレーニングされた要約モデルを導入することができます。以下の手順を参考にしてください。

### 1. **Hugging Faceから要約モデルを取得**
Hugging FaceのTransformersライブラリには、要約に使える事前トレーニング済みのモデルが多数あります。

### 2. **モデルをCoreML形式に変換**
Hugging Faceの要約モデルをCoreML形式に変換するには、Pythonと`coremltools`を使用します。

まず、必要なパッケージをインストールします：
```bash
pip install torch transformers coremltools
```

次に、Pythonスクリプトを作成してモデルを変換します：
```python
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import coremltools as ct

# モデルとトークナイザーのロード
model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# トレースのためのサンプル入力
input_text = "summarize: This is an example text to summarize."
inputs = tokenizer(input_text, return_tensors="pt")

# トレーシング
traced_model = torch.jit.trace(model, (inputs['input_ids'], inputs['attention_mask']))

# CoreMLに変換
mlmodel = ct.convert(
    traced_model,
    inputs=[ct.TensorType(name="input_ids", shape=inputs['input_ids'].shape),
            ct.TensorType(name="attention_mask", shape=inputs['attention_mask'].shape)]
)

# 保存
mlmodel.save("T5Summarizer.mlmodel")
```

### 3. **SwiftでCoreMLモデルを使用**
次に、変換したCoreMLモデルをSwiftプロジェクトに組み込みます。

Xcodeプロジェクトに`T5Summarizer.mlmodel`を追加し、以下のコードを使用してテキスト要約を実行します：

```swift
import CoreML
import Foundation

class TextSummarizer {
    let model: T5Summarizer

    init() {
        guard let model = try? T5Summarizer(configuration: .init()) else {
            fatalError("Failed to load the model")
        }
        self.model = model
    }

    func summarize(text: String) -> String? {
        // Tokenize the input text (you'll need to implement this)
        let inputIds = tokenize(text)
        let attentionMask = createAttentionMask(inputIds)

        // Create MLMultiArray for inputs
        guard let inputIdsArray = try? MLMultiArray(shape: [1, NSNumber(value: inputIds.count)], dataType: .int32),
              let attentionMaskArray = try? MLMultiArray(shape: [1, NSNumber(value: attentionMask.count)], dataType: .int32) else {
            return nil
        }

        // Fill the MLMultiArray with data
        for (index, value) in inputIds.enumerated() {
            inputIdsArray[index] = NSNumber(value: value)
        }
        for (index, value) in attentionMask.enumerated() {
            attentionMaskArray[index] = NSNumber(value: value)
        }

        // Make prediction
        guard let output = try? model.prediction(input_ids: inputIdsArray, attention_mask: attentionMaskArray) else {
            return nil
        }

        // Decode the output (you'll need to implement this)
        return decode(output)
    }

    private func tokenize(_ text: String) -> [Int] {
        // Implement tokenization logic
    }

    private func createAttentionMask(_ inputIds: [Int]) -> [Int] {
        // Implement attention mask creation logic
    }

    private func decode(_ output: MLMultiArray) -> String {
        // Implement decoding logic
    }
}
```

### 注意点
- トークナイザーの実装やデコード部分はHugging Faceのトークナイザーを参考にしてください。
- CoreMLモデルの入力と出力形式に注意し、適切に前処理と後処理を行う必要があります。

この方法を利用して、外部リソースから取得した要約モデルをCoreMLで動かすことができます。公式のSDKとしては存在しませんが、このような手順でカスタムソリューションを構築することが可能です。

---

## 👤 ユーザー
*2024/5/18 19:02:08*

OpenAIを使いたい
ラップしたSDKなどはないか？

---

## 🤖 アシスタント
*2024/5/18 19:02:27*

OpenAIのAPIを利用するためのラップされたSDKがいくつか存在します。以下は、そのようなSDKの例と使い方についての説明です。

### 1. **OpenAI Swift SDK**
OpenAIのAPIを簡単に利用できるSwift向けの非公式SDKがGitHubに公開されています。以下の手順で利用できます。

#### 手順
1. **プロジェクトにパッケージを追加**
   Swift Package Managerを使用して、プロジェクトにSDKを追加します。以下のURLを使用して、Xcodeの「Swift Packages」タブからパッケージを追加します：
   ```
   https://github.com/MacPaw/OpenAI.git
   ```

2. **APIキーを取得**
   OpenAIの公式サイトからAPIキーを取得します。

3. **SDKを使用してテキスト要約を行う**
   以下のコード例では、取得したAPIキーを使用してOpenAIのAPIにリクエストを送り、テキストを要約します：

```swift
import OpenAI

struct OpenAIClient {
    private let apiKey = "YOUR_API_KEY"
    private let openAI = OpenAI(apiKey: "YOUR_API_KEY")
    
    func summarizeText(_ text: String, completion: @escaping (String?) -> Void) {
        let prompt = "Summarize the following text:\n\n\(text)\n\nSummary:"
        
        let request = OpenAI.CompletionRequest(model: "text-davinci-003", prompt: prompt, maxTokens: 60, temperature: 0.7)
        
        openAI.send(request) { result in
            switch result {
            case .success(let response):
                if let summary = response.choices.first?.text?.trimmingCharacters(in: .whitespacesAndNewlines) {
                    completion(summary)
                } else {
                    completion(nil)
                }
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                completion(nil)
            }
        }
    }
}
```

#### 利用例
以下のコードは、上記の`OpenAIClient`を使用して、テキストを要約する方法を示しています：

```swift
let client = OpenAIClient()
let textToSummarize = "OpenAI provides access to a powerful AI language model for various applications, including text summarization."

client.summarizeText(textToSummarize) { summary in
    if let summary = summary {
        print("Summary: \(summary)")
    } else {
        print("Failed to get summary.")
    }
}
```

### 2. **他の非公式SDK**
他にも非公式のOpenAI APIラッパーがGitHubで公開されています。それらを探して、自分のプロジェクトに合うものを選ぶこともできます。

### 注意点
- 非公式のSDKを使用する場合、APIの更新に追従しているかを確認することが重要です。
- APIキーの管理には十分注意し、公開リポジトリなどに含めないようにしましょう。

これらの手順を踏むことで、Swiftから簡単にOpenAIのAPIを利用してテキスト要約を実行することができます。

---

## 👤 ユーザー
*2024/5/18 19:03:08*

apikeyはどうやったら入手可能か？
自分は課金ユーザーである

---

## 🤖 アシスタント
*2024/5/18 19:03:22*

User is a paid subscriber to OpenAI.

---

## 🔧 ツール
*2024/5/18 19:03:22*

Model set context updated.

---

## 🤖 アシスタント
*2024/5/18 19:03:22*

OpenAI APIキーは、OpenAIの公式ウェブサイトから取得できます。以下の手順に従ってください：

### APIキーの取得方法

1. **OpenAIにログイン**
   OpenAIの公式ウェブサイト（[openai.com](https://www.openai.com)）にアクセスし、右上の「Log in」ボタンをクリックしてログインします。

2. **APIキーの取得ページにアクセス**
   ログイン後、ダッシュボードに移動します。上部のメニューから「API」を選択し、「API Keys」または「View API keys」をクリックします。

3. **APIキーの作成**
   「Create new secret key」ボタンをクリックして、新しいAPIキーを作成します。APIキーが生成されるので、表示されたキーをコピーして、安全な場所に保存してください。

### 注意事項
- **APIキーのセキュリティ**：APIキーは機密情報です。公開リポジトリや第三者と共有しないように注意してください。
- **キーの管理**：必要に応じて、APIキーを無効化したり、新しいキーを発行したりすることができます。

### 使い方の例
前述のコード例に、取得したAPIキーを設定します：

```swift
struct OpenAIClient {
    private let apiKey = "YOUR_API_KEY"  // ここに取得したAPIキーを設定します
    private let openAI = OpenAI(apiKey: "YOUR_API_KEY")
    
    func summarizeText(_ text: String, completion: @escaping (String?) -> Void) {
        let prompt = "Summarize the following text:\n\n\(text)\n\nSummary:"
        
        let request = OpenAI.CompletionRequest(model: "text-davinci-003", prompt: prompt, maxTokens: 60, temperature: 0.7)
        
        openAI.send(request) { result in
            switch result {
            case .success(let response):
                if let summary = response.choices.first?.text?.trimmingCharacters(in: .whitespacesAndNewlines) {
                    completion(summary)
                } else {
                    completion(nil)
                }
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                completion(nil)
            }
        }
    }
}
```

この方法でAPIキーを取得し、Swiftのアプリケーションで使用することができます。

---

## 👤 ユーザー
*2024/5/18 19:04:09*

ユーザーにOpenAIにログインさせるようにしてそのユーザーのapikeyを使えるようにできないか？

---

## 🤖 アシスタント
*2024/5/18 19:04:30*

ユーザーにOpenAIにログインさせ、そのユーザーのAPIキーを使用できるようにするには、OAuth 2.0のような認証・認可フローを実装する必要があります。しかし、現在のところ、OpenAIはOAuth 2.0のような認証フローを提供していません。そのため、ユーザーごとに個別のAPIキーを使う仕組みを構築することは難しいです。

ただし、以下のような方法でユーザーからAPIキーを取得し、使用することができます。

### 方法 1: APIキーを手動で入力させる
ユーザーが自身のAPIキーを手動で入力する方法です。以下はその実装例です。

#### UIでAPIキーを入力させる
まず、ユーザーにAPIキーを入力させるためのUIを作成します。

```swift
import SwiftUI

struct APIKeyInputView: View {
    @State private var apiKey: String = ""
    @State private var isAPIKeySaved: Bool = false

    var body: some View {
        VStack {
            TextField("Enter your OpenAI API Key", text: $apiKey)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Button(action: {
                saveAPIKey(apiKey)
                isAPIKeySaved = true
            }) {
                Text("Save API Key")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }

            if isAPIKeySaved {
                Text("API Key saved successfully!")
                    .foregroundColor(.green)
            }
        }
        .padding()
    }

    func saveAPIKey(_ apiKey: String) {
        // Save the API key securely (e.g., using Keychain)
        // This is just an example, you'll need to implement the secure storage
        UserDefaults.standard.set(apiKey, forKey: "OpenAIAPIKey")
    }
}
```

#### APIキーを使ってリクエストを送信する
次に、保存されたAPIキーを使用してOpenAI APIにリクエストを送信する方法を示します。

```swift
import OpenAI

struct OpenAIClient {
    private var apiKey: String {
        return UserDefaults.standard.string(forKey: "OpenAIAPIKey") ?? ""
    }

    func summarizeText(_ text: String, completion: @escaping (String?) -> Void) {
        guard !apiKey.isEmpty else {
            completion(nil)
            return
        }
        
        let openAI = OpenAI(apiKey: apiKey)
        let prompt = "Summarize the following text:\n\n\(text)\n\nSummary:"
        
        let request = OpenAI.CompletionRequest(model: "text-davinci-003", prompt: prompt, maxTokens: 60, temperature: 0.7)
        
        openAI.send(request) { result in
            switch result {
            case .success(let response):
                if let summary = response.choices.first?.text?.trimmingCharacters(in: .whitespacesAndNewlines) {
                    completion(summary)
                } else {
                    completion(nil)
                }
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                completion(nil)
            }
        }
    }
}
```

### 方法 2: APIキーのセキュアな保存
APIキーをセキュアに保存するには、iOSのKeychainを使用することが推奨されます。以下はその例です。

#### KeychainにAPIキーを保存する
```swift
import Security

func saveAPIKeyToKeychain(_ apiKey: String) {
    let keychainQuery: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "OpenAIAPIKey",
        kSecValueData as String: apiKey.data(using: .utf8)!
    ]

    SecItemDelete(keychainQuery as CFDictionary)
    SecItemAdd(keychainQuery as CFDictionary, nil)
}

func getAPIKeyFromKeychain() -> String? {
    let keychainQuery: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "OpenAIAPIKey",
        kSecReturnData as String: kCFBooleanTrue!,
        kSecMatchLimit as String: kSecMatchLimitOne
    ]

    var dataTypeRef: AnyObject? = nil
    let status: OSStatus = SecItemCopyMatching(keychainQuery as CFDictionary, &dataTypeRef)

    if status == errSecSuccess, let retrievedData = dataTypeRef as? Data, let apiKey = String(data: retrievedData, encoding: .utf8) {
        return apiKey
    } else {
        return nil
    }
}
```

これにより、ユーザーが自身のAPIキーを安全に入力し、アプリケーションで使用することが可能になります。ユーザーごとに異なるAPIキーを使用する場合、この方法が現実的なアプローチとなります。

---
