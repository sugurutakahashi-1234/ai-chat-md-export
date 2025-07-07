# Integrating MFMailCompose SwiftUI

日付: 2024-08-26

---

## 👤 ユーザー
*2024/8/26 19:27:28*

MFMailComposeViewController SwiftUI

---

## 🤖 アシスタント
*2024/8/26 19:28:03*

To use `MFMailComposeViewController` in a SwiftUI view, you'll need to integrate it using `UIViewControllerRepresentable`. This allows you to wrap a UIKit view controller and use it within SwiftUI. Here’s how you can do it:

1. **Create a SwiftUI wrapper for `MFMailComposeViewController`:**

```swift
import SwiftUI
import MessageUI

struct MailView: UIViewControllerRepresentable {
    @Environment(\.presentationMode) var presentationMode
    @Binding var result: Result<MFMailComposeResult, Error>?
    
    class Coordinator: NSObject, MFMailComposeViewControllerDelegate {
        var parent: MailView
        
        init(_ parent: MailView) {
            self.parent = parent
        }
        
        func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
            defer {
                parent.presentationMode.wrappedValue.dismiss()
            }
            
            if let error = error {
                parent.result = .failure(error)
            } else {
                parent.result = .success(result)
            }
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> MFMailComposeViewController {
        let vc = MFMailComposeViewController()
        vc.mailComposeDelegate = context.coordinator
        return vc
    }
    
    func updateUIViewController(_ uiViewController: MFMailComposeViewController, context: Context) {}
}
```

2. **Use the `MailView` in your SwiftUI view:**

Here’s an example of how to use this `MailView` within a SwiftUI view:

```swift
struct ContentView: View {
    @State private var showingMailView = false
    @State private var mailResult: Result<MFMailComposeResult, Error>? = nil
    
    var body: some View {
        VStack {
            Button("Send Email") {
                showingMailView = true
            }
            .disabled(!MFMailComposeViewController.canSendMail())
        }
        .sheet(isPresented: $showingMailView) {
            MailView(result: $mailResult)
        }
    }
}
```

### **Explanation:**

1. **`MailView`:** This struct conforms to `UIViewControllerRepresentable`, which allows a UIKit view controller (`MFMailComposeViewController` in this case) to be used in a SwiftUI view.
2. **`Coordinator`:** A class that acts as the delegate for `MFMailComposeViewController`. It handles the dismissal of the mail composer and any result or errors.
3. **`makeUIViewController` and `updateUIViewController`:** Required methods for `UIViewControllerRepresentable`. `makeUIViewController` creates the `MFMailComposeViewController`, while `updateUIViewController` is left empty since there is no need to update the view controller once created.
4. **`ContentView`:** This is your SwiftUI view that contains a button to present the `MailView`. The `.sheet` modifier is used to present the `MailView` when the button is tapped.

### **Note:**

- Make sure you have configured the `MFMailComposeViewController` correctly and your device is capable of sending emails.
- Remember to import `MessageUI` at the top of your Swift file to use `MFMailComposeViewController`.
- `MFMailComposeViewController` will not work on a simulator because it requires the Mail app, which is only available on a real device.

---
