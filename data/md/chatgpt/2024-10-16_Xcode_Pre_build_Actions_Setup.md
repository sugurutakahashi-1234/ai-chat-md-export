# Xcode Pre-build Actions Setup

日付: 2024-10-16

---

## 👤 ユーザー
*2024/10/16 17:25:54*

Xcode &gt; Scheme &gt; Build &gt; Pre-action

---

## 🤖 アシスタント
*2024/10/16 17:26:05*

In Xcode, you can set up pre-build actions for a scheme by following these steps:

1. **Open Xcode** and select your project in the **Navigator**.
2. At the top of the window, click on the **Scheme selector** (next to the Stop/Play button) and choose **"Edit Scheme…"**.
3. In the left panel, select the **"Build"** section under your target.
4. Now, on the right side, click on the **"Pre-actions"** tab.
5. Click the **"+" button** to add a new action. This can be a **Run Script** action.
6. Choose to execute the script either **Before Build** or at any other event like **Before Run**.
7. Enter your shell script in the provided text box, or you can click **"Provide build settings from"** to set up specific environment variables.

This is useful for performing tasks such as cleaning up files, running scripts, or configuring environment variables before the build process kicks off.

Would you like help writing a specific pre-build script?

---
