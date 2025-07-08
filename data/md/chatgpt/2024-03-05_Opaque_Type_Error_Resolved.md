# Opaque Type Error Resolved

Date: 2024-03-05

---

## 👤 User
*2024-03-06 00:50:22*

@MainActor
final class DeviceInfoPresenter&lt;Dependency: DeviceInfoPresenterDependency&gt;: ObservableObject {
    @Published var shouldShowCopyAlert: Bool = false
    private(set) var selectedDeviceInfoType: DeviceInfoType?

    private let clipboardDriver: Dependency.ClipboardDriverProtocolAT
    private let deviceInfoUsecase: some DeviceInfoUsecase

    var copiedAlertTitle: String {
        guard let selectedDeviceInfoType else {
            return ""
        }
        return "Copied \"\(getDeviceInfoValue(selectedDeviceInfoType))\""
    }

    init(dependency: Dependency) {
        LogDriver.initLog()

        clipboardDriver = dependency.clipboardDriver
        deviceInfoUsecase = DeviceInfoInteractor(buildEnvRepository: dependency.buildEnvRepository, deviceInfoDriver: dependency.deviceInfoDriver)
    }
}

以下のエラーが発生している。deviceInfoUsecase は DeviceInfoUsecase としてのインターフェースしか提供したくないが、DeviceInfoInteractor を使うことは確定している。

Property declares an opaque return type, but has no initializer expression from which to infer an underlying type

Cannot assign value of type 'DeviceInfoInteractor&lt;Dependency.BuildEnvRepositoryProtocolAT, Dependency.DeviceInfoDriverProtocolAT&gt;' to type 'some DeviceInfoUsecase'

---

## 👤 User
*2024-03-06 00:52:00*

これだと any になって、some よりも処理性能が落ちてしまう。、

---

## 🤖 Assistant
*2024-03-06 00:53:23*

Swiftの`some`キーワードは、コンパイル時に具体的な型を確定させるために使用されます。これにより、`some`を使用することで、ジェネリックスやプロトコルに対する型の曖昧さを解消し、型安全性を高めることができます。しかし、`some`キーランタイム時の型の柔軟性は制限され、コンパイル時にその型が何であるかを確定させる必要があります。

あなたのケースでは、`DeviceInfoUsecase`プロトコルを実装する`DeviceInfoInteractor`インスタンスを`deviceInfoUsecase`プロパティに割り当てようとしていますが、`some`キーワードを使用しているため、エラーが発生しています。`some`キーワードは、関数やプロパティが一つの具体的な型のみを返すことを保証する場合に使用しますが、プロパティの宣言時には、その具体的な型をコンパイラが推論できるような形で初期化式を提供する必要があります。

この問題を解決するためには、`some`キーワードの代わりに`any`キーワードを使用することで、実行時の型のチェックを許容し、より動的な型の使用を可能にすることができます。ただし、`any`を使用すると、コンパイル時の型の確定性が失われ、実行時のパフォーマンスが低下する可能性があります。しかし、あなたのケースでは、`DeviceInfoUsecase`プロトコルの具体的な実装を隠蔽しつつ、依存性注入を通じて柔軟性を保持する必要があるため、このトレードオフは受け入れる必要があります。

```swift
private let deviceInfoUsecase: any DeviceInfoUsecase
```

このように`any`キーワードを使用することで、`DeviceInfoInteractor`のインスタンスを`DeviceInfoUsecase`プロトコルとして`deviceInfoUsecase`プロパティに割り当てることができます。これにより、実行時に`DeviceInfoUsecase`プロトコルを満たす任意の型のオブジェクトを`deviceInfoUsecase`プロパティに割り当てることが可能になり、より動的なプログラミングが可能になりますが、コンパイル時の型の確定性と最適化の利点は失われます。

---

## 👤 User
*2024-03-06 01:00:46*

どうしてもanyキーワードを使いたくない。今回のケースとしてはDeviceInfoInteractorとわかっているのだけれども、DeviceInfoInteractor側が公開している変数を意図せずに呼べてしまうのがよくないんだ。

---

## 🤖 Assistant
*2024-03-06 01:02:06*

理解しました。`any`キーワードを避け、かつ`DeviceInfoInteractor`の具体的な実装を隠蔽しつつ、`DeviceInfoUsecase`プロトコルを通じてのみアクセスを許可したい場合、Swiftの型システム内で解決する方法が必要です。`some`キーワードを使用している場合、コンパイラはそのプロパティが一貫して同じ型を返すことを期待しますが、プロパティの宣言時に具体的な型を推論できる必要があります。

