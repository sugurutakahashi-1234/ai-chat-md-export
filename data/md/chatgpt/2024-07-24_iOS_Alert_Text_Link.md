# iOS Alert Text Link

日付: 2024-07-24

---

## 👤 ユーザー
*2024/07/24 16:24:19*

iOSの標準アラートにテキストリンクを埋め込めるのか？

---

## 🤖 アシスタント
*2024/07/24 16:24:29*

iOSの標準アラート（`UIAlertController`）にテキストリンクを埋め込むことは直接的にはできません。`UIAlertController`のメッセージやタイトルは単純なテキストしか受け付けないため、リンクのようなリッチなテキストを表示することはできません。

しかし、カスタムアラートを作成することでリンクを表示することは可能です。例えば、`UIViewController`を使用してカスタムアラートを作成し、その中にリンクを含む`UILabel`を配置する方法があります。

以下にカスタムアラートを使用してリンクを表示する簡単な例を示します：

```swift
import UIKit

class CustomAlertViewController: UIViewController {

    let alertTitle = "重要なお知らせ"
    let message = "こちらのリンクをクリックしてください。"

    override func viewDidLoad() {
        super.viewDidLoad()
        setupAlertView()
    }

    func setupAlertView() {
        view.backgroundColor = UIColor(white: 0, alpha: 0.5)

        let alertView = UIView()
        alertView.backgroundColor = .white
        alertView.layer.cornerRadius = 10
        alertView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(alertView)

        let titleLabel = UILabel()
        titleLabel.text = alertTitle
        titleLabel.font = .boldSystemFont(ofSize: 18)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        alertView.addSubview(title

---
