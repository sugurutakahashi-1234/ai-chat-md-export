# Passing Flag SwiftUI

Date: 2024-07-03

---

## 👤 User
*2024-07-03 14:19:28*

SwiftUIでdissMiss時にフラグを渡す

---

## 🤖 Assistant
*2024-07-03 14:19:47*

SwiftUIでビューをdismissする際にフラグを渡すための一般的な方法は、`@Binding`または`@Environment`を使うことです。以下に、`@Binding`を使用してフラグを渡す方法を示します。

1. **親ビューでフラグを定義する**:

   ```swift
   struct ParentView: View {
       @State private var isChildViewPresented = false
       @State private var didDismissWithFlag = false

       var body: some View {
           VStack {
               Button("Show Child View") {
                   isChildViewPresented = true
               }
               .sheet(isPresented: $isChildViewPresented) {
                   ChildView(isPresented: $isChildViewPresented, didDismissWithFlag: $didDismissWithFlag)
               }
               
               if didDismissWithFlag {
                   Text("Dismissed with flag set!")
               }
           }
       }
   }
   ```

2. **子ビューでフラグを更新する**:

   ```swift
   struct ChildView: View {
       @Binding var isPresented: Bool
       @Binding var didDismissWithFlag: Bool

       var body: some View {
           VStack {
               Button("Dismiss with Flag") {
                   didDismissWithFlag = true
                   isPresented = false
               }
               Button("Dismiss without Flag") {
                   isPresented = false
               }
           }
       }
   }
   ```

この例では、`ParentView`に表示されるフラグ`didDismissWithFlag`を子ビューで更新することができます。子ビューの`Dismiss with Flag`ボタンをタップすると、`didDismissWithFlag`が`true`に設定され、ビューが閉じられます。

これにより、SwiftUIの`sheet`や`fullScreenCover`を使って表示したビューが閉じられるときに、親ビューに情報を伝達することができます。

他に疑問や詳細な要望があれば教えてください。

---
