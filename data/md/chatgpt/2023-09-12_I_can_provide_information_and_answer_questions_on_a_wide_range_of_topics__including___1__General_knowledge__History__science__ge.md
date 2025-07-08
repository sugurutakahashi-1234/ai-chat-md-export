# I can provide information and answer questions on a wide range of topics, including:

1. General knowledge: History, science, ge

Date: 2023-09-12

---

## 👤 User
*2023-09-12 18:10:53*

roundMessageView について、こううするとroundMessageViewのお願い終了条件の文字列が中央揃えになってしまう。

struct WebsiteMeasurementInstructionView: View {
    @Environment(\.dismiss) private var dismiss
    let websiteMeasurement: WebsiteMeasurement
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    roundMessageView(title: "お願い終了条件", message: websiteMeasurement.requirementInstructions)
                    roundMessageView(title: "サイトを見るときのシチュエーション", message: websiteMeasurement.instructions)
                }
                .padding(.top, 24)
                .padding(.horizontal, 16)
            }
            .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("このお願いについて")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        dismiss.callAsFunction()
                    } label: {
                        Text(CoreStrings.Common.close)
                            .typographyStyle(.button2)
                            .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                    }
                }
            }
        }
    }
    
    private func roundMessageView(title: String, message: String) -&gt; some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .typographyStyle(.body3)
            Text(message)
                .typographyStyle(.body2)
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(CoreAssets.Color.Neutral.white.swiftUIColor)
        .cornerRadius(8)
    }
}

---

## 🤖 Assistant
*2023-09-12 18:11:53*

SwiftUI の `VStack` において、中身のテキストの揃え方を指定するために `alignment: .leading` を使用しています。この場合、テキストは左揃えになるはずですが、`Text(message)` の内容によっては、文字列が中央揃えに見えることがあります。

原因として考えられるのは:

1. `Text(message)` に与えられた文字列が、行の幅いっぱいに広がっているか、又は行の真ん中に配置されている場合。
2. 使用している `.typographyStyle` 修飾子や他のカスタム修飾子が、予期せぬ振る舞いをしている。

修正方法:

1. `Text(message)` のスタイルを詳しくチェックする。特に、カスタムの `.typographyStyle` 修飾子が予期せぬ振る舞いをしていないか確認する。
2. 一時的に `.typographyStyle` などのカスタム修飾子を削除して、問題が解決するかどうかを確認する。
3. `Text` ウィジェットに `.multilineTextAlignment(.leading)` を追加して、テキストの揃え方を強制的に左揃えにする。
4. `.frame` 修飾子の動作を確認する。特に `maxWidth: .infinity` が適切に動作しているかどうかをチェックする。

上記のコードで提供されている情報を元に提案した解決方法です。もし、これで問題が解決しない場合は、さらなる詳細やコンテキストが必要かもしれません。

---
