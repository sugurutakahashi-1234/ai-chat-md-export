# VideoPlayerView サイズ解決

Date: 2023-06-28

---

## 👤 User
*2023-06-29 02:30:11*

この場合でのVideoPlayerViewの幅と高さを知りたい

struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding&lt;MissionVideoWatchResultType?&gt;) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                // TODO: 動画の表示エリアが上手くデバイスの淵ギリギリで表示されないので、調整する
                ZStack(alignment: .bottomTrailing) {
                    // SwiftUIのVideoPlayerだと、再生/停止などのUIが自動で表示されてしまうので、
                    // UIViewRepresentableでカスタム実装
                    // Ref: https://qiita.com/ozawa0711/items/a33ee808c7f710033d60
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        // aspectRatio == .fillにすると、widthが画面外まで伸びてしまい、制御で出来なくなるので、
                        // 仕方なくGeometryReaderで仮実装
                        .frame(width: gr.size.width, height: gr.size.height)
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}

public struct VideoPlayerView: UIViewRepresentable {
    // Ref: https://stackoverflow.com/a/69163384
    final class PlayerContainer: UIView {
        init(playerLayer: AVPlayerLayer) {
            super.init(frame: .zero)
            layer.addSublayer(playerLayer)
        }

        @available(*, unavailable)
        required init?(coder _: NSCoder) {
            fatalError("init(coder:) has not been implemented")
        }

        // 自動でサイズが変更されるようにする
        override func layoutSubviews() {
            super.layoutSubviews()
            layer.sublayers?.first?.frame = frame
        }
    }

    public let videoPlayer: AVPlayer

    public init(videoPlayer: AVPlayer) {
        self.videoPlayer = videoPlayer
    }

    public func makeUIView(context _: Context) -&gt; UIView {
        let playerLayer = AVPlayerLayer(player: videoPlayer)
        return PlayerContainer(playerLayer: playerLayer)
    }

    public func updateUIView(_: UIView, context _: Context) {}
}

---

## 🤖 Assistant
*2023-06-29 02:30:40*

このコードでは、`VideoPlayerView`が親の`GeometryReader`によってそのサイズが制御されています。以下の行に注目してください。

```swift
.frame(width: gr.size.width, height: gr.size.height)
```

ここで、`gr.size.width`および`gr.size.height`は、`GeometryReader`が提供する親ビューの幅と高さを参照しています。つまり、`VideoPlayerView`の幅と高さはこの値と同じになります。もしも具体的なピクセル数を知りたいということであれば、デバッグ中にこれらの値を出力または検査することでそれを知ることが可能です。

さらに、`PlayerContainer`クラスにおいては、`layoutSubviews`メソッドをオーバーライドし、サブレイヤーのフレームを親ビューのフレームと同じに設定しています。つまり、`AVPlayerLayer`もまた`VideoPlayerView`と同じ幅と高さを持つことになります。

```swift
override func layoutSubviews() {
    super.layoutSubviews()
    layer.sublayers?.first?.frame = frame
}
```

これらにより、動画プレーヤーのビューが親ビューと同じサイズで表示され、全画面での表示が可能となります。

---

## 👤 User
*2023-06-29 02:31:12*

その値をプレゼンター側で知りたい

final class MissionVideoWatchPresenter: ObservableObject {
    let avPlayer: AVPlayer
    private let sessionId: Session.ID
    private let movie: MissionValueType.Movie
    private var cancellableSet = Set&lt;AnyCancellable&gt;()
    @Published var shouldShowSkipButton = true
    @Published var resultType: MissionVideoWatchResultType?

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        avPlayer = AVPlayer(url: movie.fileURL)
        self.sessionId = sessionId
        self.movie = movie

        setUp()
    }
}

extension MissionVideoWatchPresenter {
    var orientation: UIDeviceOrientation {
        switch movie.orientation {
        case .portrait: return .portrait
        case .landscapeRight: return .landscapeRight
        }
    }
}

private extension MissionVideoWatchPresenter {
    func setUp() {
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem).sink { [weak self] _ in
            self?.resultType = .didComplete
        }
        .store(in: &cancellableSet)
    }
}

---

## 🤖 Assistant
*2023-06-29 02:31:58*

SwiftUIのビューからプレゼンターに直接データを渡すことはできません。そのため、ビューの幅と高さをプレゼンターで取得するためには、少し異なるアプローチを用いる必要があります。

一つの解決策として、`@Published`プロパティをプレゼンターに追加し、ビューからそのプロパティを更新することができます。その際、この新しいプロパティは、ビューのサイズが変更されたときに更新される必要があります。

以下に、そのためのコードを示します：

```swift
// 1. プレゼンターに新しいプロパティを追加
final class MissionVideoWatchPresenter: ObservableObject {
    ...
    @Published var videoPlayerSize: CGSize = .zero
    ...
}

struct MissionVideoWatchView: View {
    ...
    var body: some View {
        ...
        VideoPlayerView(videoPlayer: presenter.avPlayer)
            .frame(width: gr.size.width, height: gr.size.height)
            .onChange(of: gr.size) { newSize in
                // 2. サイズが変わったときにプレゼンターのプロパティを更新
                presenter.videoPlayerSize = newSize
            }
        ...
    }
    ...
}
```

これにより、`MissionVideoWatchPresenter`の`videoPlayerSize`プロパティが、`VideoPlayerView`のサイズと同期するようになります。プレゼンターはこの`videoPlayerSize`プロパティを通じてビューのサイズを取得できます。

ただし、この方法は`GeometryReader`のサイズが変わったときにしか動作しないことを覚えておいてください。初期サイズが必要な場合や、ビューがレンダリングされた直後のサイズが必要な場合には、異なるアプローチが必要になります。

---

## 👤 User
*2023-06-29 02:33:22*

普通に視聴している動画の高さと幅をpreseterのfuncから保持している変数に対して更新したいだけなんだ.

---

## 🤖 Assistant
*2023-06-29 02:34:06*

あなたが要求している動作を達成するためには、プレゼンターに新しいメソッドを作成し、そのメソッドを通じてビューの幅と高さを更新することができます。

以下にそのためのコードを示します：

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    ...
    @Published var videoPlayerSize: CGSize = .zero

    func updateVideoPlayerSize(_ size: CGSize) {
        videoPlayerSize = size
    }
    ...
}

struct MissionVideoWatchView: View {
    ...
    var body: some View {
        ...
        VideoPlayerView(videoPlayer: presenter.avPlayer)
            .frame(width: gr.size.width, height: gr.size.height)
            .onAppear {
                // onAppearに設定しておけば、ビューが表示された直後に更新されます。
                presenter.updateVideoPlayerSize(gr.size)
            }
        ...
    }
    ...
}
```

このコードでは、`MissionVideoWatchPresenter`に新しいメソッド`updateVideoPlayerSize(_:)`を作成し、そのメソッドを通じてビューのサイズを更新します。`onAppear`修飾子を使用することで、ビューがレンダリングされた直後にこのメソッドが呼び出され、`videoPlayerSize`が適切な値に更新されます。

ただし、ビューのサイズが動的に変化する場合（デバイスが回転するなど）、`onChange`修飾子を使用してサイズの変更を検知し、その変更に応じて`updateVideoPlayerSize(_:)`を呼び出すようにすることも可能です。

上記の解決策はあくまで一例であり、要件により適切な方法は変わる可能性があります。あなたの具体的な要件やアプリケーションの設計によって最適な解決策は変わるため、より詳細なアドバイスが必要な場合は具体的な状況を説明してください。

---

## 👤 User
*2023-06-29 02:34:30*

けど、再生される動画のアスペクト比によって異なるのでは？

---

## 🤖 Assistant
*2023-06-29 02:35:05*

その通りで、動画のアスペクト比によって、実際のビデオコンテンツが表示される幅と高さは異なることがあります。そのため、アスペクト比を考慮に入れたサイズを計算することが重要です。

AVPlayerは`AVPlayerItem`を持ち、それは`AVAsset`を持っています。`AVAsset`から動画のアスペクト比を取得することが可能です。以下のようなコードで取得できます：

```swift
let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
let size = videoTrack?.naturalSize ?? CGSize.zero
let aspectRatio = size.width / size.height
```

上記のコードで`aspectRatio`を取得することができます。ここで`size.width / size.height`とすると、幅が高さに対してどれだけ大きいか（アスペクト比）がわかります。

ただし、このアスペクト比を利用して具体的にどのような操作を行いたいのか（例えば動画を表示する領域のサイズを調整する、動画のサイズに応じてUIを調整するなど）によって、具体的な実装方法は変わるかと思います。もし具体的な実装方法についての質問があれば、もう少し具体的なシチュエーションを教えていただけますと幸いです。

---

## 👤 User
*2023-06-29 02:36:28*

やりたいことは動画を視聴中にタップした箇所が動画のどのあたりをタップしているのかを知りたい。動画の領域の左上を(0.0)として、右下を(1,1)とした相対座標をしゅとくしたいんだ。もちろん負のあたいも取りうると思っている。

---

## 🤖 Assistant
*2023-06-29 02:37:20*

タップ位置を動画の相対座標に変換するためには、いくつかのステップを踏む必要があります。以下にその一連のプロセスを示します：

1. まず、タップ位置の絶対座標を取得します。SwiftUIでは、`.simultaneousGesture`修飾子と`DragGesture`を使ってタップ位置を取得することができます。

2. 次に、この絶対座標をVideoPlayerViewのサイズに対する相対座標に変換します。

3. 最後に、この相対座標を動画のアスペクト比に基づいて補正します。

以下にそのためのコードを示します：

```swift
struct MissionVideoWatchView: View {
    ...
    var body: some View {
        ...
        VideoPlayerView(videoPlayer: presenter.avPlayer)
            .frame(width: gr.size.width, height: gr.size.height)
            .simultaneousGesture(DragGesture(minimumDistance: 0).onChanged({ value in
                let positionInPlayer = CGPoint(
                    x: value.location.x / gr.size.width,
                    y: value.location.y / gr.size.height
                )
                presenter.updateTapPositionInPlayer(positionInPlayer)
            }))
        ...
    }
    ...
}

final class MissionVideoWatchPresenter: ObservableObject {
    ...
    var videoPlayerSize: CGSize = .zero
    var videoAspect: CGSize = .zero
    @Published var tapPositionInPlayer: CGPoint = .zero

    func updateTapPositionInPlayer(_ position: CGPoint) {
        tapPositionInPlayer = CGPoint(
            x: position.x * videoAspect.width,
            y: position.y * videoAspect.height
        )
    }
    
