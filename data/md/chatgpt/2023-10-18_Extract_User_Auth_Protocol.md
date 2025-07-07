# Extract User Auth Protocol

日付: 2023-10-18

---

## 👤 ユーザー
*2023/10/18 11:56:03*

protocolを抽出して欲しい

    public func signUp(emailAddress: String, phoneNumber: String, password: String) async throws {
        let authUserAttributes = \[
            AuthUserAttribute(.email, value: emailAddress),
            AuthUserAttribute(.phoneNumber, value: phoneNumber)
        \]
        let options = AuthSignUpRequest.Options(userAttributes: authUserAttributes)
        let result = try await Amplify.Auth.signUp(username: emailAddress, password: password, options: options)
        LoggerContainer.log(.signUp(.init(result: "\\(result)")))

        switch result.nextStep {
        case .confirmUser(let deliveryDetails, let info, let userId):
            LoggerContainer.debugLog("Confirm sign up user: \\(String(describing: deliveryDetails)), \\(String(describing: info)), \\(String(describing: userId)))")
        case .done:
            LoggerContainer.debugLog("Reset completed")
        }
    }

    public func confirmSignUp(emailAddress: String, otpCode: String) async throws {
        let result = try await Amplify.Auth.confirmSignUp(for: emailAddress, confirmationCode: otpCode)
        LoggerContainer.log(.confirmSignUp(.init(result: "\\(result)")))
    }

    public func resendSignUpCode(emailAddress: String) async throws {
        let result = try await Amplify.Auth.resendSignUpCode(for: emailAddress)
        LoggerContainer.log(.resendSignUpCode(.init(result: "\\(result)")))
    }

    public func resetPassword(emailAddress: String) async throws {
        let result = try await Amplify.Auth.resetPassword(for: emailAddress)
        LoggerContainer.log(.resetPassword(.init(result: "\\(result)")))

        switch result.nextStep {
        case .confirmResetPasswordWithCode(let deliveryDetails, let info):
            LoggerContainer.debugLog("Confirm reset password with code send to - \\(deliveryDetails) \\(String(describing: info))")
        case .done:
            LoggerContainer.debugLog("Reset completed")
        }
    }

---

## 🤖 アシスタント
*2023/10/18 11:56:20*

It appears that you're asking to extract a protocol from the provided Swift code, which includes methods for signing up, confirming sign-up, resending a sign-up code, and resetting a password. These methods seem to be part of a user authentication system, possibly using the Amplify library.

Below is an example of how you might define a protocol that abstracts these functionalities:

```swift
import Amplify

protocol UserAuthenticationService {
    func signUp(emailAddress: String, phoneNumber: String, password: String) async throws
    func confirmSignUp(emailAddress: String, otpCode: String) async throws
    func resendSignUpCode(emailAddress: String) async throws
    func resetPassword(emailAddress: String) async throws
}
```

This `UserAuthenticationService` protocol defines the contract that any authentication service must adhere to. It declares the same functions as in your provided code, without any specific implementation. 

You can then make your original class (or a new one) conform to this protocol by implementing the protocol's methods, which you have already defined. Here's a basic example:

```swift
class AmplifyAuthenticationService: UserAuthenticationService {

    public func signUp(emailAddress: String, phoneNumber: String, password: String) async throws {
        // Your existing implementation...
    }

    public func confirmSignUp(emailAddress: String, otpCode: String) async throws {
        // Your existing implementation...
    }

    public func resendSignUpCode(emailAddress: String) async throws {
        // Your existing implementation...
    }

    public func resetPassword(emailAddress: String) async throws {
        // Your existing implementation...
    }
}
```

This approach allows you to depend on abstractions (protocols) rather than concrete implementations, providing more flexibility to your code, easing the process of testing, and adhering to the Dependency Inversion Principle.

---
