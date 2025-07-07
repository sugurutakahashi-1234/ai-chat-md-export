# Save Image to Camera

日付: 2024-06-17

---

## 👤 ユーザー
*2024/6/17 19:39:00*

SwiftUIでカメラロールに画像を保存させる方法

---

## 🤖 アシスタント
*2024/6/17 19:39:45*

SwiftUIで画像をカメラロールに保存するには、UIKitの`UIImageWriteToSavedPhotosAlbum`関数を使用する必要があります。以下にその実装例を示します。

### 手順

1. **インポート**：`Photos`フレームワークをインポートします。
2. **保存関数の作成**：UIImageをカメラロールに保存するための関数を作成します。
3. **SwiftUIビューから呼び出す**：SwiftUIビューからこの保存関数を呼び出します。

### 実装例

まず、`Photos`フレームワークをインポートします。

```swift
import Photos
```

次に、UIImageをカメラロールに保存する関数を作成します。

```swift
func saveImageToCameraRoll(image: UIImage) {
    UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
}
```

SwiftUIビューからこの関数を呼び出す例を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var image: UIImage? = UIImage(named: "example") // 例として

    var body: some View {
        VStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }

            Button(action: {
                if let image = image {
                    saveImageToCameraRoll(image: image)
                }
            }) {
                Text("Save to Camera Roll")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}
```

### 完全な例

以下は、カメラロールに画像を保存する完全な実装例です。

```swift
import SwiftUI
import Photos

struct ContentView: View {
    @State private var image: UIImage? = UIImage(named: "example") // 例として

    var body: some View {
        VStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }

            Button(action: {
                if let image = image {
                    saveImageToCameraRoll(image: image)
                }
            }) {
                Text("Save to Camera Roll")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }

    func saveImageToCameraRoll(image: UIImage) {
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
    }
}
```

### 画像保存時のエラーハンドリングと権限チェック

実際のアプリケーションでは、画像の保存に失敗した場合のエラーハンドリングや、ユーザーがカメラロールへのアクセスを許可しているかを確認するための権限チェックも必要です。以下はその例です。

```swift
import SwiftUI
import Photos

struct ContentView: View {
    @State private var image: UIImage? = UIImage(named: "example") // 例として

    var body: some View {
        VStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }

            Button(action: {
                checkPhotoLibraryPermission { granted in
                    if granted {
                        if let image = image {
                            saveImageToCameraRoll(image: image)
                        }
                    } else {
                        print("Photo library access denied")
                    }
                }
            }) {
                Text("Save to Camera Roll")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }

    func saveImageToCameraRoll(image: UIImage) {
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
    }