    func updateVideoPlayerSize(_ size: CGSize) {
        videoPlayerSize = size
        
        // Video's aspect ratio
        let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
        let videoSize = videoTrack?.naturalSize ?? CGSize.zero
        videoAspect = CGSize(width: videoSize.width / size.width, height: videoSize.height / size.height)
    }
    ...
}
```

これにより、`tapPositionInPlayer`プロパティがタップ位置の相対座標を保持します。左上が(0, 0)、右下が(1, 1)となります。また、ビデオのアスペクト比によって調整され、ビデオの外部をタップした場合には0未満または1を超える値が得られます。

---

## 👤 User
*2023-06-29 02:39:11*

どうして、videoAspectを使う必要があるの？

---

## 🤖 Assistant
*2023-06-29 02:41:36*

ご質問ありがとうございます。`videoAspect`を用いる理由は、動画が表示されているビュー（`VideoPlayerView`）のサイズと実際の動画コンテンツのアスペクト比が異なる場合があるためです。

具体的には、`VideoPlayerView`のサイズ（`videoPlayerSize`）がデバイスのスクリーンサイズやレイアウトに依存する一方で、実際の動画コンテンツのサイズ（アスペクト比）は動画そのものの情報に依存します。

したがって、ユーザーがタップした位置を、動画コンテンツにおける相対的な位置に変換するためには、これらの両方の情報を考慮に入れる必要があります。タップ位置の座標をビューのサイズで正規化するだけでなく、動画のアスペクト比を用いて更に調整することで、実際の動画コンテンツに対するタップ位置を正確に計算することができます。

例えば、もしビデオが`VideoPlayerView`にピッタリ収まっているならば、`videoAspect`は必要ありません。しかし、ビデオが`VideoPlayerView`内でレターボックス（黒い余白）を伴って表示されている場合、その余白を考慮しないと、タップ位置が実際のビデオコンテンツに対してずれた結果になってしまいます。これを避けるために、`videoAspect`を用いて調整しています。

---

## 👤 User
*2023-06-29 02:42:02*

func updateVideoPlayerSize(_ size: CGSize) {} の sizeは具体的な変数名に変えて欲しい。

---

## 🤖 Assistant
*2023-06-29 02:42:28*

ご指摘ありがとうございます。`updateVideoPlayerSize(_ size: CGSize)`という関数がVideoPlayerのビューのサイズを更新する役割を果たしていると理解しておりますので、引数の名前を`videoPlayerViewSize`に変更することで具体性を高めることができます。

```swift
func updateVideoPlayerViewSize(_ videoPlayerViewSize: CGSize) {
    videoPlayerSize = videoPlayerViewSize
    
    // Video's aspect ratio
    let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
    let videoSize = videoTrack?.naturalSize ?? CGSize.zero
    videoAspect = CGSize(width: videoSize.width / videoPlayerViewSize.width, height: videoSize.height / videoPlayerViewSize.height)
}
```

この関数は、VideoPlayerのビュー（`VideoPlayerView`）のサイズが変更されたときに呼び出され、その新しいサイズ（`videoPlayerViewSize`）を使用して`videoPlayerSize`と`videoAspect`を更新します。

---

## 👤 User
*2023-06-29 02:43:43*

View側の処理も省略しないで書いて欲しい

---

## 🤖 Assistant
*2023-06-29 02:44:40*

了解しました。すみませんが、ご指摘頂いた部分を全体のコードに組み込むと以下のようになります。

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                        .onChange(of: gr.size) { newSize in
                            presenter.updateVideoPlayerViewSize(newSize)
                        }
                        .simultaneousGesture(DragGesture(minimumDistance: 0).onChanged({ value in
                            let positionInPlayer = CGPoint(
                                x: value.location.x / gr.size.width,
                                y: value.location.y / gr.size.height
                            )
                            presenter.updateTapPositionInPlayer(positionInPlayer)
                        }))
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

ここで、`onAppear` および `onChange` メソッドは `GeometryReader` のサイズが変わったときに `MissionVideoWatchPresenter` の `updateVideoPlayerViewSize` メソッドを呼び出し、新しいサイズを更新します。また、`simultaneousGesture` メソッドはタップした位置を取得し、それを動画プレーヤー内の相対位置に変換し、`updateTapPositionInPlayer` メソッドで保存します。

---

## 👤 User
*2023-06-29 02:46:12*

MissionVideoWatchView は fullScreenCover で呼ばれるんだけど、そうなると実質GeometryReaderはどんな値を表すのか？

---

## 🤖 Assistant
*2023-06-29 02:46:46*

`GeometryReader`はビューが描画されている領域のサイズと位置情報を提供します。`MissionVideoWatchView`が`fullScreenCover`を使って全画面表示される場合、`GeometryReader`のサイズはデバイスのスクリーンの全領域を表すでしょう。

具体的には、`GeometryReader`が提供する`size.width`と`size.height`はデバイスのスクリーンの幅と高さをそれぞれ表します。同様に、`size`全体はスクリーン全体の領域を表します。

ただし、ステータスバーやノッチ（iPhone X以降のデバイスに存在）等のシステムUIによって実際に使用可能な領域が若干異なる場合があるので、それを考慮する必要があります。

この情報は、動画プレーヤーがどの程度の領域を占めているのか（つまり、`VideoPlayerView`の大きさがどの程度なのか）を理解するために有用です。これにより、ユーザがビューのどこをタップしたのかを正確に把握することが可能になります。

---

## 👤 User
*2023-06-29 02:52:47*

タップ位置というの正しくなくて、ライブラリを使って視線の焦点のCGPointがとれるんだ。それの動画のコンテンツに対する相対座標を取得したいんだ。

---

## 🤖 Assistant
*2023-06-29 02:53:53*

なるほど、視線の焦点を追跡するためのライブラリを使用して、その焦点の`CGPoint`を取得するとのことですね。

上記のコードではタップ位置の情報を使用していますが、これを視線の焦点の情報に置き換えることができます。

例えば、あるライブラリが視線の焦点を`CGPoint`として返すメソッド`getEyeFocusPoint()`を提供していると仮定すると、以下のようにコードを更新できます：

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                        .onChange(of: gr.size) { newSize in
                            presenter.updateVideoPlayerViewSize(newSize)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
        .onReceive(EyeTrackingLibrary.shared.$eyeFocusPoint) { focusPoint in
            let positionInPlayer = CGPoint(
                x: focusPoint.x / UIScreen.main.bounds.width,
                y: focusPoint.y / UIScreen.main.bounds.height
            )
            presenter.updateEyeFocusPositionInPlayer(positionInPlayer)
        }
    }
}
```

このコードでは、EyeTrackingLibraryから得られる視線の焦点の情報を受け取り、それを使って`updateEyeFocusPositionInPlayer`メソッドを呼び出しています。このメソッドでは視線の焦点の位置を、動画プレーヤー内の相対座標に変換しています。

なお、このコード例では、`EyeTrackingLibrary`という視線追跡ライブラリを使用していると仮定しています。使用するライブラリにより、利用可能なAPIや受け取ることのできる情報は異なる可能性があるので注意してください。

---

## 👤 User
*2023-06-29 03:16:49*

なるほど、その手の処理はなるべくpresenterでやりたくて、以下のようなインターフェースでsdkは提供されている

var gazePointPublisher: AnyPublisher&lt;CGPoint, Never&gt;

---

## 🤖 Assistant
*2023-06-29 03:17:36*

理解しました。SDKが`gazePointPublisher`というインターフェースを提供しているのであれば、Combineフレームワークを使用して視線の焦点を追跡することができます。`MissionVideoWatchPresenter`で直接購読して更新することが可能です。

以下にその例を示します:

Presenter:
```swift
final class MissionVideoWatchPresenter: ObservableObject {
    // ...
    private var gazePointCancellable: AnyCancellable?

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        // ...
        setUp()
    }

    func setUp() {
        gazePointCancellable = SDK.shared.gazePointPublisher
            .sink { [weak self] gazePoint in
                let positionInPlayer = CGPoint(
                    x: gazePoint.x / self?.videoPlayerViewSize.width ?? 1,
                    y: gazePoint.y / self?.videoPlayerViewSize.height ?? 1
                )
                self?.eyeFocusPositionInPlayer = positionInPlayer
            }
    }
    // ...
}
```
上記の`setUp()`メソッド内で、SDKから提供される`gazePointPublisher`を購読しています。購読すると、新しい視線の焦点が利用可能になるたびにブロック内のコードが実行されます。ブロック内では、取得した視線の焦点の位置を動画プレーヤー内の相対座標に変換し、その結果を`eyeFocusPositionInPlayer`プロパティに保存しています。

なお、このコード例では`SDK`という名前の視線追跡SDKを使用していると仮定しています。また、`gazePointCancellable`プロパティは、視線の焦点の購読を後でキャンセルするために保存されています。この購読を適切にキャンセルしないと、メモリリークが発生する可能性があります。

このようにすると、View側のコードは先程の例から視線の部分を取り除いてシンプルになります。

---

## 👤 User
*2023-06-29 03:18:09*

videoPlayerViewSize はどうやって得るの？Viewとpresenterのコードを書いて欲しい

---

## 🤖 Assistant
*2023-06-29 03:19:03*

了解しました。`videoPlayerViewSize`は`GeometryReader`から得られる動画プレーヤーのサイズを格納するためのプロパティです。このプロパティは、視線の焦点の動画プレーヤー内の相対位置を計算するために使用します。

