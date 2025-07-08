# Crop Screen Option Handling

日付: 2024-08-20

---

## 👤 ユーザー
*2024/08/20 17:46:48*

一番最初に来たselectedImageが更新した場合はenablePhotoCropがtrueでもcrop画面を表示しないようなオプションを引数でbool値でつけて欲しい

APIで登録された画像をここに更新するとcrop画面が表示さちゃうんだ。

struct PhotoRegisterButton&lt;Content: View&gt;: View {
    @Binding var selectedImage: UIImage?
    let enablePhotoCrop: Bool
    let label: () -&gt; Content

    @State private var selectedPhotosPickerItem: PhotosPickerItem? = nil
    @State private var showCameraShoot: Bool = false
    @State private var showPhotoPicker: Bool = false
    @State private var showPhotoCrop: Bool = false

    var body: some View {
        Menu {
            Button {
                showPhotoPicker = true
            } label: {
                Label {
                    Text("写真を選択する")
                } icon: {
                    SFSymbols.photoOnRectangle.image
                }
            }

            Button {
                showCameraShoot = true
            } label: {
                Label {
                    Text("カメラで撮影する")
                } icon: {
                    SFSymbols.camera.image
                }
            }
        } label: {
            label()
        }
        .fullScreenCover(isPresented: $showCameraShoot) {
            SimpleCameraShootView(image: $selectedImage)
                .ignoresSafeArea()
        }
        .fullScreenCover(isPresented: $showPhotoCrop) {
            ImageCropView(image: $selectedImage)
                .navigationStacked()
        }
        .photosPicker(isPresented: $showPhotoPicker, selection: $selectedPhotosPickerItem, matching: .images)
        .onChange(of: selectedPhotosPickerItem) { newItem in
            if let newItem {
                Task {
                    if let data = try? await newItem.loadTransferable(type: Data.self), let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                    }
                }
            }
        }
        .onChange(of: selectedImage) { image in
            if enablePhotoCrop {
                showPhotoCrop = image != nil
            } else {
                showPhotoCrop = false
            }
        }
        .onChange(of: showPhotoCrop) { showPhotoCrop in
            if showPhotoCrop {
                selectedPhotosPickerItem = nil
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/08/20 17:47:16*

User wants to add an option to the `PhotoRegisterButton` struct to prevent the crop screen from appearing when the `selectedImage` is updated, even if `enablePhotoCrop` is true. This option should be passed as a Boolean argument.

---

## 🔧 ツール
*2024/08/20 17:47:16*

Model set context updated.

---

## 🤖 アシスタント
*2024/08/20 17:47:16*

Here’s how you can modify the `PhotoRegisterButton` struct to include an option that prevents the crop screen from appearing when the `selectedImage` is updated, even if `enablePhotoCrop` is true.

```swift
struct PhotoRegisterButton<Content: View>: View {
    @Binding var selectedImage: UIImage?
    let enablePhotoCrop: Bool
    let showCropOnUpdate: Bool
    let label: () -> Content

    @State private var selectedPhotosPickerItem: PhotosPickerItem? = nil
    @State private var showCameraShoot: Bool = false
    @State private var showPhotoPicker: Bool = false
    @State private var showPhotoCrop: Bool = false

    var body: some View {
        Menu {
            Button {
                showPhotoPicker = true
            } label: {
                Label {
                    Text("写真を選択する")
                } icon: {
                    SFSymbols.photoOnRectangle.image
                }
            }

            Button {
                showCameraShoot = true
            } label: {
                Label {
                    Text("カメラで撮影する")
                } icon: {
                    SFSymbols.camera.image
                }
            }
        } label: {
            label()
        }
        .fullScreenCover(isPresented: $showCameraShoot) {
            SimpleCameraShootView(image: $selectedImage)
                .ignoresSafeArea()
        }
        .fullScreenCover(isPresented: $showPhotoCrop) {
            ImageCropView(image: $selectedImage)
                .navigationStacked()
        }
        .photosPicker(isPresented: $showPhotoPicker, selection: $selectedPhotosPickerItem, matching: .images)
        .onChange(of: selectedPhotosPickerItem) { newItem in
            if let newItem {
                Task {
                    if let data = try? await newItem.loadTransferable(type: Data.self), let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                    }
                }
            }
        }
        .onChange(of: selectedImage) { image in
            if enablePhotoCrop && (showCropOnUpdate || selectedPhotosPickerItem != nil) {
                showPhotoCrop = image != nil
            } else {
                showPhotoCrop = false
            }
        }
        .onChange(of: showPhotoCrop) { showPhotoCrop in
            if showPhotoCrop {
                selectedPhotosPickerItem = nil
            }
        }
    }
}
```

### Explanation:
- **showCropOnUpdate**: This new Boolean argument controls whether the crop screen should be displayed when `selectedImage` is updated, even if `enablePhotoCrop` is true.
- **onChange(of: selectedImage)**: The crop screen is only shown if `enablePhotoCrop` is true and either `showCropOnUpdate` is true or the image was selected via the photo picker.

This allows you to prevent the crop screen from showing when updating the image from an API, even if `enablePhotoCrop` is enabled.

---

## 👤 ユーザー
*2024/08/20 17:49:13*

日本語で

---

## 🤖 アシスタント
*2024/08/20 17:49:41*

こちらのコードを修正して、`selectedImage`が更新された際に、`enablePhotoCrop`がtrueでもcrop画面を表示しないオプションを追加しました。

```swift
struct PhotoRegisterButton<Content: View>: View {
    @Binding var selectedImage: UIImage?
    let enablePhotoCrop: Bool
    let showCropOnUpdate: Bool // 新しいオプション
    let label: () -> Content

    @State private var selectedPhotosPickerItem: PhotosPickerItem? = nil
    @State private var showCameraShoot: Bool = false
    @State private var showPhotoPicker: Bool = false
    @State private var showPhotoCrop: Bool = false

    var body: some View {
        Menu {
            Button {
                showPhotoPicker = true
            } label: {
                Label {
                    Text("写真を選択する")
                } icon: {
                    SFSymbols.photoOnRectangle.image
                }
            }

            Button {
                showCameraShoot = true
            } label: {
                Label {
                    Text("カメラで撮影する")
                } icon: {
                    SFSymbols.camera.image
                }
            }
        } label: {
            label()
        }
        .fullScreenCover(isPresented: $showCameraShoot) {
            SimpleCameraShootView(image: $selectedImage)
                .ignoresSafeArea()
        }
        .fullScreenCover(isPresented: $showPhotoCrop) {
            ImageCropView(image: $selectedImage)
                .navigationStacked()
        }
        .photosPicker(isPresented: $showPhotoPicker, selection: $selectedPhotosPickerItem, matching: .images)
        .onChange(of: selectedPhotosPickerItem) { newItem in
            if let newItem {
                Task {
                    if let data = try? await newItem.loadTransferable(type: Data.self), let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                    }
                }
            }
        }
        .onChange(of: selectedImage) { image in
            if enablePhotoCrop && (showCropOnUpdate || selectedPhotosPickerItem != nil) {
                showPhotoCrop = image != nil
            } else {
                showPhotoCrop = false
            }
        }
        .onChange(of: showPhotoCrop) { showPhotoCrop in
            if showPhotoCrop {
                selectedPhotosPickerItem = nil
            }
        }
    }
}
```

### 説明:
- **showCropOnUpdate**: 新しいBoolean型の引数です。この引数は、`selectedImage`が更新されたときに、`enablePhotoCrop`がtrueであってもcrop画面を表示するかどうかを制御します。
- **onChange(of: selectedImage)**: crop画面は、`enablePhotoCrop`がtrueで、`showCropOnUpdate`がtrueまたは写真ピッカーから選択された画像がある場合にのみ表示されます。

これにより、APIから画像を更新した際に、`enablePhotoCrop`がtrueでもcrop画面が表示されないように制御できます。

---
