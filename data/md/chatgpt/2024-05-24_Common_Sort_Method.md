# Common Sort Method

日付: 2024-05-24

---

## 👤 ユーザー
*2024/5/24 18:42:42*

@MainActor
final class TalkBoxListPresenter: ObservableObject {
    @Published private(set) var talkBoxes: [TalkBox] = []

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldfeedbackSuccess: Bool = false
    
    private let apiDriver = APIDriver()
    
    func onAppear() async {
        do {
            talkBoxes = try await apiDriver.getTalkBox()
                .sorted(by: \.lastPostedAt, order: .descending)
                .sorted(by: \.isMuted, order: .ascending)
                .sorted(by: \.isBookmarked, order: .descending)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onRefresh() async {
        await onAppear()
        shouldfeedbackSuccess = true
    }
    
    func onTapPlus() async {
        do {
            let newTalkBox = try await apiDriver.postTalkBox(talkBox: .random)
            talkBoxes.insert(newTalkBox, at: 0)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    // TODO: onTapStar と onTapMute の共通化
    func onTapStar(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            talkBoxes =  talkBoxes
                .sorted(by: \.lastPostedAt, order: .descending)
                .sorted(by: \.isMuted, order: .ascending)
                .sorted(by: \.isBookmarked, order: .descending)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    // TODO: onTapStar と onTapMute の共通化
    func onTapMute(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            talkBoxes =  talkBoxes
                .sorted(by: \.lastPostedAt, order: .descending)
                .sorted(by: \.isMuted, order: .ascending)
                .sorted(by: \.isBookmarked, order: .descending)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapEscape(talkBox: TalkBox) async {
        do {
            try await apiDriver.leaveTalkBox(talkBox: talkBox)
            
            if let index = talkBoxes.firstIndex(where: { $0.id == talkBox.id }) {
                talkBoxes.remove(at: index)
            } else {
                assertionFailure("Unexpected")
            }
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}


public extension Sequence {
    func sorted(order: SortOrder) -&gt; [Element] where Element: Comparable {
        switch order {
        case .ascending:
            return sorted { $0 &lt; $1 }
        case .descending:
            return sorted { $0 &gt; $1 }
        }
    }

    func sorted(by keyPath: KeyPath&lt;Element, some Comparable&gt;, order: SortOrder) -&gt; [Element] {
        switch order {
        case .ascending:
            sorted { $0[keyPath: keyPath] &lt; $1[keyPath: keyPath] }
        case .descending:
            sorted { $0[keyPath: keyPath] &gt; $1[keyPath: keyPath] }
        }
    }
}


以下のソートをよく行なっているが、共通化したいどうすればいいか？また、何度もsorted と書くのはあまりやりたくないので、条件を配列で渡すこともできるようにしたい

                .sorted(by: \.lastPostedAt, order: .descending)
                .sorted(by: \.isMuted, order: .ascending)
                .sorted(by: \.isBookmarked, order: .descending)

---

## 🤖 アシスタント
*2024/5/24 18:43:21*

ソートの共通化とソート条件を配列で渡す方法について、以下のようにして対応できます。

### ソートの共通化と条件の配列化

1. ソート条件を表すための型を定義する。
2. その条件を利用して配列をソートする関数を作成する。

まず、ソート条件を表すための型を定義します。

```swift
enum SortOrder {
    case ascending
    case descending
}

struct SortDescriptor<Element> {
    let keyPath: KeyPath<Element, some Comparable>
    let order: SortOrder
}
```

次に、配列を複数のソート条件でソートする関数を作成します。

```swift
extension Array {
    func sorted(by descriptors: [SortDescriptor<Element>]) -> [Element] {
        sorted { lhs, rhs in
            for descriptor in descriptors {
                let lhsValue = lhs[keyPath: descriptor.keyPath]
                let rhsValue = rhs[keyPath: descriptor.keyPath]
                if lhsValue != rhsValue {
                    switch descriptor.order {
                    case .ascending:
                        return lhsValue < rhsValue
                    case .descending:
                        return lhsValue > rhsValue
                    }
                }
            }
            return false
        }
    }
}
```

これにより、ソートを行うときにソート条件の配列を渡せるようになります。

### `TalkBoxListPresenter` の修正

`TalkBoxListPresenter` のソート部分を共通化されたソート方法を利用するように修正します。

```swift
@MainActor
final class TalkBoxListPresenter: ObservableObject {
    @Published private(set) var talkBoxes: [TalkBox] = []

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldfeedbackSuccess: Bool = false
    
    private let apiDriver = APIDriver()
    
    func onAppear() async {
        do {
            talkBoxes = try await apiDriver.getTalkBox()
                .sorted(by: [
                    SortDescriptor(keyPath: \.lastPostedAt, order: .descending),
                    SortDescriptor(keyPath: \.isMuted, order: .ascending),
                    SortDescriptor(keyPath: \.isBookmarked, order: .descending)
                ])
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onRefresh() async {
        await onAppear()
        shouldfeedbackSuccess = true
    }
    
    func onTapPlus() async {
        do {
            let newTalkBox = try await apiDriver.postTalkBox(talkBox: .random)
            talkBoxes.insert(newTalkBox, at: 0)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    // 共通化されたソート処理を利用する
    private func updateSortedTalkBoxes() {
        talkBoxes = talkBoxes.sorted(by: [
            SortDescriptor(keyPath: \.lastPostedAt, order: .descending),
            SortDescriptor(keyPath: \.isMuted, order: .ascending),
            SortDescriptor(keyPath: \.isBookmarked, order: .descending)
        ])
    }
    
    func onTapStar(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            updateSortedTalkBoxes()
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapMute(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            updateSortedTalkBoxes()
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapEscape(talkBox: TalkBox) async {
        do {
            try await apiDriver.leaveTalkBox(talkBox: talkBox)
            
            if let index = talkBoxes.firstIndex(where: { $0.id == talkBox.id }) {
                talkBoxes.remove(at: index)
            } else {
                assertionFailure("Unexpected")
            }
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
```

これで、ソート処理が共通化され、ソート条件を配列で渡すことができるようになります。

---

## 👤 ユーザー
*2024/5/24 18:44:47*

配列でまとめなくていいや、以下の処理を繰り返しているのでどうにか共通化できないか？

                .sorted(by: \.lastPostedAt, order: .descending)
                .sorted(by: \.isMuted, order: .ascending)
                .sorted(by: \.isBookmarked, order: .descending)

---

## 🤖 アシスタント
*2024/5/24 18:45:19*

配列でまとめるのではなく、共通のソートロジックをメソッドに抽出することで、繰り返しのコードを共通化できます。以下のように、`sortTalkBoxes` という共通のソートメソッドを作成し、それを必要な場所で呼び出すように変更します。

### 共通のソートメソッドの定義

まず、`sortTalkBoxes` というメソッドを定義します。このメソッドは `TalkBox` の配列をソートするロジックを含みます。

```swift
@MainActor
final class TalkBoxListPresenter: ObservableObject {
    @Published private(set) var talkBoxes: [TalkBox] = []

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldfeedbackSuccess: Bool = false
    
    private let apiDriver = APIDriver()
    
    func onAppear() async {
        do {
            let fetchedTalkBoxes = try await apiDriver.getTalkBox()
            updateTalkBoxes(with: fetchedTalkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onRefresh() async {
        await onAppear()
        shouldfeedbackSuccess = true
    }
    
    func onTapPlus() async {
        do {
            let newTalkBox = try await apiDriver.postTalkBox(talkBox: .random)
            talkBoxes.insert(newTalkBox, at: 0)
            sortTalkBoxes()
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    private func sortTalkBoxes() {
        talkBoxes = talkBoxes
            .sorted(by: \.lastPostedAt, order: .descending)
            .sorted(by: \.isMuted, order: .ascending)
            .sorted(by: \.isBookmarked, order: .descending)
    }

    private func updateTalkBoxes(with newTalkBoxes: [TalkBox]) {
        talkBoxes = newTalkBoxes
        sortTalkBoxes()
    }
    
    func onTapStar(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            sortTalkBoxes()
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapMute(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            sortTalkBoxes()
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapEscape(talkBox: TalkBox) async {
        do {
            try await apiDriver.leaveTalkBox(talkBox: talkBox)
            
            if let index = talkBoxes.firstIndex(where: { $0.id == talkBox.id }) {
                talkBoxes.remove(at: index)
            } else {
                assertionFailure("Unexpected")
            }
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
```

### 変更点の説明

1. **`sortTalkBoxes` メソッドの定義**:
    - `talkBoxes` のソート処理を `sortTalkBoxes` メソッドにまとめました。このメソッドを呼び出すことで、必要なソートを一度に実行できます。

2. **`updateTalkBoxes` メソッドの定義**:
    - 新しい `TalkBox` 配列を設定し、その後ソートを実行するためのメソッドです。`onAppear` メソッド内で使用されます。

3. **ソート呼び出しの共通化**:
    - 以前は各所で個別にソートを実行していましたが、`sortTalkBoxes` メソッドを呼び出すことでコードの重複を排除しました。例えば、`onTapPlus` メソッドの最後に `sortTalkBoxes` を呼び出して、新しい `TalkBox` 追加後にソートを実行しています。

---

## 👤 ユーザー
*2024/5/24 18:46:37*

以下を作るだけの方がスマートでは？
private func sortTalkBoxes(talkBox: TalkBox) -&gt; [TalkBox] {

---

## 🤖 アシスタント
*2024/5/24 18:47:11*

その通りです。関数にソートロジックをまとめる方法はシンプルで効果的です。以下のように、ソート関数を定義し、それを必要な箇所で呼び出すように変更します。

### `sortTalkBoxes` 関数の定義

```swift
private func sortTalkBoxes(_ talkBoxes: [TalkBox]) -> [TalkBox] {
    return talkBoxes
        .sorted(by: \.lastPostedAt, order: .descending)
        .sorted(by: \.isMuted, order: .ascending)
        .sorted(by: \.isBookmarked, order: .descending)
}
```

### `TalkBoxListPresenter` の修正

`TalkBoxListPresenter` クラスの各メソッドでこの関数を使用するように変更します。

```swift
@MainActor
final class TalkBoxListPresenter: ObservableObject {
    @Published private(set) var talkBoxes: [TalkBox] = []

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldfeedbackSuccess: Bool = false
    
    private let apiDriver = APIDriver()
    
    func onAppear() async {
        do {
            let fetchedTalkBoxes = try await apiDriver.getTalkBox()
            self.talkBoxes = sortTalkBoxes(fetchedTalkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onRefresh() async {
        await onAppear()
        shouldfeedbackSuccess = true
    }
    
    func onTapPlus() async {
        do {
            let newTalkBox = try await apiDriver.postTalkBox(talkBox: .random)
            self.talkBoxes.insert(newTalkBox, at: 0)
            self.talkBoxes = sortTalkBoxes(self.talkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    private func sortTalkBoxes(_ talkBoxes: [TalkBox]) -> [TalkBox] {
        return talkBoxes
            .sorted(by: \.lastPostedAt, order: .descending)
            .sorted(by: \.isMuted, order: .ascending)
            .sorted(by: \.isBookmarked, order: .descending)
    }
    
    func onTapStar(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            self.talkBoxes = sortTalkBoxes(self.talkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapMute(talkBox: TalkBox) async {
        do {
            let updatedTalkBox = try await apiDriver.putTalkBox(talkBox: talkBox)

            if let index = talkBoxes.firstIndex(where: { $0.id == updatedTalkBox.id }) {
                talkBoxes[index] = updatedTalkBox
            } else {
                assertionFailure("Unexpected")
            }

            self.talkBoxes = sortTalkBoxes(self.talkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
    
    func onTapEscape(talkBox: TalkBox) async {
        do {
            try await apiDriver.leaveTalkBox(talkBox: talkBox)
            
            if let index = talkBoxes.firstIndex(where: { $0.id == talkBox.id }) {
                talkBoxes.remove(at: index)
            } else {
                assertionFailure("Unexpected")
            }

            self.talkBoxes = sortTalkBoxes(self.talkBoxes)
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
```

### 変更点の説明

1. **`sortTalkBoxes` 関数の定義**:
    - `talkBoxes` をソートするロジックを持つ関数を定義しました。この関数は引数として `TalkBox` の配列を受け取り、ソートされた配列を返します。

2. **各メソッドでの `sortTalkBoxes` 呼び出し**:
    - `onAppear`, `onTapPlus`, `onTapStar`, `onTapMute`, `onTapEscape` の各メソッドで、`sortTalkBoxes` 関数を呼び出してソート処理を共通化しました。

これにより、ソートロジックが一箇所にまとめられ、メンテナンスが容易になります。

---
