# Crop UIImage with TOCropViewController

日付: 2024-08-16

---

## 👤 ユーザー
*2024/8/16 13:46:42*

TOCropViewController を使ってSwiftUIでUIImageを円に切り抜く処理を実装して欲しい

---

## 🤖 アシスタント
*2024/8/16 13:46:58*

User wants to implement a process using TOCropViewController in SwiftUI to crop a UIImage into a circle.

---

## 🔧 ツール
*2024/8/16 13:46:58*

Model set context updated.

---

## 🤖 アシスタント
*2024/8/16 13:46:58*

To implement cropping a UIImage into a circle using TOCropViewController in SwiftUI, you can follow these steps:

### 1. **Install TOCropViewController:**
   Make sure you've added TOCropViewController to your project. You can do this via CocoaPods, Carthage, or Swift Package Manager.

   For Swift Package Manager, add the following to your `Package.swift`:
   ```swift
   .package(url: "https://github.com/TimOliver/TOCropViewController.git", from: "2.6.0")
   ```

### 2. **Create a UIViewControllerRepresentable:**
   Create a SwiftUI wrapper for TOCropViewController using `UIViewControllerRepresentable`.

   ```swift
   import SwiftUI
   import TOCropViewController

   struct CropViewController: UIViewControllerRepresentable {
       @Binding var image: UIImage
       @Environment(\.presentationMode) private var presentationMode
       
       func makeUIViewController(context: Context) -> TOCropViewController {
           let cropViewController = TOCropViewController(image: image)
           cropViewController.delegate = context.coordinator
           cropViewController.aspectRatioPreset = .presetSquare
           cropViewController.aspectRatioLockEnabled = true
           cropViewController.resetAspectRatioEnabled = false
           cropViewController.aspectRatioPickerButtonHidden = true
           cropViewController.rotateButtonsHidden = true
           cropViewController.cropView.cropBoxResizeEnabled = false
           return cropViewController
       }
       
       func updateUIViewController(_ uiViewController: TOCropViewController, context: Context) {}
       
       func makeCoordinator() -> Coordinator {
           Coordinator(self)
       }
       
       class Coordinator: NSObject, TOCropViewControllerDelegate {
           var parent: CropViewController
           
           init(_ parent: CropViewController) {
               self.parent = parent
           }
           
           func cropViewController(_ cropViewController: TOCropViewController, didCropToCircularImage image: UIImage, withCropRect cropRect: CGRect, angle: Int) {
               parent.image = image
               parent.presentationMode.wrappedValue.dismiss()
           }
           
           func cropViewController(_ cropViewController: TOCropViewController, didFinishCancelled cancelled: Bool) {
               parent.presentationMode.wrappedValue.dismiss()
           }
       }
   }
   ```

### 3. **Use the CropViewController in Your SwiftUI View:**

   ```swift
   struct ContentView: View {
       @State private var image: UIImage? = UIImage(named: "example") // Replace with your image
       @State private var isShowingCropView = false
       
       var body: some View {
           VStack {
               if let image = image {
                   Image(uiImage: image)
                       .resizable()
                       .aspectRatio(contentMode: .fit)
                       .frame(width: 200, height: 200)
                       .clipShape(Circle())
               }
               Button("Crop Image") {
                   isShowingCropView = true
               }
               .sheet(isPresented: $isShowingCropView) {
                   if let image = image {
                       CropViewController(image: $image)
                   }
               }
           }
       }
   }
   ```

### 4. **Handle Circular Cropping:**

   TOCropViewController has a built-in feature for circular cropping. The code above locks the aspect ratio to a square and disables aspect ratio selection, making it easier to crop a circular image. The `didCropToCircularImage` delegate method is used to handle the cropped image.

This setup will allow you to present the TOCropViewController within your SwiftUI view, crop the image into a circle, and display the result back in your SwiftUI interface.

---

## 👤 ユーザー
*2024/8/16 13:47:21*

CropViewController のオプションについて、日本語でコメントをいれてほしい

---

## 🤖 アシスタント
*2024/8/16 13:47:40*

以下は、`CropViewController` のオプションについて日本語でコメントを追加したコードです。

```swift
import SwiftUI
import TOCropViewController

struct CropViewController: UIViewControllerRepresentable {
    @Binding var image: UIImage
    @Environment(\.presentationMode) private var presentationMode
    
    func makeUIViewController(context: Context) -> TOCropViewController {
        let cropViewController = TOCropViewController(image: image)
        cropViewController.delegate = context.coordinator
        
        // アスペクト比を正方形に固定
        cropViewController.aspectRatioPreset = .presetSquare
        
        // アスペクト比のロックを有効化
        cropViewController.aspectRatioLockEnabled = true
        
        // アスペクト比のリセットを無効化
        cropViewController.resetAspectRatioEnabled = false
        
        // アスペクト比選択ボタンを非表示
        cropViewController.aspectRatioPickerButtonHidden = true
        
        // 回転ボタンを非表示
        cropViewController.rotateButtonsHidden = true
        
        // 切り取りボックスのリサイズを無効化
        cropViewController.cropView.cropBoxResizeEnabled = false
        
        return cropViewController
    }
    
    func updateUIViewController(_ uiViewController: TOCropViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, TOCropViewControllerDelegate {
        var parent: CropViewController
        
        init(_ parent: CropViewController) {
            self.parent = parent
        }
        
        // 画像を円形に切り抜いた後の処理
        func cropViewController(_ cropViewController: TOCropViewController, didCropToCircularImage image: UIImage, withCropRect cropRect: CGRect, angle: Int) {
            parent.image = image
            parent.presentationMode.wrappedValue.dismiss() // モーダルを閉じる
        }
        
        // 切り抜きがキャンセルされた場合の処理
        func cropViewController(_ cropViewController: TOCropViewController, didFinishCancelled cancelled: Bool) {
            parent.presentationMode.wrappedValue.dismiss() // モーダルを閉じる
        }
    }
}
```

