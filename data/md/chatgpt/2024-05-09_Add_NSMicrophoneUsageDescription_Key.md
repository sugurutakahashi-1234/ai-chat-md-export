# Add NSMicrophoneUsageDescription Key

Date: 2024-05-09

---

## 👤 User
*2024-05-09 17:54:38*

Preview でこのようなエラーになってしまった

This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSMicrophoneUsageDescription key with a string value explaining to the user how the app uses this data.

---

## 🤖 Assistant
*2024-05-09 17:55:08*

このエラーメッセージは、アプリがマイクロフォンのデータへのアクセスを試みたが、`Info.plist` ファイルに必要な説明がないためにクラッシュしたことを示しています。ユーザーのプライバシーに関わるデータへアクセスする場合、iOSは開発者がその理由をユーザーに説明することを義務付けています。

解決するには、アプリの `Info.plist` ファイルに `NSMicrophoneUsageDescription` キーを追加し、その値にアプリがマイクロフォンをどのように使用するかを説明する文字列を設定する必要があります。以下はその手順です：

1. Xcodeでプロジェクトを開きます。
2. ナビゲーションエリアで `Info.plist` ファイルを選択します。
3. ファイルエディターで右クリックし、「Add Row」を選択します。
4. 新しいキーとして `NSMicrophoneUsageDescription` を追加します。
5. 値のフィールドに、アプリがユーザーのマイクロフォンデータをどのように使用するかを説明するメッセージを入力します。例えば、「このアプリでは、ボイスメッセージの録音にマイクロフォンが使用されます」などです。

これでアプリがユーザーのデータを安全に扱い、プライバシーポリシーに従っていることをユーザーに伝えることができます。プロジェクトを再度ビルドして実行すれば、この問題は解消されるはずです。

---

## 👤 User
*2024-05-09 17:56:05*

これはSwiftUIのPreviewなんだ info.plistでは設定できない

---

## 🤖 Assistant
*2024-05-09 17:56:53*

SwiftUIのプレビューで `NSMicrophoneUsageDescription` のエラーが発生している場合、Xcodeのプレビュー環境に適用される `Info.plist` は異なる扱いになります。このような状況に対処する一つの方法は、プレビュー専用の設定を行うことです。

SwiftUI プレビューで特定の機能（例えばマイクロフォン）を使用する場合、通常のアプリ実行時に必要とされるプライバシー関連の設定がプレビュー時にも適用されるわけではないため、エラーが発生することがあります。ただし、SwiftUIプレビューでマイクロフォンやカメラなどのハードウェア機能を直接扱うコードが動作している場合、それをプレビューから外すか、条件付きでプレビューを制限する必要があります。

以下の方法でプレビューでのエラーを回避できるかもしれません：

### プレビュー用のコンディショナルコードを追加する
プレビュー中に特定のコードが実行されないようにするには、`DEBUG` 環境変数を利用して、コードがプレビューでのみ、またはプレビュー外でのみ実行されるように制御できます。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, world!")
            .padding()
            .onAppear {
                #if DEBUG
                // デバッグまたはプレビュー時のみ実行されるコード
                #else
                // 実際のデバイスやシミュレータでのみ実行されるコード
                #endif
            }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この方法で、プレビュー中に特定の機能へのアクセスを試みるコード部分が無効化され、エラーが解消されるかもしれません。ただし、プレビューでのビジュアルテストには影響が出る可能性がありますので、その点は考慮する必要があります。

---

## 👤 User
*2024-05-09 17:57:17*

#if Preview などはできないのか？

---

## 🤖 Assistant
*2024-05-09 17:58:02*

SwiftUIで `#if Preview` のようなプリプロセッサディレクティブを使用して直接プレビュー状態を判定する方法は用意されていません。Swift のプリプロセッサディレクティブはコンパイル時に評価されるため、ランタイム状態（例えばXcodeのプレビューがアクティブかどうか）に基づいた条件分岐を直接行うことはできません。

プレビューで特定のコードを避けるためのアプローチとしては、次のような方法が考えられます：

### プレビュー用のダミーデータまたはビューモデルを使用
プレビュー専用のダミーデータやビューモデルを用意し、それをプレビュー時のみ使用するという方法です。これにより、リアルなデバイスやシミュレーター上での動作とは異なる挙動をプレビューに対して設定できます。

```swift
struct ContentView: View {
    @ObservedObject var viewModel: ViewModel

    var body: some View {
        Text(viewModel.data)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(viewModel: PreviewViewModel())
    }
}

class PreviewViewModel: ViewModel {
    override init() {
        super.init()
        // プレビュー用の設定やダミーデータ
        self.data = "プレビュー用のテキスト"
    }
}
```

### Environment 変数を利用
`Environment` または `EnvironmentObject` を使用して、アプリがプレビュー中かどうかを示すフラグを管理することも考えられます。ただし、これには環境変数を設定し、ビューがそれを読み取るようにする追加のセットアップが必要です。

### 最後の手段としての DEBUG 条件コンパイル
デバッグビルドでのみ有効になるコードを記述するには、`#if DEBUG` を使用する方法がありますが、これはプレビュー専用ではなく、デバッグ時全般に影響します。

```swift
#if DEBUG
// デバッグビルドでのみ実行されるコード
#endif
```

これらの方法はプレビューで特定の挙動を制御する際の代替手段となりますが、完全にプレビュー状態のみを対象とするディレクティブは現在のSwiftUIには存在しません。

---
