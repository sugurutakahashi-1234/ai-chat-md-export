# Left-align Text View

日付: 2024-07-18

---

## 👤 ユーザー
*2024/7/18 15:06:16*

テキストを左寄せにしたい

public struct LicenseDetailView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: LicenseDetailPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, license: License) {
        self.dependency = dependency
        \_presenter = .init(wrappedValue: LicenseDetailPresenter(dependency: dependency, license: license))
    }

    public var body: some View {
        ScrollView {
            Text(presenter.license.text)
                .padding()
        }
        .navigationTitle(presenter.license.name)
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
*2024/7/18 15:06:25*

テキストを左寄せにするには、`Text`ビューに`multilineTextAlignment(.leading)`を追加します。これにより、テキストの複数行が左寄せになります。以下に修正したコードを示します。

```swift
public struct LicenseDetailView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: LicenseDetailPresenter<Dependency>

    public init(dependency: Dependency, license: License) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: LicenseDetailPresenter(dependency: dependency, license: license))
    }

    public var body: some View {
        ScrollView {
            Text(presenter.license.text)
                .padding()
                .multilineTextAlignment(.leading) // ここで左寄せにする
        }
        .navigationTitle(presenter.license.name)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}
```

これにより、`presenter.license.text`のテキストが左寄せになります。

---
