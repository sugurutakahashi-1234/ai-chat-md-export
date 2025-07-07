# Remove List Background

日付: 2024-08-15

---

## 👤 ユーザー
*2024/8/15 15:11:24*

{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-PKaDHlgZckGj5T5rhQisvPDy",
  "size\_bytes": 56539,
  "width": 462,
  "height": 920,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
Listならではのグレーの背景が表示される.scrollContentBackground(.hidden)や.background(Color.clear)としてもパディングが保たれてしまうので、それを消したい

// MARK: - View

public struct ProfilePostView: View {
    @StateObject private var presenter: ProfilePostPresenter

    public init() {
        \_presenter = .init(wrappedValue: ProfilePostPresenter())
    }

    public var body: some View {
        VStack {
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)

            List {
                NavigationLink {
                    TextInputView(inputText: $presenter.nickname, title: "ニックネーム", placeholder: "あとで変更できます")
                } label: {
                    HStack {
                        Spacer()
                        Text(presenter.nickname == "" ? "入力してください" : presenter.nickname)
                            .foregroundStyle(.gray)
                    }
                }
                .accentColor(.gray)
                .listRowSeparator(.hidden)
            }
            .listStyle(.automatic)
            // .background(Color.clear)
            .scrollDisabled(true)
            // .scrollContentBackground(.hidden)

            HStack {
                Text("誕生日")
                    .font(.headline)
                Spacer()
            }
            .padding(.bottom)
            
            DatePicker(
                "",
                selection: $presenter.birthDay,
                displayedComponents: .date
            )
            .datePickerStyle(.wheel)
            .labelsHidden()
            
            HStack {
                Text("性別")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)
            
            List {
                Picker("", selection: $presenter.gender) {
                    ForEach(Gender.allCases, id: \\.self) { gender in
                        Text("\\(gender.displayName)")
                            .tag(gender)
                    }
                }
                .pickerStyle(.navigationLink)
                .labelsHidden()
                .accentColor(.gray)
                .listRowSeparator(.hidden)
            }
            .listStyle(.automatic)
            // .background(Color.clear)
            .scrollDisabled(true)
            // .scrollContentBackground(.hidden)
                    
            Spacer()
            
            Button {
                presenter.onTapDone()
            } label: {
                Text("完了")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .disabled(!presenter.isValid)
        }
        .padding(.horizontal, 32)
        .navigationTitle("プロフィール")
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 アシスタント
*2024/8/15 15:11:37*

To remove the default gray background of the `List` while keeping the necessary padding, you can modify your `ProfilePostView` by wrapping the `List` in a `ZStack` and applying the `background` modifier to the `List` itself instead of its container. Here's how you can adjust your code:

```swift
public struct ProfilePostView: View {
    @StateObject private var presenter: ProfilePostPresenter

    public init() {
        _presenter = .init(wrappedValue: ProfilePostPresenter())
    }

    public var body: some View {
        VStack {
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)

            ZStack {
                Color.clear
                List {
                    NavigationLink {
                        TextInputView(inputText: $presenter.nickname, title: "ニックネーム", placeholder: "あとで変更できます")
                    } label: {
                        HStack {
                            Spacer()
                            Text(presenter.nickname == "" ? "入力してください" : presenter.nickname)
                                .foregroundStyle(.gray)
                        }
                    }
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .background(Color.clear)
                .scrollContentBackground(.hidden)
            }

            HStack {
                Text("誕生日")
                    .font(.headline)
                Spacer()
            }
            .padding(.bottom)
            
            DatePicker(
                "",
                selection: $presenter.birthDay,
                displayedComponents: .date
            )
            .datePickerStyle(.wheel)
            .labelsHidden()
            
            HStack {
                Text("性別")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)
            
            ZStack {
                Color.clear
                List {
                    Picker("", selection: $presenter.gender) {
                        ForEach(Gender.allCases, id: \.self) { gender in
                            Text("\(gender.displayName)")
                                .tag(gender)
                        }
                    }
                    .pickerStyle(.navigationLink)
                    .labelsHidden()
                    .accentColor(.gray)
                    .listRowSeparator(.hidden)
                }
                .listStyle(.plain)
                .scrollDisabled(true)
                .background(Color.clear)
                .scrollContentBackground(.hidden)
            }

            Spacer()
            
            Button {
                presenter.onTapDone()
            } label: {
                Text("完了")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .disabled(!presenter.isValid)
        }
        .padding(.horizontal, 32)
        .navigationTitle("プロフィール")
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

In this modification:

- A `ZStack` with `Color.clear` is added to each `List` section, which keeps the `List`'s background clear while preserving the layout.
- The `.listStyle(.plain)` is used instead of `.automatic` to simplify the background removal process.
- `.scrollContentBackground(.hidden)` is applied to remove the default background color of the list.

This should remove the gray background while maintaining the desired padding and alignment.

---

## 👤 ユーザー
*2024/8/15 15:12:06*

変わらずパディングをとっていた

---

## 🤖 アシスタント
*2024/8/15 15:12:19*

`List` のデフォルトのパディングを完全に削除するために、`Section` を使わず、`List` を直接利用しない方法があります。また、`List` の代わりに他のレイアウト方法を使ってパディングを制御することも考えられます。

例えば、`List` の代わりに `VStack` を使い、必要なスタイルやアクセントを手動で適用する方法です。以下はその例です：

```swift
public struct ProfilePostView: View {
    @StateObject private var presenter: ProfilePostPresenter

    public init() {
        _presenter = .init(wrappedValue: ProfilePostPresenter())
    }

    public var body: some View {
        VStack {
            HStack {
                Text("ニックネーム")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)

            NavigationLink {
                TextInputView(inputText: $presenter.nickname, title: "ニックネーム", placeholder: "あとで変更できます")
            } label: {
                HStack {
                    Spacer()
                    Text(presenter.nickname == "" ? "入力してください" : presenter.nickname)
                        .foregroundStyle(.gray)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(8)
            }
            .accentColor(.gray)

            HStack {
                Text("誕生日")
                    .font(.headline)
                Spacer()
            }
            .padding(.bottom)
            
            DatePicker(
                "",
                selection: $presenter.birthDay,
                displayedComponents: .date
            )
            .datePickerStyle(.wheel)
            .labelsHidden()
            
            HStack {
                Text("性別")
                    .font(.headline)
                Spacer()
            }
            .padding(.vertical)
            
            Picker("", selection: $presenter.gender) {
                ForEach(Gender.allCases, id: \.self) { gender in
                    Text("\(gender.displayName)")
                        .tag(gender)
                }
            }
            .pickerStyle(.navigationLink)
            .accentColor(.gray)
            .padding()
            .background(Color.white)
            .cornerRadius(8)
                    
            Spacer()
            
            Button {
                presenter.onTapDone()
            } label: {
                Text("完了")
                    .font(.title2)
                    .frame(height: 54)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .clipShape(.rect(cornerRadius: 50))
            .padding(.bottom, 32)
            .disabled(!presenter.isValid)
        }
        .padding(.horizontal, 32)
        .navigationTitle("プロフィール")
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

### 変更点：
- `List` の代わりに `VStack` や `HStack` を使用して、レイアウトを直接制御しています。
- パディングをカスタムに設定して、余分なスペースを削除しています。
- `NavigationLink` や `Picker` のラベル部分にも手動でスタイルを適用しています。

このアプローチにより、不要なパディングや背景色が除去され、`List` の代わりに自分でスタイルを管理することで、希望通りのデザインに近づけることができます。

---
