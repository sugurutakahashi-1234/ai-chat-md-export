# Testing Errors with Quick/Nimble

日付: 2023-08-15

---

## 👤 ユーザー
*2023/8/15 16:16:25*

Quick/Nimble で try を catch してエラー系をテストしたい

---

## 🤖 アシスタント
*2023/8/15 16:17:02*

Quick/Nimble は Swift の人気のある BDD (Behavior-Driven Development) テストフレームワークです。Swift のエラーをキャッチしてテストする場合、次のような方法で行うことができます。

以下に、Swift のエラーを利用してQuick/Nimble を使ってテストする例を示します:

1. まず、適切なエラーを定義します:
```swift
enum SampleError: Error {
    case somethingWentWrong
}
```

2. テスト対象の関数を定義します:
```swift
func mightThrowError(shouldThrow: Bool) throws {
    if shouldThrow {
        throw SampleError.somethingWentWrong
    }
}
```

3. Quick/Nimble を使ってエラーをキャッチし、テストします:
```swift
import Quick
import Nimble

class SampleSpec: QuickSpec {
    override func spec() {
        describe("error handling") {
            it("throws the error when it should") {
                expect {
                    try mightThrowError(shouldThrow: true)
                }.to(throwError(SampleError.somethingWentWrong))
            }
            
            it("doesn't throw an error when it shouldn't") {
                expect {
                    try mightThrowError(shouldThrow: false)
                }.notTo(throwError())
            }
        }
    }
}
```

この例では、`expect {...}.to(throwError(...))` を使用して、関数が期待されるエラーをスローするかどうかをテストしています。

注意点として、`throwError` はエラーの具体的な型や内容をテストすることができるので、期待するエラーの種類によって `throwError` の引数を変更してください。

---

## 👤 ユーザー
*2023/8/15 16:17:52*

errorのenumが連想値を持っている場合はどうすればいいか？caseだけ一致していればいいとしたい

---

## 🤖 アシスタント
*2023/8/15 16:18:34*

連想値を持つエラー `enum` の場合、エラーの型やケースだけを確認したい場合は、カスタムマッチャーを作成することで実現できます。

以下に、連想値を持つエラー `enum` の場合のQuick/Nimbleでのテスト例を示します:

1. 連想値を持つエラーを定義:
```swift
enum SampleError: Error {
    case somethingWentWrong(message: String)
}
```

2. テスト対象の関数を定義:
```swift
func mightThrowError(shouldThrow: Bool) throws {
    if shouldThrow {
        throw SampleError.somethingWentWrong(message: "An error occurred!")
    }
}
```

3. カスタムマッチャーを定義:
```swift
func throwErrorCase<T: Equatable, E: Error>(_ expectedError: T) -> Predicate<E> {
    return Predicate { actualExpression in
        if let actualError = try? actualExpression.evaluate(), let actualErrorCase = actualError as? T {
            return PredicateResult(bool: actualErrorCase == expectedError, message: .expectedTo("throw error case \(expectedError)"))
        }
        return PredicateResult(status: .fail, message: .expectedTo("throw error case \(expectedError)"))
    }
}
```

4. Quick/Nimbleを使ってエラーのケースだけをテスト:
```swift
import Quick
import Nimble

class SampleSpec: QuickSpec {
    override func spec() {
        describe("error handling with associated values") {
            it("throws the error with the right case") {
                expect {
                    try mightThrowError(shouldThrow: true)
                }.to(throwErrorCase(SampleError.somethingWentWrong(message: "")))
            }
        }
    }
}
```

ここで、`throwErrorCase` はエラーのケースだけを比較し、連想値の内容は無視します。この方法で、エラーのケースの一致のみを確認するテストを作成できます。

---

## 👤 ユーザー
*2023/8/15 16:18:50*

もうちょっとカジュアルに書きたい

---

## 🤖 アシスタント
*2023/8/15 16:19:19*

もちろん、もっとシンプルに書くこともできます。エラーの `case` だけをテストするための簡単な方法を以下に示します。

1. 連想値を持つエラーを定義:
```swift
enum SampleError: Error {
    case somethingWentWrong(message: String)
}
```

2. テスト対象の関数を定義:
```swift
func mightThrowError(shouldThrow: Bool) throws {
    if shouldThrow {
        throw SampleError.somethingWentWrong(message: "An error occurred!")
    }
}
```

3. Quick/Nimbleを使ってエラーのケースだけをテスト:
```swift
import Quick
import Nimble

class SampleSpec: QuickSpec {
    override func spec() {
        describe("error handling with associated values") {
            it("throws the error with the right case") {
                expect {
                    try mightThrowError(shouldThrow: true)
                }.to(throwError { (error: SampleError) in
                    switch error {
                    case .somethingWentWrong:
                        // This block will be executed if the error matches
                        break
                    default:
                        fail("Unexpected error case")
                    }
                })
            }
        }
    }
}
```

上記のテストでは、`throwError` マッチャーのクロージャーを使用して、エラーの `case` だけを確認しています。クロージャー内では具体的なエラーケースを確認し、それ以外のケースでエラーがスローされた場合は `fail` を使ってテストが失敗するようにしています。

---
