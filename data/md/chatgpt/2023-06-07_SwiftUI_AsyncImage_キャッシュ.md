# SwiftUI AsyncImage キャッシュ

日付: 2023-06-07

---

## 👤 ユーザー
*2023/06/07 11:46:19*

SwiftUI の AsyncImage を使ってキャッシュの機構とか、容量制限などしたい

---

## 🤖 アシスタント
*2023/06/07 11:47:14*

SwiftUI の `AsyncImage` は非常に便利なコンポーネントですが、基本的にはデフォルトのキャッシュメカニズムを使用します。なので、独自のキャッシュメカニズムや容量制限を設けたい場合には、独自のイメージローダーやキャッシュシステムを作成する必要があります。

以下に、自前のキャッシュシステムを用いた例を示します：

```swift
import SwiftUI
import Combine

class ImageCache {
    static let shared = ImageCache()
    private var cache = NSCache<NSURL, UIImage>()
    
    subscript(_ key: URL) -> UIImage? {
        get { cache.object(forKey: key as NSURL) }
        set { newValue == nil ? cache.removeObject(forKey: key as NSURL) : cache.setObject(newValue!, forKey: key as NSURL) }
    }
}

class ImageLoader: ObservableObject {
    @Published var image: UIImage?
    private let url: URL
    private var cancellable: AnyCancellable?
    
    init(url: URL) {
        self.url = url
    }
    
    deinit {
        cancellable?.cancel()
    }
    
    func load() {
        if let image = ImageCache.shared[url] {
            self.image = image
            return
        }
        
        cancellable = URLSession.shared.dataTaskPublisher(for: url)
            .map { UIImage(data: $0.data) }
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { _ in },
                receiveValue: { [weak self] image in
                    if let image = image {
                        ImageCache.shared[self?.url] = image
                        self?.image = image
                    }
                }
            )
    }
    
    func cancel() {
        cancellable?.cancel()
    }
}

struct CachedAsyncImage: View {
    @StateObject private var loader: ImageLoader
    var placeholder: Image
    
    init(url: URL, placeholder: Image = Image(systemName: "photo")) {
        _loader = StateObject(wrappedValue: ImageLoader(url: url))
        self.placeholder = placeholder
    }
    
    var body: some View {
        image
            .onAppear(perform: loader.load)
            .onDisappear(perform: loader.cancel)
    }
    
    private var image: some View {
        Group {
            if loader.image != nil {
                Image(uiImage: loader.image!)
                    .resizable()
            } else {
                placeholder
            }
        }
    }
}
```

この `CachedAsyncImage` は SwiftUI の View で、URL を与えるとその URL のイメージを非同期にロードし表示します。ロードが完了する前やロードが失敗した場合には placeholder のイメージを表示します。

なお、`NSCache` のデフォルトの動作としては、メモリ警告が出た時にはオブジェクトを解放するため、容量制限という観点からも一定の機能を果たしています。ただし、これはあくまでメモリに対する制限であり、具体的な容量（MBやGBなど）を指定することはできません。それを実現するためには更に

---

## 👤 ユーザー
*2023/06/07 11:49:04*

AsyncImage を拡張する形で同じような機構を使えたりできないの？

---

## 🤖 アシスタント
*2023/06/07 11:49:28*

SwiftUI の `AsyncImage` は非常に便利なコンポーネントですが、2021年の時点では独自のキャッシュメカニズムを設けるような拡張はサポートされていません。`AsyncImage`は内部的にキャッシュ機能を提供していますが、その具体的な動作や設定は公開されていません。

それにより、もし `AsyncImage` の挙動を変更する必要がある場合、独自の画像ロードとキャッシュシステムを作成することが一般的に推奨されています。私が以前に提供した `ImageLoader` と `ImageCache` のコードはその一例です。

ただし、これはあくまで2021年時点の情報であり、その後のSwiftUIの更新により変わっている可能性もあります。したがって、最新のSwiftUIのドキュメンテーションやリリースノートを確認して、新たなキャッシュ管理機能が追加されていないか確認することをおすすめします。

最新の情報をご確認の上、具体的な疑問点や実装に関する問題があれば、ぜひお知らせください。それに対するサポートを提供いたします。

---
