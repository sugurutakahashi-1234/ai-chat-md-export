# Swift Function with Default Values

日付: 2024-06-17

---

## 👤 ユーザー
*2024/06/17 16:21:37*

qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder をデフォルト値とするようなcreateを使う関数を作成してほしい

static func placeholder(

) -&gt; RootDIContainerDependencyMock {
create(

}

public extension RootDIContainerDependencyMock {
    static var buildConfiguration: BuildConfiguration {
        #if DEBUG
            .debug
        #else
            .release
        #endif
    }

    /// 生成された init() だと nil が代入されてしまうため、デフォルト引数を設定した create を用意する
    static func create(
        logDriver: LogDriver&lt;LogDriverDependencyMock&gt; = .init(dependency: .init(osLogDriver: OSLogDriver())),
        qrCodeDriver: QRCodeDriverProtocolMock = .init(),
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver&lt;DeviceNameDriverProtocolMock&gt; = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        apiRequestDriver: APIRequestDriverProtocolMock = .random,
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -&gt; RootDIContainerDependencyMock {
        RootDIContainerDependencyMock(
            logDriver: logDriver,
            qrCodeDriver: qrCodeDriver,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: apiRequestDriver,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    static var empty: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            apiRequestDriver: .empty
        )
    }

    static var sizeS: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var sizeL: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var placeholder: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var random: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            apiRequestDriver: .random
        )
    }

    static var error: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .error,
            apiRequestDriver: .error
        )
    }

    static var releaseBuildConfiguration: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            buildEnvDriver: .init(buildScheme: .development, buildConfiguration: .release)
        )
    }

    static var randomForSnapshotTest: RootDIContainerDependencyMock {
        let localDataStoreDriver: LocalDataStoreDriver = .init()

        // スナップショットテスト時に固定値でないと困るのでlaunchAppCountを毎回リセットする
        localDataStoreDriver.launchAppCount = .placeholder

        // スナップショットテスト時はオンボーディングは済んでいるものとする
        localDataStoreDriver.isCompletedOnboarding = true

        return RootDIContainerDependencyMock.create(
            localDataStoreDriver: localDataStoreDriver
        )
    }
}

---

## 🤖 アシスタント
*2024/06/17 16:22:06*

To create a function `static func placeholder()` that uses `RootDIContainerDependencyMock.create` with default values for `qrCodeDriver` and `apiRequestDriver` set to `.placeholder`, you can implement it as follows:

```swift
public extension RootDIContainerDependencyMock {
    /// Creates a RootDIContainerDependencyMock instance with qrCodeDriver and apiRequestDriver set to .placeholder by default.
    static func placeholder() -> RootDIContainerDependencyMock {
        create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static func create(
        logDriver: LogDriver<LogDriverDependencyMock> = .init(dependency: .init(osLogDriver: OSLogDriver())),
        qrCodeDriver: QRCodeDriverProtocolMock = .init(),
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver<DeviceNameDriverProtocolMock> = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        apiRequestDriver: APIRequestDriverProtocolMock = .random,
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -> RootDIContainerDependencyMock {
        RootDIContainerDependencyMock(
            logDriver: logDriver,
            qrCodeDriver: qrCodeDriver,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: apiRequestDriver,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    // Existing static properties...
    static var empty: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            apiRequestDriver: .empty
        )
    }

    static var sizeS: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var sizeL: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var placeholder: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .placeholder,
            apiRequestDriver: .placeholder
        )
    }

    static var random: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            apiRequestDriver: .random
        )
    }

    static var error: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            qrCodeDriver: .error,
            apiRequestDriver: .error
        )
    }

    static var releaseBuildConfiguration: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.create(
            buildEnvDriver: .init(buildScheme: .development, buildConfiguration: .release)
        )
    }

    static var randomForSnapshotTest: RootDIContainerDependencyMock {
        let localDataStoreDriver: LocalDataStoreDriver = .init()

        // スナップショットテスト時に固定値でないと困るのでlaunchAppCountを毎回リセットする
        localDataStoreDriver.launchAppCount = .placeholder

        // スナップショットテスト時はオンボーディングは済んでいるものとする
        localDataStoreDriver.isCompletedOnboarding = true

        return RootDIContainerDependencyMock.create(
            localDataStoreDriver: localDataStoreDriver
        )
    }
}
```

In this implementation, the `placeholder()` function is added to the `RootDIContainerDependencyMock` extension, which calls the `create` method with `qrCodeDriver` and `apiRequestDriver` set to `.placeholder`. This ensures that these drivers have default values of `.placeholder` when the `placeholder` function is used.

---

## 👤 ユーザー
*2024/06/17 16:22:48*

こう言う感じでつかいたんだ。

    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.placeholder(
            localDataStoreDriver: .sizeM
        )
    }

---

## 🤖 アシスタント
*2024/06/17 16:23:05*

Understood. You want to use the `placeholder` method to allow overriding specific parameters while keeping the default values for the rest. Here's how you can define the `placeholder` function and use it in the way you described:

