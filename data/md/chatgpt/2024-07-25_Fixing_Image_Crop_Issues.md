# Fixing Image Crop Issues

日付: 2024-07-25

---

## 👤 ユーザー
*2024/7/25 13:18:10*

PhotoCropView について、PhotoCropViewで表示されるが画像がもともとの画像よりも切り取られてから拡大などができる件について修正したい

struct PhotoCropView: View {
    private struct Constants {
        static let frameSize: CGFloat = 300
    }
    
    @Binding var image: UIImage?
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 0.0
    @State private var offset: CGSize = .zero
    @State private var lastStoredOffset: CGSize = .zero
    @GestureState private var isInteracting: Bool = false

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .overlay {
                            GeometryReader { proxy in
                                let rect = proxy.frame(in: .named("photoCropView"))
                                
                                Color.clear
                                    .onChange(of: isInteracting) { newValue in
                                        withAnimation(.easeInOut(duration: 0.2)) {
                                            if rect.minX &gt; 0 {
                                                offset.width = (offset.width - rect.minX)
                                            }
                                            if rect.minY &gt; 0 {
                                                offset.height = (offset.height - rect.minY)
                                            }
                                            
                                            if rect.maxX &lt; geometry.size.width {
                                                offset.width = (rect.minX - offset.width)
                                            }
                                            
                                            if rect.maxY &lt; geometry.size.height {
                                                offset.height = (rect.minY - offset.height)
                                            }
                                        }
                                        
                                        if !newValue {
                                            lastStoredOffset = offset
                                        }
                                    }
                            }
                        }
                        .frame(width: geometry.size.width, height: geometry.size.height)
                }
            }
        }
        .scaleEffect(scale)
        .offset(offset)
        .coordinateSpace(name: "photoCropView")
        .gesture(
            DragGesture()
                .updating($isInteracting) { _, state, _ in
                    state = true
                }
                .onChanged { value in
                    let translation = value.translation
                    offset = CGSize(width: translation.width + lastStoredOffset.width, height: translation.height + lastStoredOffset.height)
                    
                }
                .onEnded { _ in
                    withAnimation(.easeInOut(duration: 0.2)) {
                        lastStoredOffset = offset
                    }
                }
        )
        .gesture(
            MagnificationGesture()
                .updating($isInteracting) { _, state, _ in
                    state = true
                }
                .onChanged { value in
                    let updatedScale = value + lastScale
                    scale = max(1, updatedScale)
                }
                .onEnded { value in
                    if scale &lt; 1 {
                        scale = 1
                        lastScale = 0
                    } else {
                        lastScale = scale - 1
                    }
                }
        )
        .frame(width: Constants.frameSize, height: Constants.frameSize)
        .clipShape(.rect(cornerRadius: Constants.frameSize / 2))
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            Color.black
                .ignoresSafeArea()
        )
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button {
                    // selectedImage = nil
                    dismiss.callAsFunction()
                } label: {
                    Text("キャンセル")
                        .foregroundStyle(.white)
                }
            }

            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    dismiss.callAsFunction()
                } label: {
                    Text("適用")
                        .foregroundStyle(.white)
                }
            }
        }
    }
}

import DomainLayer

@available(iOS 18.0, *)
#Preview {
    struct PhotoCropViewPreview: View {
        @State private var isPresented: Bool = true
        @State private var selectedImage: UIImage? = nil

        var body: some View {
            VStack {
                Button {
                    Task {
                        selectedImage = try? await URLSessionDownloadStaticDriver.imageDownload(url: .randomImageUrl)
                    }
                } label: {
                    Text("reset")
                }
                
                if let image = selectedImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 300, height: 300)
                }
                
                Toggle("show", isOn: $isPresented)
                    .fullScreenCover(isPresented: $isPresented, content: {
                        PhotoCropView(image: $selectedImage)
                            .navigationStacked()
                    })
            }
            .task {
                selectedImage = try? await URLSessionDownloadStaticDriver.imageDownload(url: .randomImageUrl)
            }
        }
    }

    return PhotoCropViewPreview()
}

---

## 🤖 アシスタント
*2024/7/25 13:18:30*

`PhotoCropView`を修正して、画像が切り取られてから拡大される問題を解決するには、以下の修正を行います。特に、`scaleEffect`と`offset`の設定を`Image`に対して直接適用する必要があります。

次のコードを使用して、`PhotoCropView`を修正します。

```swift
struct PhotoCropView: View {
    private struct Constants {
        static let frameSize: CGFloat = 300
    }
    
    @Binding var image: UIImage?
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @State private var lastStoredOffset: CGSize = .zero
    @GestureState private var isInteracting: Bool = false

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .scaleEffect(scale)
                        .offset(offset)
                        .gesture(
                            DragGesture()
                                .updating($isInteracting) { _, state, _ in
                                    state = true
                                }
                                .onChanged { value in
                                    let translation = value.translation
                                    offset = CGSize(width: translation.width + lastStoredOffset.width, height: translation.height + lastStoredOffset.height)
                                    
                                }
                                .onEnded { _ in
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        lastStoredOffset = offset
                                    }
                                }
                        )
                        .gesture(
                            MagnificationGesture()
                                .updating($isInteracting) { _, state, _ in
                                    state = true
                                }
                                .onChanged { value in
                                    let updatedScale = value * lastScale
                                    scale = max(1, updatedScale)
                                }
                                .onEnded { value in
                                    if scale < 1 {
                                        scale = 1
                                        lastScale = 1
                                    } else {
                                        lastScale = scale
                                    }
                                }
                        )
                        .frame(width: geometry.size.width, height: geometry.size.height)
                }
            }
            .coordinateSpace(name: "photoCropView")
        }
        .frame(width: Constants.frameSize, height: Constants.frameSize)
        .clipShape(Rectangle())
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            Color.black
                .ignoresSafeArea()
        )
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button {
                    dismiss.callAsFunction()
                } label: {
                    Text("キャンセル")
                        .foregroundStyle(.white)
                }
            }

            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    dismiss.callAsFunction()
                } label: {
                    Text("適用")
                        .foregroundStyle(.white)
                }
            }
        }
    }
}

import DomainLayer

@available(iOS 18.0, *)
#Preview {
    struct PhotoCropViewPreview: View {
        @State private var isPresented: Bool = true
        @State private var selectedImage: UIImage? = nil

        var body: some View {
            VStack {
                Button {
                    Task {
                        selectedImage = try? await URLSessionDownloadStaticDriver.imageDownload(url: .randomImageUrl)
                    }
                } label: {
                    Text("reset")
                }
                
                if let image = selectedImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 300, height: 300)
                }
                
                Toggle("show", isOn: $isPresented)
                    .fullScreenCover(isPresented: $isPresented, content: {
                        PhotoCropView(image: $selectedImage)
                            .navigationStacked()
                    })
            }
            .task {
                selectedImage = try? await URLSessionDownloadStaticDriver.imageDownload(url: .randomImageUrl)
            }
        }
    }

    return PhotoCropViewPreview()
}
```

この修正により、画像は元の画像サイズのまま拡大・縮小・移動が可能になり、切り取り後に拡大されることはなくなります。

---
