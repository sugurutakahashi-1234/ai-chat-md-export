# SwiftUI Photo Picker Views

日付: 2024-07-24

---

## 👤 ユーザー
*2024/7/24 11:04:14*

SwiftUIでカメラロール or その場写真のViewを出すViewの実装

---

## 🤖 アシスタント
*2024/7/24 11:04:44*

SwiftUIでカメラロール（フォトライブラリ）やその場で写真を撮る機能を実装するには、`UIImagePickerController`を使って実装します。SwiftUIとUIKitの連携が必要となりますので、`UIViewControllerRepresentable`を使います。

以下は、カメラロールとカメラの両方をサポートする例です：

1. **`ImagePicker`の実装**:
```swift
import SwiftUI
import UIKit

struct ImagePicker: UIViewControllerRepresentable {
    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: ImagePicker

        init(parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let uiImage = info[.originalImage] as? UIImage {
                parent.image = uiImage
            }

            parent.presentationMode.wrappedValue.dismiss()
        }
    }

    @Environment(\.presentationMode) var presentationMode
    @Binding var image: UIImage?
    var sourceType: UIImagePickerController.SourceType

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = sourceType
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
}
```

2. **使い方の例**:
```swift
import SwiftUI

struct ContentView: View {
    @State private var image: UIImage? = nil
    @State private var isImagePickerPresented = false
    @State private var sourceType: UIImagePickerController.SourceType = .photoLibrary

    var body: some View {
        VStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 300, height: 300)
            } else {
                Text("No Image Selected")
                    .font(.headline)
            }

            HStack {
                Button(action: {
                    sourceType = .photoLibrary
                    isImagePickerPresented = true
                }) {
                    Text("Select from Library")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }

                Button(action: {
                    sourceType = .camera
                    isImagePickerPresented = true
                }) {
                    Text("Take a Photo")
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            .sheet(isPresented: $isImagePickerPresented) {
                ImagePicker(image: $image, sourceType: sourceType)
            }
        }
        .padding()
    }
}
```

### 解説:
1. **ImagePicker**:
    - `UIViewControllerRepresentable`プロトコルに準拠することで、SwiftUIにUIKitの`UIImagePickerController`を統合します。
    - `makeCoordinator`メソッドで、コーディネーターを生成します。このコーディネーターは`UIImagePickerControllerDelegate`として動作し、画像が選択されたときの処理を行います。

2. **ContentView**:
    - `@State`プロパティを使って、選択された画像とシートの表示状態を管理します。
    - ボタンを使って、フォトライブラリから画像を選択するか、その場で写真を撮るかを選択できます。
    - `.sheet`モディファイアを使って、`ImagePicker`を表示します。

この実装は、iOSのカメラおよびフォトライブラリを使用するため、実機でのテストが必要です。また、アプリが写真ライブラリやカメラへのアクセス権を必要とするため、Info.plistに適切な権限を追加する必要があります。

```xml
<key>NSCameraUsageDescription</key>
<string>カメラを使用するための説明文</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>フォトライブラリを使用するための説明文</string>
```

---
