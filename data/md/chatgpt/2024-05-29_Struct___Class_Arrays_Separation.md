# Struct & Class Arrays Separation

Date: 2024-05-29

---

## 👤 User
*2024-05-29 11:45:31*

struct や  class の配列の場合とそうでない場合の配列を分けたい

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
                        Text("\(type(of: object))[\(index)]")
                    }
                }
            }
        }
    }
    
    func propertyView(object: Any) -&gt; some View {
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
                            Text("\(Mirror(reflecting: child.value).subjectType)")
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

---

## 🤖 Assistant
*2024-05-29 11:45:54*

To separate the arrays containing `struct` or `class` instances from those that do not, we can modify the `propertyView` function to handle both scenarios. Specifically, we will distinguish between arrays of `struct` or `class` instances and arrays of other types by checking the display style of the array's elements.

Here's the modified code:

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
                        Text("\(type(of: object))[\(index)]")
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
                    let isStructOrClassArray = subObjects.allSatisfy { subObject in
                        let subObjectMirror = Mirror(reflecting: subObject)
                        return subObjectMirror.displayStyle == .struct || subObjectMirror.displayStyle == .class
                    }
                    if isStructOrClassArray {
                        DisclosureGroup {
                            ForEach(Array(subObjects.enumerated()), id: \.offset) { subIndex, subObject in
                                propertyView(object: subObject)
                            }
                        } label: {
                            HStack {
                                Text(label)
                                Spacer()
                                Text("\(Mirror(reflecting: child.value).subjectType)")
                            }
                        }
                    } else {
                        DisclosureGroup {
                            ForEach(Array(subObjects.enumerated()), id: \.offset) { subIndex, subObject in
                                Button {
                                    UIPasteboard.general.string = "\(subObject)"
                                    print("\(subObject)")
                                } label: {
                                    HStack {
                                        Text("\(subObject)")
                                        Spacer()
                                        Text("\(subObject)")
                                    }
                                }
                            }
                        } label: {
                            HStack {
                                Text(label)
                                Spacer()
                                Text("\(Mirror(reflecting: child.value).subjectType)")
                            }
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

This updated version ensures that arrays of `struct` or `class` instances are displayed as `DisclosureGroup` with nested views, while arrays of other types (like strings or integers) are displayed with buttons to copy their values to the clipboard. This should provide a clearer and more intuitive representation of the data structure.

---
