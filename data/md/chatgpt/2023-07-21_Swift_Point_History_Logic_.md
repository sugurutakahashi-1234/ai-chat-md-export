# Swift Point History Logic.

日付: 2023-07-21

---

## 👤 ユーザー
*2023/07/21 15:48:58*

SwiftでgetPoints() で取得したポイントについて、当月より前の月（例えば今月が2023年の7月であれば、2023年の6月、2023年の5月、、、など）で月の合計ポイントを算出して、その値をマイナしたポイントのPoint型を生成して、Point(id: UUID().string, createdAt: 合計した次の追記の1日の日付、orgName: "エモミル運営", researchTitle: "YYYY年MM月のポイント付与予定分", value: 計算結果)として、追加して、pointHistoriesを時間が最新な順に並べて欲しい


public struct Point: Identifiable {
    public let id: String
    public let createdAt: Date
    public let orgName: String?
    public let researchTitle: String
    public let value: Int

    public init(id: String, createdAt: Date, orgName: String?, researchTitle: String, value: Int) {
        self.id = id
        self.createdAt = createdAt
        self.orgName = orgName
        self.researchTitle = researchTitle
        self.value = value
    }
}


@MainActor
final class PointRootPresenter: ObservableObject {
    @Published private(set) var user: EmomilCore.User?
    @Published private(set) var totalPoints: Int = 0 // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
    @Published private(set) var pointHistories: [EmomilCore.Point] = []
    @Published var isLoading = false
    private let apiRequestManager: ApiRequestManagerProtocol

    init(apiRequestManager: ApiRequestManagerProtocol = AmplifyApiRequestManager()) {
        self.apiRequestManager = apiRequestManager
    }

    func onAppear() async {
        isLoading = true
        defer {
            isLoading = false
        }
        do {
            let user = try await apiRequestManager.getUser()
            let pointHistories = try await apiRequestManager.getPoints()
            self.user = user
            self.pointHistories = pointHistories

            // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
            totalPoints = pointHistories.reduce(0) { $0 + $1.value }
        } catch {
            // TODO: エラーアラート表示ロジックを追加する
            AppLogger.debugLog(error.localizedDescription, category: .network, level: .error)
            isLoading = false
        }
    }
}

---

## 🤖 アシスタント
*2023/07/21 15:49:41*

以下は、指示に従い`PointRootPresenter`の`onAppear`メソッドに合計ポイントを計算し、新たなポイントエントリを生成してヒストリーリストに追加するロジックを実装したものです。その後、新しいリストを最新の日付順にソートします。

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        let user = try await apiRequestManager.getUser()
        var pointHistories = try await apiRequestManager.getPoints()
        self.user = user

        // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
        totalPoints = pointHistories.reduce(0) { $0 + $1.value }
        
        let now = Date()
        let calendar = Calendar.current
        let thisMonthComponents = calendar.dateComponents([.year, .month], from: now)
        guard let thisMonth = calendar.date(from: thisMonthComponents) else { return }

        let pointsTillLastMonth = pointHistories.filter { $0.createdAt < thisMonth }.reduce(0) { $0 + $1.value }
        let deductedValue = totalPoints - pointsTillLastMonth
        let nextMonthDate = calendar.date(byAdding: .month, value: 1, to: thisMonth)!
        let nextMonthFirstDate = calendar.date(from: calendar.dateComponents([.year, .month], from: nextMonthDate))!

        let newPointEntry = Point(id: UUID().uuidString, 
                                  createdAt: nextMonthFirstDate, 
                                  orgName: "エモミル運営", 
                                  researchTitle: "\(calendar.component(.year, from: nextMonthDate))年\(calendar.component(.month, from: nextMonthDate))月のポイント付与予定分", 
                                  value: deductedValue)
        pointHistories.append(newPointEntry)
        
        // sort the points by createdAt in descending order
        pointHistories.sort { $0.createdAt > $1.createdAt }

        self.pointHistories = pointHistories
    } catch {
        // TODO: エラーアラート表示ロジックを追加する
        AppLogger.debugLog(error.localizedDescription, category: .network, level: .error)
        isLoading = false
    }
}
```

この実装では、最初に今年と今月の情報を持つ`thisMonth`を生成しています。次に、それ以前の全てのポイントを取得し、`pointsTillLastMonth`を算出しています。これにより、次月のポイント付与分を計算できます。その後、次の月の最初の日を表す`nextMonthFirstDate`を生成し、新しいPointエントリを作成して`pointHistories`に追加します。

そして、`createdAt`プロパティを基に降順でソートを行います。これにより、最新のポイント情報が最初に表示されます。

注意: このコードはエラーハンドリングを完全には行っていません。生産コードでは適切なエラーハンドリングを行うことが重要です。

---

## 👤 ユーザー
*2023/07/21 15:49:57*

以下は一番最後のしょりにしてほしい

// TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
        totalPoints = pointHistories.reduce(0) { $0 + $1.value }

---

## 🤖 アシスタント
*2023/07/21 15:50:31*

わかりました。その指示に従い、全ポイントの合計を計算して`totalPoints`を更新する処理を最後に移動します。

以下に修正後のコードを示します:

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        let user = try await apiRequestManager.getUser()
        var pointHistories = try await apiRequestManager.getPoints()
        self.user = user

        let now = Date()
        let calendar = Calendar.current
        let thisMonthComponents = calendar.dateComponents([.year, .month], from: now)
        guard let thisMonth = calendar.date(from: thisMonthComponents) else { return }

        let pointsTillLastMonth = pointHistories.filter { $0.createdAt < thisMonth }.reduce(0) { $0 + $1.value }
        let deductedValue = totalPoints - pointsTillLastMonth
        let nextMonthDate = calendar.date(byAdding: .month, value: 1, to: thisMonth)!
        let nextMonthFirstDate = calendar.date(from: calendar.dateComponents([.year, .month], from: nextMonthDate))!

        let newPointEntry = Point(id: UUID().uuidString, 
                                  createdAt: nextMonthFirstDate, 
                                  orgName: "エモミル運営", 
                                  researchTitle: "\(calendar.component(.year, from: nextMonthDate))年\(calendar.component(.month, from: nextMonthDate))月のポイント付与予定分", 
                                  value: deductedValue)
        pointHistories.append(newPointEntry)
        
        // sort the points by createdAt in descending order
        pointHistories.sort { $0.createdAt > $1.createdAt }

        self.pointHistories = pointHistories

        // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
        totalPoints = pointHistories.reduce(0) { $0 + $1.value }
    } catch {
        // TODO: エラーアラート表示ロジックを追加する
        AppLogger.debugLog(error.localizedDescription, category: .network, level: .error)
        isLoading = false
    }
}
```
この修正により、新たに作成したポイントエントリを加えた後のポイント履歴全体から`totalPoints`を算出するようになります。

