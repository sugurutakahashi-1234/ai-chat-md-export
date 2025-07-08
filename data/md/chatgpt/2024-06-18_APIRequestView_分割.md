# APIRequestView 分割

日付: 2024-06-18

---

## 👤 ユーザー
*2024/06/18 18:09:35*

Viewをいくつか分割したい

public struct APIRequestView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: APIRequestPresenter&lt;Dependency&gt;

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(dependency: dependency))
    }

    public var body: some View {
        List {
            Section("Request") {
                HStack {
                    Picker(selection: $presenter.selectedApi) {
                        ForEach(APIType.allCases, id: \.self) { apiType in
                            Text("\(apiType)")
                        }
                    } label: {
                        Text("API")
                    }
                    .pickerStyle(.menu)

                    Spacer()
                }

                Group {
                    switch presenter.selectedApi {
                    case .getUsers:
                        EmptyView()
                    case .getUser:
                        VStack(alignment: .leading) {
                            Text("User id")
                                .font(.subheadline)
                            TextField("1", value: $presenter.userId, format: .number)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(.numberPad)
                        }
                    case .all:
                        EmptyView()
                    }
                }
            }
            .textCase(.none)
            .listRowSeparator(.hidden)

            Section("Response") {
                Group {
                    switch presenter.selectedApi {
                    case .getUsers:
                        NavigationLink {
                            APIResponseView(object: presenter.getUsersResponse)
                        } label: {
                            Text("Response")
                        }
                        .isHidden(presenter.getUsersResponse.isEmpty)
                    case .getUser:
                        NavigationLink {
                            APIResponseView(object: presenter.getUserByIdResponse)

                        } label: {
                            Text("Response")
                        }
                        .isHidden(presenter.getUserByIdResponse.isEmpty)
                    case .all:
                        NavigationLink {
                            APIResponseView(object: presenter.allResponse)
                        } label: {
                            Text("Response")
                        }
                        .isHidden(presenter.allResponse.isEmpty)
                    }
                }
                .redacted(reason: presenter.isLoading ? .placeholder : [])
                .shimmering(active: presenter.isLoading)
            }
            .textCase(.none)

            Group {
                switch presenter.selectedApi {
                case .getUsers:
                    PropertyView(showToast: $presenter.showToast, objects: presenter.getUsersResponse, onTapElement: presenter.onTapElement)
                case .getUser:
                    PropertyView(showToast: $presenter.showToast, objects: presenter.getUserByIdResponse, onTapElement: presenter.onTapElement)
                case .all:
                    PropertyView(showToast: $presenter.showToast, objects: presenter.allResponse, onTapElement: presenter.onTapElement)
                }
            }
            .redacted(reason: presenter.isLoading ? .placeholder : [])
            .shimmering(active: presenter.isLoading)
        }
        .scrollDismissesKeyboard(.immediately)
        .simpleToast(isPresented: $presenter.showToast, options: SimpleToastOptions(alignment: .bottom, hideAfter: 1), content: {
            Label {
                Text("Copy")
            } icon: {
                SFSymbols.checkmarkCircle.image
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        })
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    presenter.onTapCleaner()
                } label: {
                    SFSymbols.wandAndStars.image
                }
            }

            ToolbarItem(placement: .status) {
                Button {
                    Task {
                        await presenter.onTapPlay()
                    }
                } label: {
                    Label {
                        Text("Request")
                    } icon: {
                        SFSymbols.arrowUpSquare.image
                    }
                    .labelStyle(.titleAndIcon)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .navigationTitle("API Request")
        .alert(isPresented: $presenter.showAlert, error: presenter.appError) {
            Button("OK") {}
        }
    }
}

---

## 🤖 アシスタント
*2024/06/18 18:10:15*

`APIRequestView` をいくつかのコンポーネントに分割して、コードの可読性とメンテナンス性を向上させましょう。主に「Requestセクション」、「Responseセクション」、および「プロパティビュー」の部分を独立したビューに分けます。

まず、APIRequestViewの全体構造はそのままにして、必要なサブビューを作成します。

