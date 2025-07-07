# HStackとSpacerを切り出す

日付: 2024-06-03

---

## 👤 ユーザー
*2024/6/3 17:34:12*

以下について、HStack(alignment: .top) と Spacer() の組み合わせの画面を別のStructとして切り出したい

// MARK: - View

struct PropertyView&lt;T: Encodable&gt;: View {
    @Binding var showToast: Bool
    let objects: \[T\]
    var onTapElement: (Any) -&gt; Void

    public var body: some View {
        ForEach(Array(objects.enumerated()), id: \\.offset) { index, object in
            Section {
                propertyView(object: object)
            } header: {
                HStack {
                    Text("\\(type(of: object))\[\\(index)\]")

                    Spacer()

                    Button {
                        onTapElement(object)
                    } label: {
                        Image(systemName: "doc.on.doc") // Replace with your SFSymbols
                    }
                    .buttonStyle(.borderless)
                }
            }
            .textCase(.none)
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
                    DisclosureGroup {
                        ForEach(Array(subObjects.enumerated()), id: \\.offset) { subIndex, subObject in
                            let subObjectMirror = Mirror(reflecting: subObject)
                            if subObjectMirror.displayStyle == .struct || subObjectMirror.displayStyle == .class {
                                DisclosureGroup {
                                    propertyView(object: subObject)
                                } label: {
                                    HStack(alignment: .top) {
                                        Text("\\(type(of: subObject))")
                                            .foregroundStyle(.black)
                                        Spacer()
                                        Text("\\(type(of: subObject))\[\\(subIndex)\]")
                                    }
                                }
                            } else {
                                Button {
                                    onTapElement(subObject)
                                } label: {
                                    HStack(alignment: .top) {
                                        Text("\[\\(subIndex)\]")
                                            .foregroundStyle(.black)
                                        Spacer()
                                        Text("\\(subObject)")
                                    }
                                }
                            }
                        }
                    } label: {
                        HStack(alignment: .top) {
                            Text(label)
                                .foregroundStyle(.black)
                            Spacer()
                            Text("\\(Mirror(reflecting: child.value).subjectType)")
                        }
                    }
                } else {
                    Button {
                        onTapElement(child.value)
                    } label: {
                        HStack(alignment: .top) {
                            Text(label)
                                .foregroundStyle(.black)
                            Spacer()
                            Text("\\(child.value)")
                        }
                    }
                }
            } else {
                Button {
                    onTapElement(child.value)
                } label: {
                    HStack(alignment: .top) {
                        Text("\[\\(index)\]")
                            .foregroundStyle(.black)
                        Spacer()
                        Text("\\(child.value)")
                    }
                }
            }
        })
    }
}

---

## 🤖 アシスタント
*2024/6/3 17:34:39*

以下のように、`HStack(alignment: .top)` と `Spacer()` の組み合わせを別のStructに切り出すことができます。

まず、新しい構造体を作成し、それを`PropertyView`の中で使用します。