---

## 👤 ユーザー
*2023/07/21 15:52:47*

ちょっと違くて、今月より前の月ごとにappendしていって欲しい。

---

## 🤖 アシスタント
*2023/07/21 15:53:35*

理解しました、それでは次のように変更します。

次のスニペットでは、指定された日付（通常は現在の日付）からそれ以前の各月のポイントを計算し、それを新しい`Point`エントリとして`pointHistories`配列に追加しています。その後、全てのポイントの合計を算出し、`totalPoints`を更新しています。

この新しいロジックでは、各月ごとに新しい`Point`エントリを作成し、それを`pointHistories`に追加しています。追加が完了したら、ポイント履歴を日付の新しい順にソートしています。

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        let user = try await apiRequestManager.getUser()
        var pointHistories = try await apiRequestManager.getPoints()
        self.user = user

        let now = Date()
        let calendar = Calendar.current
        var currentMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: now))!
        
        while let pointsThisMonth = pointHistories.filter({ 
            let pointDateComponents = calendar.dateComponents([.year, .month], from: $0.createdAt)
            let pointMonth = calendar.date(from: pointDateComponents)!
            return pointMonth < currentMonth 
        }).first {
            pointHistories = pointHistories.filter { $0.id != pointsThisMonth.id }
            let deductedValue = pointsThisMonth.value - pointHistories.reduce(0) { $0 + $1.value }
            let nextMonthDate = calendar.date(byAdding: .month, value: 1, to: currentMonth)!
            let nextMonthFirstDate = calendar.date(from: calendar.dateComponents([.year, .month], from: nextMonthDate))!

            let newPointEntry = Point(id: UUID().uuidString, 
                                      createdAt: nextMonthFirstDate, 
                                      orgName: "エモミル運営", 
                                      researchTitle: "\(calendar.component(.year, from: nextMonthDate))年\(calendar.component(.month, from: nextMonthDate))月のポイント付与予定分", 
                                      value: deductedValue)
            pointHistories.append(newPointEntry)
            
            currentMonth = nextMonthDate
        }

        // sort the points by createdAt in descending order
        pointHistories.sort { $0.createdAt > $1.createdAt }

        self.pointHistories = pointHistories

        // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
        totalPoints = pointHistories.reduce(0) { $0 + $1.value }
    } catch {
        // TODO: エラーアラート表示ロジックを追加する
        AppLogger.debugLog(error.localizedDescription, category: .network, level: .error)
        isLoading = false
    }
}
```

これにより、前の各月のポイントを順番に計算し、新しい`Point`エントリを作成して追加することができます。最終的に全てのポイントの合計が`totalPoints`に反映されます。

---

## 👤 ユーザー
*2023/07/21 15:56:17*

var giftPoints: [Point] = [] を定義して、それに追加していって、全部の月の処理が終わったら、最後にpointHistoriesに追加していってほしい。

---

## 🤖 アシスタント
*2023/07/21 15:56:52*

それでは、指定された方法でコードを更新します。新たに`giftPoints`という配列を定義し、そこに毎月のギフトポイントを追加します。全ての月の処理が終わったら、これらのポイントを`pointHistories`に追加します。

以下が更新後のコードです：

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        let user = try await apiRequestManager.getUser()
        var pointHistories = try await apiRequestManager.getPoints()
        self.user = user

        let now = Date()
        let calendar = Calendar.current
        var currentMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: now))!
        
        var giftPoints: [Point] = []
        
        while let pointsThisMonth = pointHistories.filter({ 
            let pointDateComponents = calendar.dateComponents([.year, .month], from: $0.createdAt)
            let pointMonth = calendar.date(from: pointDateComponents)!
            return pointMonth < currentMonth 
        }).first {
            pointHistories = pointHistories.filter { $0.id != pointsThisMonth.id }
            let deductedValue = pointsThisMonth.value - pointHistories.reduce(0) { $0 + $1.value }
            let nextMonthDate = calendar.date(byAdding: .month, value: 1, to: currentMonth)!
            let nextMonthFirstDate = calendar.date(from: calendar.dateComponents([.year, .month], from: nextMonthDate))!

            let newPointEntry = Point(id: UUID().uuidString, 
                                      createdAt: nextMonthFirstDate, 
                                      orgName: "エモミル運営", 
                                      researchTitle: "\(calendar.component(.year, from: nextMonthDate))年\(calendar.component(.month, from: nextMonthDate))月のポイント付与予定分", 
                                      value: deductedValue)
            giftPoints.append(newPointEntry)
            
            currentMonth = nextMonthDate
        }
        
        pointHistories.append(contentsOf: giftPoints)

        // sort the points by createdAt in descending order
        pointHistories.sort { $0.createdAt > $1.createdAt }

        self.pointHistories = pointHistories

        // TODO: 本来は User.points からポイントを取得しているが、サーバー側の都合で一時的にアプリ側でsumしているので、いつか削除する
        totalPoints = pointHistories.reduce(0) { $0 + $1.value }
    } catch {
        // TODO: エラーアラート表示ロジックを追加する
        AppLogger.debugLog(error.localizedDescription, category: .network, level: .error)
        isLoading = false
    }
}
```

