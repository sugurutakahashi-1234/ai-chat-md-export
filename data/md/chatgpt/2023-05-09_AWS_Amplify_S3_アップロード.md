# AWS Amplify S3 アップロード

日付: 2023-05-09

---

## 👤 ユーザー
*2023/05/09 11:19:59*

AWS Amplify を使ってS3に対して、CSVファイルをアップロードするコードを書いてみて

---

## 🤖 アシスタント
*2023/05/09 11:20:08*

AWS Amplifyは、AWSサービスを利用するためのフレームワークです。以下は、AWS Amplifyを使用してS3にCSVファイルをアップロードするためのJavaScriptコード例です。

1. Amplifyの設定を行う

まず、Amplifyを使うために、Amplifyの設定を行います。次のコマンドを実行して、Amplify CLIをインストールします。

```
npm install -g @aws-amplify/cli
```

次に、Amplifyプロジェクトを初期化します。Amplify CLIを使用して、Amplifyアプリケーションを初期化するには、以下のコマンドを実行します。

```
amplify init
```

このコマンドを実行すると、Amplifyの設定を行うための対話形式のプロンプトが表示されます。プロンプトに従って、プロジェクト名、AWSプロファイル、リージョンなどの設定を行います。

2. Amplify Storageライブラリをインストールする

AmplifyのStorageライブラリをインストールするには、以下のコマンドを実行します。

```
npm install @aws-amplify/storage
```

3. S3にCSVファイルをアップロードする

以下のコードは、AmplifyのStorageライブラリを使用して、S3にCSVファイルをアップロードする方法を示しています。このコードを実行する前に、Amplifyの設定を行っている必要があります。

```
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

// Amplifyの設定
Amplify.configure(awsconfig);

// ファイルをアップロードする関数
async function uploadFile(file) {
  const fileName = file.name;
  const fileType = file.type;

  // S3にアップロードするためのキーを作成
  const key = `csv/${fileName}`;

  // S3にファイルをアップロード
  await Storage.put(key, file, {
    contentType: fileType
  });

  console.log(`File uploaded successfully: ${key}`);
}

// ファイル選択ボタンがクリックされたときに実行する関数
function handleFileSelect(event) {
  const file = event.target.files[0];
  uploadFile(file);
}

// ファイル選択ボタンにイベントリスナーを設定
const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', handleFileSelect);
```

このコードは、ファイル選択ボタンがクリックされたときに、S3にCSVファイルをアップロードします。ファイルのアップロードが完了すると、コンソールにファイルのキーが表示されます。

注意点として

---

## 👤 ユーザー
*2023/05/09 11:20:15*

SwiftUIでやってほしい

---

## 🤖 アシスタント
*2023/05/09 11:20:24*

SwiftUIを使用してS3にCSVファイルをアップロードする方法を説明します。以下は、SwiftUIでの実装例です。

1. AWS SDK for iOSをインストールする

まず、AWS SDK for iOSをインストールします。CocoaPodsを使用して、AWS SDK for iOSをインストールするには、以下のコマンドを実行します。

```
pod 'AWSiOSSDKv2', '~> 2.10.5'
```

2. S3にCSVファイルをアップロードする

以下のコードは、SwiftUIを使用して、S3にCSVファイルをアップロードする方法を示しています。

```
import SwiftUI
import AWSS3

struct ContentView: View {
    @State var showingImagePicker = false
    @State var image: UIImage?
    
    var body: some View {
        VStack {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 300, height: 300)
                    .padding()
                
                Button("Upload CSV") {
                    if let imageData = image.jpegData(compressionQuality: 0.5) {
                        let fileName = "test.csv"
                        let s3BucketName = "your-s3-bucket-name"
                        
                        let s3 = AWSS3.default()
                        let request = AWSS3TransferManagerUploadRequest()!
                        request.bucket = s3BucketName
                        request.key = "csv/\(fileName)"
                        request.body = imageData
                        request.contentType = "image/jpeg"
                        
                        let transferManager = AWSS3TransferManager.default()
                        transferManager.upload(request).continueWith { task in
                            if let error = task.error {
                                print("Error uploading file: \(error.localizedDescription)")
                            } else {
                                print("File uploaded successfully.")
                            }
                            
                            return nil
                        }
                    }
                }
            } else {
                Button("Select CSV") {
                    self.showingImagePicker = true
                }
                .padding()
                .sheet(isPresented: $showingImagePicker, onDismiss: loadImage) {
                    ImagePicker(image: self.$image)
                }
            }
        }
    }
    
    func loadImage() {
        guard let inputImage = image else { return }
        image = inputImage
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.presentationMode) var presentationMode
    
    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let pickedImage = info[.originalImage] as? UIImage {
                parent.image = pickedImage
            }
            
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<ImagePicker>) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = .photoLibrary
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: UIViewControllerRepresentableContext<ImagePicker>) {
        
    }
}
```

このコードは

---
