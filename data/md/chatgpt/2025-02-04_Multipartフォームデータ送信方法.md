# Multipartフォームデータ送信方法

Date: 2025-02-04

---

## 👤 User
*2025-02-04 18:29:10*

APIで multipart/form-data に追加してパラメーターを付与させたい

---

## 🤖 Assistant
*2025-02-04 18:30:03*

`multipart/form-data` のリクエストに追加のパラメーターを付与する方法を説明します。

---

## 1. Swift で `multipart/form-data` を送信する場合
`URLRequest` を作成し、`URLSession` を使用してリクエストを送信できます。

### 例: 画像と追加のパラメーターを含めたリクエスト
```swift
import Foundation

func uploadImage(imageData: Data, fileName: String, parameters: [String: String], url: URL) {
    var request = URLRequest(url: url)
    request.httpMethod = "POST"

    let boundary = UUID().uuidString
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    var body = Data()

    // パラメーターの追加
    for (key, value) in parameters {
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".data(using: .utf8)!)
        body.append("\(value)\r\n".data(using: .utf8)!)
    }

    // 画像の追加
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(fileName)\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
    body.append(imageData)
    body.append("\r\n".data(using: .utf8)!)

    // 最後のバウンダリー
    body.append("--\(boundary)--\r\n".data(using: .utf8)!)

    request.httpBody = body

    // HTTPリクエストの送信
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Upload error: \(error)")
            return
        }
        if let data = data, let responseString = String(data: data, encoding: .utf8) {
            print("Response: \(responseString)")
        }
    }

    task.resume()
}
```

### 使用例:
```swift
let imageUrl = URL(fileURLWithPath: "path/to/image.jpg")
if let imageData = try? Data(contentsOf: imageUrl) {
    let parameters = [
        "userId": "12345",
        "description": "アップロードする画像の説明"
    ]
    let uploadURL = URL(string: "https://example.com/upload")!
    uploadImage(imageData: imageData, fileName: "image.jpg", parameters: parameters, url: uploadURL)
}
```

---

## 2. Flutter (Dart) で `multipart/form-data` を送信する場合
`http` パッケージを使って `multipart/form-data` を送信できます。

### 例: 画像と追加のパラメーターを含めたリクエスト
```dart
import 'package:http/http.dart' as http;
import 'dart:io';

Future<void> uploadImage(File imageFile, Map<String, String> parameters, String uploadUrl) async {
  var request = http.MultipartRequest('POST', Uri.parse(uploadUrl));

  // パラメーターの追加
  parameters.forEach((key, value) {
    request.fields[key] = value;
  });

  // 画像の追加
  var imageStream = http.ByteStream(imageFile.openRead());
  var length = await imageFile.length();
  var multipartFile = http.MultipartFile(
    'file', imageStream, length,
    filename: imageFile.path.split('/').last,
    contentType: MediaType('image', 'jpeg'),
  );

  request.files.add(multipartFile);

  // リクエスト送信
  var response = await request.send();
  if (response.statusCode == 200) {
    print("Upload successful");
  } else {
    print("Upload failed: ${response.statusCode}");
  }
}
```

### 使用例:
```dart
File imageFile = File('/path/to/image.jpg');
Map<String, String> params = {
  'userId': '12345',
  'description': 'アップロードする画像の説明',
};
String uploadUrl = 'https://example.com/upload';

uploadImage(imageFile, params, uploadUrl);
```

---

このように `multipart/form-data` を使うと、ファイルと一緒に追加のパラメーターを送信できます。Swift や Flutter の `http` ライブラリを活用しながら、API に適した方法でデータを送信してください。

---

## 👤 User
*2025-02-04 18:30:37*

これを受け取る方はどうハンドリングすればいいのか？

---

## 🤖 Assistant
*2025-02-04 18:31:58*

API側（バックエンド）で `multipart/form-data` を受け取る方法を説明します。バックエンドの言語ごとに実装を紹介します。

---

## 1. **Node.js (Express)**
Node.js の `express` と `multer` を使って `multipart/form-data` を処理します。