まず、`MissionVideoWatchPresenter`に新しいプロパティを追加します:

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    // ...
    @Published var videoPlayerViewSize: CGSize = .zero
    // ...
}
```

次に、`MissionVideoWatchView`で、`GeometryReader`のサイズが変わるたびに`videoPlayerViewSize`を更新します：

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            presenter.videoPlayerViewSize = gr.size
                        }
                        .onChange(of: gr.size) { newSize in
                            presenter.videoPlayerViewSize = newSize
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

このようにすると、動画プレーヤーのサイズが変わるたびに、`presenter.videoPlayerViewSize`が自動的に更新されます。そして、`MissionVideoWatchPresenter`内の`setUp`メソッドで視線の焦点の位置を動画プレーヤー内の相対座標に変換するときにこの`videoPlayerViewSize`を使用します。

---

## 👤 User
*2023-06-29 03:22:39*

なるほど、presenterの値をviewで直接更新するのは避けたいので、presenterに関数を置いてそれで更新してほしい。また、Viewとプレゼンターの処理を全部書いて欲しい

---

## 🤖 Assistant
*2023-06-29 03:23:27*

理解しました。あなたが要望されているように、`MissionVideoWatchPresenter`に関数を配置してビューのサイズを更新します。`updateVideoPlayerViewSize`という名前の新しいメソッドを追加します。

`MissionVideoWatchPresenter`:
```swift
final class MissionVideoWatchPresenter: ObservableObject {
    //...
    @Published var videoPlayerViewSize: CGSize = .zero
    //...
    
    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size
    }
    //...
}
```
そして、`MissionVideoWatchView`で、`GeometryReader`のサイズが変わるたびにこの新しいメソッドを呼び出します。

`MissionVideoWatchView`:
```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                        .onChange(of: gr.size) { newSize in
                            presenter.updateVideoPlayerViewSize(newSize)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

このようにすると、プレゼンターはビデオプレーヤービューのサイズを制御し、視線の焦点の位置を動画プレーヤー内の相対座標に変換するときに使用できます。

---

## 👤 User
*2023-06-29 03:24:24*

プレゼンター側も全量書いて欲しい

---

## 🤖 Assistant
*2023-06-29 03:25:10*

すみません、その要望を見落としていました。以下に`MissionVideoWatchPresenter`の全コードを示します。視線の焦点をトラッキングするための`gazePointPublisher`を`setUp`メソッドに追加しました。


```swift
import Combine

final class MissionVideoWatchPresenter: ObservableObject {
    let avPlayer: AVPlayer
    private let sessionId: Session.ID
    private let movie: MissionValueType.Movie
    private var cancellableSet = Set<AnyCancellable>()
    @Published var shouldShowSkipButton = true
    @Published var resultType: MissionVideoWatchResultType?
    @Published var videoPlayerViewSize: CGSize = .zero
    
    var gazePointPublisher: AnyPublisher<CGPoint, Never> // Initialized with the gaze tracking library
    
    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        avPlayer = AVPlayer(url: movie.fileURL)
        self.sessionId = sessionId
        self.movie = movie

        setUp()
    }

    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size
    }
}

extension MissionVideoWatchPresenter {
    var orientation: UIDeviceOrientation {
        switch movie.orientation {
        case .portrait: return .portrait
        case .landscapeRight: return .landscapeRight
        }
    }
}

private extension MissionVideoWatchPresenter {
    func setUp() {
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem).sink { [weak self] _ in
            self?.resultType = .didComplete
        }
        .store(in: &cancellableSet)
        
        gazePointPublisher
            .sink { [weak self] gazePoint in
                guard let self = self else { return }
                let relativePoint = CGPoint(x: gazePoint.x / self.videoPlayerViewSize.width, y: gazePoint.y / self.videoPlayerViewSize.height)
                // Use `relativePoint` as needed
            }
            .store(in: &cancellableSet)
    }
}
```
このようにすれば、視線の焦点が変わるたびに、その焦点の動画プレーヤー内での相対位置を計算します。そしてこの相対位置をあなたが必要とする任意の処理に使用できます。

---

## 👤 User
*2023-06-29 03:28:14*

これって画面の領域すべてに動画プレーヤーがあることを想定した処理になっていない？例えばデバイスをポートレートで横長の動画だと、視線の相対座標は 負になったりすると思うんだけどどうなのかな？

---

## 🤖 Assistant
*2023-06-29 03:29:16*

ご指摘の通り、現在の実装は動画プレーヤーが画面全体を占めることを想定しています。そのため、視線の相対座標が負になる可能性があります。

デバイスの向きや動画のアスペクト比によって、動画プレーヤーが画面全体を占めない場合がある場合、その視線の座標を動画プレーヤーの座標空間に変換する必要があります。

まず、動画プレーヤーが中央に配置され、その周囲に黒い余白がある場合、視線座標のxおよびy値がvideoPlayerViewSizeの半分より大きいかどうかを確認します。もしそうであれば、視線座標からvideoPlayerViewSizeの半分を引いて、その座標を動画プレーヤーの座標空間に変換します。そして、その結果の座標を動画のサイズで割って相対座標を計算します。

また、動画のアスペクト比を考慮に入れるためには、動画プレーヤーのアスペクト比と視線の座標を適切に調整する必要があります。

以下にコードを示します:

```swift
gazePointPublisher
    .sink { [weak self] gazePoint in
        guard let self = self else { return }

        // Calculate the video frame in the player view, taking aspect ratio into account
        let videoAspect = self.movie.aspectRatio // Assume `aspectRatio` is available in `movie`
        let playerAspect = self.videoPlayerViewSize.width / self.videoPlayerViewSize.height
        let videoFrameInPlayerView: CGRect
        if videoAspect &gt; playerAspect {
            // Video aspect ratio is greater than the player's (i.e., video is wider)
            let height = self.videoPlayerViewSize.width / videoAspect
            let yOffset = (self.videoPlayerViewSize.height - height) / 2
            videoFrameInPlayerView = CGRect(x: 0, y: yOffset, width: self.videoPlayerViewSize.width, height: height)
        } else {
            // Video aspect ratio is less than or equal to the player's (i.e., video is taller)
            let width = self.videoPlayerViewSize.height * videoAspect
            let xOffset = (self.videoPlayerViewSize.width - width) / 2
            videoFrameInPlayerView = CGRect(x: xOffset, y: 0, width: width, height: self.videoPlayerViewSize.height)
        }

        // Convert gazePoint to the video player's coordinate space
        let relativePointInPlayerView = CGPoint(x: (gazePoint.x - videoFrameInPlayerView.origin.x) / videoFrameInPlayerView.size.width,
                                                y: (gazePoint.y - videoFrameInPlayerView.origin.y) / videoFrameInPlayerView.size.height)
        
        // Now relative

---

## 🤖 Assistant
*2023-06-29 03:29:45*

PointInPlayerView represents gazePoint in the coordinate space of the video content itself, ranging from (0,0) for the top-left corner of the video content to (1,1) for the bottom-right corner
        // Use `relativePointInPlayerView` as needed
    }
    .store(in: &cancellableSet)
```
このコードは、視線の座標を動画プレーヤーの座標空間に変換し、その後でその座標を動画の座標空間に変換します。そのため、この相対座標は動画の内容に対してのみ相対的なもので、動画プレーヤーの余白は考慮に入れません。

---

## 👤 User
*2023-06-29 03:30:39*

2で割る理由がよくわかっていない

---

## 🤖 Assistant
*2023-06-29 03:31:30*

ここで2で割っているのは、動画がビデオプレイヤーの中央に配置され、その周囲に黒い余白が存在する場合の状況を想定しています。動画のアスペクト比とプレイヤービューのアスペクト比が一致しないと、このような状況が起こります。 

例えば、デバイスがポートレートモードで、視聴している動画が横長（ランドスケープ）の場合、動画は上下に黒い余白を持つことになります。このとき、黒い余白部分を無視して、動画の内容に対する視線の位置を求めるためには、動画がビデオプレイヤービューのどこに位置しているかを知る必要があります。この位置は通常、ビデオプレイヤービューの中央になります。

したがって、黒い余白の高さは(ビデオプレイヤービューの高さ - 動画の高さ)で計算でき、その半分が上の黒い余白の高さになります。これが`yOffset`になります。同様に、黒い余白が左右にある場合も`xOffset`を計算します。

その後、このオフセットを使って視線の座標を動画の座標空間に変換します。それには、視線の座標からオフセットを引き（これにより動画の左上角が新たな原点になります）、その結果を動画の幅または高さで割ります。これにより、視線の座標は動画の座標空間に変換され、動画の左上角を(0,0)、右下角を(1,1)とする相対座標が得られます。

---

## 👤 User
*2023-06-29 03:32:00*

説明とてもわかりやすかった。うまくコードコメントとして反映して欲しい。

---

## 🤖 Assistant
*2023-06-29 03:32:57*

もちろんです。以下に、より詳細なコメントを追加したコードを示します。

```swift
extension MissionVideoWatchPresenter {
    // The function for updating the size of the video player
    func updateVideoPlayerViewSize(_ size: CGSize) {
        self.videoPlayerViewSize = size
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                guard let self = self, 
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                // Calculate offsets for the video content within the player view
                // When the aspect ratios of the video and the player view do not match, 
                // there will be black bars around the video.
                // In such a case, the video content is typically centered within the player view.
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect > videoPlayerViewSize.width / videoPlayerViewSize.height {
                    // For a video with landscape aspect ratio being watched in portrait mode
                    // The video content is horizontally filling the player view,
                    // with black bars at the top and bottom
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    // For a video with portrait aspect ratio being watched in landscape mode,
                    // or for a square video being watched in either portrait or landscape mode
                    // The video content is vertically filling the player view,
                    // with black bars at the left and right
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                // Subtract the offsets from the gaze point's coordinates
                // to translate the origin to the top-left corner of the video content,
                // then divide by the actual width and height of the video content
                // to convert the coordinates into the coordinate space of the video content,
                // where the top-left corner is (0,0) and the bottom-right corner is (1,1)
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                // Update the property with the gaze point in the video content's coordinate space
                // or do whatever is needed with this relative gaze point
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
```
上記のコードでは、より詳細なコメントを追加して、計算の背後にある意図と各ステップが何を行っているのかを明確に説明しています。

---

## 👤 User
*2023-06-29 03:35:24*

日本語でコメントお願いいたします。

---

## 🤖 Assistant
*2023-06-29 03:36:31*

もちろんです、日本語での詳細なコメントを以下に示します。

```swift
extension MissionVideoWatchPresenter {
    // ビデオプレイヤーのサイズを更新する関数
    func updateVideoPlayerViewSize(_ size: CGSize) {
        self.videoPlayerViewSize = size
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -&gt; CGPoint? in
                guard let self = self, 
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                // プレイヤービュー内のビデオコンテンツのオフセットを計算します。
                // ビデオとプレイヤービューのアスペクト比が一致しない場合、
                // ビデオの周囲に黒い余白が出ます。
                // このような場合、ビデオコンテンツは通常、プレイヤービューの中央に配置されます。
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect &gt; videoPlayerViewSize.width / videoPlayerViewSize.height {
                    // ポートレートモードで視聴されるランドスケープのビデオの場合
                    // ビデオコンテンツはプレイヤービューを水平に満たし、
                    // 上下に黒い余白があります。
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    // ランドスケープモードで視聴されるポートレートのビデオの場合、
                    // またはどちらのモードでも視聴される正方形のビデオの場合
                    // ビデオコンテンツはプレイヤービューを垂直に満たし、
                    // 左右に黒い余白があります。
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                // 視線の座標からオフセットを引いて（これによりビデオの左上隅が新たな原点になります）、
                // 結果をビデオコンテンツの実際の幅または高さで割ります。
                // これにより、視線の座標はビデオコンテンツの座標空間に変換され、
                // ビデオコンテンツの左上隅が(0,0)、右下隅が(1,1)となる相対座標が得られます。
                let x = (gazePoint.x - xOffset) /

---

## 🤖 Assistant
*2023-06-29 03:36:54*

(videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                // 視線の相対座標（ビデオコンテンツの座標空間における）をプロパティに更新します。
                // あるいは、必要に応じてこの相対座標を利用します。
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
```
上記のコードでは、日本語で詳細なコメントを追加し、計算の背後にある意図と各ステップが何を行っているのかを明確に説明しています。

---

## 👤 User
*2023-06-29 03:38:03*

ありがとう。relativePointInPlayerView を配列にしてpresenterで保持したいんだけどCombineを使ってうまく記述できないかな？

---

## 🤖 Assistant
*2023-06-29 03:38:46*

もちろんです、Combineを使用して視線の相対座標を更新し続け、それらを配列に追加するために以下のように書くことができます。以下の例では、配列の要素数が上限（たとえば100）に達したら、最初の要素が削除されて新しい要素が末尾に追加されるようになっています。

```swift
extension MissionVideoWatchPresenter {
    // 視線の相対座標を保持する配列
    @Published private(set) var relativePointsInPlayerView: [CGPoint] = []
    
    // 視線の相対座標の最大数（配列の要素数の上限）
    private let maxPoints = 100

    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                // 前述の処理を続行します...
            }
            .sink { [weak self] relativePointInPlayerView in
                // 新しい相対座標を配列に追加します。
                self?.relativePointsInPlayerView.append(relativePointInPlayerView)
                
                // 配列の要素数が上限を超えたら、最初の要素を削除します。
                if self?.relativePointsInPlayerView.count > self?.maxPoints {
                    self?.relativePointsInPlayerView.removeFirst()
                }
            }
            .store(in: &cancellableSet)
    }
}
```
この実装では、`relativePointsInPlayerView`配列は常に最新の視線の相対座標を保持し、配列のサイズは指定した最大値を超えることはありません。新しい視線の相対座標が追加されると、古い座標が順次配列から削除されます。

---

## 👤 User
*2023-06-29 03:39:57*

配列ではなければ.assign(to:)というメソッドで更新し続けられるが配列に貯めるためのメソッドってないんだっけ？

---

## 🤖 Assistant
*2023-06-29 03:40:39*

`assign(to:)` は指定したプロパティの値を更新するために使われますが、配列全体を更新する場合に使います。ある値（このケースでは `CGPoint`）を配列に追加するというケースには直接使うことはできません。

しかし、配列の要素を追加する専用のCombineのオペレータはありませんので、`.sink` を使用して各新しいイベントで配列に要素を追加するのが最も一般的な方法です。

それでも、配列に対する操作を一箇所にまとめたい場合は、新しいオペレータを作成することも可能です。例えば、以下のように `append(to:)` オペレータを作成することもできます：

```swift
import Combine

extension Publisher where Self.Output: Any {
    func append<T: RangeReplaceableCollection>(to collection: inout T) -> AnyCancellable where T.Element == Output {
        return self.sink(receiveValue: { collection.append($0) })
    }
}
```

ただし、このようなカスタムオペレータを作成する場合は、スレッドセーフを保証するための適切な措置を講じる必要があります。これは、特にSwiftUIとCombineを組み合わせて使用する場合には重要です。上記のコードはあくまで参考例で、そのまま使用するとマルチスレッド環境で問題を引き起こす可能性があります。

以上を踏まえて、`.sink` を使用することで十分な場合も多いです。特にこのケースでは、座標を配列に追加するときに要素数の上限を超えていないか確認するなど、配列に対する操作が単純な追加だけでないため、`.sink` を使用した方が適していると考えられます。

---

## 👤 User
*2023-06-29 03:41:46*

なるほどありがとう。ちなみに今のコードでViewとpresenterを全文記述してほしい。

---

## 🤖 Assistant
*2023-06-29 03:42:51*

以下はViewとPresenterの全文コードです。

まずはViewの部分：

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            // 動画プレーヤーのサイズをプレゼンターに渡します
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.startMonitoringGazePoint()
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

次にPresenterの部分：

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    let avPlayer: AVPlayer
    private let sessionId: Session.ID
    private let movie: MissionValueType.Movie
    private var videoPlayerViewSize: CGSize = .zero
    private var cancellableSet = Set<AnyCancellable>()
    @Published var shouldShowSkipButton = true
    @Published var resultType: MissionVideoWatchResultType?
    @Published private(set) var relativePointsInPlayerView: [CGPoint] = []
    private let maxPoints = 100
    var gazePointPublisher: AnyPublisher<CGPoint, Never> = ...

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        avPlayer = AVPlayer(url: movie.fileURL)
        self.sessionId = sessionId
        self.movie = movie

        setUp()
    }

    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                // 省略
            }
            .sink { [weak self] relativePointInPlayerView in
                // 省略
            }
            .store(in: &cancellableSet)
    }

    // 他のコードは省略
}
```

ご確認ください。また、具体的な実装や細部の調整はプロジェクトの要件や既存のコード、SDKの具体的な使用方法などによって変わる可能性があることをご理解ください。このコードは、あくまで一つの例示であり、すべてがあなたの具体的な要件に適合しているわけではありません。

---

## 👤 User
*2023-06-29 05:39:01*

videoAspect を取得する処理は？

---

## 🤖 Assistant
*2023-06-29 05:39:43*

すみません、その部分を省略してしまいました。以下に`MissionVideoWatchPresenter`の修正版を記述します。

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    let avPlayer: AVPlayer
    private let sessionId: Session.ID
    private let movie: MissionValueType.Movie
    private var videoPlayerViewSize: CGSize = .zero
    private var videoAspect: CGFloat = 1.0 // デフォルト値
    private var cancellableSet = Set<AnyCancellable>()
    @Published var shouldShowSkipButton = true
    @Published var resultType: MissionVideoWatchResultType?
    @Published private(set) var relativePointsInPlayerView: [CGPoint] = []
    private let maxPoints = 100
    var gazePointPublisher: AnyPublisher<CGPoint, Never> = ...

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        avPlayer = AVPlayer(url: movie.fileURL)
        self.sessionId = sessionId
        self.movie = movie
        // ムービーのアスペクト比を計算
        videoAspect = movie.size.width / movie.size.height
        setUp()
    }

    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                // 省略
            }
            .sink { [weak self] relativePointInPlayerView in
                // 省略
            }
            .store(in: &cancellableSet)
    }

    // 他のコードは省略
}
```