### APIRequestView

```swift
public struct APIRequestView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: APIRequestPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(dependency: dependency))
    }

    public var body: some View {
        List {
            RequestSectionView(presenter: presenter)
            ResponseSectionView(presenter: presenter)
            PropertySectionView(presenter: presenter)
        }
        .scrollDismissesKeyboard(.immediately)
        .simpleToast(isPresented: $presenter.showToast, options: SimpleToastOptions(alignment: .bottom, hideAfter: 1), content: {
            Label {
                Text("Copy")
            } icon: {
                SFSymbols.checkmarkCircle.image
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        })
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    presenter.onTapCleaner()
                } label: {
                    SFSymbols.wandAndStars.image
                }
            }

            ToolbarItem(placement: .status) {
                Button {
                    Task {
                        await presenter.onTapPlay()
                    }
                } label: {
                    Label {
                        Text("Request")
                    } icon: {
                        SFSymbols.arrowUpSquare.image
                    }
                    .labelStyle(.titleAndIcon)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .navigationTitle("API Request")
        .alert(isPresented: $presenter.showAlert, error: presenter.appError) {
            Button("OK") {}
        }
    }
}
```

### RequestSectionView

```swift
struct RequestSectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Section("Request") {
            HStack {
                Picker(selection: $presenter.selectedApi) {
                    ForEach(APIType.allCases, id: \.self) { apiType in
                        Text("\(apiType)")
                    }
                } label: {
                    Text("API")
                }
                .pickerStyle(.menu)

                Spacer()
            }

            Group {
                switch presenter.selectedApi {
                case .getUsers:
                    EmptyView()
                case .getUser:
                    VStack(alignment: .leading) {
                        Text("User id")
                            .font(.subheadline)
                        TextField("1", value: $presenter.userId, format: .number)
                            .textFieldStyle(.roundedBorder)
                            .keyboardType(.numberPad)
                    }
                case .all:
                    EmptyView()
                }
            }
        }
        .textCase(.none)
        .listRowSeparator(.hidden)
    }
}
```

### ResponseSectionView

```swift
struct ResponseSectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Section("Response") {
            Group {
                switch presenter.selectedApi {
                case .getUsers:
                    NavigationLink {
                        APIResponseView(object: presenter.getUsersResponse)
                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.getUsersResponse.isEmpty)
                case .getUser:
                    NavigationLink {
                        APIResponseView(object: presenter.getUserByIdResponse)

                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.getUserByIdResponse.isEmpty)
                case .all:
                    NavigationLink {
                        APIResponseView(object: presenter.allResponse)
                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.allResponse.isEmpty)
                }
            }
            .redacted(reason: presenter.isLoading ? .placeholder : [])
            .shimmering(active: presenter.isLoading)
        }
        .textCase(.none)
    }
}
```

### PropertySectionView

```swift
struct PropertySectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Group {
            switch presenter.selectedApi {
            case .getUsers:
                PropertyView(showToast: $presenter.showToast, objects: presenter.getUsersResponse, onTapElement: presenter.onTapElement)
            case .getUser:
                PropertyView(showToast: $presenter.showToast, objects: presenter.getUserByIdResponse, onTapElement: presenter.onTapElement)
            case .all:
                PropertyView(showToast: $presenter.showToast, objects: presenter.allResponse, onTapElement: presenter.onTapElement)
            }
        }
        .redacted(reason: presenter.isLoading ? .placeholder : [])
        .shimmering(active: presenter.isLoading)
    }
}
```

このように、各セクションを個別のビューに分割することで、コードがより整理され、個々のセクションのテストやメンテナンスが容易になります。

---

## 👤 ユーザー
*2024/06/18 18:10:44*

presenter を外部に持たせたくない

---

## 🤖 アシスタント
*2024/06/18 18:11:22*

User prefers not to externalize the presenter in their SwiftUI views.

---

## 🔧 ツール
*2024/06/18 18:11:22*

Model set context updated.

---

## 🤖 アシスタント
*2024/06/18 18:11:22*

