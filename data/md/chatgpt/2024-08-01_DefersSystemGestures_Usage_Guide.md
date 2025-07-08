# DefersSystemGestures Usage Guide

日付: 2024-08-01

---

## 👤 ユーザー
*2024/08/01 16:55:41*

defersSystemGestures の使い所

---

## 🤖 アシスタント
*2024/08/01 16:56:07*

`defersSystemGestures`は、特定のビューの上にシステムジェスチャー（例えば、画面の端からのスワイプによるジェスチャー）を一時的に無効にするために使用されます。以下のようなシナリオで有効に使うことができます：

### 1. 全画面ゲーム
ゲームアプリケーションでは、ユーザーが画面の端からスワイプする操作を頻繁に行う場合があります。これらのジェスチャーが意図せずシステムジェスチャーをトリガーしてしまうことを防ぐために、`defersSystemGestures`を使用します。

```swift
struct GameView: View {
    var body: some View {
        Text("Game Content")
            .edgesIgnoringSafeArea(.all)
            .defersSystemGestures(on: .all)
    }
}
```

### 2. ビデオ再生アプリ
全画面でビデオを再生している際に、ユーザーがジェスチャーでビデオの操作を行うことがある場合、システムジェスチャーが邪魔になることがあります。このような場合に使用します。

```swift
struct VideoPlayerView: View {
    var body: some View {
        VideoPlayer(player: AVPlayer(url: videoURL))
            .edgesIgnoringSafeArea(.all)
            .defersSystemGestures(on: .all)
    }
}
```

### 3. 描画アプリ
ユーザーが画面の端からスワイプして絵を描く場合、システムジェスチャーが誤作動を引き起こす可能性があります。この場合に`defersSystemGestures`を設定します。

```swift
struct DrawingView: View {
    var body: some View {
        Canvas { context, size in
            // Drawing code here
        }
        .edgesIgnoringSafeArea(.all)
        .defersSystemGestures(on: .all)
    }
}
```

### 使い方

```swift
defersSystemGestures(on edges: Edge.Set = .all)
```

`edges`引数には、システムジェスチャーを無効にしたいエッジを指定します。例えば、`.top`、`.bottom`、`.leading`、`.trailing`、またはそれらの組み合わせ（`.all`など）を指定できます。

### 注意点

- `defersSystemGestures`を使用することで、ユーザーエクスペリエンスに影響を与える可能性があるため、使用は必要最低限に留めるべきです。
- システムジェスチャーの無効化がユーザーにとって直感的でない場合、アプリの使い勝手が悪くなる可能性があります。

これらを考慮しながら、適切な場面で`defersSystemGestures`を使用してください。

---