ここでは`init`メソッド内で動画のアスペクト比(`videoAspect`)を計算しています。ここで`movie.size`は動画のフレームサイズを表していると想定しています。実際のプロジェクトでは`AVAsset`から適切な情報を取得する必要があるかもしれません。

---

## 👤 User
*2023-06-29 05:40:08*

そのとおりでmovieはその情報を持っていない

---

## 🤖 Assistant
*2023-06-29 05:41:03*

それであれば、`AVAsset`を使って動画のアスペクト比を計算することができます。具体的には`AVAssetTrack`の`naturalSize`プロパティを利用します。ただし、`AVAsset`の読み込みは非同期に行われるため、コードには`AVAsset`の読み込み完了を待つロジックが必要になります。

以下にアスペクト比の計算方法を示します:

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    // 他のプロパティとメソッドは省略

    private var videoAspect: CGFloat = 1.0 // デフォルト値

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        avPlayer = AVPlayer(url: movie.fileURL)
        self.sessionId = sessionId
        self.movie = movie

        // 非同期でAVAssetをロードします
        avPlayer.currentItem?.asset.loadValuesAsynchronously(forKeys: ["tracks"], completionHandler: {
            var error: NSError? = nil
            let status = self.avPlayer.currentItem?.asset.statusOfValue(forKey: "tracks", error: &error)
            if status == .loaded {
                // AVAssetが正常に読み込まれた場合
                if let track = self.avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
                    // ビデオのアスペクト比を計算
                    self.videoAspect = track.naturalSize.width / track.naturalSize.height
                }
            } else {
                // AVAssetの読み込みに問題があった場合のエラーハンドリング
            }
        })

        setUp()
    }

    // 他のメソッドは省略
}
```

上記のコードは、`AVPlayer`の`currentItem`の`asset`からビデオトラックを取得し、その`naturalSize`からアスペクト比を計算します。読み込みが完了するまでアスペクト比が不確定になるため、その間はデフォルト値(ここでは1.0)を使用します。また、`loadValuesAsynchronously(forKeys:completionHandler:)`メソッドを使って`AVAsset`の非同期読み込みを行います。

なお、これらの操作は非同期に行われ、エラーを含む可能性があるため、適切なエラーハンドリングが必要です。ここでは読み込み状態をチェックしていますが、エラーハンドリングの詳細はプロジェクトの要件に応じて調整する必要があります。

---

## 👤 User
*2023-06-29 05:43:52*

既存のupdateVideoPlayerViewSize() のタイミングでvideoAspectを更新してはいけないのかな？

let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
        let videoSize = videoTrack?.naturalSize ?? CGSize.zero
        videoAspect = CGSize(width: videoSize.width / size.width, height: videoSize.height / size.height)

---

## 🤖 Assistant
*2023-06-29 05:44:47*

はい、それも一つの手段ですね。ただし、ビデオのアスペクト比が定数であるという前提の元での処理となります。つまり、ビデオが再生される前や再生中にアスペクト比が変わらない場合に限ります。このケースでは、`AVPlayer`の`currentItem`が更新されるたびに`updateVideoPlayerViewSize()`を呼び出すことで、`videoAspect`の更新を行うことができます。

以下にその例を示します。

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    //...
    //...
    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size
        updateVideoAspect()
        computeRelativePoints()
    }

    private func updateVideoAspect() {
        let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
        let videoSize = videoTrack?.naturalSize ?? CGSize.zero
        videoAspect = CGSize(width: videoSize.width / videoPlayerViewSize.width, height: videoSize.height / videoPlayerViewSize.height)
    }
    //...
    //...
}
```

上記のコードでは、ビデオプレイヤーのビューのサイズが更新されるたびに、`updateVideoPlayerViewSize()`内で`updateVideoAspect()`を呼び出し、アスペクト比を更新しています。

