# Simplify Package.swift File

日付: 2024-08-06

---

## 👤 ユーザー
*2024/8/6 13:58:00*

typesafeな記述にしているがシンプルな記述に直したい

import PackageDescription

// MARK: - Package

let package = Package(
    name: "SmallTalkPackage",
    defaultLocalization: "ja",
    platforms: \[
        .iOS(.v16),
        .macOS(.v15),
    \],
    products: TargetType.allCases.map { $0.product },
    dependencies: \[
        // Driver Framework
        .package(url: "https://github.com/argmaxinc/whisperkit", from: "0.8.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.2"),
        .package(url: "https://github.com/devicekit/DeviceKit.git", from: "5.4.0"),
        .package(url: "https://github.com/cybozu/LicenseList.git", from: "1.0.0"),
        .package(url: "https://github.com/marmelroy/PhoneNumberKit", from: "3.7.11"),

        // View Framework
        .package(url: "https://github.com/sanzaru/SimpleToast.git", from: "0.8.1"),
        .package(url: "https://github.com/markiv/SwiftUI-Shimmer.git", from: "1.5.0"),
        .package(url: "https://github.com/doordash-oss/swiftui-preview-snapshots", from: "1.1.1"),
    \],
    targets: TargetType.allCases.map { $0.target } + TestTargetType.allCases.map { $0.target }
)

// MARK: - Target

extension TargetType {
    var dependencyLibrary: DependencyLibrary {
        switch self {
        case .dependencyInjection:
            .init(FrameworkTargetType.allCases.map { TargetType.framework($0).dependency } + \[
                TargetType.presentation.dependency,
            \])
        case .domain:
            .init(\[\], plugins: \[\])
        case .framework(.device):
            .init(\[
                TargetType.domain.dependency,
                .product(name: "DeviceKit", package: "DeviceKit"),
            \])
        case .framework(.firebase):
            .init(\[
                TargetType.domain.dependency,
            \])
        case .framework(.license):
            .init(\[
                TargetType.domain.dependency,
                .product(name: "LicenseList", package: "LicenseList"),
            \])
        case .framework(.openAPI):
            .init(\[
                TargetType.domain.dependency,
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            \])
        case .framework(.phoneNumber):
            .init(\[
                TargetType.domain.dependency,
                .product(name: "PhoneNumberKit", package: "PhoneNumberKit"),
            \])
        case .framework(.speechToText):
            .init(\[
                TargetType.domain.dependency,
                .product(name: "WhisperKit", package: "whisperkit"),
            \])
        case .presentation:
            .init(\[
                TargetType.domain.dependency,
                .product(name: "PreviewSnapshots", package: "swiftui-preview-snapshots"),
                .product(name: "SimpleToast", package: "SimpleToast"),
                .product(name: "Shimmer", package: "SwiftUI-Shimmer"),
            \])
        case .uiCatalog:
            .init(\[
                TargetType.presentation.dependency,
            \])
        }
    }
}

// MARK: - Test Target

extension TestTargetType {
    var dependencyLibrary: DependencyLibrary {
        switch self {
        case .driverTest:
            .init(FrameworkTargetType.allCases.map { TargetType.framework($0).dependency } + \[\])
        case .interactorTest:
            .init(\[
                TargetType.dependencyInjection.dependency,
            \])
        case .presenterTest:
            .init(\[
                TargetType.presentation.dependency,
            \])
        case .viewSnapshotTest:
            .init(\[
                TargetType.presentation.dependency,
                .product(name: "PreviewSnapshotsTesting", package: "swiftui-preview-snapshots"),
            \])
        }
    }
}

// MARK: - Entity

struct DependencyLibrary {
    let dependencies: \[PackageDescription.Target.Dependency\]
    let plugins: \[PackageDescription.Target.PluginUsage\]

    init(\_ dependencies: \[PackageDescription.Target.Dependency\] = \[\], plugins: \[PackageDescription.Target.PluginUsage\] = \[\]) {
        self.dependencies = dependencies
        self.plugins = plugins
    }
}

