# Update Deployment for iOS18.0

Date: 2024-06-13

---

## 👤 User
*2024-06-13 15:09:18*

'Previewable()' is only available in iOS 18.0 or newer こうなった

#Preview {
    @Previewable @State var audioFormat: AudioFormat = .default
    @Previewable @State var audioSampleRate: AudioSampleRate = .default
    @Previewable @State var audioChannel: AudioChannel = .default
    @Previewable @State var audioEncodeQuality: AudioEncodeQuality = .default
    @Previewable @State var audioSessionCategory: AudioSessionCategory = .default
    @Previewable @State var audioSessionMode: AudioSessionMode = .default

    return List {
        RecordingConfigPickerView(selection: $audioFormat)
        RecordingConfigPickerView(selection: $audioSampleRate)
        RecordingConfigPickerView(selection: $audioChannel)
        RecordingConfigPickerView(selection: $audioEncodeQuality)
        RecordingConfigPickerView(selection: $audioSessionCategory)
        RecordingConfigPickerView(selection: $audioSessionMode)
    }
    .navigationStacked()
}

---

## 🤖 Assistant
*2024-06-13 15:09:35*

The error you're encountering is because `Previewable` is only available in iOS 18.0 or newer, and your deployment target might be set to an older version. Here are a few steps you can take to resolve this:

1. **Update Deployment Target**: Ensure that your project’s deployment target is set to iOS 18.0 or newer.

2. **Conditional Compilation**: Use conditional compilation to ensure that `Previewable` is only used on iOS 18.0 or newer.

Here is how you can use conditional compilation:

```swift
import SwiftUI

@available(iOS 18.0, *)
struct RecordingConfigPickerViewPreviews: PreviewProvider {
    static var previews: some View {
        #Preview {
            @Previewable @State var audioFormat: AudioFormat = .default
            @Previewable @State var audioSampleRate: AudioSampleRate = .default
            @Previewable @State var audioChannel: AudioChannel = .default
            @Previewable @State var audioEncodeQuality: AudioEncodeQuality = .default
            @Previewable @State var audioSessionCategory: AudioSessionCategory = .default
            @Previewable @State var audioSessionMode: AudioSessionMode = .default

            return List {
                RecordingConfigPickerView(selection: $audioFormat)
                RecordingConfigPickerView(selection: $audioSampleRate)
                RecordingConfigPickerView(selection: $audioChannel)
                RecordingConfigPickerView(selection: $audioEncodeQuality)
                RecordingConfigPickerView(selection: $audioSessionCategory)
                RecordingConfigPickerView(selection: $audioSessionMode)
            }
            .navigationStacked()
        }
    }
}
```

By wrapping your preview code in the `@available(iOS 18.0, *)` attribute, you ensure that it only runs on iOS 18.0 or newer. If your project supports older iOS versions, this will prevent any compilation issues.

Ensure that your project’s settings are configured to support iOS 18.0 or newer if you plan to use features that require it. This way, you can take advantage of the latest SwiftUI functionalities.

---