ただし、注意点としては、ビデオトラックの取得やビデオの`naturalSize`の取得は通常非同期に行われます。そのため、`updateVideoAspect()`が呼び出されるタイミングでビデオの読み込みが完了していない場合、期待する結果が得られない可能性があります。この場合は、初めに説明したように`AVAsset`の読み込み完了を待つ必要があります。

なお、再生中のビデオのアスペクト比が変わることは通常はありませんが、例外的なケース（例えば広告の挿入や異なるアスペクト比の動画への切り替えなど）に対応するためには、アスペクト比の更新を動的に行う仕組みが必要となります。その場合は、ビデオの再生状態の変更を検知してアスペクト比を更新するようなロジックが必要になるでしょう。

---

## 👤 User
*2023-06-29 05:46:39*

private関数にわけないくていいよ。こうするとvideoPlayerViewSizeとvideoAspectはほぼ同時のタイミングで更新がかけられると言う理解であっていますか？

---

## 🤖 Assistant
*2023-06-29 05:47:08*

はい、その通りです。関数を分けずに書くことにより、`videoPlayerViewSize`と`videoAspect`は同一の関数内で更新されるので、更新のタイミングがほぼ同じになります。ただし、完全に同時とは言えません。なぜなら、コードは一行ずつ順番に実行されるため、`videoPlayerViewSize`が先に更新され、その後で`videoAspect`が更新されます。

下記のように`updateVideoPlayerViewSize`関数を改めて定義することで、同じ関数内で`videoPlayerViewSize`と`videoAspect`の更新を行うことができます。

```swift
final class MissionVideoWatchPresenter: ObservableObject {
    //...
    //...

    func updateVideoPlayerViewSize(_ size: CGSize) {
        videoPlayerViewSize = size

        let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first
        let videoSize = videoTrack?.naturalSize ?? CGSize.zero
        videoAspect = CGSize(width: videoSize.width / videoPlayerViewSize.width, height: videoSize.height / videoPlayerViewSize.height)

        computeRelativePoints()
    }

    //...
    //...
}
```

上記のコードでは、`updateVideoPlayerViewSize`が呼ばれた際に、まず`videoPlayerViewSize`を更新し、次に`videoAspect`を更新します。これにより、両者の更新はほぼ同時に行われるようになります。

---

## 👤 User
*2023-06-29 05:49:15*

videoAspect は CGSize 型なのはなぜ？

---

## 🤖 Assistant
*2023-06-29 05:49:50*

`videoAspect`はビデオのアスペクト比（幅と高さの比率）を表すために`CGSize`型を使用しています。この型を使用することで、幅（width）と高さ（height）の2つの値を1つの変数で表現することができます。

具体的には、`videoAspect`の`width`プロパティはビデオの幅の比率を、`height`プロパティはビデオの高さの比率を表します。したがって、`videoAspect`を計算する際には、ビデオの実際の幅と高さをビデオプレーヤービューの幅と高さでそれぞれ割ることで、ビデオのアスペクト比を得ることができます。

もし`videoAspect`を2つの独立した`Float`型の変数（例えば`videoAspectWidth`と`videoAspectHeight`）で表現すると、変数の数が増えてコードの管理が難しくなる可能性があります。このため、`CGSize`型を使用して幅と高さの比率を1つの変数でまとめて表現しています。

ただし、これは一つの設計方針であり、必ずしもこの方法を選ばなければならないわけではありません。プロジェクトの要件やチームのコーディングスタイルによりますので、適切な方法を選択してください。

---

## 👤 User
*2023-06-29 05:51:27*

このようなことはvideoAspect は CGSize 型として可能なのか？