    func checkPhotoLibraryPermission(completion: @escaping (Bool) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus()
        switch status {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            PHPhotoLibrary.requestAuthorization { status in
                DispatchQueue.main.async {
                    completion(status == .authorized)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}
```

このコードでは、`checkPhotoLibraryPermission`関数を使ってカメラロールへのアクセス権を確認し、適切な処理を行います。これにより、ユーザーがアプリにカメラロールへのアクセスを許可していない場合でも、適切な対応が可能になります。

---

## 👤 ユーザー
*2024/6/17 19:42:00*

MVVM で実装してほしい。VMにビジネスロジックを持ってきて、カメラロールへのパーミッションの確認などはそちらで実装してほしい。

---

## 🤖 アシスタント
*2024/6/17 19:42:28*

もちろん、MVVMアーキテクチャで実装しましょう。ここでは、以下の構成にします。

1. **Model**: 画像データを表す。
2. **ViewModel**: 画像の保存やカメラロールへのアクセス許可の確認を含むビジネスロジックを担当。
3. **View**: ユーザーインターフェースを提供し、ViewModelと連携。

### Model

まず、画像データを表すモデルを作成します。

```swift
import Foundation
import UIKit

struct ImageModel {
    var image: UIImage?
}
```

### ViewModel

次に、ViewModelを作成し、ビジネスロジックを実装します。

```swift
import Foundation
import Photos
import SwiftUI

class ImageViewModel: ObservableObject {
    @Published var imageModel: ImageModel

    init(image: UIImage?) {
        self.imageModel = ImageModel(image: image)
    }

    func saveImageToCameraRoll() {
        guard let image = imageModel.image else { return }

        checkPhotoLibraryPermission { granted in
            if granted {
                UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
            } else {
                print("Photo library access denied")
            }
        }
    }

    private func checkPhotoLibraryPermission(completion: @escaping (Bool) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus()
        switch status {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            PHPhotoLibrary.requestAuthorization { status in
                DispatchQueue.main.async {
                    completion(status == .authorized)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}
```

### View

最後に、SwiftUIビューを作成してViewModelと連携します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel: ImageViewModel

    init(image: UIImage?) {
        _viewModel = StateObject(wrappedValue: ImageViewModel(image: image))
    }

    var body: some View {
        VStack {
            if let image = viewModel.imageModel.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }

            Button(action: {
                viewModel.saveImageToCameraRoll()
            }) {
                Text("Save to Camera Roll")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}
```

### 完全な実装

以下に、完全な実装を示します。

```swift
import SwiftUI
import Photos

struct ImageModel {
    var image: UIImage?
}

class ImageViewModel: ObservableObject {
    @Published var imageModel: ImageModel

    init(image: UIImage?) {
        self.imageModel = ImageModel(image: image)
    }

    func saveImageToCameraRoll() {
        guard let image = imageModel.image else { return }

        checkPhotoLibraryPermission { granted in
            if granted {
                UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
            } else {
                print("Photo library access denied")
            }
        }
    }

    private func checkPhotoLibraryPermission(completion: @escaping (Bool) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus()
        switch status {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            PHPhotoLibrary.requestAuthorization { status in
                DispatchQueue.main.async {
                    completion(status == .authorized)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}

struct ContentView: View {
    @StateObject private var viewModel: ImageViewModel

    init(image: UIImage?) {
        _viewModel = StateObject(wrappedValue: ImageViewModel(image: image))
    }

    var body: some View {
        VStack {
            if let image = viewModel.imageModel.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }

            Button(action: {
                viewModel.saveImageToCameraRoll()
            }) {
                Text("Save to Camera Roll")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}
```

この実装により、MVVMアーキテクチャに従って画像をカメラロールに保存する機能を提供することができます。ViewModelがビジネスロジック（カメラロールへの保存およびアクセス許可の確認）を担当し、Viewはユーザーインターフェースの描画およびユーザー操作を処理します。

---

## 👤 ユーザー
*2024/6/17 19:45:06*

画像の長押して保存の選択肢がでるといい。
contextMenu とかで実装してほしい。

---

## 🤖 アシスタント
*2024/6/17 19:45:44*

画像の長押し時に保存の選択肢が表示されるようにするためには、SwiftUIの`contextMenu`を使用できます。これにより、ユーザーが画像を長押しした際にコンテキストメニューが表示され、画像の保存などのオプションを提供できます。

以下にその実装方法を示します。

### ViewModel

まず、ViewModelのコードはそのまま使用します。

```swift
import Foundation
import Photos
import SwiftUI

struct ImageModel {
    var image: UIImage?
}

class ImageViewModel: ObservableObject {
    @Published var imageModel: ImageModel

    init(image: UIImage?) {
        self.imageModel = ImageModel(image: image)
    }

    func saveImageToCameraRoll() {
        guard let image = imageModel.image else { return }

        checkPhotoLibraryPermission { granted in
            if granted {
                UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
            } else {
                print("Photo library access denied")
            }
        }
    }

    private func checkPhotoLibraryPermission(completion: @escaping (Bool) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus()
        switch status {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            PHPhotoLibrary.requestAuthorization { status in
                DispatchQueue.main.async {
                    completion(status == .authorized)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}
```

### View

次に、SwiftUIビューに`contextMenu`を追加します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel: ImageViewModel

    init(image: UIImage?) {
        _viewModel = StateObject(wrappedValue: ImageViewModel(image: image))
    }

    var body: some View {
        VStack {
            if let image = viewModel.imageModel.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .contextMenu {
                        Button(action: {
                            viewModel.saveImageToCameraRoll()
                        }) {
                            Text("Save to Camera Roll")
                            Image(systemName: "square.and.arrow.down")
                        }
                    }
            } else {
                Text("No Image Available")
            }
        }
        .padding()
    }
}
```

### 完全な実装

以下に、コンテキストメニューを使用した完全な実装を示します。

```swift
import SwiftUI
import Photos

struct ImageModel {
    var image: UIImage?
}

class ImageViewModel: ObservableObject {
    @Published var imageModel: ImageModel

    init(image: UIImage?) {
        self.imageModel = ImageModel(image: image)
    }

    func saveImageToCameraRoll() {
        guard let image = imageModel.image else { return }

        checkPhotoLibraryPermission { granted in
            if granted {
                UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
            } else {
                print("Photo library access denied")
            }
        }
    }

    private func checkPhotoLibraryPermission(completion: @escaping (Bool) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus()
        switch status {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            PHPhotoLibrary.requestAuthorization { status in
                DispatchQueue.main.async {
                    completion(status == .authorized)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}

struct ContentView: View {
    @StateObject private var viewModel: ImageViewModel

    init(image: UIImage?) {
        _viewModel = StateObject(wrappedValue: ImageViewModel(image: image))
    }

    var body: some View {
        VStack {
            if let image = viewModel.imageModel.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .contextMenu {
                        Button(action: {
                            viewModel.saveImageToCameraRoll()
                        }) {
                            Text("Save to Camera Roll")
                            Image(systemName: "square.and.arrow.down")
                        }
                    }
            } else {
                Text("No Image Available")
            }
        }
        .padding()
    }
}
```

この実装では、ユーザーが画像を長押しすると「Save to Camera Roll」というオプションが表示され、それを選択すると画像がカメラロールに保存されます。`contextMenu`を使用することで、簡単にコンテキストメニューを実装できます。

---
