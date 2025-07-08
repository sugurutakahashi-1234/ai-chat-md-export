# Troubleshooting NavigationLink Behavior in SwiftUI

日付: 2025-04-13

---

## 👤 ユーザー
*2025/04/13 19:45:31*

ナビゲーション遷移がおかしい。ItemDetailViewからNavigationLinkで遷移させてもPush遷移しないんだ。

**import** SwiftUI
**import** SwiftData

**struct** ContentView: View {
    @Environment(\.modelContext) **private** **var** modelContext
    @Query **private** **var** items: [Item]
    @State **private** **var** newItemText = ""
    @State **private** **var** showingAddSheet = **false**

    **var** body: **some** View {
        NavigationSplitView {
            
                List {
                    ForEach(items) { item **in**
                        NavigationLink {
                            
                            ItemDetailView(item: item)
                            
                        } label: {
                            VStack(alignment: .leading) {
                                Text(item.text)
                                    .lineLimit(1)
                                Text(item.timestamp, format: .dateTime.day().month().hour().minute())
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .onDelete {
                        deleteItems(offsets: $0)
                    }
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        EditButton()
                    }
                    ToolbarItem {
                        Button {
                            showingAddSheet = **true**
                        } label: {
                            Label("Add Item", systemImage: "plus")
                        }
                    }
                }
                .sheet(isPresented: $showingAddSheet) {
                    addItemView
                }
            
        } detail: {
            Text("Select an item")
        }
    }

    **private** **var** addItemView: **some** View {
        NavigationStack {
            Form {
                TextField("Enter text", text: $newItemText)
            }
            .navigationTitle("Add New Item")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        newItemText = ""
                        showingAddSheet = **false**
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        addItem(text: newItemText)
                        newItemText = ""
                        showingAddSheet = **false**
                    }
                }
            }
        }
        .presentationDetents([.medium])
    }

    **private** **func** addItem(text: String) {
        withAnimation {
            **let** newItem = Item(text: text, timestamp: Date())
            modelContext.insert(newItem)
        }
    }

    **private** **func** deleteItems(offsets: IndexSet) {
        withAnimation {
            **for** index **in** offsets {
                modelContext.delete(items[index])
            }
        }
    }
}

**struct** ItemDetailView: View {
    @Bindable **var** item: Item
    
    **var** body: **some** View {
            List {
                Section(header: Text("Item Details")) {
                    NavigationLink {
                            TextField("Item Text", text: $item.text)
                                .textFieldStyle(.roundedBorder)
                                .padding()
                                .navigationTitle("Edit Item")
                    } label: {
                        Text(item.text)
                            .lineLimit(1)
                    }
                    
                    Text("Created: \(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Item Details")
        }
    
}

#Preview {
    ContentView()
        .modelContainer(for: Item.**self**, inMemory: **true**)
}

---

## 🤖 アシスタント
*2025/04/13 19:45:43*

こんにちは！ナビゲーション遷移の問題について理解しました。ItemDetailViewからNavigationLinkでPush遷移しない問題ですね。

問題の原因は、NavigationSplitViewとItemDetailView内のNavigationLinkの組み合わせにあります。NavigationSplitViewは独自のナビゲーション管理を行っており、ItemDetailViewが直接NavigationStackの中にないため、正しくPush遷移が行われません。

これを修正するには、ItemDetailView内でNavigationStackを使用するか、NavigationLinkの代わりに別の方法で編集画面を表示する必要があります。

以下に解決策を提案します：

```swift
struct ItemDetailView: View {
    @Bindable var item: Item
    @State private var isEditing = false
    
    var body: some View {
        List {
            Section(header: Text("Item Details")) {
                Button {
                    isEditing = true
                } label: {
                    HStack {
                        Text(item.text)
                            .lineLimit(1)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.secondary)
                    }
                }
                
                Text("Created: \(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .navigationTitle("Item Details")
        .sheet(isPresented: $isEditing) {
            NavigationStack {
                VStack {
                    TextField("Item Text", text: $item.text)
                        .textFieldStyle(.roundedBorder)
                        .padding()
                }
                .navigationTitle("Edit Item")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            isEditing = false
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Save") {
                            isEditing = false
                        }
                    }
                }
            }
        }
    }
}
```

この修正では、NavigationLinkの代わりにButtonを使用し、シートとして編集画面を表示するようにしています。これにより、NavigationSplitViewの構造を維持しながら、編集機能を実装できます。

もう一つの方法としては、NavigationSplitViewの代わりにNavigationStackを使用してアプリ全体のナビゲーション構造を変更することもできますが、それはデザインの大きな変更になります。

この問題はSwiftUIのナビゲーション関連の一般的な課題の一つです。iOS 16以降のSwiftUIのナビゲーションシステムでは、NavigationSplitViewとNavigationStackの組み合わせにはこのような制限があります。

---

## 👤 ユーザー
*2025/04/13 19:47:14*

NavigationSplitView の detail に NavigationStack にしてそこで遷移させた方がいいのか？

---

## 🤖 アシスタント
*2025/04/13 19:47:26*

はい、その方法が効果的な解決策になります。NavigationSplitViewのdetail部分にNavigationStackを配置することで、detail領域内でのナビゲーション遷移を正しく管理できるようになります。

以下のようにコードを修正するとよいでしょう：

```swift
struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var items: [Item]
    @State private var newItemText = ""
    @State private var showingAddSheet = false
    @State private var selectedItem: Item?

    var body: some View {
        NavigationSplitView {
            List(items, selection: $selectedItem) { item in
                Text(item.text)
                    .lineLimit(1)
                Text(item.timestamp, format: .dateTime.day().month().hour().minute())
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .onDelete {
                deleteItems(offsets: $0)
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    EditButton()
                }
                ToolbarItem {
                    Button {
                        showingAddSheet = true
                    } label: {
                        Label("Add Item", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                addItemView
            }
            .navigationTitle("Items")
        } detail: {
            NavigationStack {
                if let selectedItem = selectedItem {
                    ItemDetailView(item: selectedItem)
                } else {
                    Text("Select an item")
                }
            }
        }
    }

    // 他のメソッドは同じ
}
```

そして、ItemDetailViewでは通常のNavigationLinkを使用して遷移させることができます：

```swift
struct ItemDetailView: View {
    @Bindable var item: Item
    
    var body: some View {
        List {
            Section(header: Text("Item Details")) {
                NavigationLink {
                    VStack {
                        TextField("Item Text", text: $item.text)
                            .textFieldStyle(.roundedBorder)
                            .padding()
                    }
                    .navigationTitle("Edit Item")
                } label: {
                    Text(item.text)
                        .lineLimit(1)
                }
                
                Text("Created: \(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .navigationTitle("Item Details")
    }
}
```

この方法では：

1. NavigationSplitViewのmaster部分でアイテムを選択
2. 選択されたアイテムはdetail部分のNavigationStackに表示
3. detail部分内のNavigationStackで正しくPush遷移が機能する

これによりSplitViewの構造を維持しながら、detail領域内でのナビゲーション遷移も適切に動作するようになります。

---