extension MissionVideoWatchPresenter {
    // ビデオプレイヤーのサイズを更新する関数
    func updateVideoPlayerViewSize(_ size: CGSize) {
        self.videoPlayerViewSize = size
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -&gt; CGPoint? in
                guard let self = self, 
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                // プレイヤービュー内のビデオコンテンツのオフセットを計算します。
                // ビデオとプレイヤービューのアスペクト比が一致しない場合、
                // ビデオの周囲に黒い余白が出ます。
                // このような場合、ビデオコンテンツは通常、プレイヤービューの中央に配置されます。
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect &gt; videoPlayerViewSize.width / videoPlayerViewSize.height {
                    // ポートレートモードで視聴されるランドスケープのビデオの場合
                    // ビデオコンテンツはプレイヤービューを水平に満たし、
                    // 上下に黒い余白があります。
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    // ランドスケープモードで視聴されるポートレートのビデオの場合、
                    // またはどちらのモードでも視聴される正方形のビデオの場合
                    // ビデオコンテンツはプレイヤービューを垂直に満たし、
                    // 左右に黒い余白があります。
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                // 視線の座標からオフセットを引いて（これによりビデオの左上隅が新たな原点になります）、
                // 結果をビデオコンテンツの実際の幅または高さで割ります。
                // これにより、視線の座標はビデオコンテンツの座標空間に変換され、
                // ビデオコンテンツの左上隅が(0,0)、右下隅が(1,1)となる相対座標が得られます。
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                // 視線の相対座標（ビデオコンテンツの座標空間における）をプロパティに更新します。
                // あるいは、必要に応じてこの相対座標を利用します。
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
03:43
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding&lt;MissionVideoWatchResultType?&gt;) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            // 動画プレーヤーのサイズをプレゼンターに渡します
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.startMonitoringGazePoint()
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}

---

## 🤖 Assistant
*2023-06-29 05:52:26*

すみません、videoAspect の比較が意味をなさないことに気づきました。videoAspect は CGSize なので、直接数値と比較することはできません。ここでは、ビデオのアスペクト比（videoAspect.width / videoAspect.height）とビデオプレイヤービューのアスペクト比（videoPlayerViewSize.width / videoPlayerViewSize.height）を比較するべきです。

修正したコードを以下に示します。

```swift
extension MissionVideoWatchPresenter {
    // ビデオプレイヤーのサイズを更新する関数
    func updateVideoPlayerViewSize(_ size: CGSize) {
        self.videoPlayerViewSize = size
        
        if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
            let videoSize = videoTrack.naturalSize
            self.videoAspect = CGSize(width: videoSize.width / size.width, height: videoSize.height / size.height)
        }
    }
    
    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                guard let self = self, 
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect.width / videoAspect.height > videoPlayerViewSize.width / videoPlayerViewSize.height {
                    let videoHeight = videoPlayerViewSize.width / (videoAspect.width / videoAspect.height)
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    let videoWidth = videoPlayerViewSize.height * (videoAspect.width / videoAspect.height)
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
```

これで、適切にアスペクト比を計算し、視線のポイントをビデオのコンテンツに対する相対座標に変換することができるようになりました。

---

## 👤 User
*2023-06-29 05:54:47*

なるほど、if videoAspect.width / videoAspect.height &gt; videoPlayerViewSize.width / videoPlayerViewSize.height { } の場合と else {} がそれぞれ何をいみしているか日本語でコメントを追記して欲しい

---

## 🤖 Assistant
*2023-06-29 05:55:37*

もちろんです、以下にそれぞれの条件の意味を説明します。

```swift
// ビデオのアスペクト比とビデオプレーヤービューのアスペクト比を比較します
if videoAspect.width / videoAspect.height > videoPlayerViewSize.width / videoPlayerViewSize.height {
    // この場合、ビデオのアスペクト比はビデオプレーヤービューのアスペクト比よりも大きいということです。
    // つまり、ビデオはビデオプレーヤービューの幅を満たすために縮小され、上下に黒い余白（レターボックス）が出現します。
    // そのため、ビデオの実際の高さを計算し、その基づいてyオフセットを決定します。xオフセットは0です。
    let videoHeight = videoPlayerViewSize.width / (videoAspect.width / videoAspect.height)
    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
    xOffset = 0
} else {
    // この場合、ビデオのアスペクト比はビデオプレーヤービューのアスペクト比よりも小さいということです。
    // つまり、ビデオはビデオプレーヤービューの高さを満たすために縮小され、左右に黒い余白（ピラーボックス）が出現します。
    // そのため、ビデオの実際の幅を計算し、その基づいてxオフセットを決定します。yオフセットは0です。
    let videoWidth = videoPlayerViewSize.height * (videoAspect.width / videoAspect.height)
    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
    yOffset = 0
}
```

上記のコメントは、ビデオとビデオプレーヤービューのアスペクト比が異なる場合に黒い余白が出現する理由を説明しています。それぞれの条件下でのオフセットの計算方法も説明しています。

---

## 👤 User
*2023-06-29 06:04:09*

videoAspect は Double型で扱ったほうが良くないかな？

---

## 🤖 Assistant
*2023-06-29 06:04:39*

動画のアスペクト比を取得する際、通常は幅と高さの比率（つまり、一つの数値）を取得します。したがって、あなたの提案通り `Double` 型でアスペクト比を扱うのが自然かもしれません。その場合、アスペクト比の取得と更新は次のようになります。

```swift
func updateVideoPlayerViewSize(_ size: CGSize) {
    self.videoPlayerViewSize = size
    
    if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
        let videoSize = videoTrack.naturalSize
        self.videoAspect = videoSize.width / videoSize.height
    }
}
```

そして、`startMonitoringGazePoint()` 内のアスペクト比の使用箇所も次のように修正します。

```swift
if videoAspect > videoPlayerViewSize.width / videoPlayerViewSize.height {
    let videoHeight = videoPlayerViewSize.width / videoAspect
    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
    xOffset = 0
} else {
    let videoWidth = videoPlayerViewSize.height * videoAspect
    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
    yOffset = 0
}
```

こうすることで、コードがより直感的になり、`CGSize`を不要に使用することもなくなります。

---

## 👤 User
*2023-06-29 06:06:02*

このほうがわかりやすい。Viewとプレゼンターのコードを書き直して欲しい。全量書いて欲しい。

---

## 🤖 Assistant
*2023-06-29 06:07:02*

もちろんです、以下が修正後のコードです：

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            // 動画プレーヤーのサイズと動画のアスペクト比をプレゼンターに渡します
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.startMonitoringGazePoint()
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

```swift
class MissionVideoWatchPresenter: ObservableObject {
    @Published var resultType: MissionVideoWatchResultType?
    @Published var avPlayer: AVPlayer
    @Published var orientation: UIInterfaceOrientation
    @Published var videoPlayerViewSize: CGSize?
    @Published var videoAspect: Double?
    @Published var relativePointInPlayerView: CGPoint?

    private var cancellableSet: Set&lt;AnyCancellable&gt; = []
    private var gazePointPublisher: AnyPublisher&lt;CGPoint, Never&gt;

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        // setup AVPlayer, orientation and gazePointPublisher
    }
    
    func updateVideoPlayerViewSize(_ size: CGSize) {
        self.videoPlayerViewSize = size
        
        if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
            let videoSize = videoTrack.naturalSize
            self.videoAspect = videoSize.width / videoSize.height
        }
    }

    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -&gt; CGPoint? in
                guard let self = self,
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect &gt; videoPlayerViewSize.width / videoPlayerViewSize.height {
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) /

---

## 🤖 Assistant
*2023-06-29 06:07:20*

(videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
```

ここでは、`videoAspect` を `Double` として扱っています。さらに、`updateVideoPlayerViewSize(_:)` 内で `videoAspect` を更新する際に、ビデオトラックから直接アスペクト比を取得するように修正しています。

---

## 👤 User
*2023-06-29 06:11:09*

ちなみに MissionVideoWatchPresenterの責務としてはあまりこのような処理を書きたくなくて、Interactorとして、処理を記述したい。

presenterからInteractorにはfunc updateMovieTrack(videoPlayerViewSize: CGSize, videoAspect: Double) で Interactor で保持するvideoPlayerViewSize: CGSize?とvideoAspect: Double? に更新をかけるイメージです。修正してほしい。

---

## 🤖 Assistant
*2023-06-29 06:12:04*

了解しました。PresenterとInteractorを使ってモデルを更新する方法を以下に示します。

まず、新たなInteractorを定義します：

```swift
class VideoInteractor: ObservableObject {
    @Published var videoPlayerViewSize: CGSize?
    @Published var videoAspect: Double?
    
    func updateMovieTrack(videoPlayerViewSize: CGSize, videoAspect: Double) {
        self.videoPlayerViewSize = videoPlayerViewSize
        self.videoAspect = videoAspect
    }
}
```

次に、Presenterを更新します：

```swift
class MissionVideoWatchPresenter: ObservableObject {
    @Published var resultType: MissionVideoWatchResultType?
    @Published var avPlayer: AVPlayer
    @Published var orientation: UIInterfaceOrientation
    @Published var relativePointInPlayerView: CGPoint?

    private var cancellableSet: Set<AnyCancellable> = []
    private var gazePointPublisher: AnyPublisher<CGPoint, Never>
    private var videoInteractor = VideoInteractor()

    init(sessionId: Session.ID, movie: MissionValueType.Movie) {
        // setup AVPlayer, orientation and gazePointPublisher
    }
    
    func updateVideoPlayerViewSize(_ size: CGSize) {
        if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
            let videoSize = videoTrack.naturalSize
            let videoAspect = videoSize.width / videoSize.height
            
            videoInteractor.updateMovieTrack(videoPlayerViewSize: size, videoAspect: videoAspect)
        }
    }

    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                guard let self = self,
                      let videoPlayerViewSize = self.videoInteractor.videoPlayerViewSize,
                      let videoAspect = self.videoInteractor.videoAspect else { return nil }
                
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect > videoPlayerViewSize.width / videoPlayerViewSize.height {
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                self?.relativePointInPlayerView = relativePointInPlayerView
            }
            .store(in: &cancellableSet)
    }
}
```

このように、Presenterはビデオのアスペクト比とサイズを取得し、それらを使ってInteractorを更新します。Interactorはこの情報を保持し、必要に応じて返すことができます。また、Interactorの情報はPublisherを介して非同期にPresenterにフィードバックされ、必要に応じてUIの更新に利用されます。

---

## 👤 User
*2023-06-29 06:13:02*

gazePointPublisher の サブスクライブ処理も VideoInteractor 側で行いたい。Interactorに [CGPoint(x: x, y: y)] をどんどん貯めて欲しい。

---

## 🤖 Assistant
*2023-06-29 06:14:03*

承知しました。そのような要求に応じて、`VideoInteractor`と`MissionVideoWatchPresenter`を次のように更新しましょう：

まず、新しいInteractorを定義します：

```swift
class VideoInteractor: ObservableObject {
    @Published var videoPlayerViewSize: CGSize?
    @Published var videoAspect: Double?
    @Published var relativePointsInPlayerView: [CGPoint] = []

    private var gazePointPublisher: AnyPublisher<CGPoint, Never>
    private var cancellableSet: Set<AnyCancellable> = []
    
    init(gazePointPublisher: AnyPublisher<CGPoint, Never>) {
        self.gazePointPublisher = gazePointPublisher
    }

    func updateMovieTrack(videoPlayerViewSize: CGSize, videoAspect: Double) {
        self.videoPlayerViewSize = videoPlayerViewSize
        self.videoAspect = videoAspect
    }

    func startMonitoringGazePoint() {
        gazePointPublisher
            .map { [weak self] gazePoint -> CGPoint? in
                guard let self = self,
                      let videoPlayerViewSize = self.videoPlayerViewSize,
                      let videoAspect = self.videoAspect else { return nil }
                
                let yOffset: CGFloat
                let xOffset: CGFloat
                if videoAspect > videoPlayerViewSize.width / videoPlayerViewSize.height {
                    let videoHeight = videoPlayerViewSize.width / videoAspect
                    yOffset = (videoPlayerViewSize.height - videoHeight) / 2
                    xOffset = 0
                } else {
                    let videoWidth = videoPlayerViewSize.height * videoAspect
                    xOffset = (videoPlayerViewSize.width - videoWidth) / 2
                    yOffset = 0
                }
                
                let x = (gazePoint.x - xOffset) / (videoPlayerViewSize.width - 2 * xOffset)
                let y = (gazePoint.y - yOffset) / (videoPlayerViewSize.height - 2 * yOffset)
                
                return CGPoint(x: x, y: y)
            }
            .sink { [weak self] relativePointInPlayerView in
                if let relativePointInPlayerView = relativePointInPlayerView {
                    self?.relativePointsInPlayerView.append(relativePointInPlayerView)
                }
            }
            .store(in: &cancellableSet)
    }
}
```

次に、Presenterを更新します：

```swift
class MissionVideoWatchPresenter: ObservableObject {
    @Published var resultType: MissionVideoWatchResultType?
    @Published var avPlayer: AVPlayer
    @Published var orientation: UIInterfaceOrientation

    private var videoInteractor: VideoInteractor

    init(sessionId: Session.ID, movie: MissionValueType.Movie, gazePointPublisher: AnyPublisher<CGPoint, Never>) {
        // setup AVPlayer, orientation
        self.videoInteractor = VideoInteractor(gazePointPublisher: gazePointPublisher)
    }
    
    func updateVideoPlayerViewSize(_ size: CGSize) {
        if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
            let videoSize = videoTrack.naturalSize
            let videoAspect = videoSize.width / videoSize.height
            
            videoInteractor.updateMovieTrack(videoPlayerViewSize: size, videoAspect: videoAspect)
        }
    }

    func startMonitoringGazePoint() {
        videoInteractor.startMonitoringGazePoint()
    }
}
```

このように、Interactorは視線の座標を取得し、それを基に相対座標の配列を

---

## 🤖 Assistant
*2023-06-29 06:14:17*

生成します。一方、Presenterはビデオのアスペクト比とサイズを取得し、それらを使ってInteractorを更新します。Interactorの情報はPublisherを介して非同期にPresenterにフィードバックされ、必要に応じてUIの更新に利用されます。

---

## 👤 User
*2023-07-02 16:12:41*

Viewの処理も書いて欲しい

---

## 🤖 Assistant
*2023-07-02 16:13:10*

もちろんです。Viewが次のようになります：

```swift
struct MissionVideoWatchView: View {
    @StateObject private var presenter: MissionVideoWatchPresenter
    @Binding private var resultType: MissionVideoWatchResultType?
    @Environment(\.dismiss) private var dismiss

    init(sessionId: Session.ID, movie: MissionValueType.Movie, resultType: Binding<MissionVideoWatchResultType?>) {
        _resultType = resultType
        _presenter = .init(wrappedValue: .init(sessionId: sessionId, movie: movie))
    }

    var body: some View {
        ZStack {
            GeometryReader { gr in
                ZStack(alignment: .bottomTrailing) {
                    VideoPlayerView(videoPlayer: presenter.avPlayer)
                        .frame(width: gr.size.width, height: gr.size.height)
                        .onAppear {
                            // 動画プレーヤーのサイズをプレゼンターに渡します
                            presenter.updateVideoPlayerViewSize(gr.size)
                        }
                    SkipButtonView(resultType: $presenter.resultType)
                        .isHidden(!presenter.shouldShowSkipButton, remove: true)
                }
            }
            MissionAnalysisView(settingsPresenter: .init(), orientation: presenter.orientation)
        }
        .background(CoreAssets.Color.Neutral.black.swiftUIColor)
        .onAppear {
            presenter.startMonitoringGazePoint()
            presenter.avPlayer.play()
        }
        .onChange(of: presenter.resultType) { resultType in
            dismiss()
            self.resultType = resultType
        }
    }
}
```

ここでは`MissionVideoWatchView`が同じままです。`MissionVideoWatchPresenter`がすべてのロジックを担当し、そのロジックは内部的に`VideoInteractor`に委譲されます。このようにすると、各クラスの役割が明確になり、コードの読みやすさと保守性が向上します。

---

## 👤 User
*2023-07-02 16:15:36*

ガード文にして欲しい

func updateVideoPlayerViewSize(_ size: CGSize) {
        if let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first {
            let videoSize = videoTrack.naturalSize
            let videoAspect = videoSize.width / videoSize.height
            
            anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: size, videoAspect: videoAspect)
        }
    }

---

## 🤖 Assistant
*2023-07-02 16:15:50*

了解しました。`guard let` を用いて、`videoTrack`が存在しない場合の早期リターンを実装します。以下のように修正しました：

```swift
func updateVideoPlayerViewSize(_ size: CGSize) {
    guard let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first else { return }
    
    let videoSize = videoTrack.naturalSize
    let videoAspect = videoSize.width / videoSize.height
    
    anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: size, videoAspect: videoAspect)
}
```

この修正により、`videoTrack`が存在しない場合、関数はすぐにリターンし、後続の処理が実行されません。これによりコードの可読性と安全性が向上します。

---

## 👤 User
*2023-07-02 16:26:07*

このonAppearのタイミングではupdateVideoPlayerViewSizeはguardでリターンしてしまった。
updateVideoPlayerViewSizeの実行タイミングを適切にしたい