```swift
public extension RootDIContainerDependencyMock {
    /// Creates a RootDIContainerDependencyMock instance with qrCodeDriver and apiRequestDriver set to .placeholder by default.
    static func placeholder(
        logDriver: LogDriver<LogDriverDependencyMock> = .init(dependency: .init(osLogDriver: OSLogDriver())),
        qrCodeDriver: QRCodeDriverProtocolMock = .placeholder,
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver<DeviceNameDriverProtocolMock> = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        apiRequestDriver: APIRequestDriverProtocolMock = .placeholder,
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -> RootDIContainerDependencyMock {
        RootDIContainerDependencyMock(
            logDriver: logDriver,
            qrCodeDriver: qrCodeDriver,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: apiRequestDriver,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    // Example usage with overridden parameters
    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.placeholder(
            localDataStoreDriver: .sizeM
        )
    }
}
```

In this implementation, the `placeholder` function initializes the `RootDIContainerDependencyMock` with default values for `qrCodeDriver` and `apiRequestDriver` set to `.placeholder`. You can override specific parameters, such as `localDataStoreDriver`, while keeping the rest of the default values intact.

---

## 👤 ユーザー
*2024/06/17 16:23:45*

static func placeholder( で .placeholder をデフォルトに指定しているものは引数設定しないようにしてほしい

---

## 🤖 アシスタント
*2024/06/17 16:23:58*

了解しました。引数設定が必要ないものは省略し、`placeholder`関数の中でデフォルトの`.placeholder`値を設定するようにします。

```swift
public extension RootDIContainerDependencyMock {
    /// Creates a RootDIContainerDependencyMock instance with qrCodeDriver and apiRequestDriver set to .placeholder by default.
    static func placeholder(
        logDriver: LogDriver<LogDriverDependencyMock> = .init(dependency: .init(osLogDriver: OSLogDriver())),
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver<DeviceNameDriverProtocolMock> = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -> RootDIContainerDependencyMock {
        RootDIContainerDependencyMock(
            logDriver: logDriver,
            qrCodeDriver: .placeholder,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: .placeholder,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    // Example usage with overridden parameters
    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.placeholder(
            localDataStoreDriver: .sizeM
        )
    }
}
```

このように、`placeholder`関数の中でデフォルトの`.placeholder`値を設定し、引数として設定しないようにしています。例えば、`sizeM`の使用例では、`localDataStoreDriver`だけをオーバーライドし、それ以外はデフォルトの値を使用しています。

---

## 👤 ユーザー
*2024/06/17 16:24:26*

中でうまく create のデフォルト値を使ってほしい。

---

## 🤖 アシスタント
*2024/06/17 16:24:54*

了解しました。`placeholder`メソッドの中で`create`のデフォルト値を利用して`.placeholder`を設定するように変更します。

```swift
public extension RootDIContainerDependencyMock {
    /// Creates a RootDIContainerDependencyMock instance with qrCodeDriver and apiRequestDriver set to .placeholder by default.
    static func placeholder(
        logDriver: LogDriver<LogDriverDependencyMock> = .init(dependency: .init(osLogDriver: OSLogDriver())),
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver<DeviceNameDriverProtocolMock> = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -> RootDIContainerDependencyMock {
        create(
            logDriver: logDriver,
            qrCodeDriver: .placeholder,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: .placeholder,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    static func create(
        logDriver: LogDriver<LogDriverDependencyMock> = .init(dependency: .init(osLogDriver: OSLogDriver())),
        qrCodeDriver: QRCodeDriverProtocolMock = .init(),
        clipboardDriver: ClipboardDriver = .init(), // UT 時に本物の ClipboardDriver を使ってしまうとペースト許諾のアラートが表示されてテストが実行されないため、Mock に差し替え可能にしているが通常は本物を使う(UI テストは OK)
        buildEnvDriver: BuildEnvDriverProtocolMock = .init(buildScheme: .development, buildConfiguration: RootDIContainerDependencyMock.buildConfiguration),
        localDataStoreDriver: LocalDataStoreDriver = .init(),
        deviceInfoDriver: DeviceInfoDriver<DeviceNameDriverProtocolMock> = .init(deviceNameDriver: .init(deviceName: "Mock")),
        speechFrameworkTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        whisperKitTranscriptionDriver: TranscriptionDriverProtocolMock = .init(),
        apiRequestDriver: APIRequestDriverProtocolMock = .random,
        deviceAccessDriver: DeviceAccessDriverProtocolMock = .init()
    ) -> RootDIContainerDependencyMock {
        RootDIContainerDependencyMock(
            logDriver: logDriver,
            qrCodeDriver: qrCodeDriver,
            clipboardDriver: clipboardDriver,
            buildEnvDriver: buildEnvDriver,
            localDataStoreDriver: localDataStoreDriver,
            deviceInfoDriver: deviceInfoDriver,
            speechFrameworkTranscriptionDriver: speechFrameworkTranscriptionDriver,
            whisperKitTranscriptionDriver: whisperKitTranscriptionDriver,
            apiRequestDriver: apiRequestDriver,
            deviceAccessDriver: deviceAccessDriver
        )
    }

    // Example usage with overridden parameters
    static var sizeM: RootDIContainerDependencyMock {
        RootDIContainerDependencyMock.placeholder(
            localDataStoreDriver: .sizeM
        )
    }
}
```

この実装では、`placeholder`メソッドの中で`create`メソッドを呼び出し、`.placeholder`をデフォルト値として設定するようにしています。他の引数も必要に応じてオーバーライドできます。例えば、`sizeM`の使用例では、`localDataStoreDriver`だけをオーバーライドし、それ以外は`placeholder`メソッドのデフォルト値を使用しています。

---
