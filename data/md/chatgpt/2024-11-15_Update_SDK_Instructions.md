# Update SDK Instructions

日付: 2024-11-15

---

## 👤 ユーザー
*2024/11/15 16:05:14*

&lt;windows&gt;
&lt;instructions&gt;
You are being provided with textfield content from windows the user has asked you to focus on.
User-selected text is enclosed within &lt;user__selection&gt; tags (these tags are not part of the original content and should never be included in your response). When the user has selected text, focus your response on that text. For example, if the user asks about "this," they are likely referring to the selected text.
&lt;/instructions&gt;
&lt;window&gt;
&lt;title&gt;DISample — Package.swift&lt;/title&gt;
&lt;app_name&gt;Xcode&lt;/app_name&gt;
&lt;textfields&gt;
&lt;textfield id="0"&gt;// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import CompilerPluginSupport
import PackageDescription

private extension String {
    /// ex) "dependencyInjection" -&gt; "DependencyInjection"
    var initialUppercased: String {
        guard !isEmpty else {
            return ""
        }
        return prefix(1).uppercased() + dropFirst()
    }
}

let swiftFlags = [
    "-Xfrontend", "-warn-long-expression-type-checking=300",
    "-Xfrontend", "-warn-long-function-bodies=300",
    "-enable-actor-data-race-checks",
]

/// Ref: https://github.com/treastrain/swift-upcomingfeatureflags-cheatsheet
/// Ref: https://zenn.dev/treastrain/articles/d2fd1b44e3ead5
extension SwiftSetting {
    static let existentialAny: Self = .enableUpcomingFeature("ExistentialAny") // SE-0335, Swift 5.6,  SwiftPM 5.8+
    static let otherSwiftFlags: Self = .unsafeFlags(swiftFlags)
}

/// Ref: https://github.com/treastrain/swift-upcomingfeatureflags-cheatsheet
/// Ref: https://zenn.dev/treastrain/articles/d2fd1b44e3ead5
extension SwiftSetting: @retroactive CaseIterable {
    public static var allCases: [Self] {
        [
            .existentialAny,
            .otherSwiftFlags,
        ]
    }
}

struct DependencyLibrary: @unchecked Sendable {
    let dependencies: [PackageDescription.Target.Dependency]
    let plugins: [PackageDescription.Target.PluginUsage]

    init(_ dependencies: [PackageDescription.Target.Dependency] = [], plugins: [PackageDescription.Target.PluginUsage] = []) {
        self.dependencies = dependencies
        self.plugins = plugins
    }
}

enum MacroTargetType: CaseIterable, @unchecked Sendable {
    case swiftMacroSample

    private var name: String {
        "\(self)".initialUppercased
    }

    var target: PackageDescription.Target {
        .macro(
            name: name,
            dependencies: dependencyLibrary.dependencies,
            plugins: dependencyLibrary.plugins
        )
    }

    var dependency: PackageDescription.Target.Dependency {
        PackageDescription.Target.Dependency(stringLiteral: name)
    }
}

enum FrameworkTargetType: CaseIterable, @unchecked Sendable {
    case firebase
    case device
    case license

    var folderName: String {
        "\(self)".initialUppercased
    }
}

enum TargetType: CaseIterable, @unchecked Sendable {
    case dependencyInjection
    case domain
    case framework(FrameworkTargetType)
    case presentation
    case previewCatalog

    static var allCases: [TargetType] {
        FrameworkTargetType.allCases.map { .framework($0) } + [
            .dependencyInjection,
            .domain,
            .presentation,
            .previewCatalog,
        ]
    }

    var folderName: String {
        switch self {
        case .framework:
            "Framework"
        default:
            "\(self)".initialUppercased
        }
    }

    var path: String {
        switch self {
        case .framework(let frameworkTargetType):
            "./Sources/\(folderName)/\(frameworkTargetType.folderName)"
        default:
            "./Sources/\(folderName)/"
        }
    }

    var name: String {
        switch self {
        case .framework(let frameworkTargetType):
            "\(frameworkTargetType.folderName)Framework"
        default:
            "\(folderName)Layer"
        }
    }

    var target: PackageDescription.Target {
        .target(
            name: name,
            dependencies: dependencyLibrary.dependencies,
            path: path,
            resources: resources,
            plugins: dependencyLibrary.plugins
        )
    }

