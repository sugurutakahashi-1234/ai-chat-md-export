# TestFlight URLスキーム

Date: 2023-06-25

---

## 👤 User
*2023-06-26 01:14:56*

TestFlightでベータ版を公開していて、TestFlightのアプリのページを

URLスキーム、ディープリンク方法で以下ってやっていいんだっけ

Application.OpenURL("itms-beta://beta.itunes.apple.com/v1/app/{ここにアプリID}");

---

## 🤖 Assistant
*2023-06-26 01:15:22*

TestFlightのベータ版のアプリページを開くためのURLスキームについては公式なドキュメンテーションがないため、特定のURLスキームを使用して直接開くことが公式にはサポートされていないかもしれません。

また、AppleはApp Store Review Guidelinesの中で「2.5.2 Apps should be self-contained in their bundles, and may not read or write data outside the designated container area, nor may they download, install, or execute code, including other iOS, watchOS, Mac OS X, or tvOS apps.」と明記しており、他のアプリを直接開くためのコードを使用することは制限されています。

しかし、Webブラウザを通じてユーザーをTestFlightのWebページにリダイレクトする方法は一般的に問題ないでしょう。例えば、以下のような方法で行うことができます:

```
Application.OpenURL("https://testflight.apple.com/join/{ここにInviteコード}");
```

なお、上記のURLスキームとURLは仮のもので、正確なURLやURLスキームを取得するためにはTestFlightの公式ドキュメンテーションを参照するか、Appleのサポートに問い合わせて確認してください。

---
