# Invalid port in connection

Date: 2024-05-27

---

## 👤 User
*2024-05-27 13:27:43*

変わらずエラーになった

Run tbls doc
parse "***tcp(127.0.0.1:3306)/todo_database": invalid port ":3306)" after host
Error: Process completed with exit code 1.

---

## 🤖 Assistant
*2024-05-27 13:27:49*

エラーの原因は、接続文字列のポート指定部分に不正な形式が含まれているためです。具体的には、ポート指定の閉じ括弧 `")"` が余分に含まれています。

正しい接続文字列は次のようになります。

```
"***tcp(127.0.0.1:3306)/todo_database"
```

まず、設定ファイルや環境変数を確認して、接続文字列が正しく設定されているか確認してください。

### 修正例
例えば、GitHub Actionsの設定ファイルで接続文字列を指定している場合は、以下のように修正します。

```yaml
env:
  DB_CONNECTION: "***tcp(127.0.0.1:3306)/todo_database"
```

また、コード内で直接接続文字列を指定している場合も、同様に修正してください。

```go

---