    var dependency: PackageDescription.Target.Dependency {
        PackageDescription.Target.Dependency(stringLiteral: name)
    }

    var product: PackageDescription.Product {
        .library(name: name, targets: [name])
    }

    var resources: [Resource]? {
        switch self {
        case .domain:
            [
                // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
                .process("Resources"),
            ]
        case .presentation:
            [
                // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
                .process("Resources"),
            ]
        case .framework(.firebase):
            [
                // Staging 環境の GoogleService-Info.plist のコピー (testTarget でインテグレーションテストをしたいときに参照する)
                .process("Resources/GoogleService-Info-For-Testing.plist"),
            ]
        default:
            nil
        }
    }
}

enum TestTargetType: CaseIterable, Sendable {
    case driverTest
    case interactorTest
    case presenterTest
    case viewSnapshotTest

    var name: String {
        "\(self)".initialUppercased
    }

    private var exclude: [String] {
        switch self {
        case .viewSnapshotTest:
            // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
            ["__Snapshots__"]
        default:
            []
        }
    }

    private var resources: [Resource]? {
        nil
    }

    var target: PackageDescription.Target {
        .testTarget(
            name: name,
            dependencies: dependencyLibrary.dependencies,
            exclude: exclude,
            resources: resources,
            plugins: dependencyLibrary.plugins
        )
    }
}

private extension PackageDescription.Target.Dependency {
    /// Library
    nonisolated(unsafe) static let firebaseAnalytics: Self = .product(name: "FirebaseAnalytics", package: "firebase-ios-sdk")
    nonisolated(unsafe) static let firebaseRemoteConfig: Self = .product(name: "FirebaseRemoteConfig", package: "firebase-ios-sdk")
    nonisolated(unsafe) static let firebaseCrashlytics: Self = .product(name: "FirebaseCrashlytics", package: "firebase-ios-sdk")
    nonisolated(unsafe) static let previewSnapshots: Self = .product(name: "PreviewSnapshots", package: "swiftui-preview-snapshots")
    nonisolated(unsafe) static let previewSnapshotsTesting: Self = .product(name: "PreviewSnapshotsTesting", package: "swiftui-preview-snapshots")
    nonisolated(unsafe) static let previewGallery: Self = .product(name: "PreviewGallery", package: "SnapshotPreviews-iOS")
    nonisolated(unsafe) static let deviceKit: Self = .product(name: "DeviceKit", package: "DeviceKit")
    nonisolated(unsafe) static let licenseList: Self = .product(name: "LicenseList", package: "LicenseList")

    /// Test
    nonisolated(unsafe) static let testing: Self = .product(name: "Testing", package: "swift-testing")
    
    nonisolated(unsafe) static let swiftSyntaxMacros: Self = .product(name: "SwiftSyntaxMacros", package: "swift-syntax")
    nonisolated(unsafe) static let swiftCompilerPlugin: Self = .product(name: "SwiftCompilerPlugin", package: "swift-syntax")
}

// MARK: - Package

let package = Package(
    name: "DISampleAppPackage",
    defaultLocalization: "ja",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: TargetType.allCases.map { $0.product },
    dependencies: [
        // Library
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "10.24.0"),
        .package(url: "https://github.com/doordash-oss/swiftui-preview-snapshots", from: "1.1.1"),
        .package(url: "https://github.com/EmergeTools/SnapshotPreviews-iOS", from: "0.8.8"),
        .package(url: "https://github.com/apple/swift-syntax", from: "600.0.1"),
        .package(url: "https://github.com/devicekit/DeviceKit.git", from: "5.2.3"),
        .package(url: "https://github.com/cybozu/LicenseList.git", from: "1.1.1"),

        // Test
        .package(url: "&lt;user__selection&gt;https://github.com/apple/swift-testing.git&lt;/user__selection&gt;", from: "0.7.0"),

        // for CLI
        .package(url: "https://github.com/yonaskolb/Mint.git", from: "0.17.5"),
        .package(url: "https://github.com/daikimat/depermaid.git", from: "1.1.0"),
        .package(url: "https://github.com/apple/swift-docc-plugin", from: "1.3.0"),
        
    ],
    targets: MacroTargetType.allCases.map { $0.target } + TargetType.allCases.map { $0.target } + TestTargetType.allCases.map { $0.target }
)