この問題を解決する一つの方法は、`DeviceInfoUsecase`を満たす任意の型を受け入れるためのファクトリメソッドまたはイニシャライザを導入することです。しかし、`some`をプロパティで直接使用する場合、初期化時に具体的な型を確定させる必要があるため、このアプローチは直接のプロパティ宣言では機能しません。

代わりに、`DeviceInfoUsecase`プロトコルを満たす具体的な型を隠蔽するために、ジェネリックを使用して`DeviceInfoPresenter`自体を設計することができます。ただし、あなたの要件に基づいて、`DeviceInfoInteractor`の具体的な実装を隠蔽しつつ、そのインスタンスを内部で使用するという点において、ジェネリックスも同様の問題に直面する可能性があります。

もう一つのアプローチは、`DeviceInfoUsecase`プロトコルを満たすラッパークラスまたは構造体を作成することです。このラッパーは内部で`DeviceInfoInteractor`のインスタンスを保持し、外部からは`DeviceInfoUsecase`プロトコルを通じてのみアクセスを許可します。これにより、`DeviceInfoInteractor`の公開されているメソッドやプロパティへのアクセスを制限しつつ、`DeviceInfoUsecase`プロトコルを満たす機能を提供できます。

例えば:

```swift
protocol DeviceInfoUsecase {
    // ここにプロトコルの要件を定義
}

class DeviceInfoUsecaseWrapper: DeviceInfoUsecase {
    private var interactor: DeviceInfoInteractor

    init(interactor: DeviceInfoInteractor) {
        self.interactor = interactor
    }

    // DeviceInfoUsecaseプロトコルを満たすメソッドを実装し、内部でinteractorを使用
}

// 使用例
let usecaseWrapper = DeviceInfoUsecaseWrapper(interactor: DeviceInfoInteractor(...))
```

この方法では、`DeviceInfoPresenter`内で`DeviceInfoUsecaseWrapper`インスタンスを保持し、`DeviceInfoUsecase`プロトコルを通じて操作を行います。これにより、`DeviceInfoInteractor`の具体的な実装を隠蔽しつつ、必要な機能を提供できます。

---

## 👤 User
*2024-03-06 01:14:41*

これは求めているものではなかった。
whereとかを用いてうまく解決できないのか？

---

## 🤖 Assistant
*2024-03-06 01:16:31*

了解しました。`where`句を使用して、ジェネリック型の制約を指定する方法で問題を解決しようとするアプローチについて考えてみましょう。ただし、`some`キーワードを使用した場合の主な課題は、プロパティが一貫して同じ型を返すことを保証する必要がある点です。これは、プロパティ宣言時には直接解決できない問題です。

しかし、`where`句を使ってジェネリック型の制約を設定し、特定の条件下でのみクラスやメソッドを使用できるようにすることは可能です。この場合、`DeviceInfoPresenter`クラス自体をジェネリックとして定義し、そのジェネリック型が`DeviceInfoUsecase`プロトコルを満たす型であることを保証することが考えられます。しかし、これは`DeviceInfoUsecase`の実装を隠蔽するという当初の要求からは少し離れるかもしれません。

`DeviceInfoUsecase`プロトコルを満たす具体的な型を隠蔽しつつ、その型が`DeviceInfoInteractor`であることを内部的に保証する方法については、Swiftの型システムでは直接的な解決策は提供されていません。`some`や`any`を使用する場合の型の抽象化は、型の具体的な実装を隠蔽する目的で使用されますが、これらのキーワードはプロパティや関数の戻り値に対する型の抽象化に焦点を当てています。

もし`DeviceInfoInteractor`の具体的な実装を隠蔽しつつ、そのメソッドやプロパティへのアクセスを制限したいのであれば、前述したようにラッパークラスやファクトリーパターンを使用するのが現実的な解決策です。これにより、`DeviceInfoUsecase`プロトコルを通じてのみアクセスを許可し、`DeviceInfoInteractor`の公開されているメソッドやプロパティへの直接的なアクセスを防ぐことができます。

結論として、Swiftの現在の型システムと言語機能では、`where`句を使用してこの特定の問題を解決する方法は提供されていません。プロトコルとジェネリックスを使用した型の抽象化は、型の安全性と再利用性を向上させることができますが、特定の実装を隠蔽しつつ型制約を強制することは、提案された方法（ラッパークラスやファクトリーパターンの使用）を通じて行う必要があります。

---