VideoPlayerView(videoPlayer: presenter.avPlayer)
                    // aspectRatio == .fillにすると、widthが画面外まで伸びてしまい、制御で出来なくなるので、
                    // 仕方なくGeometryReaderで仮実装
                    .frame(width: gr.size.width, height: gr.size.height)
                    .onAppear {
                        // 動画プレーヤーのサイズをプレゼンターに渡します
                        presenter.updateVideoPlayerViewSize(videoPlayerViewSize: gr.size)
                    }

@MainActor
final class MissionVideoWatchPresenter: ObservableObject {
    let avPlayer = AVPlayer()
    private let sessionId: Session.ID
    private let movie: MissionValueType.Movie
    @Binding var videoPlayingStatus: VideoPlayingStatus? {
        didSet {
            #if DEBUG
                if let videoPlayingStatus {
                    print("VideoPlayingStatus: \(videoPlayingStatus)")
                }
            #endif
            if let videoPlayingStatus, videoPlayingStatus == .interrupted {
                shouldShowVideoInterruptedAlert = true
            }
        }
    }

    @Published var shouldShowSkipButton = false
    @Published var resultType: MissionVideoWatchResultType?
    @Published var isLoading = false
    @Published var appError: AppError?
    @Published var shouldShowAlert = false
    @Published var shouldShowVideoInterruptedAlert = false

    private let userDefaultsManager: UserDefaultsManagerProtocol
    private let anchorAndEmotionAnalysisInteractor: AnchorAndEmotionAnalysisInteractorProtocol
    private var cancellableSet = Set&lt;AnyCancellable&gt;()
    private var observers: [NSKeyValueObservation] = []

    init(
        sessionId: Session.ID,
        movie: MissionValueType.Movie,
        videoPlayingStatus: Binding&lt;VideoPlayingStatus?&gt;,
        userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager(),
        anchorAndEmotionAnalysisInteractor: AnchorAndEmotionAnalysisInteractorProtocol = AnchorAndEmotionAnalysisInteractor()
    ) {
        self.sessionId = sessionId
        self.movie = movie
        _videoPlayingStatus = videoPlayingStatus
        self.userDefaultsManager = userDefaultsManager
        self.anchorAndEmotionAnalysisInteractor = anchorAndEmotionAnalysisInteractor

        setSubscriber()
    }

    deinit {
        Task {
            await anchorAndEmotionAnalysisInteractor.endAnalysis()
        }
        AppLogger.debugDeinit()
    }

    func onAppear() async {
        isLoading = true
        defer {
            isLoading = false
        }
        do {
            // (1) 動画のダウンロード
            let fileURL = try await downloadVideoResource()

            // (2) SeeSoの初期化
            await anchorAndEmotionAnalysisInteractor.initializationGazeTracker()

            // (3) トラッカーが動き出すまで待機する
            try await anchorAndEmotionAnalysisInteractor.startAnalysis(orientation: movie.orientation)

            // (4) Playerの読み込み（サムネイルの読み込み）
            let avPlayerItem = AVPlayerItem(url: fileURL)
            // リモート用のサンプル(使う時はコメントアウトを消す)
//            let avAsset = AVAsset(url: URL(string: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8")!)
//            let avPlayerItem = AVPlayerItem(asset: avAsset)
            avPlayer.replaceCurrentItem(with: avPlayerItem)
            try setUpAudio()

            // (5) 動画の再生
            avPlayer.play()
        } catch {
            appError = error.asAppError
        }
    }
    
    func updateVideoPlayerViewSize(videoPlayerViewSize: CGSize) {
        guard let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first else {
            AppLogger.debugLog("video track not found", level: .error)
            return
        }
        
        let videoSize = videoTrack.naturalSize
        let videoAspect = videoSize.width / videoSize.height
        
        anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: videoPlayerViewSize, videoAspect: videoAspect)
    }
}

---

## 🤖 Assistant
*2023-07-02 16:26:48*

ここでの課題は、`AVPlayer`が`AVPlayerItem`をロードし、ビデオトラックが利用可能になるタイミングをキャプチャすることです。このタイミングでは、ビデオの自然なサイズを取得し、アスペクト比を計算することができます。

Swiftの`AVPlayerItem`には、`status`というプロパティがあり、これは`AVPlayerItem.Status`型の値を持ちます。この`status`プロパティの値は、`AVPlayerItem`の状態を表し、次の3つの値を取ることができます。

1. `AVPlayerItem.Status.unknown` - メディアがまだ読み込まれていない、または読み込みが進行中であることを示します。
2. `AVPlayerItem.Status.readyToPlay` - メディアが再生可能であることを示します。
3. `AVPlayerItem.Status.failed` - メディアの読み込みが失敗したことを示します。

したがって、`AVPlayerItem`の`status`プロパティが`AVPlayerItem.Status.readyToPlay`になった時点で、ビデオトラックの自然なサイズとアスペクト比を取得し、それをInteractorに渡すことができます。そのためには、`status`プロパティの変化を監視するKVO（Key-Value Observing）を使うことができます。

以下に、`onAppear`メソッドと`updateVideoPlayerViewSize`メソッドを修正した例を示します：

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        // (1) 動画のダウンロード
        let fileURL = try await downloadVideoResource()

        // (2) SeeSoの初期化
        await anchorAndEmotionAnalysisInteractor.initializationGazeTracker()

        // (3) トラッカーが動き出すまで待機する
        try await anchorAndEmotionAnalysisInteractor.startAnalysis(orientation: movie.orientation)

        // (4) Playerの読み込み（サムネイルの読み込み）
        let avPlayerItem = AVPlayerItem(url: fileURL)
        // リモート用のサンプル(使う時はコメントアウトを消す)
//        let avAsset = AVAsset(url: URL(string: "http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8")!)
//        let avPlayerItem = AVPlayerItem(asset: avAsset)
        avPlayer.replaceCurrentItem(with: avPlayerItem)
        try setUpAudio()

        // (5) 動画の再生
        avPlayer.play()

        // 監視を開始
        observers.append(avPlayerItem.observe(\.status, options: [.new]) { [weak self] item, change in
            if item.status == .readyTo

---

## 🤖 Assistant
*2023-07-02 16:27:10*

Play {
                self?.updateVideoPlayerViewSize(videoPlayerViewSize: videoPlayerView.frame.size)
            }
        })
    } catch {
        appError = error.asAppError
    }
}

func updateVideoPlayerViewSize(videoPlayerViewSize: CGSize) {
    guard let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first else {
        AppLogger.debugLog("video track not found", level: .error)
        return
    }
    
    let videoSize = videoTrack.naturalSize
    let videoAspect = videoSize.width / videoSize.height
    
    anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: videoPlayerViewSize, videoAspect: videoAspect)
}
```

これにより、`AVPlayerItem`が準備完了した瞬間にビデオの自然なサイズとアスペクト比を取得してInteractorに渡すことができます。

---

## 👤 User
*2023-07-02 16:27:35*

その処理ってsetSubscriberにあったほうが自然かな？

private extension MissionVideoWatchPresenter {
    func setSubscriber() {
        let playing = avPlayer.publisher(for: \.timeControlStatus)
            .removeDuplicates()
            .filter { $0 == .playing }
            .map { _ in VideoPlayingStatus.didStart }

        let paused = avPlayer.publisher(for: \.timeControlStatus)
            .removeDuplicates()
            .filter { $0 == .paused }
            .dropFirst() // AVPlayer の初期状態は `paused` のためスキップする
            .map { _ in VideoPlayingStatus.paused }

        let endPlaying = NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem)
            .map { _ in VideoPlayingStatus.didEnd }

        playing
            .merge(with: endPlaying)
            .combineLatest(paused)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] playingStatus, paused in
                guard let self else { return }
                if playingStatus == .didStart, paused == .paused {
                    self.videoPlayingStatus = .interrupted
                    self.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .error(.init(message: "interrupted error"))))
                }
            }
            .store(in: &cancellableSet)

        playing
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoPlay(.init(source: "")))) // 本来 Web イベントのため空文字でよい
                self?.shouldShowSkipButton = true
                self?.videoPlayingStatus = .didStart
            }
            .store(in: &cancellableSet)

        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                guard let self else { return }
                Task { @MainActor in
                    await self.endedVideo()
                }
            }
            .store(in: &cancellableSet)

        $appError
            .mapIsNotNil()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] shouldShowAlert in
                AppLogger.debugLog(self?.appError.debugDescription ?? "", level: .error)
                self?.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .error(.init(message: self?.appError.debugDescription ?? ""))))
                self?.shouldShowAlert = shouldShowAlert
            }
            .store(in: &cancellableSet)

        anchorAndEmotionAnalysisInteractor.errorPublisher
            .map { $0.asAppError }
            .receive(on: DispatchQueue.main)
            .assign(to: &$appError)

        $resultType
            .filter { $0 == .didSkip }
            .first()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                guard let self else { return }
                self.shouldShowSkipButton = false
                self.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoSkipped(.init(currentTime: self.avPlayer.currentTime().seconds))))
            }
            .store(in: &cancellableSet)
    }

    func setUpAudio() throws {
        try AVAudioSession.sharedInstance().setCategory(.playback, options: [])
    }

    func downloadVideoResource() async throws -&gt; URL {
        // TODO: 現在、URLSession を使用しているが Amplify でファイルをダウンロードする機能が提供されているのでそれをつかってもよさそう
        guard let fileName = movie.fileURI.split(separator: "/").last else {
            throw AppError.customMessageError(message: "Failed to get video file name")
        }

        let fileURL = URL(fileURLWithPath: NSTemporaryDirectory() + "video_\(movie.id)_\(String(fileName))")
        if FileManager.default.fileExists(atPath: fileURL.path) {
            return fileURL
        }
        do {
            let (data, _) = try await URLSession.shared.data(from: movie.fileURL)
            try data.write(to: fileURL)
            return fileURL
        } catch {
            AppLogger.debugLog(error.localizedDescription, category: .network)
            throw error
        }
    }

    func endedVideo() async {
        isLoading = true
        defer {
            isLoading = false
        }

        anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoEnded(.init(source: "")))) // 本来 Web イベントのため空文字でよい
        await anchorAndEmotionAnalysisInteractor.endAnalysis()

        do {
            guard let userId = userDefaultsManager.appUserId.value else {
                throw AppError.customMessageError(message: "userId not found")
            }
            try await anchorAndEmotionAnalysisInteractor.uploadAnalysisResults(measurementId: movie.id, userId: userId, sessionId: sessionId)
        } catch {
            appError = error.asAppError
        }

        resultType = .didComplete
        videoPlayingStatus = .didEnd
    }
}

---

## 🤖 Assistant
*2023-07-02 16:27:54*

はい、その通りです。`setSubscriber`の中でAVPlayerItemの状態を監視する方が自然な設計になるかもしれません。以下に修正した`setSubscriber`メソッドを示します:

```swift
private extension MissionVideoWatchPresenter {
    func setSubscriber() {
        // ...
        // ここに既存のサブスクリプションが存在するとします

        // AVPlayerItemのstatusの変更を監視
        avPlayer.currentItem?.publisher(for: \.status)
            .sink { [weak self] status in
                switch status {
                case .readyToPlay:
                    self?.updateVideoPlayerViewSize(videoPlayerViewSize: self?.videoPlayerView.frame.size ?? .zero)
                case .unknown, .failed:
                    break
                }
            }
            .store(in: &cancellableSet)
    }
}
```

しかし、`setSubscriber`が呼ばれる時点で`avPlayer.currentItem`がまだ設定されていない可能性があるので注意が必要です。`avPlayer.currentItem`が確実に設定されてから`setSubscriber`を呼び出すようにしてください。そうしないと、期待通りにKVOを設定できない可能性があります。

---

## 👤 User
*2023-07-02 16:29:09*

Value of type 'MissionVideoWatchPresenter' has no member 'videoPlayerView' となった

---

## 🤖 Assistant
*2023-07-02 16:29:45*

すみません、そのエラーは私のミスで発生したものです。`videoPlayerView`は`MissionVideoWatchPresenter`には存在しないプロパティです。ここでは、実際には`AVPlayer`の視覚的な表現（つまりビデオを表示する`View`）のサイズが必要ですが、そのサイズを取得する方法は様々なフレームワークにより異なるため、具体的なコードを提供することはできません。

その代わり、以下のように`VideoPlayerView`を修正し、ビデオが再生可能になったタイミング（`AVPlayerItem.Status`が`readyToPlay`になった時点）で`updateVideoPlayerViewSize`を呼び出すことを提案します。これはSwiftUIの特性を利用したもので、`updateVideoPlayerViewSize`の呼び出しタイミングを`onAppear`から適切なタイミングに変更するものです。

```swift
VideoPlayerView(videoPlayer: presenter.avPlayer)
    .frame(width: gr.size.width, height: gr.size.height)
    .onChange(of: presenter.avPlayer.currentItem?.status, perform: { status in
        if status == .readyToPlay {
            presenter.updateVideoPlayerViewSize(videoPlayerViewSize: gr.size)
        }
    })
