# CombineLatestでtrueの場合にprint

日付: 2023-09-29

---

## 👤 ユーザー
*2023/9/29 15:28:06*

以下のcombineが全部trueになったときにprintするような処理を実施したい

$shouldShowLogin
            .combineLatest($shouldShowAppIntroduction)
            .combineLatest($shouldShowUserAttributesRegister)
            .combineLatest($shouldShowDeviceAccessRequest)
            .combineLatest($shouldShowGazeCalibration)
            .

---

## 🤖 アシスタント
*2023/9/29 15:28:48*

Combineの概念は、異なるオブザーバブルシーケンスの最新の要素を組み合わせることです。すべての`combineLatest`が`true`である場合に、特定の処理を行いたい場合、その組み合わせの結果が`true`であるかどうかを確認すればよいです。次の例はSwiftでReactiveSwiftまたはRxSwiftを使用した場合の一般的なアプローチです。

### RxSwiftの場合

```swift
import RxSwift
import RxCocoa

let disposeBag = DisposeBag()

Observable.combineLatest(
    shouldShowLogin.asObservable(),
    shouldShowAppIntroduction.asObservable(),
    shouldShowUserAttributesRegister.asObservable(),
    shouldShowDeviceAccessRequest.asObservable(),
    shouldShowGazeCalibration.asObservable()
)
.map { $0.0 && $0.1 && $0.2 && $0.3 && $0.4 }
.distinctUntilChanged()
.filter { $0 == true }
.subscribe(onNext: {
    print("すべてがtrueです")
})
.disposed(by: disposeBag)
```

### ReactiveSwiftの場合

```swift
import ReactiveSwift

let compositeDisposable = CompositeDisposable()

let combinedSignal = SignalProducer.combineLatest(
    shouldShowLogin.producer,
    shouldShowAppIntroduction.producer,
    shouldShowUserAttributesRegister.producer,
    shouldShowDeviceAccessRequest.producer,
    shouldShowGazeCalibration.producer
)
.map { $0 && $1 && $2 && $3 && $4 }
.distinctUntilChanged()
.filter { $0 == true }

compositeDisposable += combinedSignal.startWithValues {
    print("すべてがtrueです")
}
```

この例では、`combineLatest`を使用して5つのObservableまたはSignalProducerの最新の値を組み合わせ、それがすべて`true`の場合にのみprintします。

注意: これらの例では、各変数がObservableまたはSignalProducerとして正しく設定されていることを前提としています。また、適切なライブラリがプロジェクトにインストールされ、インポートされている必要があります。

---
