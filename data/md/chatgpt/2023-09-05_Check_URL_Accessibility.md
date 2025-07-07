# Check URL Accessibility

日付: 2023-09-05

---

## 👤 ユーザー
*2023/9/5 16:17:52*

urlがアクセス可能かどうかを確認してBoolを返却する関数名 wo

---

## 🤖 アシスタント
*2023/9/5 16:18:26*

URLがアクセス可能かどうかを確認するPythonの関数を作成する場合、`requests`ライブラリを使用するのが一般的です。以下は、指定されたURLがアクセス可能かどうかを確認し、その結果をBool値で返す関数の例です。

関数名を`is_url_accessible`としていますが、お好みに合わせて名前を変更することができます。

```python
import requests

def is_url_accessible(url):
    try:
        response = requests.get(url, timeout=5)
        # 200番台のHTTPステータスコードは成功を意味するため、この範囲内であればTrueを返します
        return 200 <= response.status_code < 300
    except requests.RequestException:
        # 例外が発生した場合はアクセス不可と判断し、Falseを返します
        return False

# 使用例
url = "https://www.example.com"
if is_url_accessible(url):
    print(f"{url} is accessible!")
else:
    print(f"{url} is not accessible.")
```

この関数は、URLがアクセス可能かどうかの簡単なチェックを提供します。ただし、サイトやサーバーによっては、この方法で正確にアクセス可能かどうかを確認できない場合があります。必要に応じて、関数をカスタマイズしてください。

---
