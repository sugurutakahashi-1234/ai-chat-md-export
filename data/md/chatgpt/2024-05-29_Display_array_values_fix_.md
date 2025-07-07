# Display array values fix.

日付: 2024-05-29

---

## 👤 ユーザー
*2024/5/29 11:22:01*

structやclass の key-valueは表示されるが、    var city: \[String\]
    var postalCode: \[Int\] のような場合は値が表示されない。値が表示されるようにしてほしい。

import SwiftUI

struct PropertyView: View {
    var objects: \[Any\] = \[\]
    
    init(objects: \[Any\]) {
        self.objects = objects
    }

    public var body: some View {
        List {
            ForEach(Array(objects.enumerated()), id: \\.offset) { index, object in
                DisclosureGroup {
                    propertyView(object: object)
                } label: {
                    HStack {
                        Text("\\(type(of: object))")
                        Spacer()
                        Text("\[\\(index)\]")
                    }
                }
            }
        }
    }
    
    func propertyView(object: Any) -&gt; some View {
        AnyView(ForEach(Array(Mirror(reflecting: object).children.enumerated()), id: \\.offset) { index, child in
            if let label = child.label {
                let childMirror = Mirror(reflecting: child.value)
                if childMirror.displayStyle == .struct || childMirror.displayStyle == .class {
                    DisclosureGroup {
                        propertyView(object: child.value)
                    } label: {
                        Text(label)
                    }
                } else if let subObjects = child.value as? \[Any\] {
                    ForEach(Array(subObjects.enumerated()), id: \\.offset) { subIndex, subObject in
                        DisclosureGroup {
                            propertyView(object: subObject)
                        } label: {
                            HStack {
                                Text("\\(type(of: subObject))")
                                Spacer()
                                Text("\[\\(subIndex)\]")
                            }
                        }
                    }
                } else {
                    Button {
                        UIPasteboard.general.string = "\\(child.value)"
                        print("\\(child.value)")
                    } label: {
                        HStack {
                            Text(label)
                            Spacer()
                            Text("\\(child.value)")
                        }
                    }
                }
            }
        })
    }
}

struct Address {
    var city: \[String\]
    var postalCode: \[Int\]
}

struct Person {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: \[Address\]
}

#Preview {
    NavigationStack {
        PropertyView(objects: \[
            Person(name: "John Doe", age: 30, isEmployed: true, address: \[
                Address(city: \["New York", "トーキョー"\], postalCode: \[10001, 10002\]),
                Address(city: \["New York", "トーキョー"\], postalCode:\[10001, 10002\]),
            \]),
            Person(name: "John Doe", age: 30, isEmployed: true, address: \[
                Address(city: \["New York", "トーキョー"\], postalCode: \[10001, 10002\]),
                Address(city: \["New York", "トーキョー"\], postalCode: \[10001, 10002\]),
            \])
        \])
    }
}

---

## 🤖 アシスタント
*2024/5/29 11:22:20*

以下のコードを修正して、配列の値も表示されるようにします。

```swift
import SwiftUI

struct PropertyView: View {
    var objects: [Any] = []
    
    init(objects: [Any]) {
        self.objects = objects
    }

    public var body: some View {
        List {
            ForEach(Array(objects.enumerated()), id: \.offset) { index, object in
                DisclosureGroup {
                    propertyView(object: object)
                } label: {
                    HStack {
                        Text("\(type(of: object))")
                        Spacer()
                        Text("[\(index)]")
                    }
                }
            }
        }
    }
    
    func propertyView(object: Any) -> some View {
        AnyView(ForEach(Array(Mirror(reflecting: object).children.enumerated()), id: \.offset) { index, child in
            if let label = child.label {
                let childMirror = Mirror(reflecting: child.value)
                if childMirror.displayStyle == .struct || childMirror.displayStyle == .class {
                    DisclosureGroup {
                        propertyView(object: child.value)
                    } label: {
                        Text(label)
                    }
                } else if let subObjects = child.value as? [Any] {
                    DisclosureGroup {
                        ForEach(Array(subObjects.enumerated()), id: \.offset) { subIndex, subObject in
                            propertyView(object: subObject)
                        }
                    } label: {
                        HStack {
                            Text(label)
                            Spacer()
                            Text("Array[\(subObjects.count)]")
                        }
                    }
                } else {
                    Button {
                        UIPasteboard.general.string = "\(child.value)"
                        print("\(child.value)")
                    } label: {
                        HStack {
                            Text(label)
                            Spacer()
                            Text("\(child.value)")
                        }
                    }
                }
            }
        })
    }
}

struct Address {
    var city: [String]
    var postalCode: [Int]
}

struct Person {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: [Address]
}

#Preview {
    NavigationStack {
        PropertyView(objects: [
            Person(name: "John Doe", age: 30, isEmployed: true, address: [
                Address(city: ["New York", "トーキョー"], postalCode: [10001, 10002]),
                Address(city: ["New York", "トーキョー"], postalCode:[10001, 10002]),
            ]),
            Person(name: "John Doe", age: 30, isEmployed: true, address: [
                Address(city: ["New York", "トーキョー"], postalCode: [10001, 10002]),
                Address(city: ["New York", "トーキョー"], postalCode: [10001, 10002]),
            ])
        ])
    }
}
```

この修正では、配列の値も表示されるように `DisclosureGroup` を追加し、配列の要素を再帰的に表示するようにしました。これにより、配列の中身も展開して表示できるようになります。

---
