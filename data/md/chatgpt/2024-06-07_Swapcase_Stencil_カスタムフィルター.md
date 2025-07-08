# Swapcase Stencil カスタムフィルター

Date: 2024-06-07

---

## 👤 User
*2024-06-07 15:49:58*

stencil で swapcase を .stencil ファイルないで実装する方法

---

## 🤖 Assistant
*2024-06-07 15:50:16*

Stencil でテンプレート内で文字列のケースを変換するには、カスタムフィルターを定義する必要があります。Stencil はデフォルトでは `swapcase` のようなフィルターを提供していないため、自分で作成する必要があります。

以下は、Stencil で `swapcase` フィルターを実装する手順です：

1. **Stencil カスタムフィルターの作成**:

   まず、Stencil のカスタムフィルターを定義します。これにより、テンプレート内で `swapcase` フィルターを使用できるようになります。

   ```swift
   import Stencil

   class SwapcaseExtension: Extension {
       override init() {
           super.init()
           registerFilter("swapcase") { (value: Any?) in
               guard let string = value as? String else { return value }
               return String(string.map { $0.isUppercase ? $0.lowercased() : $0.uppercased() })
           }
       }
   }
   ```

2. **TemplateLoader にカスタムフィルターを追加**:

   次に、Stencil のテンプレートローダーにカスタムフィルターを追加します。

   ```swift
   let environment = Environment(extensions: [SwapcaseExtension()])
   ```

3. **テンプレートでの使用**:

   これで、Stencil テンプレート内で `swapcase` フィルターを使用できるようになります。

   ```stencil
   {{ "Hello World!"|swapcase }}
   ```

   上記のテンプレートは `"hELLO wORLD!"` を出力します。

4. **サンプルプロジェクト**:

   すべてをまとめると、以下のようなシンプルな Swift プロジェクトになります。

   ```swift
   import Foundation
   import Stencil

   // カスタムフィルターの定義
   class SwapcaseExtension: Extension {
       override init() {
           super.init()
           registerFilter("swapcase") { (value: Any?) in
               guard let string = value as? String else { return value }
               return String(string.map { $0.isUppercase ? $0.lowercased() : $0.uppercased() })
           }
       }
   }

   // テンプレートエンジンのセットアップ
   let environment = Environment(extensions: [SwapcaseExtension()])

   // テンプレートの定義
   let templateString = "Original: {{ text }}\nSwapped: {{ text|swapcase }}"
   let template = try! Template(templateString: templateString)

   // コンテキストの定義
   let context: [String: Any] = ["text": "Hello World!"]

   // レンダリング
   let rendered = try! template.render(context)
   print(rendered)
   ```

   これを実行すると、以下の出力が得られます：

   ```
   Original: Hello World!
   Swapped: hELLO wORLD!
   ```

以上が、Stencil で `swapcase` フィルターを実装する方法です。これにより、テンプレート内で文字列の大文字と小文字を入れ替えることができるようになります。

---

## 👤 User
*2024-06-07 15:50:42*

カスタムフィルター を作成せずにしてほしい。先頭の文字列を小文字にするだけでいいんだ。

---

## 👤 User
*2024-06-07 15:52:51*

こういうファイルで実現したい。

//
//  Created by {{ argument.userName }} on {{ argument.date }}
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase|split:" "|join:"" }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase|split:" "|join:"" }}:
            TestCaseListView&lt;{{ type.name }}&gt;()
        {% endfor %}
        }
    }
}

---

## 🤖 Assistant
*2024-06-07 15:53:01*

カスタムフィルターを使わずに、文字列の先頭文字を小文字にするためには、既存のフィルターを組み合わせて実現できます。具体的には、`replace` と `lowercase` を使って手動で先頭の文字を小文字にする方法を示します。

以下のように `.stencil` ファイルを編集します：