// MARK: - Framework

enum FrameworkTargetType: CaseIterable {
    case device
    case firebase
    case license
    case openAPI
    case phoneNumber
    case speechToText

    var folderName: String {
        "\\(self)".initialUppercased
    }
}

// MARK: - Target

enum TargetType: CaseIterable {
    case dependencyInjection
    case domain
    case framework(FrameworkTargetType)
    case presentation
    case uiCatalog

    static var allCases: \[TargetType\] {
        FrameworkTargetType.allCases.map { .framework($0) } + \[
            .dependencyInjection,
            .domain,
            .presentation,
            .uiCatalog,
        \]
    }

    var folderName: String {
        switch self {
        case .framework:
            "Framework"
        case .uiCatalog:
            "UICatalog"
        default:
            "\\(self)".initialUppercased
        }
    }

    var path: String {
        switch self {
        case .framework(let frameworkTargetType):
            "./Sources/\\(folderName)/\\(frameworkTargetType.folderName)"
        default:
            "./Sources/\\(folderName)/"
        }
    }

    var name: String {
        switch self {
        case .framework(let frameworkTargetType):
            "\\(frameworkTargetType.folderName)Framework"
        default:
            "\\(folderName)Layer"
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
        .library(name: name, targets: \[name\])
    }

    var resources: \[Resource\]? {
        switch self {
        case .domain:
            \[
                // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
                .process("Resources"),
            \]
        case .presentation:
            \[
                // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
                .process("Resources"),
            \]
        default:
            nil
        }
    }
}

// MARK: - Test Target

enum TestTargetType: CaseIterable {
    case driverTest
    case interactorTest
    case presenterTest
    case viewSnapshotTest

    var name: String {
        "\\(self)".initialUppercased
    }

    private var exclude: \[String\] {
        switch self {
        case .viewSnapshotTest:
            \[
                // この記述がなくても動くが SPM の CLI 上の warning を出なくするために記述している
                "\_\_Snapshots\_\_",
            \]
        default:
            \[\]
        }
    }