/// Ref: https://github.com/treastrain/swift-upcomingfeatureflags-cheatsheet
package.targets.filter { ![.system, .binary, .plugin, .macro].contains($0.type) }.forEach { $0.swiftSettings = SwiftSetting.allCases }

// MARK: - Macro

extension MacroTargetType {
    var dependencyLibrary: DependencyLibrary {
        switch self {
        case .swiftMacroSample:
            .init([
                .swiftSyntaxMacros,
                .swiftCompilerPlugin,
            ])
        }
    }
}

// MARK: - Target

extension TargetType {
    var dependencyLibrary: DependencyLibrary {
        switch self {
        case .dependencyInjection:
            .init(FrameworkTargetType.allCases.map { TargetType.framework($0).dependency } + [
                TargetType.presentation.dependency,
            ])
        case .domain:
            .init()
        case .framework(.firebase):
            .init([
                TargetType.domain.dependency,
                .firebaseAnalytics,
                .firebaseRemoteConfig,
                .firebaseCrashlytics,
            ])
        case .framework(.device):
            .init([
                TargetType.domain.dependency,
                .deviceKit,
            ])
        case .framework(.license):
            .init([
                TargetType.domain.dependency,
                .licenseList,
            ])
        case .presentation:
            .init([
                TargetType.domain.dependency,
                .previewSnapshots,
            ])
        case .previewCatalog:
            .init([
                TargetType.presentation.dependency, // PreviewGallery() 行うモジュールに依存させるとその Preview が生成される
                .previewGallery,
            ])
        }
    }
}

// MARK: - Test

// TODO: swift-testing が Xcode のコンソール上で細かくテスト対象が選択できるようになったらテストターゲット分割を見直す
extension TestTargetType {
    var dependencyLibrary: DependencyLibrary {
        switch self {
        case .driverTest:
            .init(FrameworkTargetType.allCases.map { TargetType.framework($0).dependency } + [
                .testing,
            ])
        case .interactorTest:
            .init([
                TargetType.dependencyInjection.dependency,
                .testing,
            ])
        case .presenterTest:
            .init([
                TargetType.presentation.dependency,
                .testing,
            ])
        case .viewSnapshotTest:
            .init([
                TargetType.presentation.dependency,
                .previewSnapshotsTesting,
                .testing,
            ])
        }
    }
}
&lt;/textfield&gt;
&lt;/textfields&gt;
&lt;/window&gt;
&lt;/windows&gt;

---

## 👤 ユーザー
*2024/11/15 16:05:14*

update sdk

---

## 🤖 アシスタント
*2024/11/15 16:05:19*

To update the SDK for the `https://github.com/apple/swift-testing.git` package:

1. **Identify the latest version:**
   - Visit the [Swift Testing GitHub repository](https://github.com/apple/swift-testing) to find the most recent version tag.

2. **Update the `Package.swift` file:**
   - Replace the current version (`from: "0.7.0"`) with the latest version.

   Example:
   ```swift
   .package(url: "https://github.com/apple/swift-testing.git", from: "0.8.0"),
   ```

3. **Regenerate the Xcode project:**
   - Run the following command in your project directory:
     ```bash
     swift package resolve
     ```

4. **Verify compatibility:**
   - Ensure your codebase is compatible with the new SDK version by checking for any deprecations or API changes.

Would you like me to confirm the latest version for you?

---

## 👤 ユーザー
*2024/11/15 16:08:47*

Hey!

---

## 🤖 アシスタント
*2024/11/15 16:08:48*

Hey! What's on your mind? 😊

---

## 👤 ユーザー
*2024/11/15 16:09:04*

I study English. Please...

---

## 🤖 アシスタント
*2024/11/15 16:09:05*

That's great! Are you looking for help with vocabulary, grammar, or practicing conversations? Let me know how I can support you! 😊

---

## 👤 ユーザー
*2024/11/15 16:09:20*

I practice, I want to practice grammar.

---

## 🤖 アシスタント
*2024/11/15 16:09:21*

Perfect! What kind of grammar do you want to practice? For example, verb tenses, articles, prepositions, or sentence structure? Let’s start with something simple! 😊

---