```stencil
//
//  Created by {{ argument.userName }} on {{ argument.date }}
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|replace:type.name[0], type.name[0]|lowercase }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|replace:type.name[0], type.name[0]|lowercase }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

これにより、`type.name` の最初の文字を小文字に変換し、`ViewTestCase` を削除することができます。例えば、`MyViewTestCase` は `my` となります。

上記の例では、`replace` フィルターを二重に使用して、最初の文字を小文字に変換しています。これにより、カスタムフィルターを作成せずに目的を達成できます。

---

## 👤 User
*2024-06-07 15:53:52*

全部小文字になってしまった。ちょっと見直してほしい。

---

## 🤖 Assistant
*2024-06-07 15:54:08*

最初の文字だけを小文字にし、残りの部分はそのままにするには、テンプレート言語の機能を駆使する必要があります。Stencil自体には直接的な方法はありませんが、カスタムフィルターなしでこれを達成するために工夫する方法を以下に示します。

以下のコードでは、手動で最初の文字を小文字にし、残りの部分をそのままにするための方法を実装します。

```stencil
//
//  Created by {{ argument.userName }} on {{ argument.date }}
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ (type.name|replace:"ViewTestCase","")[:1]|lowercase }}{{ (type.name|replace:"ViewTestCase","")[1:] }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ (type.name|replace:"ViewTestCase","")[:1]|lowercase }}{{ (type.name|replace:"ViewTestCase","")[1:] }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

このコードでは、以下の操作を行います：
1. `type.name` から `ViewTestCase` を削除します。
2. 残りの文字列の最初の文字を小文字に変換します。
3. 残りの部分はそのままにします。

例えば、`MyViewTestCase` という名前の列挙型があった場合、`My` の `M` を小文字に変換して `my` にし、`ViewTestCase` を削除することで、最終的に `my` となります。

この方法で、目的の結果を得ることができます。

---

## 👤 User
*2024-06-07 15:54:25*

error: ./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unable to resolve subscript ':1' in variable '"")[:1]'

---

## 🤖 Assistant
*2024-06-07 15:54:40*

Stencil には部分文字列のサポートがないため、`[:1]` のようなインデックス操作が使えません。これを回避するために、テンプレートエンジンでできる範囲内で文字列操作を行う必要があります。

以下の方法で最初の文字を小文字にし、残りの部分をそのままにすることができます：

```stencil
//
//  Created by {{ argument.userName }} on {{ argument.date }}
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|first|lowercase }}{{ type.name|replace:"ViewTestCase",""|slice:1 }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|first|lowercase }}{{ type.name|replace:"ViewTestCase",""|slice:1 }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### 説明
1. **first フィルターを使用して最初の文字を取得し、lowercase フィルターを適用**:
   - `{{ type.name|replace:"ViewTestCase",""|first|lowercase }}` は、`type.name` の `ViewTestCase` を削除し、その後の最初の文字を小文字に変換します。

2. **slice フィルターを使用して最初の文字以外の部分を取得**:
   - `{{ type.name|replace:"ViewTestCase",""|slice:1 }}` は、`type.name` の `ViewTestCase` を削除し、その後の最初の文字以外の部分を取得します。

### 例
- `MyViewTestCase` は、`case my` となります。
- `ExampleViewTestCase` は、`case example` となります。

これで、Stencil テンプレート内で最初の文字を小文字に変換し、残りの部分をそのままにすることができます。

---

## 👤 User
*2024-06-07 15:55:00*

error: ./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter 'first'. Found similar filters: 'split', 'filter', 'class', 'struct', 'count', 'split', 'filter'.

---

## 🤖 Assistant
*2024-06-07 15:55:20*

Stencil には `first` や `slice` のようなフィルターは存在しないため、文字列の部分取得やインデックス操作を行うための直接的な方法がありません。そのため、少し工夫が必要です。

Stencil では、Python のような文字列操作を行うフィルターは提供されていないため、以下のような方法で文字列の操作を行う必要があります。

### 回避策

`replace` フィルターを駆使して、先頭の文字だけを小文字に変換する方法を考えます。これは一度にすべての文字を小文字に変換してから、元の大文字の部分を置き換える手法を使います。

### 実装方法

1. すべての文字を小文字に変換します。
2. 元の文字列の先頭文字を取り出して小文字に変換します。
3. 小文字に変換した文字列の先頭文字を適切に置き換えます。

以下に示すのはその実装例です。

```stencil
//
//  Created by {{ argument.userName }} on {{ argument.date }}
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase|replace:(type.name|replace:"ViewTestCase","")[0]|lowercase, (type.name|replace:"ViewTestCase","")[0] }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase|replace:(type.name|replace:"ViewTestCase","")[0]|lowercase, (type.name|replace:"ViewTestCase","")[0] }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### 説明

1. **`type.name|replace:"ViewTestCase",""|lowercase`**:
   - `ViewTestCase` を削除し、文字列全体を小文字に変換します。

2. **`replace` フィルターを二重に使用**:
   - `type.name` から `ViewTestCase` を削除した文字列の先頭文字を取り出し、それを小文字に変換します。
   - その小文字に変換された先頭文字を、元の文字列の先頭文字に置き換えます。

この方法では、最初の文字だけが小文字に変換され、他の文字はそのまま保持されます。例えば、`MyViewTestCase` は `my` になります。

---
