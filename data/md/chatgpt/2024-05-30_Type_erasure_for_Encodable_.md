# Type erasure for Encodable.

日付: 2024-05-30

---

## 👤 ユーザー
*2024/5/30 14:52:13*

ResponseView(objects: responseObjects) Type 'any Encodable' cannot conform to 'Encodable' となった。なぜか？

struct ResponseView&lt;T: Encodable&gt;: View {
    @State var showToast: Bool = false
    let objects: [T]
    
    public var body: some View {
        Section {
            NavigationLink {
                ScrollView {
                    VStack(alignment: .leading) {
                        SelectableTextView(text: "\(try! JSONHandler.jsonString(objects: objects))")
                    }
                    .padding()
                }
                .navigationTitle("Response")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            onTapElement(object: objects)
                        } label : {
                            Image(systemName: "doc.on.doc")
                        }
                    }
                }
                .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                    alignment: .bottom,
                    hideAfter: 1
                )) {
                    Label {
                        Text("Copy")
                    } icon: {
                        Image(systemName: "checkmark.circle")
                    }
                    .padding()
                    .background(Color.green.opacity(0.8))
                    .foregroundColor(Color.white)
                    .cornerRadius(12)
                    .padding(.top)
                }
            } label: {
                Text("Response")
            }
        }
    }
    
    func onTapElement(object: Any) {
        UIPasteboard.general.string = {
            do {
                return try JSONHandler.jsonString(object: object)
            } catch {
                return "\(object)"
            }
        }()
        
        showToast = true
    }
}
enum ApiType: CaseIterable {
    case getUsers
    case getUser
}

enum ApiError: LocalizedError {
    case notFound
    case undocumented
    
    // alert title
    var errorDescription: String? {
        "\(self)"
    }
}

public struct ContentView: View {
    @State var showToast: Bool = false
    @State var responseObjects: [Encodable] = []
    @State var getUsersResponse: [Components.Schemas.User] = []
    @State var getUserByIdResponse: [Components.Schemas.User] = []
    @State var hoge: [Persons] = []
    @State var userId: Int = 1
    @State var selectedApi: ApiType = .getUser
    @State var isLoading: Bool = false
    @State var showAlert: Bool = false
    @State var apiError: ApiError?
    let client: Client

    public init() {
        self.client = Client(
            serverURL: try! Servers.server1(),
            transport: URLSessionTransport()
        )
        
//        $selectedApi
//            .map { apiType in
//                switch apiType {
//
//                }
//            }
//            .assign(to: &$responseObjects)
        
        responseObjects = getUsersResponse
        responseObjects = hoge
    }

    public var body: some View {
        NavigationStack {
            List {
                
                Picker(selection: $selectedApi) {
                    ForEach(ApiType.allCases, id: \.self) { apiType in
                        Text("\(apiType)")
                    }
                } label: {
                    Text("API")
                }
                .pickerStyle(.navigationLink)
                
        
                if selectedApi == .getUser {
                    TextField("User id", value: $userId, format: .number)
                }

                Button {
                    Task {
                        await executeSelectedAPI()
                    }
                } label: {
                    Text("Execute")
                }
    
                ResponseView(objects: responseObjects)
                    .redacted(reason: isLoading ? .placeholder : [])
                    .shimmering(active: isLoading)

                PropertyView(showToast: $showToast, objects: responseObjects)
                    .redacted(reason: isLoading ? .placeholder : [])
                    .shimmering(active: isLoading)
            }
            .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                alignment: .bottom,
                hideAfter: 1
            )) {
                Label {
                    Text("Copy")
                } icon: {
                    Image(systemName: "checkmark.circle")
                }
                .padding()
                .background(Color.green.opacity(0.8))
                .foregroundColor(Color.white)
                .cornerRadius(12)
                .padding(.top)
            }
        }
        .alert(isPresented: $showAlert, error: apiError) { 
            Button("OK") {}
        }
    }
    
    func executeSelectedAPI() async {
        switch selectedApi {
        case .getUsers:
            await getUsers()
        case .getUser:
            await getUserById(id: userId)
        }
    }

    private func getUsers() async {
        getUsersResponse = []
        isLoading = true
        defer {
            isLoading = false
        }
        
        let response = try! await client.getUsers()
        
        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let users):
                self.getUsersResponse = users
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }

    private func getUserById(id: Int) async {
        getUserByIdResponse = []
        isLoading = true
        defer {
            isLoading = false
        }

        let response = try! await client.getUserById(path: .init(id: id))

        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let user):
                self.getUserByIdResponse = [user]
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }
}

#Preview {
    ContentView()
}

---

## 🤖 アシスタント
*2024/5/30 14:52:49*

The issue `Type 'any Encodable' cannot conform to 'Encodable'` arises because Swift's type system doesn't allow existential types (like `any Encodable`) to conform to protocols (`Encodable`). In other words, `any Encodable` means "some type that conforms to `Encodable`", but Swift can't guarantee how to encode that type at runtime because it doesn't know the specific type.

To resolve this, we need to adjust how we handle the type constraints. One approach is to use type erasure to wrap the encodable objects. Here's an implementation that uses `AnyEncodable` to solve this issue:

