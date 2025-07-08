# Async Image Download Preview

Date: 2024-07-25

---

## 👤 User
*2024-07-25 11:35:36*

await が入るように守成してほしい

@available(iOS 18.0, *)
#Preview {
    @Previewable @State var selectedImage: UIImage? = try? await URLSessionDownloadStaticDriver.imageDownload(url: .placeholderImageUrl)
    
    PhotoCropView(selectedImage: $selectedImage)
}

---

## 🤖 Assistant
*2024-07-25 11:35:41*

`await` を使用するために、非同期関数内で呼び出す必要があります。プレビューのコードには非同期関数を直接使用することはできないため、ラップする必要があります。以下のようにコードを変更できます。

```swift
@available(iOS 18.0, *)
#Preview {
    struct PhotoCropViewPreview: View {
        @State private var selectedImage: UIImage? = nil

        var body: some View {
            PhotoCropView(selectedImage: $selectedImage)
                .task {
                    selectedImage = try? await URLSessionDownloadStaticDriver.imageDownload(url: .placeholderImageUrl)
                }
        }
    }
    
    return PhotoCropViewPreview()
}
```

このようにすることで、`task` 修飾子を使用して非同期で画像をダウンロードし、`selectedImage` に設定できます。

---
