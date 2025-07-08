# Last Value Appends Last

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/20 11:24:26*

これって最新の値はfirstに入っているのラストに入っているの？

public struct BoundedArray&lt;T&gt; {
    private var array: [T] = []
    private var maxSize: Int

    public init(maxSize: Int) {
        self.maxSize = maxSize
    }

    public mutating func append(_ element: T) {
        if array.count &gt;= maxSize {
            array.removeFirst()
        }
        array.append(element)
    }

    public func getArray() -&gt; [T] {
        return array
    }

    public mutating func setMaxSize(_ newSize: Int) {
        while array.count &gt; newSize {
            array.removeFirst()
        }
        self.maxSize = newSize
    }
}

---

## 🤖 アシスタント
*2024/6/20 11:24:36*

`BoundedArray`構造体では、最新の値は配列の最後に入ります。`append`メソッドを見てみると、配列のサイズが`maxSize`に達している場合、最初の要素を削除してから新しい要素を追加しています。つまり、新しい要素は常に配列の最後に追加されるため、最新の値は常に配列の最後（`array.last`）に入ることになります。

```swift
public struct BoundedArray<T> {
    private var array: [T] = []
    private var maxSize: Int

    public init(maxSize: Int) {
        self.maxSize = maxSize
    }

    public mutating func append(_ element: T) {
        if array.count >= maxSize {
            array.removeFirst()
        }
        array.append(element)
    }

    public func getArray() -> [T] {
        return array
    }

    public mutating func setMaxSize(_ newSize: Int) {
        while array.count > newSize {
            array.removeFirst()
        }
        self.maxSize = newSize;
    }
}
```

このコードでは、例えば最大サイズが3の`BoundedArray`に対して次のように操作を行った場合：

```swift
var boundedArray = BoundedArray<Int>(maxSize: 3)
boundedArray.append(1)
boundedArray.append(2)
boundedArray.append(3)
boundedArray.append(4)
```

結果として、`boundedArray`の内容は `[2, 3, 4]` になります。最新の値である`4`は配列の最後に入っています。

---
