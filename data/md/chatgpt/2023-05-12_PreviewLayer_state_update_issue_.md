# PreviewLayer state update issue.

日付: 2023-05-12

---

## 👤 ユーザー
*2023/5/12 16:38:10*

以下のコードでself.previewLayer = previewLayerするとModifying state during view update, this will cause undefined behavior.とエラーがでた。DispatchQueue.main.async {} で囲む以外に対処方法をおしえてほしい



struct CameraPreview: UIViewRepresentable {
    let cameraPreviewPresenter: CameraPreviewPresenter
    private let queue = DispatchQueue(label: "videoQueue")
    @State private var previewLayer: AVCaptureVideoPreviewLayer?
    @Binding var currentImageItems: \[ImageItem\]

    func makeUIView(context: Context) -&gt; UIView {
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
            print("Failed to setup AVCaptureDevice!")
            return UIView()
        }
        let cameraView = UIView()
        do {
            cameraPreviewPresenter.captureSession.sessionPreset = .hd1280x720
            let input = try AVCaptureDeviceInput(device: device)
            let output = AVCaptureVideoDataOutput()
            output.setSampleBufferDelegate(context.coordinator, queue: queue)
            cameraPreviewPresenter.captureSession.addInput(input)
            cameraPreviewPresenter.captureSession.addOutput(output)
            // Ref: https://developers.google.com/ml-kit/vision/selfie-segmentation/ios?hl=ja#tips\_to\_improve\_performance
            output.alwaysDiscardsLateVideoFrames = true
            let connection = output.connection(with: .video)
            connection?.videoOrientation = .portrait
            connection?.isVideoMirrored = true
        } catch {
            print(error.localizedDescription)
        }
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: cameraPreviewPresenter.captureSession)
        previewLayer.videoGravity = .resizeAspectFill
        cameraView.layer.addSublayer(previewLayer)

        self.previewLayer = previewLayer
        return cameraView
    }

    func updateUIView(\_ uiView: UIView, context: Context) {
        previewLayer?.frame = uiView.frame
    }

    func makeCoordinator() -&gt; CameraPreviewCoordinator {
        return Coordinator(self)
    }
}

---

## 🤖 アシスタント
*2023/5/12 16:41:08*

`UIViewRepresentable`の`makeUIView(context:)`メソッドは、SwiftUIが要求するためにビューを作成する場所です。このメソッドの目的は、新しいビューを作成して返すことであるため、ビューの状態を更新することは避けるべきです。

エラーを回避するために、`makeUIView(context:)`を変更して、`previewLayer`を`UIView`のサブクラスとして追加し、そのインスタンスを返すことができます。これにより、`previewLayer`の状態を更新する必要がなくなります。

以下に修正された`CameraPreview`を示します：

```swift
struct CameraPreview: UIViewRepresentable {
    let cameraPreviewPresenter: CameraPreviewPresenter
    private let queue = DispatchQueue(label: "videoQueue")
    @Binding var currentImageItems: [ImageItem]

    class CameraView: UIView {
        var previewLayer: AVCaptureVideoPreviewLayer?
    }

    func makeUIView(context: Context) -> CameraView {
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
            print("Failed to setup AVCaptureDevice!")
            return CameraView()
        }
        let cameraView = CameraView()
        do {
            cameraPreviewPresenter.captureSession.sessionPreset = .hd1280x720
            let input = try AVCaptureDeviceInput(device: device)
            let output = AVCaptureVideoDataOutput()
            output.setSampleBufferDelegate(context.coordinator, queue: queue)
            cameraPreviewPresenter.captureSession.addInput(input)
            cameraPreviewPresenter.captureSession.addOutput(output)
            output.alwaysDiscardsLateVideoFrames = true
            let connection = output.connection(with: .video)
            connection?.videoOrientation = .portrait
            connection?.isVideoMirrored = true
        } catch {
            print(error.localizedDescription)
        }
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: cameraPreviewPresenter.captureSession)
        previewLayer.videoGravity = .resizeAspectFill
        cameraView.layer.addSublayer(previewLayer)
        cameraView.previewLayer = previewLayer

        return cameraView
    }

    func updateUIView(_ uiView: CameraView, context: Context) {
        uiView.previewLayer?.frame = uiView.frame
    }

    func makeCoordinator() -> CameraPreviewCoordinator {
        return Coordinator(self)
    }
}
```

ここでは、`CameraView`という新しいカスタム`UIView`のサブクラスを作成し、そのサブクラスに`previewLayer`を格納しています。`makeUIView(context:)`メソッドは、`previewLayer`を`cameraView`に追加し、`cameraView.previewLayer`に割り当てます。`updateUIView(_:context:)`メソッドは、引数で受け取った`uiView`の`previewLayer`プロパティを更新します。この変更により、ビューの状態を更新する必要がなくなり、エラーが解決されます。

---