### コメントの内容について
- **アスペクト比を正方形に固定:** `aspectRatioPreset` を `.presetSquare` に設定することで、切り抜き領域が正方形に固定されます。
- **アスペクト比のロックを有効化:** `aspectRatioLockEnabled` を `true` に設定して、ユーザーがアスペクト比を変更できないようにします。
- **アスペクト比のリセットを無効化:** `resetAspectRatioEnabled` を `false` に設定し、ユーザーがアスペクト比をリセットできないようにします。
- **アスペクト比選択ボタンを非表示:** `aspectRatioPickerButtonHidden` を `true` に設定して、アスペクト比を選択するためのボタンを非表示にします。
- **回転ボタンを非表示:** `rotateButtonsHidden` を `true` に設定して、回転ボタンを非表示にします。
- **切り取りボックスのリサイズを無効化:** `cropBoxResizeEnabled` を `false` に設定して、ユーザーが切り取りボックスのサイズを変更できないようにします。

このコメントにより、各オプションの意味がより理解しやすくなるかと思います。

---

## 👤 ユーザー
*2024/8/16 13:48:11*

@Environment(\\.presentationMode) private var presentationMode ではなくて、dissmisを使って欲しい

---

## 🤖 アシスタント
*2024/8/16 13:48:27*

User prefers to use `dismiss` instead of `@Environment(\\.presentationMode) private var presentationMode`.

---

## 🔧 ツール
*2024/8/16 13:48:27*

Model set context updated.

---

## 🤖 アシスタント
*2024/8/16 13:48:27*

`@Environment(\.presentationMode)` を `dismiss` に置き換えたコードを以下に示します。

```swift
import SwiftUI
import TOCropViewController

struct CropViewController: UIViewControllerRepresentable {
    @Binding var image: UIImage
    @Environment(\.dismiss) private var dismiss
    
    func makeUIViewController(context: Context) -> TOCropViewController {
        let cropViewController = TOCropViewController(image: image)
        cropViewController.delegate = context.coordinator
        
        // アスペクト比を正方形に固定
        cropViewController.aspectRatioPreset = .presetSquare
        
        // アスペクト比のロックを有効化
        cropViewController.aspectRatioLockEnabled = true
        
        // アスペクト比のリセットを無効化
        cropViewController.resetAspectRatioEnabled = false
        
        // アスペクト比選択ボタンを非表示
        cropViewController.aspectRatioPickerButtonHidden = true
        
        // 回転ボタンを非表示
        cropViewController.rotateButtonsHidden = true
        
        // 切り取りボックスのリサイズを無効化
        cropViewController.cropView.cropBoxResizeEnabled = false
        
        return cropViewController
    }
    
    func updateUIViewController(_ uiViewController: TOCropViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, TOCropViewControllerDelegate {
        var parent: CropViewController
        
        init(_ parent: CropViewController) {
            self.parent = parent
        }
        
        // 画像を円形に切り抜いた後の処理
        func cropViewController(_ cropViewController: TOCropViewController, didCropToCircularImage image: UIImage, withCropRect cropRect: CGRect, angle: Int) {
            parent.image = image
            parent.dismiss() // モーダルを閉じる
        }
        
        // 切り抜きがキャンセルされた場合の処理
        func cropViewController(_ cropViewController: TOCropViewController, didFinishCancelled cancelled: Bool) {
            parent.dismiss() // モーダルを閉じる
        }
    }
}
```

### 修正点
- `@Environment(\.presentationMode)` の代わりに、`@Environment(\.dismiss)` を使用して、`dismiss()` メソッドでモーダルを閉じる処理を行うようにしました。

この変更により、`dismiss` を用いてより簡潔にビューの閉じる処理を実装できます。

---

## 👤 ユーザー
*2024/8/16 13:49:34*

circle できりぬくような感じになるのかな？

---

## 🤖 アシスタント
*2024/8/16 13:49:44*

現状のコードでは、`TOCropViewController` のデフォルト機能を使って円形に切り抜く設定がされています。この設定により、正方形に固定されたアスペクト比の中でユーザーが画像を切り抜き、その後にその画像を円形にトリミングします。

ただし、切り抜き後の画像は自動的に円形に変換されるわけではありません。そこで、切り抜き後の正方形の画像を円形にトリミングする処理を追加する必要があります。

以下に、切り抜き後の画像を円形に変換するコードを追加します：

### 1. **UIImage Extensionを追加する**

まず、`UIImage` に円形に切り抜くためのメソッドを追加します。

```swift
extension UIImage {
    func circularImage() -> UIImage? {
        let squareImage = self

        let imageView = UIImageView(image: squareImage)
        imageView.layer.cornerRadius = min(squareImage.size.width, squareImage.size.height) / 2
        imageView.layer.masksToBounds = true

        UIGraphicsBeginImageContextWithOptions(imageView.bounds.size, false, squareImage.scale)
        guard let context = UIGraphicsGetCurrentContext() else { return nil }
        imageView.layer.render(in: context)
        let circularImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        return circularImage
    }
}
```

### 2. **Coordinatorでの処理を更新する**

次に、`Coordinator` の中で、このメソッドを使って画像を円形にトリミングします。

```swift
class Coordinator: NSObject, TOCropViewControllerDelegate {
    var parent: CropViewController
    
    init(_ parent: CropViewController) {
        self.parent = parent
    }
    
    // 画像を円形に切り抜いた後の処理
    func cropViewController(_ cropViewController: TOCropViewController

---