```swift
import SwiftUI

struct PropertyView<T: Encodable>: View {
    @Binding var showToast: Bool
    let objects: [T]
    var onTapElement: (Any) -> Void

    public var body: some View {
        ForEach(Array(objects.enumerated()), id: \.offset) { index, object in
            Section {
                propertyView(object: object)
            } header: {
                HStack {
                    Text("\(type(of: object))[\(index)]")
                    
                    Spacer()
                    
                    Button {
                        onTapElement(object)
                    } label: {
                        Image(systemName: "doc.on.doc") // Replace with your SFSymbols
                    }
                    .buttonStyle(.borderless)
                }
            }
            .textCase(.none)
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
                            let subObjectMirror = Mirror(reflecting: subObject)
                            if subObjectMirror.displayStyle == .struct || subObjectMirror.displayStyle == .class {
                                DisclosureGroup {
                                    propertyView(object: subObject)
                                } label: {
                                    PropertyHStackView(title: "\(type(of: subObject))", detail: "\(type(of: subObject))[\(subIndex)]")
                                }
                            } else {
                                Button {
                                    onTapElement(subObject)
                                } label: {
                                    PropertyHStackView(title: "[\(subIndex)]", detail: "\(subObject)")
                                }
                            }
                        }
                    } label: {
                        PropertyHStackView(title: label, detail: "\(Mirror(reflecting: child.value).subjectType)")
                    }
                } else {
                    Button {
                        onTapElement(child.value)
                    } label: {
                        PropertyHStackView(title: label, detail: "\(child.value)")
                    }
                }
            } else {
                Button {
                    onTapElement(child.value)
                } label: {
                    PropertyHStackView(title: "[\(index)]", detail: "\(child.value)")
                }
            }
        })
    }
}

struct PropertyHStackView: View {
    let title: String
    let detail: String

    var body: some View {
        HStack(alignment: .top) {
            Text(title)
                .foregroundStyle(.black)
            Spacer()
            Text(detail)
        }
    }
}
```

このようにすることで、`HStack(alignment: .top)`と`Spacer()`の組み合わせを使う箇所を`PropertyHStackView`として抽出し、コードの再利用性と可読性を向上させることができます。

---

## 👤 ユーザー
*2024/6/3 17:40:25*

onTapElement(object: )としたい

---

## 🤖 アシスタント
*2024/6/3 17:40:54*

`onTapElement` を `PropertyHStackView` に渡すように変更し、タップされたときに `onTapElement` を呼び出すようにすることができます。以下のようにコードを修正します。

```swift
import SwiftUI

struct PropertyView<T: Encodable>: View {
    @Binding var showToast: Bool
    let objects: [T]
    var onTapElement: (Any) -> Void

    public var body: some View {
        ForEach(Array(objects.enumerated()), id: \.offset) { index, object in
            Section {
                propertyView(object: object)
            } header: {
                HStack {
                    Text("\(type(of: object))[\(index)]")
                    
                    Spacer()
                    
                    Button {
                        onTapElement(object)
                    } label: {
                        Image(systemName: "doc.on.doc") // Replace with your SFSymbols
                    }
                    .buttonStyle(.borderless)
                }
            }
            .textCase(.none)
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
                            let subObjectMirror = Mirror(reflecting: subObject)
                            if subObjectMirror.displayStyle == .struct || subObjectMirror.displayStyle == .class {
                                DisclosureGroup {
                                    propertyView(object: subObject)
                                } label: {
                                    PropertyHStackView(title: "\(type(of: subObject))", detail: "\(type(of: subObject))[\(subIndex)]", onTap: {
                                        onTapElement(subObject)
                                    })
                                }
                            } else {
                                PropertyHStackView(title: "[\(subIndex)]", detail: "\(subObject)", onTap: {
                                    onTapElement(subObject)
                                })
                            }
                        }
                    } label: {
                        PropertyHStackView(title: label, detail: "\(Mirror(reflecting: child.value).subjectType)", onTap: {
                            onTapElement(child.value)
                        })
                    }
                } else {
                    PropertyHStackView(title: label, detail: "\(child.value)", onTap: {
                        onTapElement(child.value)
                    })
                }
            } else {
                PropertyHStackView(title: "[\(index)]", detail: "\(child.value)", onTap: {
                    onTapElement(child.value)
                })
            }
        })
    }
}

struct PropertyHStackView: View {
    let title: String
    let detail: String
    var onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top) {
                Text(title)
                    .foregroundStyle(.black)
                Spacer()
                Text(detail)
            }
        }
        .buttonStyle(.borderless)
    }
}
```

このように、`PropertyHStackView` に `onTap` クロージャを渡し、それを `Button` の `action` に設定することで、`HStack` 全体をタップ可能にし、タップされたときに `onTapElement` を呼び出すことができます。

---