この新しいロジックにより、全ての月のギフトポイントが先に計算され、その後で`pointHistories`に追加されます。

---

## 👤 ユーザー
*2023/07/21 15:59:20*

つまり、4月分のポイントはすべて合計されて、5月1日にその合計値のマイナスのポイントになって、5月分のポイントはすべて合計されて、6月1日にその合計値のマイナスのポイントになるみないな挙動するであっていますか？

---

## 🤖 アシスタント
*2023/07/21 15:59:58*

ごめんなさいが、上記のコードはそのような挙動を作り出すものではありません。しかし、こちらの修正を行うことで、ご要望の挙動を実現できます。

まず、`while let pointsThisMonth` は単一の月に対して動作しています。それぞれの月のポイントを集計するために、我々は1年12ヶ月分のループを作り、その中で各月のポイントを集計します。

以下の修正を行いました：

1. `giftPoints` と `currentMonth` を0ポイントから開始します。
2. 1年（12ヶ月）分のループを作成し、その中で毎月のポイントを集計します。
3. 集計されたポイントを `giftPoints` に追加します。

これにより、各月のポイントが集計され、その合計値がマイナスになり、次の月の1日に適用されます。

以下が修正後のコードです：

```swift
func onAppear() async {
    isLoading = true
    defer {
        isLoading = false
    }
    do {
        let user = try await apiRequestManager.getUser()
        var pointHistories = try await apiRequestManager.getPoints()
        self.user = user

        let now = Date()
        let calendar = Calendar.current
        var currentMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: now))!
        
        var giftPoints: [Point] = []
        
        for _ in 1...12 {
            let pointsThisMonth = pointHistories.filter({ 
                let pointDateComponents = calendar.dateComponents([.year, .month], from: $0.createdAt)
                let pointMonth = calendar.date(from: pointDateComponents)!
                return pointMonth &lt; currentMonth 
            })
            
            let monthlyTotal = pointsThisMonth.reduce(0) { $0 + $1.value }
            pointHistories = pointHistories.filter { !pointsThisMonth.contains($0) }
            
            let nextMonthDate = calendar.date(byAdding: .month, value: 1, to: currentMonth)!
            let nextMonthFirstDate = calendar.date(from: calendar.dateComponents([.year, .month], from: nextMonthDate))!

            let newPointEntry = Point(id: UUID().uuidString, 
                                      createdAt: nextMonthFirstDate, 
                                      orgName: "エモミル運営", 
                                      researchTitle: "\(calendar.component(.year, from

---