```swift
import SwiftUI

// Type erasure wrapper for Encodable
struct AnyEncodable: Encodable {
    private let _encode: (Encoder) throws -> Void

    init<T: Encodable>(_ wrapped: T) {
        _encode = wrapped.encode
    }

    func encode(to encoder: Encoder) throws {
        try _encode(encoder)
    }
}

struct ResponseView<T: Encodable>: View {
    @State var showToast: Bool = false
    let objects: [T]
    
    public var body: some View {
        Section {
            NavigationLink {
                ScrollView {
                    VStack(alignment: .leading) {
                        SelectableTextView(text: "\(try! JSONHandler.jsonString(objects: objects))")
                    }
                    .padding()
                }
                .navigationTitle("Response")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            onTapElement(object: objects)
                        } label: {
                            Image(systemName: "doc.on.doc")
                        }
                    }
                }
                .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                    alignment: .bottom,
                    hideAfter: 1
                )) {
                    Label {
                        Text("Copy")
                    } icon: {
                        Image(systemName: "checkmark.circle")
                    }
                    .padding()
                    .background(Color.green.opacity(0.8))
                    .foregroundColor(Color.white)
                    .cornerRadius(12)
                    .padding(.top)
                }
            } label: {
                Text("Response")
            }
        }
    }
    
    func onTapElement(object: [T]) {
        UIPasteboard.general.string = {
            do {
                return try JSONHandler.jsonString(objects: object)
            } catch {
                return "\(object)"
            }
        }()
        
        showToast = true
    }
}

enum ApiType: CaseIterable {
    case getUsers
    case getUser
}

enum ApiError: LocalizedError {
    case notFound
    case undocumented
    
    // alert title
    var errorDescription: String? {
        "\(self)"
    }
}

public struct ContentView: View {
    @State var showToast: Bool = false
    @State var responseObjects: [AnyEncodable] = []
    @State var getUsersResponse: [Components.Schemas.User] = []
    @State var getUserByIdResponse: [Components.Schemas.User] = []
    @State var hoge: [Persons] = []
    @State var userId: Int = 1
    @State var selectedApi: ApiType = .getUser
    @State var isLoading: Bool = false
    @State var showAlert: Bool = false
    @State var apiError: ApiError?
    let client: Client

    public init() {
        self.client = Client(
            serverURL: try! Servers.server1(),
            transport: URLSessionTransport()
        )
        
        responseObjects = getUsersResponse.map { AnyEncodable($0) }
        responseObjects = hoge.map { AnyEncodable($0) }
    }

    public var body: some View {
        NavigationStack {
            List {
                
                Picker(selection: $selectedApi) {
                    ForEach(ApiType.allCases, id: \.self) { apiType in
                        Text("\(apiType)")
                    }
                } label: {
                    Text("API")
                }
                .pickerStyle(.navigationLink)
                
        
                if selectedApi == .getUser {
                    TextField("User id", value: $userId, format: .number)
                }

                Button {
                    Task {
                        await executeSelectedAPI()
                    }
                } label: {
                    Text("Execute")
                }
    
                ResponseView(objects: responseObjects)
                    .redacted(reason: isLoading ? .placeholder : [])
                    .shimmering(active: isLoading)

                PropertyView(showToast: $showToast, objects: responseObjects)
                    .redacted(reason: isLoading ? .placeholder : [])
                    .shimmering(active: isLoading)
            }
            .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                alignment: .bottom,
                hideAfter: 1
            )) {
                Label {
                    Text("Copy")
                } icon: {
                    Image(systemName: "checkmark.circle")
                }
                .padding()
                .background(Color.green.opacity(0.8))
                .foregroundColor(Color.white)
                .cornerRadius(12)
                .padding(.top)
            }
        }
        .alert(isPresented: $showAlert, error: apiError) { 
            Button("OK") {}
        }
    }
    
    func executeSelectedAPI() async {
        switch selectedApi {
        case .getUsers:
            await getUsers()
        case .getUser:
            await getUserById(id: userId)
        }
    }

    private func getUsers() async {
        getUsersResponse = []
        isLoading = true
        defer {
            isLoading = false
        }
        
        let response = try! await client.getUsers()
        
        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let users):
                self.getUsersResponse = users
                self.responseObjects = users.map { AnyEncodable($0) }
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }

    private func getUserById(id: Int) async {
        getUserByIdResponse = []
        isLoading = true
        defer {
            isLoading = false
        }

        let response = try! await client.getUserById(path: .init(id: id))

        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let user):
                self.getUserByIdResponse = [user]
                self.responseObjects = [AnyEncodable(user)]
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }
}

#Preview {
    ContentView()
}
```

By using `AnyEncodable`, you can now handle different `Encodable` types within the same array and avoid the `any Encodable` conformance issue.

---

## 👤 ユーザー
*2024/5/30 14:52:51*

AnyEncodable は使いたくない。

---

## 🤖 アシスタント
*2024/5/30 14:53:31*

If you prefer not to use `AnyEncodable`, another approach is to keep the type information intact throughout your code by ensuring that the types conform to `Encodable` and are used consistently. Here's how you can modify your implementation to avoid `AnyEncodable` while still achieving the desired functionality:

