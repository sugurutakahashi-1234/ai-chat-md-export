# Handle visible elements compactly

日付: 2023-06-09

---

## 👤 ユーザー
*2023/6/9 20:25:37*

この処理をcompactMapに変えて欲しい

var _elements = [VisibleElement]()
        elements.forEach {
            guard let id = $0["id"] as? String,
                  let rect = $0["boundingClientRect"] as? [String: Double],
                  let domRect = DOMRect.from(dict: rect)
            else {
                return
            }
            _elements.append(VisibleElement(
                id: id,
                boundingClientRect: domRect
            ))
        }
        delegate?.visibleElementsDetected(VisibleElements(
            elements: _elements,
            datetime: Date()
        )

---

## 🤖 アシスタント
*2023/6/9 20:26:00*

`forEach` メソッドを使用して配列の各要素に対して処理を行う部分を、`compactMap` メソッドを使ってリファクタリングすることができます。`compactMap` メソッドは配列の各要素に対して変換処理を行い、その結果を新たな配列として返します。`nil` の結果をフィルタリングして、非 `nil` の値だけを含む配列を生成します。

以下に、コードをリファクタリングした例を示します:

```swift
let _elements = elements.compactMap { element -> VisibleElement? in
    guard let id = element["id"] as? String,
          let rect = element["boundingClientRect"] as? [String: Double],
          let domRect = DOMRect.from(dict: rect) else {
        return nil
    }
    return VisibleElement(id: id, boundingClientRect: domRect)
}

delegate?.visibleElementsDetected(VisibleElements(
    elements: _elements,
    datetime:

---
