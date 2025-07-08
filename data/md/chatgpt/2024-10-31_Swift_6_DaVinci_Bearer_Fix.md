# Swift 6 DaVinci Bearer Fix

日付: 2024-10-31

---

## 👤 ユーザー
*2024/10/31 10:15:33*

DaVinciBearerRequestBuilder について

- execute: Method does not override any method from its superclass
- return super.execute(apiResponseQueue, completion): Cannot convert value of type 'DispatchQueue' to expected argument type '@Sendable (Result&lt;Response&lt;T&gt;, ErrorResponse&gt;) -&gt; Void', Extra argument in cal
- super.execute(apiResponseQueue) { result in: Cannot convert value of type 'DispatchQueue' to expected argument type '@Sendable (Result&lt;Response&lt;T&gt;, ErrorResponse&gt;) -&gt; Void', Extra trailing closure passed in call

というエラーが生じている
Swift6に変えて発生するようになった。直して欲しい

private class DaVinciBearerRequestBuilder&lt;T&gt;: URLSessionRequestBuilder&lt;T&gt;, @unchecked Sendable {
    private let evaluateUseCase: EvaluateTokenUpdateUseCase = EvaluateTokenUpdateUseCaseImpl.newInstance()

    // TODO: #652 [Swift6] OpenAPIClient Swift 6, override しないように対応する
    @discardableResult
    override func execute(_ apiResponseQueue: DispatchQueue = OpenAPIClient.shared.apiResponseQueue, _ completion: @escaping (Result&lt;Response&lt;T&gt;, ErrorResponse&gt;) -&gt; Void) -&gt; RequestTask {
        guard requiresAuthentication else {
            return super.execute(apiResponseQueue, completion)
        }

        let accessToken = KeychainAuthTokenStore.newInstance().accessToken ?? ""
        addHeaders(["Authorization": "Bearer \(accessToken)"])

        super.execute(apiResponseQueue) { result in
            self.evaluateUseCase.execute(
                result: result,
                completion: {
                    completion(result)
                },
                retry: {
                    self.execute(apiResponseQueue, completion)
                }
            )
        }

        return requestTask
    }
}


open class URLSessionRequestBuilder&lt;T&gt;: RequestBuilder&lt;T&gt;, @unchecked Sendable {

    /**
     May be assigned if you want to control the authentication challenges.
     */
    public var taskDidReceiveChallenge: OpenAPIClientAPIChallengeHandler?

    required public init(method: String, URLString: String, parameters: [String: Any]?, headers: [String: String] = [:], requiresAuthentication: Bool, openAPIClient: OpenAPIClient = OpenAPIClient.shared) {
        super.init(method: method, URLString: URLString, parameters: parameters, headers: headers, requiresAuthentication: requiresAuthentication, openAPIClient: openAPIClient)
    }

    /**
     May be overridden by a subclass if you want to control the URLSession
     configuration.
     */
    open func createURLSession() -&gt; URLSessionProtocol {
        return URLSessionRequestBuilderConfiguration.shared.defaultURLSession
    }

    /**
     May be overridden by a subclass if you want to control the Content-Type
     that is given to an uploaded form part.

     Return nil to use the default behavior (inferring the Content-Type from
     the file extension).  Return the desired Content-Type otherwise.
     */
    open func contentTypeForFormPart(fileURL: URL) -&gt; String? {
        return nil
    }

    /**
     May be overridden by a subclass if you want to control the URLRequest
     configuration (e.g. to override the cache policy).
     */
    open func createURLRequest(urlSession: URLSessionProtocol, method: HTTPMethod, encoding: ParameterEncoding, headers: [String: String]) throws -&gt; URLRequest {

        guard let url = URL(string: URLString) else {
            throw DownloadException.requestMissingURL
        }

        var originalRequest = URLRequest(url: url)

        originalRequest.httpMethod = method.rawValue

        buildHeaders().forEach { key, value in
            originalRequest.setValue(value, forHTTPHeaderField: key)
        }

        let modifiedRequest = try encoding.encode(originalRequest, with: parameters)

        return modifiedRequest
    }

    @discardableResult
    override open func execute(completion: @Sendable @escaping (_ result: Swift.Result&lt;Response&lt;T&gt;, ErrorResponse&gt;) -&gt; Void) -&gt; RequestTask {
        let urlSession = createURLSession()

        guard let xMethod = HTTPMethod(rawValue: method) else {
            fatalError("Unsupported Http method - \(method)")
        }

        let encoding: ParameterEncoding

        switch xMethod {
        case .get, .head:
            encoding = URLEncoding()

        case .options, .post, .put, .patch, .delete, .trace, .connect:
            let contentType = headers["Content-Type"] ?? "application/json"

            if contentType.hasPrefix("application/") && contentType.contains("json") {
                encoding = JSONDataEncoding()
            } else if contentType.hasPrefix("multipart/form-data") {
                encoding = FormDataEncoding(contentTypeForFormPart: contentTypeForFormPart(fileURL:))
            } else if contentType.hasPrefix("application/x-www-form-urlencoded") {
                encoding = FormURLEncoding()
            } else if contentType.hasPrefix("application/octet-stream"){
                encoding = OctetStreamEncoding()
            } else {
                fatalError("Unsupported Media Type - \(contentType)")
            }
        }

        do {
            let request = try createURLRequest(urlSession: urlSession, method: xMethod, encoding: encoding, headers: headers)

            openAPIClient.interceptor.intercept(urlRequest: request, urlSession: urlSession, openAPIClient: openAPIClient) { result in

                switch result {
                case .success(let modifiedRequest):
                    let dataTask = urlSession.dataTaskFromProtocol(with: modifiedRequest) { data, response, error in
                    self.cleanupRequest()
                        if let response, let error {
                            self.openAPIClient.interceptor.retry(urlRequest: modifiedRequest, urlSession: urlSession, openAPIClient: self.openAPIClient, data: data, response: response, error: error) { retry in
                                switch retry {
                                case .retry:
                                    self.execute(completion: completion)

                                case .dontRetry:
                                    self.openAPIClient.apiResponseQueue.async {
                                        self.processRequestResponse(urlRequest: request, data: data, response: response, error: error, completion: completion)
                                    }
                                }
                            }
                        } else {
                            self.openAPIClient.apiResponseQueue.async {
                                self.processRequestResponse(urlRequest: request, data: data, response: response, error: error, completion: completion)
                            }
                        }
                    }

                    self.onProgressReady?(dataTask.progress)

                    URLSessionRequestBuilderConfiguration.shared.challengeHandlerStore[dataTask.taskIdentifier] = self.taskDidReceiveChallenge
                    URLSessionRequestBuilderConfiguration.shared.credentialStore[dataTask.taskIdentifier] = self.credential

                    self.requestTask.set(task: dataTask)

                    dataTask.resume()

                case .failure(let error):
                    self.openAPIClient.apiResponseQueue.async {
                        completion(.failure(ErrorResponse.error(415, nil, nil, error)))
                    }
                }
            }
        } catch {
            self.openAPIClient.apiResponseQueue.async {
                completion(.failure(ErrorResponse.error(415, nil, nil, error)))
            }
        }

        return requestTask
    }

    private func cleanupRequest() {
        if let task = requestTask.get() {
            URLSessionRequestBuilderConfiguration.shared.challengeHandlerStore[task.taskIdentifier] = nil
            URLSessionRequestBuilderConfiguration.shared.credentialStore[task.taskIdentifier] = nil
        }
    }

    fileprivate func processRequestResponse(urlRequest: URLRequest, data: Data?, response: URLResponse?, error: Error?, completion: @escaping (_ result: Swift.Result&lt;Response&lt;T&gt;, ErrorResponse&gt;) -&gt; Void) {

        if let error = error {
            completion(.failure(ErrorResponse.error(-1, data, response, error)))
            return
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            completion(.failure(ErrorResponse.error(-2, data, response, DecodableRequestBuilderError.nilHTTPResponse)))
            return
        }

        guard openAPIClient.successfulStatusCodeRange.contains(httpResponse.statusCode) else {
            completion(.failure(ErrorResponse.error(httpResponse.statusCode, data, response, DecodableRequestBuilderError.unsuccessfulHTTPStatusCode)))
            return
        }

        switch T.self {
        case is Void.Type:

            completion(.success(Response(response: httpResponse, body: () as! T, bodyData: data)))

        default:
            fatalError("Unsupported Response Body Type - \(String(describing: T.self))")
        }

    }

    open func buildHeaders() -&gt; [String: String] {
        var httpHeaders: [String: String] = [:]
        for (key, value) in openAPIClient.customHeaders {
            httpHeaders[key] = value
        }
        for (key, value) in headers {
            httpHeaders[key] = value
        }
        return httpHeaders
    }

    fileprivate func getFileName(fromContentDisposition contentDisposition: String?) -&gt; String? {

        guard let contentDisposition = contentDisposition else {
            return nil
        }

        let items = contentDisposition.components(separatedBy: ";")

        var filename: String?

        for contentItem in items {

            let filenameKey = "filename="
            guard let range = contentItem.range(of: filenameKey) else {
                continue
            }

            filename = contentItem
            return filename?
                .replacingCharacters(in: range, with: "")
                .replacingOccurrences(of: "\"", with: "")
                .trimmingCharacters(in: .whitespacesAndNewlines)
        }

        return filename

    }

    fileprivate func getPath(from url: URL) throws -&gt; String {

        guard var path = URLComponents(url: url, resolvingAgainstBaseURL: true)?.path else {
            throw DownloadException.requestMissingPath
        }

        if path.hasPrefix("/") {
            path.remove(at: path.startIndex)
        }

        return path

    }

    fileprivate func getURL(from urlRequest: URLRequest) throws -&gt; URL {

        guard let url = urlRequest.url else {
            throw DownloadException.requestMissingURL
        }

        return url
    }

}

---

## 🤖 アシスタント
*2024/10/31 10:15:46*

The errors you're encountering are due to changes in Swift 6 regarding concurrency and type safety. Swift 6 introduces stricter requirements around `@Sendable` closures and the proper usage of async APIs. Here are the adjustments you can make to align with Swift 6’s requirements:

### Step-by-Step Adjustments

1. **Correct `@Sendable` Compatibility:**
   Swift 6 expects any closure used within async tasks or passed as an argument to be `@Sendable`. Let's ensure the `completion` closure is explicitly marked as `@Sendable` throughout.

2. **Modify Dispatch Queue and Closure Signatures:**
   The `super.execute` method now has a `@Sendable` closure expectation, so we'll need to remove the `DispatchQueue` argument and directly use the queue within the completion handler.

### Updated `DaVinciBearerRequestBuilder` Implementation

Here’s the revised `DaVinciBearerRequestBuilder` class implementation that incorporates these changes:

```swift
private class DaVinciBearerRequestBuilder<T>: URLSessionRequestBuilder<T>, @unchecked Sendable {
    private let evaluateUseCase: EvaluateTokenUpdateUseCase = EvaluateTokenUpdateUseCaseImpl.newInstance()

    // Override to execute request with @Sendable compliance
    @discardableResult
    override func execute(_ apiResponseQueue: DispatchQueue = OpenAPIClient.shared.apiResponseQueue,
                          _ completion: @Sendable @escaping (Result<Response<T>, ErrorResponse>) -> Void) -> RequestTask {
        
        guard requiresAuthentication else {
            return super.execute(completion: completion)  // Call super without the queue argument
        }

        let accessToken = KeychainAuthTokenStore.newInstance().accessToken ?? ""
        addHeaders(["Authorization": "Bearer \(accessToken)"])

        // Use super.execute with proper `@Sendable` closure
        super.execute { result in
            apiResponseQueue.async {
                self.evaluateUseCase.execute(
                    result: result,
                    completion: {
                        completion(result)
                    },
                    retry: {
                        self.execute(apiResponseQueue, completion)  // Retry the request if necessary
                    }
                )
            }
        }

        return requestTask
    }
}
```

### Explanation of Changes

1. **Removing Dispatch Queue Argument**: `super.execute` is now called without the `apiResponseQueue` parameter because Swift 6 expects the closure to match exactly, and `DispatchQueue` doesn’t meet the new requirement.
  
2. **Async Execution on the Correct Queue**: To ensure the completion executes on `apiResponseQueue`, we wrap `evaluateUseCase.execute` within `apiResponseQueue.async`.

3. **Ensuring `@Sendable` Compliance**: Marking the closure as `@Sendable` wherever it’s passed ensures Swift 6’s concurrency model requirements are satisfied.

This should resolve the type compatibility and `@Sendable`-related errors introduced in Swift 6. If further issues appear or Swift's execution requirements change, adding `@Sendable` checks for each closure argument can help clarify issues during compile time.

---

## 👤 ユーザー
*2024/10/31 10:16:47*

Method does not override any method from its superclass とお超えられる

---

## 🤖 アシスタント
*2024/10/31 10:16:58*

The `Method does not override any method from its superclass` error means that Swift doesn't recognize `execute` in `DaVinciBearerRequestBuilder` as an overridden method from `URLSessionRequestBuilder`. This error often happens due to either a mismatch in the method signature or a Swift version change that altered method expectations.

Here’s how to address this:

1. **Check the Method Signature**: Ensure that the `execute` method’s parameters and return type exactly match those in the superclass (`URLSessionRequestBuilder`). Even a minor mismatch (e.g., argument labels, types) can cause this issue.

2. **Confirm the Method Exists in Superclass**: Make sure `execute` is defined as `open` in `URLSessionRequestBuilder`. If it's `public` but not `open`, Swift won’t allow it to be overridden.

### Updated Code

To troubleshoot, start by aligning `execute` exactly with the superclass’s definition in `URLSessionRequestBuilder`. Here’s the corrected method signature:

```swift
@discardableResult
override open func execute(completion: @Sendable @escaping (Result<Response<T>, ErrorResponse>) -> Void) -> RequestTask {
    // Method implementation
}
```

### Explanation

In this case:

- The `override open func execute(...)` in `DaVinciBearerRequestBuilder` should match exactly the parameters and return type in `URLSessionRequestBuilder`.
- If `URLSessionRequestBuilder` doesn’t have `open` access for `execute`, you’ll need to change it to `open` to allow overrides.

---
