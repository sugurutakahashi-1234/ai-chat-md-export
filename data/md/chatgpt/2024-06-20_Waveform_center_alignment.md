# Waveform center alignment

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/20 14:45:41*

これを底を合わせるのではなくて中央を設定してほしい。

struct WaveformView: View {
    let volumeLevels: [Double]
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 4) {
            ForEach(0..&lt;volumeLevels.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 10, height: volumeLevels[index] * 100)
            }
        }
        .frame(height: 100)
    }
}

---

## 🤖 アシスタント
*2024/6/20 14:45:48*

波形の矩形の中央を基準に揃えるには、`HStack`の`alignment`を`center`に設定し、各矩形の`offset`を調整する必要があります。以下はその実装例です。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]
    
    var body: some View {
        HStack(alignment: .center, spacing: 4) {
            ForEach(0..<volumeLevels.count, id: \.self) { index in
                Rectangle()
                    .fill(Color.black)
                    .frame(width: 10, height: volumeLevels[index] * 100)
                    .offset(y: (1 - volumeLevels[index]) * 50)
            }
        }
        .frame(height: 100)
    }
}
```

このコードでは、矩形の高さを`volumeLevels[index] * 100`に設定し、`offset(y:)`を使って矩形を中央に揃えています。`(1 - volumeLevels[index]) * 50`は、矩形の高さの半分だけ上下にオフセットすることで中央揃えを実現しています。

---

## 👤 ユーザー
*2024/6/20 14:46:11*

上下にスペーサーを配置するのはどうかな？

---

## 🤖 アシスタント
*2024/6/20 14:46:16*

上下にスペーサーを配置することで、矩形を中央に揃える方法もあります。以下はその実装例です。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]
    
    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<volumeLevels.count, id: \.self) { index in
                VStack {
                    Spacer()
                    Rectangle()
                        .fill(Color.black)
                        .frame(width: 10, height: volumeLevels[index] * 100)
                    Spacer()
                }
            }
        }
        .frame(height: 100)
    }
}
```

このコードでは、各矩形を`VStack`に包み、上下に`Spacer`を配置しています。これにより、矩形が垂直方向の中央に揃えられます。

---

## 👤 ユーザー
*2024/6/20 14:48:11*

volumeLevels が多く増えても画面に全て収まるようにしてほしい。

---

## 🤖 アシスタント
*2024/6/20 14:48:27*

画面に収まるようにするために、`ScrollView`を使って横方向にスクロールできるようにします。また、各矩形の幅を動的に調整して、すべてのボリュームレベルが画面に収まるようにします。

以下はその実装例です。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]
    
    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 4) {
                ForEach(0..<volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.black)
                            .frame(width: 10, height: volumeLevels[index] * 100)
                        Spacer()
                    }
                }
            }
            .padding(.vertical)
        }
        .frame(height: 100)
    }
}
```

このコードでは、`ScrollView`を使って横方向にスクロールできるようにし、`HStack`の中に`VStack`を配置して上下に`Spacer`を置くことで、矩形を垂直方向の中央に揃えています。また、`.padding(.vertical)`を追加して、上下に適切な余白を確保しています。

さらに、画面サイズに収めるために矩形の幅を調整する場合は、以下のように動的に幅を計算することもできます。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                let totalWidth = geometry.size.width
                let itemWidth = max(totalWidth / CGFloat(volumeLevels.count), 1)
                HStack(spacing: 4) {
                    ForEach(0..<volumeLevels.count, id: \.self) { index in
                        VStack {
                            Spacer()
                            Rectangle()
                                .fill(Color.black)
                                .frame(width: itemWidth, height: volumeLevels[index] * 100)
                            Spacer()
                        }
                    }
                }
                .padding(.vertical)
            }
        }
        .frame(height: 100)
    }
}
```

この実装では、`GeometryReader`を使って利用可能な画面幅を取得し、それに基づいて各矩形の幅を動的に計算しています。これにより、ボリュームレベルが多くてもすべての矩形が画面に収まるようになります。

---
