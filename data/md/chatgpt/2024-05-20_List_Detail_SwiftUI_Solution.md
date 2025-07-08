# List Detail SwiftUI Solution

日付: 2024-05-20

---

## 👤 ユーザー
*2024/05/20 22:53:38*

iOSアプリでSwiftでリストを表示しながら選択した値の詳細を下に表示する方法を検討してほしい。後ろがタッチ可能なsheetを半分出すとかが理想です。SwiftUIで。

---

## 🤖 アシスタント
*2024/05/20 22:54:20*

SwiftUIを使って、リストを表示し、選択した値の詳細を下に表示する方法を実装するには、`List`と`Sheet`を組み合わせることが有効です。特に、下部から表示されるシートを半分表示するようにすることで、直感的なUIを実現できます。

以下にその実装例を示します。

### 実装手順

1. **データモデルの定義**
2. **リストビューの作成**
3. **シートビューの作成**
4. **選択状態の管理**

### 1. データモデルの定義

まず、表示するデータのモデルを定義します。

```swift
struct Item: Identifiable {
    let id = UUID()
    let name: String
    let details: String
}
```

### 2. リストビューの作成

次に、リストビューを作成し、アイテムを表示します。

```swift
struct ContentView: View {
    @State private var items = [
        Item(name: "Item 1", details: "Details for Item 1"),
        Item(name: "Item 2", details: "Details for Item 2"),
        Item(name: "Item 3", details: "Details for Item 3")
    ]
    @State private var selectedItem: Item?
    @State private var showSheet = false

    var body: some View {
        NavigationView {
            List(items) { item in
                Text(item.name)
                    .onTapGesture {
                        selectedItem = item
                        showSheet = true
                    }
            }
            .navigationTitle("Items")
        }
        .sheet(isPresented: $showSheet) {
            if let selectedItem = selectedItem {
                DetailView(item: selectedItem)
            }
        }
    }
}
```

### 3. シートビューの作成

シートで表示する詳細ビューを作成します。

```swift
struct DetailView: View {
    let item: Item

    var body: some View {
        VStack {
            Text(item.name)
                .font(.largeTitle)
                .padding()

            Text(item.details)
                .padding()

            Spacer()
        }
        .presentationDetents([.medium, .large]) // 半分表示と全画面表示を指定
    }
}
```

### 4. 選択状態の管理

選択されたアイテムの詳細をシートで表示するために、`selectedItem`と`showSheet`の状態を管理します。

### 完成コード

最終的なコードは以下のようになります。

```swift
import SwiftUI

struct Item: Identifiable {
    let id = UUID()
    let name: String
    let details: String
}

struct ContentView: View {
    @State private var items = [
        Item(name: "Item 1", details: "Details for Item 1"),
        Item(name: "Item 2", details: "Details for Item 2"),
        Item(name: "Item 3", details: "Details for Item 3")
    ]
    @State private var selectedItem: Item?
    @State private var showSheet = false

    var body: some View {
        NavigationView {
            List(items) { item in
                Text(item.name)
                    .onTapGesture {
                        selectedItem = item
                        showSheet = true
                    }
            }
            .navigationTitle("Items")
        }
        .sheet(isPresented: $showSheet) {
            if let selectedItem = selectedItem {
                DetailView(item: selectedItem)
            }
        }
    }
}

struct DetailView: View {
    let item: Item

    var body: some View {
        VStack {
            Text(item.name)
                .font(.largeTitle)
                .padding()

            Text(item.details)
                .padding()

            Spacer()
        }
        .presentationDetents([.medium, .large]) // 半分表示と全画面表示を指定
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、リスト内のアイテムをタップすると、選択したアイテムの詳細を下から半分表示されるシートで表示します。シートのサイズは`.medium`（半分表示）と`.large`（全画面表示）を指定しています。

---

## 👤 ユーザー
*2024/05/20 22:55:09*

sheet の後ろをジェスチャー可能にするモディファイアは存在しない？

---

## 🤖 アシスタント
*2024/05/20 22:55:47*

SwiftUIでは、シート表示中にバックグラウンドのビューに対してジェスチャーを許可するための直接的なモディファイアは存在しません。しかし、代替としてカスタムコンポーネントを作成することで、この機能を実現できます。例えば、`GeometryReader`と`DragGesture`を組み合わせて、シート風のビューを実装し、その背景部分でもジェスチャーを受け取るようにできます。

以下に、シート風のカスタムビューを作成し、背景部分もタッチ可能にする方法を示します。

### 実装例

#### 1. カスタムシートビューの作成

```swift
import SwiftUI

struct CustomSheetView<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content

    init(isPresented: Binding<Bool>, @ViewBuilder content: () -> Content) {
        self._isPresented = isPresented
        self.content = content()
    }

    var body: some View {
        GeometryReader { geometry in
            if isPresented {
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        isPresented = false
                    }
                
                VStack {
                    Spacer()
                    
                    VStack {
                        self.content
                            .padding()
                            .background(Color.white)
                            .cornerRadius(16)
                            .shadow(radius: 10)
                    }
                    .frame(width: geometry.size.width, height: geometry.size.height / 2)
                    .transition(.move(edge: .bottom))
                }
                .animation(.easeInOut)
            }
        }
    }
}
```

#### 2. メインビューの作成

```swift
struct ContentView: View {
    @State private var items = [
        Item(name: "Item 1", details: "Details for Item 1"),
        Item(name: "Item 2", details: "Details for Item 2"),
        Item(name: "Item 3", details: "Details for Item 3")
    ]
    @State private var selectedItem: Item?
    @State private var showSheet = false

    var body: some View {
        ZStack {
            NavigationView {
                List(items) { item in
                    Text(item.name)
                        .onTapGesture {
                            selectedItem = item
                            showSheet = true
                        }
                }
                .navigationTitle("Items")
            }

            CustomSheetView(isPresented: $showSheet) {
                if let selectedItem = selectedItem {
                    DetailView(item: selectedItem)
                }
            }
        }
    }
}

struct DetailView: View {
    let item: Item

    var body: some View {
        VStack {
            Text(item.name)
                .font(.largeTitle)
                .padding()

            Text(item.details)
                .padding()

            Spacer()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **CustomSheetView**: このカスタムビューは、シートのような外観を持ちつつ、背景をタッチ可能にします。`isPresented`が`true`の場合、シートが表示され、背景に半透明の黒いレイヤーが表示されます。このレイヤーはタップするとシートが閉じるようになっています。

2. **ContentView**: `CustomSheetView`を使って、選択したアイテムの詳細を表示します。`selectedItem`が設定されると、シートが表示されます。

これにより、シートの背景がタッチ可能になり、ユーザーはシート外の部分をタップしてシートを閉じることができます。

---