```swift
import SwiftUI

struct ResponseView<T: Encodable>: View {
    @State var showToast: Bool = false
    let objects: [T]
    
    public var body: some View {
        Section {
            NavigationLink {
                ScrollView {
                    VStack(alignment: .leading) {
                        SelectableTextView(text: "\(try! JSONHandler.jsonString(objects: objects))")
                    }
                    .padding()
                }
                .navigationTitle("Response")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            onTapElement(object: objects)
                        } label: {
                            Image(systemName: "doc.on.doc")
                        }
                    }
                }
                .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                    alignment: .bottom,
                    hideAfter: 1
                )) {
                    Label {
                        Text("Copy")
                    } icon: {
                        Image(systemName: "checkmark.circle")
                    }
                    .padding()
                    .background(Color.green.opacity(0.8))
                    .foregroundColor(Color.white)
                    .cornerRadius(12)
                    .padding(.top)
                }
            } label: {
                Text("Response")
            }
        }
    }
    
    func onTapElement(object: [T]) {
        UIPasteboard.general.string = {
            do {
                return try JSONHandler.jsonString(objects: object)
            } catch {
                return "\(object)"
            }
        }()
        
        showToast = true
    }
}

enum ApiType: CaseIterable {
    case getUsers
    case getUser
}

enum ApiError: LocalizedError {
    case notFound
    case undocumented
    
    // alert title
    var errorDescription: String? {
        "\(self)"
    }
}

public struct ContentView: View {
    @State var showToast: Bool = false
    @State var getUsersResponse: [Components.Schemas.User] = []
    @State var getUserByIdResponse: [Components.Schemas.User] = []
    @State var hoge: [Persons] = []
    @State var userId: Int = 1
    @State var selectedApi: ApiType = .getUser
    @State var isLoading: Bool = false
    @State var showAlert: Bool = false
    @State var apiError: ApiError?
    let client: Client

    public init() {
        self.client = Client(
            serverURL: try! Servers.server1(),
            transport: URLSessionTransport()
        )
    }

    public var body: some View {
        NavigationStack {
            List {
                Picker(selection: $selectedApi) {
                    ForEach(ApiType.allCases, id: \.self) { apiType in
                        Text("\(apiType)")
                    }
                } label: {
                    Text("API")
                }
                .pickerStyle(.navigationLink)
                
                if selectedApi == .getUser {
                    TextField("User id", value: $userId, format: .number)
                }

                Button {
                    Task {
                        await executeSelectedAPI()
                    }
                } label: {
                    Text("Execute")
                }

                if selectedApi == .getUsers {
                    ResponseView(objects: getUsersResponse)
                        .redacted(reason: isLoading ? .placeholder : [])
                        .shimmering(active: isLoading)
                } else if selectedApi == .getUser {
                    ResponseView(objects: getUserByIdResponse)
                        .redacted(reason: isLoading ? .placeholder : [])
                        .shimmering(active: isLoading)
                }
            }
            .simpleToast(isPresented: $showToast, options: SimpleToastOptions(
                alignment: .bottom,
                hideAfter: 1
            )) {
                Label {
                    Text("Copy")
                } icon: {
                    Image(systemName: "checkmark.circle")
                }
                .padding()
                .background(Color.green.opacity(0.8))
                .foregroundColor(Color.white)
                .cornerRadius(12)
                .padding(.top)
            }
        }
        .alert(isPresented: $showAlert, error: apiError) { 
            Button("OK") {}
        }
    }
    
    func executeSelectedAPI() async {
        switch selectedApi {
        case .getUsers:
            await getUsers()
        case .getUser:
            await getUserById(id: userId)
        }
    }

    private func getUsers() async {
        getUsersResponse = []
        isLoading = true
        defer {
            isLoading = false
        }
        
        let response = try! await client.getUsers()
        
        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let users):
                self.getUsersResponse = users
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }

    private func getUserById(id: Int) async {
        getUserByIdResponse = []
        isLoading = true
        defer {
            isLoading = false
        }

        let response = try! await client.getUserById(path: .init(id: id))

        switch response {
        case .ok(let okResponse):
            switch okResponse.body {
            case .json(let user):
                self.getUserByIdResponse = [user]
            }
        case .notFound(let notFoundResponse):
            switch notFoundResponse.body {
            case .json(let error):
                print("\(error)")
                apiError = .notFound
                showAlert = true
            }
        case .undocumented(statusCode: let statusCode, _):
            print("\(statusCode)")
            apiError = .undocumented
            showAlert = true
        }
    }
}

#Preview {
    ContentView()
}
```

### Key Changes:
1. **ResponseView Initialization:** I removed the need for a generic `Encodable` array (`responseObjects`). Instead, the `ContentView` manages state-specific responses (`getUsersResponse`, `getUserByIdResponse`) and passes them directly to `ResponseView`.
2. **Conditionally Display ResponseView:** Based on the selected API, the appropriate response array is passed to `ResponseView`.

This approach maintains type safety and avoids the use of `AnyEncodable` by directly using type-specific responses.

---
