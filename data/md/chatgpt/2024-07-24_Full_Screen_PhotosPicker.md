# Full Screen PhotosPicker

Date: 2024-07-24

---

## 👤 User
*2024-07-24 13:26:03*

SwiftUI PhotosPicker をfull screen cover で表示する方法

---

## 🤖 Assistant
*2024-07-24 13:26:15*

`PhotosPicker` を SwiftUI の full screen cover で表示するには、`PhotosPicker` をラップするカスタムビューを作成し、それを `fullScreenCover` モディファイアで表示する方法があります。以下にその手順を示します。

1. `PhotosPickerView` というカスタムビューを作成します。
2. `fullScreenCover` を使用して、このカスタムビューを表示します。

以下はその実装例です。

```swift
import SwiftUI
import PhotosUI

// カスタムビューの作成
struct PhotosPickerView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedItem: PhotosPickerItem? = nil
    @State private var image: UIImage? = nil

    var body: some View {
        NavigationView {
            VStack {
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    Text("No image selected")
                }
                
                PhotosPicker(selection: $selectedItem, matching: .images) {
                    Text("Select a photo")
                }
                .onChange(of: selectedItem) { newItem in
                    Task {
                        if let data = try? await newItem?.loadTransferable(type: Data.self),
                           let uiImage = UIImage(data: data) {
                            image = uiImage
                        }
                    }
                }
            }
            .navigationTitle("Photos Picker")
            .navigationBarItems(trailing: Button("Done") {
                dismiss()
            })
        }
    }
}

// メインビュー
struct ContentView: View {
    @State private var isPickerPresented = false

    var body: some View {
        Button("Show Photos Picker") {
            isPickerPresented.toggle()
        }
        .fullScreenCover(isPresented: $isPickerPresented) {
            PhotosPickerView()
        }
    }
}

@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードでは、`PhotosPickerView` が `PhotosPicker` をラップし、`fullScreenCover` で表示されるようにしています。ユーザーが「Done」ボタンをタップすると、フルスクリーンのカバーが閉じます。

---