    private var resources: \[Resource\]? {
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

// MARK: - Swift 6

// Ref: Swift Upcoming Feature Flags Cheatsheet https://github.com/treastrain/swift-upcomingfeatureflags-cheatsheet
// Ref: Swift 6 に備える - 今後の機能（Upcoming Feature）の段階的適用 編 - https://zenn.dev/treastrain/articles/d2fd1b44e3ead5
let swiftFlags = \[
    "-Xfrontend", "-warn-long-expression-type-checking=500",
    "-Xfrontend", "-warn-long-function-bodies=500",
    "-enable-actor-data-race-checks",
\]

extension SwiftSetting {
    static let existentialAny: Self = .enableUpcomingFeature("ExistentialAny") // SE-0335, Swift 5.6,  SwiftPM 5.8+
    static let otherSwiftFlags: Self = .unsafeFlags(swiftFlags) // Original
}

extension SwiftSetting: @retroactive CaseIterable {
    /// コメントアウトしている箇所はすでに Swift 6 であれば有効らしい（TODO: Beta 版でなくなったら外す）
    public static var allCases: \[Self\] {
        \[
            .existentialAny,
            .otherSwiftFlags,
        \]
    }
}

package.targets.filter { !\[.system, .binary, .plugin, .macro\].contains($0.type) }.forEach { $0.swiftSettings = SwiftSetting.allCases }

// MARK: - Extension

private extension String {
    /// ex) "dependencyInjection" -&gt; "DependencyInjection"
    var initialUppercased: String {
        guard !isEmpty else {
            return ""
        }
        return prefix(1).uppercased() + dropFirst()
    }
}

---

## 🤖 アシスタント
*2024/8/6 13:58:30*

The given `Package.swift` file defines a Swift package with a comprehensive setup using enums and extensions for better organization and type safety. However, if you want to simplify it, we can reduce the use of enums and extensions while keeping the core functionality intact.

Here’s a simplified version of the `Package.swift`:

```swift
// swift-tools-version:5.8
import PackageDescription

let package = Package(
    name: "SmallTalkPackage",
    defaultLocalization: "ja",
    platforms: [
        .iOS(.v16),
        .macOS(.v15),
    ],
    products: [
        .library(name: "DependencyInjectionLayer", targets: ["DependencyInjectionLayer"]),
        .library(name: "DomainLayer", targets: ["DomainLayer"]),
        .library(name: "DeviceFramework", targets: ["DeviceFramework"]),
        .library(name: "FirebaseFramework", targets: ["FirebaseFramework"]),
        .library(name: "LicenseFramework", targets: ["LicenseFramework"]),
        .library(name: "OpenAPIFramework", targets: ["OpenAPIFramework"]),
        .library(name: "PhoneNumberFramework", targets: ["PhoneNumberFramework"]),
        .library(name: "SpeechToTextFramework", targets: ["SpeechToTextFramework"]),
        .library(name: "PresentationLayer", targets: ["PresentationLayer"]),
        .library(name: "UICatalogLayer", targets: ["UICatalogLayer"]),
    ],
    dependencies: [
        .package(url: "https://github.com/argmaxinc/whisperkit", from: "0.8.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.2"),
        .package(url: "https://github.com/devicekit/DeviceKit.git", from: "5.4.0"),
        .package(url: "https://github.com/cybozu/LicenseList.git", from: "1.0.0"),
        .package(url: "https://github.com/marmelroy/PhoneNumberKit", from: "3.7.11"),
        .package(url: "https://github.com/sanzaru/SimpleToast.git", from: "0.8.1"),
        .package(url: "https://github.com/markiv/SwiftUI-Shimmer.git", from: "1.5.0"),
        .package(url: "https://github.com/doordash-oss/swiftui-preview-snapshots", from: "1.1.1"),
    ],
    targets: [
        .target(
            name: "DependencyInjectionLayer",
            dependencies: [
                "DomainLayer",
                "DeviceFramework",
                "FirebaseFramework",
                "LicenseFramework",
                "OpenAPIFramework",
                "PhoneNumberFramework",
                "SpeechToTextFramework",
                "PresentationLayer",
            ]
        ),
        .target(
            name: "DomainLayer",
            dependencies: []
        ),
        .target(
            name: "DeviceFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "DeviceKit", package: "DeviceKit"),
            ],
            path: "./Sources/Framework/Device"
        ),
        .target(
            name: "FirebaseFramework",
            dependencies: [
                "DomainLayer",
            ],
            path: "./Sources/Framework/Firebase"
        ),
        .target(
            name: "LicenseFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "LicenseList", package: "LicenseList"),
            ],
            path: "./Sources/Framework/License"
        ),
        .target(
            name: "OpenAPIFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            ],
            path: "./Sources/Framework/OpenAPI"
        ),
        .target(
            name: "PhoneNumberFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "PhoneNumberKit", package: "PhoneNumberKit"),
            ],
            path: "./Sources/Framework/PhoneNumber"
        ),
        .target(
            name: "SpeechToTextFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "WhisperKit", package: "whisperkit"),
            ],
            path: "./Sources/Framework/SpeechToText"
        ),
        .target(
            name: "PresentationLayer",
            dependencies: [
                "DomainLayer",
                .product(name: "PreviewSnapshots", package: "swiftui-preview-snapshots"),
                .product(name: "SimpleToast", package: "SimpleToast"),
                .product(name: "Shimmer", package: "SwiftUI-Shimmer"),
            ],
            path: "./Sources/Presentation",
            resources: [.process("Resources")]
        ),
        .target(
            name: "UICatalogLayer",
            dependencies: [
                "PresentationLayer",
            ],
            path: "./Sources/UICatalog"
        ),
        .testTarget(
            name: "DriverTest",
            dependencies: [
                "DeviceFramework",
                "FirebaseFramework",
                "LicenseFramework",
                "OpenAPIFramework",
                "PhoneNumberFramework",
                "SpeechToTextFramework",
            ]
        ),
        .testTarget(
            name: "InteractorTest",
            dependencies: [
                "DependencyInjectionLayer",
            ]
        ),
        .testTarget(
            name: "PresenterTest",
            dependencies: [
                "PresentationLayer",
            ]
        ),
        .testTarget(
            name: "ViewSnapshotTest",
            dependencies: [
                "PresentationLayer",
                .product(name: "PreviewSnapshotsTesting", package: "swiftui-preview-snapshots"),
            ],
            exclude: ["__Snapshots__"]
        ),
    ],
    swiftLanguageVersions: [.v5]
)

// Swift 6 settings
let swiftFlags = [
    "-Xfrontend", "-warn-long-expression-type-checking=500",
    "-Xfrontend", "-warn-long-function-bodies=500",
    "-enable-actor-data-race-checks",
]

let swiftSettings: [SwiftSetting] = [
    .enableUpcomingFeature("ExistentialAny"), // SE-0335, Swift 5.6, SwiftPM 5.8+
    .unsafeFlags(swiftFlags),
]

package.targets.forEach { target in
    if ![.system, .binary, .plugin, .macro].contains(target.type) {
        target.swiftSettings = swiftSettings
    }
}

private extension String {
    var initialUppercased: String {
        guard !isEmpty else {
            return ""
        }
        return prefix(1).uppercased() + dropFirst()
    }
}
```

In this version:
- Removed enums and extensions for `TargetType` and `TestTargetType` and directly defined targets.
- Simplified dependencies within each target.
- Included Swift settings directly in the `forEach` loop at the end.
- Kept a private extension for `String` to handle the capitalization as before. 

This approach maintains the core functionality but simplifies the structure, making it easier to read and manage.

---

## 👤 ユーザー
*2024/8/6 14:01:44*

path を指定しているので気をつけて欲しい

---

## 🤖 アシスタント
*2024/8/6 14:02:11*

了解しました。パスの指定を考慮した上でシンプルな記述に改めます。

```swift
// swift-tools-version:5.8
import PackageDescription

let package = Package(
    name: "SmallTalkPackage",
    defaultLocalization: "ja",
    platforms: [
        .iOS(.v16),
        .macOS(.v15),
    ],
    products: [
        .library(name: "DependencyInjectionLayer", targets: ["DependencyInjectionLayer"]),
        .library(name: "DomainLayer", targets: ["DomainLayer"]),
        .library(name: "DeviceFramework", targets: ["DeviceFramework"]),
        .library(name: "FirebaseFramework", targets: ["FirebaseFramework"]),
        .library(name: "LicenseFramework", targets: ["LicenseFramework"]),
        .library(name: "OpenAPIFramework", targets: ["OpenAPIFramework"]),
        .library(name: "PhoneNumberFramework", targets: ["PhoneNumberFramework"]),
        .library(name: "SpeechToTextFramework", targets: ["SpeechToTextFramework"]),
        .library(name: "PresentationLayer", targets: ["PresentationLayer"]),
        .library(name: "UICatalogLayer", targets: ["UICatalogLayer"]),
    ],
    dependencies: [
        .package(url: "https://github.com/argmaxinc/whisperkit", from: "0.8.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.2"),
        .package(url: "https://github.com/devicekit/DeviceKit.git", from: "5.4.0"),
        .package(url: "https://github.com/cybozu/LicenseList.git", from: "1.0.0"),
        .package(url: "https://github.com/marmelroy/PhoneNumberKit", from: "3.7.11"),
        .package(url: "https://github.com/sanzaru/SimpleToast.git", from: "0.8.1"),
        .package(url: "https://github.com/markiv/SwiftUI-Shimmer.git", from: "1.5.0"),
        .package(url: "https://github.com/doordash-oss/swiftui-preview-snapshots", from: "1.1.1"),
    ],
    targets: [
        .target(
            name: "DependencyInjectionLayer",
            dependencies: [
                "DomainLayer",
                "DeviceFramework",
                "FirebaseFramework",
                "LicenseFramework",
                "OpenAPIFramework",
                "PhoneNumberFramework",
                "SpeechToTextFramework",
                "PresentationLayer",
            ],
            path: "./Sources/DependencyInjection"
        ),
        .target(
            name: "DomainLayer",
            dependencies: [],
            path: "./Sources/Domain"
        ),
        .target(
            name: "DeviceFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "DeviceKit", package: "DeviceKit"),
            ],
            path: "./Sources/Framework/Device"
        ),
        .target(
            name: "FirebaseFramework",
            dependencies: [
                "DomainLayer",
            ],
            path: "./Sources/Framework/Firebase"
        ),
        .target(
            name: "LicenseFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "LicenseList", package: "LicenseList"),
            ],
            path: "./Sources/Framework/License"
        ),
        .target(
            name: "OpenAPIFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            ],
            path: "./Sources/Framework/OpenAPI"
        ),
        .target(
            name: "PhoneNumberFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "PhoneNumberKit", package: "PhoneNumberKit"),
            ],
            path: "./Sources/Framework/PhoneNumber"
        ),
        .target(
            name: "SpeechToTextFramework",
            dependencies: [
                "DomainLayer",
                .product(name: "WhisperKit", package: "whisperkit"),
            ],
            path: "./Sources/Framework/SpeechToText"
        ),
        .target(
            name: "PresentationLayer",
            dependencies: [
                "DomainLayer",
                .product(name: "PreviewSnapshots", package: "swiftui-preview-snapshots"),
                .product(name: "SimpleToast", package: "SimpleToast"),
                .product(name: "Shimmer", package: "SwiftUI-Shimmer"),
            ],
            path: "./Sources/Presentation",
            resources: [.process("Resources")]
        ),
        .target(
            name: "UICatalogLayer",
            dependencies: [
                "PresentationLayer",
            ],
            path: "./Sources/UICatalog"
        ),
        .testTarget(
            name: "DriverTest",
            dependencies: [
                "DeviceFramework",
                "FirebaseFramework",
                "LicenseFramework",
                "OpenAPIFramework",
                "PhoneNumberFramework",
                "SpeechToTextFramework",
            ],
            path: "./Tests/DriverTest"
        ),
        .testTarget(
            name: "InteractorTest",
            dependencies: [
                "DependencyInjectionLayer",
            ],
            path: "./Tests/InteractorTest"
        ),
        .testTarget(
            name: "PresenterTest",
            dependencies: [
                "PresentationLayer",
            ],
            path: "./Tests/PresenterTest"
        ),
        .testTarget(
            name: "ViewSnapshotTest",
            dependencies: [
                "PresentationLayer",
                .product(name: "PreviewSnapshotsTesting", package: "swiftui-preview-snapshots"),
            ],
            path: "./Tests/ViewSnapshotTest",
            exclude: ["__Snapshots__"]
        ),
    ],
    swiftLanguageVersions: [.v5]
)

// Swift 6 settings
let swiftFlags = [
    "-Xfrontend", "-warn-long-expression-type-checking=500",
    "-Xfrontend", "-warn-long-function-bodies=500",
    "-enable-actor-data-race-checks",
]

let swiftSettings: [SwiftSetting] = [
    .enableUpcomingFeature("ExistentialAny"), // SE-0335, Swift 5.6, SwiftPM 5.8+
    .unsafeFlags(swiftFlags),
]

package.targets.forEach { target in
    if ![.system, .binary, .plugin, .macro].contains(target.type) {
        target.swiftSettings = swiftSettings
    }
}

private extension String {
    var initialUppercased: String {
        guard !isEmpty else {
            return ""
        }
        return prefix(1).uppercased() + dropFirst()
    }
}
```

この修正では、パスの指定を考慮し、各ターゲットに直接依存関係を指定しています。また、ターゲットごとに `path` プロパティを指定することで、指定されたパスを尊重しています。これにより、元の設定をシンプルに保ちつつ、正確なパス指定を維持しています。

---