### **インストール**
```bash
npm install express multer
```

### **サーバー実装**
```javascript
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' }); // アップロードされたファイルを `uploads/` に保存

// `file` フィールドのファイルと、他のフォームデータを受け取る
app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Received file:', req.file);
    console.log('Received fields:', req.body); // 追加パラメータ

    res.json({
        message: 'File uploaded successfully',
        file: req.file,
        parameters: req.body,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

### **解説**
- `multer` を使用して `file` フィールドのファイルを処理
- `req.file` でファイルの情報を取得
- `req.body` で `multipart/form-data` のパラメーター（`userId` など）を取得

---

## 2. **Python (FastAPI)**
Python の `FastAPI` を使って `multipart/form-data` を処理します。

### **インストール**
```bash
pip install fastapi uvicorn python-multipart
```

### **サーバー実装**
```python
from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    userId: str = Form(...),
    description: str = Form(...)
):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "userId": userId,
        "description": description
    }

# サーバー起動
# uvicorn script_name:app --reload
```

### **解説**
- `UploadFile` を使ってファイルを受け取る
- `Form(...)` を使って `multipart/form-data` のパラメーターを受け取る
- レスポンスとして `file.filename` や `userId` などを返す

---

## 3. **Go (Gin)**
Go の `gin-gonic` を使って `multipart/form-data` を処理します。

### **インストール**
```bash
go get -u github.com/gin-gonic/gin
```

### **サーバー実装**
```go
package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/upload", func(c *gin.Context) {
		// ファイル取得
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}

		// 追加のフォームパラメーター取得
		userId := c.PostForm("userId")
		description := c.PostForm("description")

		// ファイル保存
		dst := "./uploads/" + file.Filename
		c.SaveUploadedFile(file, dst)

		// レスポンス
		c.JSON(http.StatusOK, gin.H{
			"message":     "File uploaded successfully",
			"filename":    file.Filename,
			"userId":      userId,
			"description": description,
		})
	})

	r.Run(":8080")
}
```

### **解説**
- `c.FormFile("file")` で `file` を取得
- `c.PostForm("userId")` でパラメーターを取得
- `c.SaveUploadedFile(file, dst)` でファイルを保存

---

## 4. **Ruby (Sinatra)**
Ruby の `Sinatra` を使って `multipart/form-data` を処理します。

### **インストール**
```bash
gem install sinatra
```

### **サーバー実装**
```ruby
require 'sinatra'
require 'sinatra/reloader'

post '/upload' do
  content_type :json

  # ファイルを取得
  file = params[:file]
  filename = file[:filename]
  file_data = file[:tempfile].read

  # パラメーター取得
  userId = params[:userId]
  description = params[:description]

  # ファイル保存
  File.open("./uploads/#{filename}", "wb") do |f|
    f.write(file_data)
  end

  # レスポンス
  { message: "File uploaded successfully", filename: filename, userId: userId, description: description }.to_json
end
```

### **解説**
- `params[:file]` で `file` を取得
- `params[:userId]` で追加のパラメーターを取得
- `File.open("./uploads/#{filename}", "wb")` でファイルを保存

---

## **共通のポイント**
1. `multipart/form-data` を受け取るエンドポイントを作成
2. **ファイル** は `file` フィールドとして受け取る (`req.file`, `UploadFile`, `FormFile`)
3. **追加パラメーター** (`userId`, `description` など) は `req.body` や `Form(...)` で取得
4. **ファイルを保存** する場合は適切なパス (`uploads/`) を指定

---

## **クライアントからの送信例**
`curl` を使ってリクエストを送信する場合:
```bash
curl -X POST "http://localhost:3000/upload" \
  -F "file=@image.jpg" \
  -F "userId=12345" \
  -F "description=アップロードする画像"
```

---

どの言語でも `multipart/form-data` の処理はほぼ共通ですが、使うフレームワークによってメソッドの違いがあります。どの言語・フレームワークを使うかによって適切な方法を選んでください！

---
