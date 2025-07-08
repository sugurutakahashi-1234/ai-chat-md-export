# SwiftUI 2列 Pinterestデザイン

日付: 2024-05-22

---

## 👤 ユーザー
*2024/05/22 15:30:45*

SwiftUI で 2列 での Pinterest 風なグリッドデザインを表現したい。

---

## 🤖 アシスタント
*2024/05/22 15:31:03*

Pinterest風のグリッドデザインをSwiftUIで表現するためには、`LazyVGrid`を使うのが便利です。以下に、2列のPinterest風グリッドデザインを実現するためのサンプルコードを示します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let items: [GridItem] = [
        GridItem(.adaptive(minimum: 150)),
        GridItem(.adaptive(minimum: 150))
    ]

    let images = ["image1", "image2", "image3", "image4", "image5", "image6"]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: items, spacing: 10) {
                ForEach(images, id: \.self) { image in
                    Image(image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 150, height: 200)
                        .clipped()
                        .cornerRadius(10)
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

このコードでは、以下のポイントに注目しています。

1. **`LazyVGrid`**を使用して、垂直方向にグリッドを作成します。
2. **`GridItem`**を使用して、2列のレイアウトを指定します。ここでは、各列の最小幅を150ポイントに設定しています。
3. **`ForEach`**を使用して、画像リストをグリッド内に配置します。
4. **`Image`**ビューを使って、各画像を表示します。`resizable()`と`aspectRatio(contentMode: .fill)`を使って、画像がフレームにフィットするようにし、`clipped()`でフレームを超えた部分を切り取ります。
5. **`cornerRadius`**で画像の角を丸くしています。

これで、Pinterest風のグリッドデザインを2列で表現できます。`images`配列に表示したい画像の名前を追加することで、任意の画像をグリッドに表示できます。

---

## 👤 ユーザー
*2024/05/22 15:33:21*

Image(image) にしているが適当な画像をインターネットからとってきて表示させたい。
いろいろなサイズの画像がほしい。

---

## 🤖 アシスタント
*2024/05/22 15:33:45*

インターネットから画像を取得して表示するために、SwiftUIで`AsyncImage`を使うことができます。また、さまざまなサイズの画像を取得して表示する例を以下に示します。この例では、ランダムな画像を表示するためにUnsplashのランダム画像APIを利用します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let columns: [GridItem] = [
        GridItem(.adaptive(minimum: 150)),
        GridItem(.adaptive(minimum: 150))
    ]
    
    // いくつかのサンプル画像URL
    let imageURLs: [String] = [
        "https://source.unsplash.com/random/300x400",
        "https://source.unsplash.com/random/400x300",
        "https://source.unsplash.com/random/300x300",
        "https://source.unsplash.com/random/500x600",
        "https://source.unsplash.com/random/600x500",
        "https://source.unsplash.com/random/400x400"
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(imageURLs, id: \.self) { imageURL in
                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(width: 150, height: 200)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 150, height: 200)
                                .clipped()
                                .cornerRadius(10)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 150, height: 200)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

### 説明

1. **`AsyncImage`**を使用して、インターネットから画像を非同期に読み込みます。`AsyncImage`のコンストラクタにURLを渡します。
2. **`switch phase`**を使って、`AsyncImage`の状態に応じたビューを表示します。
   - **`.empty`**: 画像が読み込まれる前の状態。ここでは`ProgressView`を表示。
   - **`.success(let image)`**: 画像の読み込みが成功した状態。`image`をリサイズして表示。
   - **`.failure`**: 画像の読み込みが失敗した状態。代替としてシステム画像を表示。
3. **ランダム画像のURL**: Unsplashのランダム画像APIを利用して、異なるサイズの画像を取得しています。

これで、インターネットから取得したさまざまなサイズの画像をPinterest風の2列グリッドで表示できます。画像のURLを変更すれば、他の画像ソースからも画像を取得して表示できます。

---

## 👤 ユーザー
*2024/05/22 15:34:48*

ピンタレストみたいに縦横がそろっていなくジグザグに表現したい

---

## 🤖 アシスタント
*2024/05/22 15:35:12*

縦横が揃っていない、いわゆる「Pinterest風」のジグザグレイアウトを実現するためには、各画像のサイズをランダムにする必要があります。SwiftUIの`LazyVGrid`と`AsyncImage`を使用して、異なるサイズの画像を表示する例を以下に示します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let columns: [GridItem] = [
        GridItem(.adaptive(minimum: 150), spacing: 10),
        GridItem(.adaptive(minimum: 150), spacing: 10)
    ]
    
    // いくつかのサンプル画像URL
    let imageURLs: [String] = [
        "https://source.unsplash.com/random/300x400",
        "https://source.unsplash.com/random/400x300",
        "https://source.unsplash.com/random/300x300",
        "https://source.unsplash.com/random/500x600",
        "https://source.unsplash.com/random/600x500",
        "https://source.unsplash.com/random/400x400"
    ]

    // ランダムな高さを生成するための配列
    let randomHeights: [CGFloat] = [
        150, 200, 250, 300, 350, 400
    ]
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(imageURLs.indices, id: \.self) { index in
                    let imageURL = imageURLs[index]
                    let randomHeight = randomHeights.randomElement() ?? 200

                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(height: randomHeight)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: randomHeight)
                                .clipped()
                                .cornerRadius(10)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(height: randomHeight)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

### 説明

1. **`GridItem`**: `GridItem`の最小幅を150ポイントに設定し、列の間隔を指定しています。
2. **ランダムな高さ**: `randomHeights`配列を使って、画像の高さをランダムに設定します。
3. **`ForEach`**: `imageURLs.indices`を使って、画像URLのインデックスをループします。`index`ごとに対応する画像URLを取得し、ランダムな高さを設定します。
4. **`AsyncImage`**: 非同期で画像を読み込み、読み込み状態に応じて適切なビューを表示します。読み込みが成功した場合、画像をリサイズして表示します。
5. **`.frame(height: randomHeight)`**: 各画像の高さをランダムに設定し、Pinterest風のジグザグレイアウトを実現します。

これにより、各画像の高さがランダムに設定され、Pinterest風のジグザグレイアウトが実現できます。必要に応じて、`randomHeights`配列に異なる高さの値を追加することで、さらなるバリエーションを作成できます。

---

## 👤 ユーザー
*2024/05/22 15:36:26*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-lucMI3Z04usTIcLtVNgH2Qk8",
  "size_bytes": 754983,
  "width": 577,
  "height": 1099,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-MfYPVNA9kb4skXp4YJli83wd",
  "size_bytes": 538840,
  "width": 480,
  "height": 841,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
1個目の画像になってしまった。理想は2個目の画像である

---

## 🤖 アシスタント
*2024/05/22 15:36:53*

2つ目の画像のようなグリッドレイアウトをSwiftUIで実現するためには、`LazyVGrid`を使用し、各アイテムに対して適切なサイズと位置を設定する必要があります。以下は、2つ目の画像のような固定サイズのグリッドレイアウトを実現するためのサンプルコードです。

```swift
import SwiftUI

struct PinterestGridView: View {
    let columns: [GridItem] = [
        GridItem(.fixed(150), spacing: 10),
        GridItem(.fixed(150), spacing: 10)
    ]
    
    // いくつかのサンプル画像URL
    let imageURLs: [String] = [
        "https://source.unsplash.com/random/300x400",
        "https://source.unsplash.com/random/400x300",
        "https://source.unsplash.com/random/300x300",
        "https://source.unsplash.com/random/500x600",
        "https://source.unsplash.com/random/600x500",
        "https://source.unsplash.com/random/400x400"
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(imageURLs, id: \.self) { imageURL in
                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(width: 150, height: 150)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 150, height: 150)
                                .clipped()
                                .cornerRadius(10)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 150, height: 150)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

### 説明

1. **`GridItem`**を使用して、各列の幅を固定に設定しています。この場合、幅を150ポイントに固定しています。
2. **`LazyVGrid`**を使用して、グリッドを縦に並べています。各列の間隔と行の間隔を10ポイントに設定しています。
3. **`AsyncImage`**を使用して、非同期に画像を読み込んでいます。読み込み中には`ProgressView`を表示し、読み込みが成功した場合は画像を表示します。
4. **`frame(width: height:)`**で画像のサイズを固定しています。これにより、グリッドのアイテムがすべて同じサイズで表示されます。

このコードを実行することで、2つ目の画像のようにすべてのアイテムが統一されたサイズでグリッドに並ぶレイアウトを実現できます。必要に応じて、グリッドアイテムのサイズや間隔を調整することで、より理想に近いレイアウトを作成できます。

---

## 👤 ユーザー
*2024/05/22 15:37:49*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-jb7LrlBdTM8G95N0szWUCkR6",
  "size_bytes": 413928,
  "width": 623,
  "height": 1147,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
これだと行がそろってしまう。列は揃えたままで行の高さを色々変えたい。

---

## 🤖 アシスタント
*2024/05/22 15:38:14*

行の高さをランダムに変えるためには、各画像の高さを個別に設定する必要があります。これにより、Pinterest風のレイアウトが実現できます。以下に、行の高さをランダムに設定する例を示します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let columns: [GridItem] = [
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10)
    ]
    
    // いくつかのサンプル画像URL
    let imageURLs: [String] = [
        "https://source.unsplash.com/random/300x400",
        "https://source.unsplash.com/random/400x300",
        "https://source.unsplash.com/random/300x300",
        "https://source.unsplash.com/random/500x600",
        "https://source.unsplash.com/random/600x500",
        "https://source.unsplash.com/random/400x400"
    ]

    // ランダムな高さを生成するための配列
    let randomHeights: [CGFloat] = [
        150, 200, 250, 300, 350, 400
    ]
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(imageURLs.indices, id: \.self) { index in
                    let imageURL = imageURLs[index]
                    let randomHeight = randomHeights.randomElement() ?? 200

                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(height: randomHeight)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: randomHeight)
                                .clipped()
                                .cornerRadius(10)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(height: randomHeight)
                        @unknown default:
                            EmptyView()
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

### 説明

1. **`GridItem(.flexible())`**: 各列の幅を柔軟に設定します。これにより、2列のグリッドが画面幅に合わせて均等に配置されます。
2. **ランダムな高さ**: `randomHeights`配列を使って、画像の高さをランダムに設定します。これにより、各行の高さが異なり、Pinterest風のレイアウトになります。
3. **`AsyncImage`**: 非同期で画像を読み込み、読み込み状態に応じて適切なビューを表示します。読み込みが成功した場合は、ランダムな高さで画像を表示します。

このコードを実行することで、列の幅は揃えたまま、行の高さをランダムに設定したPinterest風のグリッドレイアウトを実現できます。

---

## 👤 ユーザー
*2024/05/22 15:39:18*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-aihkPI2oxYxPoeb2l8M7fXrr",
  "size_bytes": 796364,
  "width": 626,
  "height": 1129,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
画像が重なってしまっている

また大きな括りで行が設定されている

---

## 🤖 アシスタント
*2024/05/22 15:39:42*

画像が重ならず、Pinterest風のグリッドレイアウトを実現するためには、画像の高さを個別に設定し、行全体の高さを個別に設定しないようにする必要があります。以下に、修正したコードを示します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let columns: [GridItem] = [
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10)
    ]
    
    // いくつかのサンプル画像URL
    let imageURLs: [String] = [
        "https://source.unsplash.com/random/300x400",
        "https://source.unsplash.com/random/400x300",
        "https://source.unsplash.com/random/300x300",
        "https://source.unsplash.com/random/500x600",
        "https://source.unsplash.com/random/600x500",
        "https://source.unsplash.com/random/400x400"
    ]

    // ランダムな高さを生成するための配列
    let randomHeights: [CGFloat] = [
        150, 200, 250, 300, 350, 400
    ]
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(imageURLs.indices, id: \.self) { index in
                    let imageURL = imageURLs[index]
                    let randomHeight = randomHeights.randomElement() ?? 200

                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(height: randomHeight)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: randomHeight)
                                .clipped()
                                .cornerRadius(10)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(height: randomHeight)
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .background(Color.white)
                    .cornerRadius(10)
                    .shadow(radius: 5)
                }
            }
            .padding()
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

### 説明

1. **`LazyVGrid`**の列を柔軟に設定し、スペースを指定しています。これにより、列の幅は画面幅に合わせて調整されます。
2. **個別の画像の高さ**をランダムに設定し、それぞれの画像に対して個別にフレームを設定します。
3. **`background`**と**`cornerRadius`**、**`shadow`**を追加して、画像の背景を設定し、影をつけることで、画像が重なって見えるのを防ぎます。

このコードを実行することで、画像が重ならず、行の高さも個別に設定されるため、Pinterest風のグリッドレイアウトが実現できます。

---