```

このコードは、`presenter.avPlayer.currentItem?.status`の値が変わる度に実行される`onChange`を`VideoPlayerView`に追加します。そして`status`が`readyToPlay`（つまりビデオが再生可能になった）になった時、`updateVideoPlayerViewSize`を呼び出します。

しかし、この方法も完全ではありません。特に、`AVPlayerItem`の`status`が変更された時点で、ビデオの表示領域（ビュー）のサイズがまだ決まっていないかもしれません。その場合、これは単に`gr.size`の初期値（恐らく`.zero`）を使用することになります。これが問題になるかどうかは、アプリの具体的な動作によります。問題がある場合、ビューのサイズが確定したタイミングで`updateVideoPlayerViewSize`を再度呼び出すなどの対策を検討する必要があります。

---

## 👤 User
*2023-07-02 16:31:16*

presenter に @Published var isVideoReadyToPlay: Bool = false というフラグを設けて View側で updateVideoPlayerViewSize を呼び出すのはどう？

---

## 🤖 Assistant
*2023-07-02 16:31:45*

そのアプローチは妥当です。`MissionVideoWatchPresenter`がビデオの準備が整ったことを外部に通知するためのフラグを持つことは合理的です。具体的なコードは以下のようになります：

```swift
// Presenter
@MainActor
final class MissionVideoWatchPresenter: ObservableObject {
    ...
    @Published var isVideoReadyToPlay: Bool = false
    ...
    
    private func setSubscriber() {
        ...
        
        avPlayer.currentItem?.publisher(for: \.status)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] status in
                if status == .readyToPlay {
                    self?.isVideoReadyToPlay = true
                }
            }
            .store(in: &cancellableSet)
    }
}

// View
struct MissionVideoWatchView: View {
    ...
    @ObservedObject private var presenter: MissionVideoWatchPresenter
    ...
    
    var body: some View {
        ...
        VideoPlayerView(videoPlayer: presenter.avPlayer)
            .frame(width: gr.size.width, height: gr.size.height)
            .onChange(of: presenter.isVideoReadyToPlay) { isReady in
                if isReady {
                    presenter.updateVideoPlayerViewSize(videoPlayerViewSize: gr.size)
                }
            }
        ...
    }
}
```
ここで注意が必要な点は、`AVPlayerItem`の`status`が`readyToPlay`に変わる時点で`VideoPlayerView`のサイズが確定しているとは限らないという点です。したがって、この修正だけではまだ完全ではないかもしれません。

最良の解決策は、ビデオの再生準備が整ったとき**かつ**`VideoPlayerView`のサイズが確定したときに、初めて`updateVideoPlayerViewSize`を呼び出すことです。このためには、`VideoPlayerView`のサイズが確定したことを確認する何らかの方法が必要です。しかし、この方法は具体的な状況によりますので、一概には言えません。

---

## 👤 User
*2023-07-02 16:32:22*

VideoPlayerViewのサイズが確定したことを確認する何らかの方法 ってたとはどんなの？

---

## 🤖 Assistant
*2023-07-02 16:33:07*

`SwiftUI`では`GeometryReader`を使って`View`のサイズや座標を取得することが可能です。この特性を利用して、`VideoPlayerView`のサイズが確定したタイミングを検出することができます。

具体的には、`VideoPlayerView`のサイズを保持するための新たな`@Published`プロパティを`MissionVideoWatchPresenter`に追加します。そして、`View`側では`GeometryReader`を使って`VideoPlayerView`のサイズが確定したタイミングでこのプロパティを更新します。最後に、`isVideoReadyToPlay`と`VideoPlayerView`のサイズの両方が揃ったときに`updateVideoPlayerViewSize`を呼び出します。

こうすることで、ビデオの準備が整った時点と`VideoPlayerView`のサイズが確定した時点、どちらも満たされたときに初めて`updateVideoPlayerViewSize`が呼び出されます。

以下に具体的なコードを示します：

```swift
// Presenter
@MainActor
final class MissionVideoWatchPresenter: ObservableObject {
    ...
    @Published var isVideoReadyToPlay: Bool = false
    @Published var videoPlayerViewSize: CGSize?
    ...

    func updateVideoPlayerViewSize(videoPlayerViewSize: CGSize) {
        self.videoPlayerViewSize = videoPlayerViewSize

        guard let videoPlayerViewSize = self.videoPlayerViewSize, 
            let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first, 
            isVideoReadyToPlay else {
            return
        }
        let videoSize = videoTrack.naturalSize
        let videoAspect = videoSize.width / videoSize.height
        anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: videoPlayerViewSize, videoAspect: videoAspect)
    }
}

// View
struct MissionVideoWatchView: View {
    ...
    @ObservedObject private var presenter: MissionVideoWatchPresenter
    ...
    
    var body: some View {
        ...
        GeometryReader { geometry in
            VideoPlayerView(videoPlayer: presenter.avPlayer)
                .frame(width: geometry.size.width, height: geometry.size.height)
                .onAppear {
                    presenter.updateVideoPlayerViewSize(videoPlayerViewSize: geometry.size)
                }
        }
        ...
    }
}
```

この方法であれば、`updateVideoPlayerViewSize`はビデオの再生準備が整い、さらに`VideoPlayerView`のサイズが確定した時点で呼び出されます。このコードはあくまで一例であり、具体的な実装はアプリケーションの設計や要件によって異なることをご理解ください。

---

## 👤 User
*2023-07-02 16:33:24*

onAppear って一回しか呼ばれなんじゃないの？

---

## 🤖 Assistant
*2023-07-02 16:33:50*

はい、通常 `onAppear` は一度しか呼ばれません。特定の `View` の表示直後に一度だけ呼び出されるというライフサイクルイベントです。

ただし、親の `View` が再描画されると、その子 `View` の `onAppear` も再度呼び出されます。したがって、親 `View` の状態に変更があると、その子孫 `View` の `onAppear` が再度実行される場合があります。

ただし、この動作は SwiftUI の動作であり、実装やバージョンによっては異なる可能性があることを理解しておいてください。また、この動作に依存する設計は、その動作が変更された場合にアプリケーションの振る舞いが予期せぬものになる可能性があるため、通常は避けるべきです。

そのため、特定の条件下で動作を再度行いたい場合には、その条件を明示的に管理し、それに基づいて動作を実行する方がよいでしょう。例えば、ビデオの準備が整ったときや、`View` のサイズが変更されたときなど、それぞれの状態を監視し、それらの状態に基づいて `updateVideoPlayerViewSize` を呼び出すようにすることが推奨されます。

---

## 👤 User
*2023-07-02 16:38:45*

&gt; しかし、setSubscriberが呼ばれる時点でavPlayer.currentItemがまだ設定されていない可能性があるので注意が必要です。avPlayer.currentItemが確実に設定されてからsetSubscriberを呼び出すようにしてください。そうしないと、期待通りにKVOを設定できない可能性があります。

これはどのように対策すればいいの？

---

## 🤖 Assistant
*2023-07-02 16:39:10*

一般的には、`AVPlayer` の `currentItem` が確実に設定された後に `setSubscriber()` を呼び出すことで対策できます。具体的には、`currentItem` を設定した後（つまり、動画を読み込んだ後）に `setSubscriber()` を呼び出すようにコードを修正します。

以下に修正例を示します：

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        // (1) 動画のダウンロード
        let fileURL = try await downloadVideoResource()

        // (2) SeeSoの初期化
        await anchorAndEmotionAnalysisInteractor.initializationGazeTracker()

        // (3) トラッカーが動き出すまで待機する
        try await anchorAndEmotionAnalysisInteractor.startAnalysis(orientation: movie.orientation)

        // (4) Playerの読み込み（サムネイルの読み込み）
        let avPlayerItem = AVPlayerItem(url: fileURL)
        avPlayer.replaceCurrentItem(with: avPlayerItem)
        try setUpAudio()
        
        // 具体的には、ここで setSubscriber() を呼び出します
        setSubscriber()

        // (5) 動画の再生
        avPlayer.play()
    } catch {
        appError = error.asAppError
    }
}
```

これにより、`setSubscriber()` が呼び出される時点で `avPlayer.currentItem` が確実に設定されているため、期待通りに `KVO` を設定することができます。

---