`presenter` を外部に持たせずにビューを分割するために、依然として `APIRequestView` に保持したまま、内部で `presenter` を渡してビューを分割します。

以下はそのアプローチです：

### APIRequestView

```swift
public struct APIRequestView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: APIRequestPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(dependency: dependency))
    }

    public var body: some View {
        List {
            RequestSectionView(presenter: presenter)
            ResponseSectionView(presenter: presenter)
            PropertySectionView(presenter: presenter)
        }
        .scrollDismissesKeyboard(.immediately)
        .simpleToast(isPresented: $presenter.showToast, options: SimpleToastOptions(alignment: .bottom, hideAfter: 1), content: {
            Label {
                Text("Copy")
            } icon: {
                SFSymbols.checkmarkCircle.image
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        })
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    presenter.onTapCleaner()
                } label: {
                    SFSymbols.wandAndStars.image
                }
            }

            ToolbarItem(placement: .status) {
                Button {
                    Task {
                        await presenter.onTapPlay()
                    }
                } label: {
                    Label {
                        Text("Request")
                    } icon: {
                        SFSymbols.arrowUpSquare.image
                    }
                    .labelStyle(.titleAndIcon)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .navigationTitle("API Request")
        .alert(isPresented: $presenter.showAlert, error: presenter.appError) {
            Button("OK") {}
        }
    }
}
```

### RequestSectionView

```swift
private struct RequestSectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Section("Request") {
            HStack {
                Picker(selection: $presenter.selectedApi) {
                    ForEach(APIType.allCases, id: \.self) { apiType in
                        Text("\(apiType)")
                    }
                } label: {
                    Text("API")
                }
                .pickerStyle(.menu)

                Spacer()
            }

            Group {
                switch presenter.selectedApi {
                case .getUsers:
                    EmptyView()
                case .getUser:
                    VStack(alignment: .leading) {
                        Text("User id")
                            .font(.subheadline)
                        TextField("1", value: $presenter.userId, format: .number)
                            .textFieldStyle(.roundedBorder)
                            .keyboardType(.numberPad)
                    }
                case .all:
                    EmptyView()
                }
            }
        }
        .textCase(.none)
        .listRowSeparator(.hidden)
    }
}
```

### ResponseSectionView

```swift
private struct ResponseSectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Section("Response") {
            Group {
                switch presenter.selectedApi {
                case .getUsers:
                    NavigationLink {
                        APIResponseView(object: presenter.getUsersResponse)
                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.getUsersResponse.isEmpty)
                case .getUser:
                    NavigationLink {
                        APIResponseView(object: presenter.getUserByIdResponse)
                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.getUserByIdResponse.isEmpty)
                case .all:
                    NavigationLink {
                        APIResponseView(object: presenter.allResponse)
                    } label: {
                        Text("Response")
                    }
                    .isHidden(presenter.allResponse.isEmpty)
                }
            }
            .redacted(reason: presenter.isLoading ? .placeholder : [])
            .shimmering(active: presenter.isLoading)
        }
        .textCase(.none)
    }
}
```

### PropertySectionView

```swift
private struct PropertySectionView<Dependency: RootDIContainerDependency>: View {
    @ObservedObject var presenter: APIRequestPresenter<Dependency>

    var body: some View {
        Group {
            switch presenter.selectedApi {
            case .getUsers:
                PropertyView(showToast: $presenter.showToast, objects: presenter.getUsersResponse, onTapElement: presenter.onTapElement)
            case .getUser:
                PropertyView(showToast: $presenter.showToast, objects: presenter.getUserByIdResponse, onTapElement: presenter.onTapElement)
            case .all:
                PropertyView(showToast: $presenter.showToast, objects: presenter.allResponse, onTapElement: presenter.onTapElement)
            }
        }
        .redacted(reason: presenter.isLoading ? .placeholder : [])
        .shimmering(active: presenter.isLoading)
    }
}
```

このように、`presenter` をAPIRequestViewに保持したまま、セクションごとに独立したサブビューを定義することで、ビューの分割と整理が可能になります。

---
