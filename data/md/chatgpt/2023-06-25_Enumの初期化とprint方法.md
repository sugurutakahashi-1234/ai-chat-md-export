# Enumの初期化とprint方法

日付: 2023-06-25

---

## 👤 ユーザー
*2023/06/25 15:52:06*

enum が作られた時にprintするほうほうってあるの？

---

## 🤖 アシスタント
*2023/06/25 15:52:24*

言語によりますが、もしあなたがSwiftやJavaなどの言語でenumを使用している場合、それぞれのenumの値を印刷する方法があります。Pythonでも列挙型（enum）を扱うことができます。

例えば、Pythonで列挙型（enum）を扱うには `enum` モジュールを使います。以下に例を示します：

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

print(list(Color))  # => [<Color.RED: 1>, <Color.GREEN: 2>, <Color.BLUE: 3>]
```

Javaで列挙型（enum）を扱う場合の例を示します：

```java
enum Color {
    RED,
    GREEN,
    BLUE;
}

public class Main {
    public static void main(String[] args) {
        for (Color color : Color.values()) {
            System.out.println(color);
        }
    }
}
```

Swiftで列挙型（enum）を扱う場合の例を示します：

```swift
enum Color {
    case red

---
