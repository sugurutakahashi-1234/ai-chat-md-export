# Struct Enum Class 候補

日付: 2024-02-24

---

## 👤 ユーザー
*2024/2/24 12:53:35*

この関数がまとまったstruct or enum or class 名

func previewTest&lt;T: Snapshotable&gt;(\_ previews: T.Type, device: SnapshotConfig.DeviceType = .defaultDevice, file: StaticString = #file, function: String = #function, line: Int = #line) {
    previews.snapshots.assertSnapshots(
        as: .image(precision: SnapshotConfig.precision, layout: .device(config: device.viewImageConfig)),
        named: device.rawValue,
        file: file,
        testName: function.testRemoveNamed,
        line: UInt(line)
    )
}

func deviceVariationTest&lt;T: Snapshotable&gt;(\_ previews: T.Type, file: StaticString = #file, function: String = #function, line: Int = #line) {
    SnapshotConfig.DeviceType.allCases.forEach { device in
        previews.snapshots.assertSnapshots(
            as: .image(precision: SnapshotConfig.precision, layout: .device(config: device.viewImageConfig)),
            named: device.rawValue,
            file: file,
            testName: function.testRemoveNamed,
            line: UInt(line)
        )
    }
}

func contentSizeVariationTest&lt;T: Snapshotable&gt;(\_ previews: T.Type, device: SnapshotConfig.DeviceType = .defaultDevice, file: StaticString = #file, function: String = #function, line: Int = #line) {
    SnapshotConfig.ContentSizeType.allCases.forEach { contentSizeType in
        previews.snapshots.assertSnapshots(
            as: .image(precision: SnapshotConfig.precision, layout: .device(config: device.viewImageConfig), traits: .init(preferredContentSizeCategory: contentSizeType.size)),
            named: "\\(device.rawValue)-\\(contentSizeType.rawValue)",
            file: file,
            testName: function.testRemoveNamed,
            line: UInt(line)
        )
    }
}

---
