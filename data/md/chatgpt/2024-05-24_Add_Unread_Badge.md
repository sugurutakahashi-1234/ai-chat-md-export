# Add Unread Badge

Date: 2024-05-24

---

## 👤 User
*2024-05-24 18:34:17*

hasUnread が true のときにバッジをつけたい

import SwiftUI

struct TalkBoxView: View {
    let talkBox: TalkBox

    var body: some View {
        VStack(alignment: .leading) {
            TalkBoxAsyncImageView(imageUrl: talkBox.imageUrl)
                .overlay {
                    VStack {
                        HStack {
                            SFSymbols.starFill.image
                                .symbolRenderingMode(.multicolor)
                                .isHidden(!talkBox.isBookmarked, shouldRemove: true)
                            
                            SFSymbols.speakerSlash.image
                                .isHidden(!talkBox.isMuted, shouldRemove: true)
                            
                            Spacer()
                        }
                        Spacer()
                    }
                    .foregroundStyle(Color.white)
                    .padding()
                }
                .cornerRadius(8)
            
            HStack {
                Text("\(talkBox.lastPostedAt.toString(.yyyyMMdd))")
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
                Spacer()
            }
        }
    }
}

#Preview {
    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2)) {
        TalkBoxView(talkBox: .placeholder)
        TalkBoxView(talkBox: .placeholder)
    }
    .padding()
}

public struct TalkBox: Sendable, Identifiable, Equatable {
    public let id: String
    public let imageUrl: URL
    public let lastPostedAt: Date
    public let hasUnread: Bool
    public let isBookmarked: Bool
    public let isMuted: Bool
}

---

## 🤖 Assistant
*2024-05-24 18:34:31*

`TalkBoxView`にバッジを追加するために、`hasUnread`プロパティが`true`の場合に表示するバッジをオーバーレイに追加します。以下のように修正してみてください。

```swift
import SwiftUI

struct TalkBoxView: View {
    let talkBox: TalkBox

    var body: some View {
        VStack(alignment: .leading) {
            TalkBoxAsyncImageView(imageUrl: talkBox.imageUrl)
                .overlay {
                    VStack {
                        HStack {
                            if talkBox.hasUnread {
                                Circle()
                                    .fill(Color.red)
                                    .frame(width: 10, height: 10)
                                    .offset(x: -5, y: -5)
                            }
                            SFSymbols.starFill.image
                                .symbolRenderingMode(.multicolor)
                                .isHidden(!talkBox.isBookmarked, shouldRemove: true)
                            
                            SFSymbols.speakerSlash.image
                                .isHidden(!talkBox.isMuted, shouldRemove: true)
                            
                            Spacer()
                        }
                        Spacer()
                    }
                    .foregroundStyle(Color.white)
                    .padding()
                }
                .cornerRadius(8)
            
            HStack {
                Text("\(talkBox.lastPostedAt.toString(.yyyyMMdd))")
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
                Spacer()
            }
        }
    }
}

#Preview {
    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2)) {
        TalkBoxView(talkBox: .placeholder)
        TalkBoxView(talkBox: .placeholder)
    }
    .padding()
}

public struct TalkBox: Sendable, Identifiable, Equatable {
    public let id: String
    public let imageUrl: URL
    public let lastPostedAt: Date
    public let hasUnread: Bool
    public let isBookmarked: Bool
    public let isMuted: Bool
}
```

上記のコードでは、`hasUnread`が`true`の場合に赤いバッジ（小さな赤い円）を`TalkBoxAsyncImageView`の左上隅に表示するようにしました。バッジの大きさや位置は`Circle`の`frame`と`offset`で調整できます。

---

## 👤 User
*2024-05-24 18:36:58*

独自実装ではなくSwiftUIの.badge モディファイアなどを使うのはどうだろうか？’

---

## 🤖 Assistant
*2024-05-24 18:37:19*

SwiftUIの`.badge`モディファイアを使用することも可能です。ただし、`.badge`モディファイアはリストやタブビューのアイテムに対して使用することが一般的です。独自のビューにバッジを追加するためには、少し工夫が必要です。ここでは、カスタムなバッジとして`ZStack`を使用してバッジを表示する方法を示します。

```swift
import SwiftUI

struct TalkBoxView: View {
    let talkBox: TalkBox

    var body: some View {
        VStack(alignment: .leading) {
            ZStack(alignment: .topTrailing) {
                TalkBoxAsyncImageView(imageUrl: talkBox.imageUrl)
                    .cornerRadius(8)
                
                if talkBox.hasUnread {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 10, height: 10)
                        .offset(x: -5, y: 5)
                }
            }
            .overlay {
                VStack {
                    HStack {
                        SFSymbols.starFill.image
                            .symbolRenderingMode(.multicolor)
                            .isHidden(!talkBox.isBookmarked, shouldRemove: true)
                        
                        SFSymbols.speakerSlash.image
                            .isHidden(!talkBox.isMuted, shouldRemove: true)
                        
                        Spacer()
                    }
                    Spacer()
                }
                .foregroundStyle(Color.white)
                .padding()
            }
            
            HStack {
                Text("\(talkBox.lastPostedAt.toString(.yyyyMMdd))")
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
                Spacer()
            }
        }
    }
}

#Preview {
    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2)) {
        TalkBoxView(talkBox: .placeholder)
        TalkBoxView(talkBox: .placeholder)
    }
    .padding()
}

public struct TalkBox: Sendable, Identifiable, Equatable {
    public let id: String
    public let imageUrl: URL
    public let lastPostedAt: Date
    public let hasUnread: Bool
    public let isBookmarked: Bool
    public let isMuted: Bool
}
```

このコードでは、`ZStack`を使って画像の右上にバッジを配置しています。`ZStack`の`alignment`を`.topTrailing`に設定することで、バッジが右上に配置されます。`offset`を使って微調整しています。

`SwiftUI`の`.badge`モディファイアは以下のようにリストやタブビューのアイテムに対して使用します：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            Text("First Tab")
                .tabItem {
                    Label("First", systemImage: "1.circle")
                }
                .badge(5)
            
            Text("Second Tab")
                .tabItem {
                    Label("Second", systemImage: "2.circle")
                }
        }
    }
}

#Preview {
    ContentView()
}
```

上記のように、`.badge`は`TabView`のアイテムや`List`のアイテムに対して使われます。カスタムビューに対してバッジを表示する場合は、`ZStack`や`overlay`を使う方法が適しています。

---
