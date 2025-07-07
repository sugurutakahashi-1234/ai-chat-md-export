# Clear Xcode cache command

日付: 2024-07-09

---

## 👤 ユーザー
*2024/7/9 18:20:28*

Xcodeのあらゆるキャッシュを削除するコマンドを教えてほしい

---

## 🤖 アシスタント
*2024/7/9 18:20:41*

Xcodeのキャッシュを削除するには、以下のコマンドをターミナルで実行してください。これにより、ビルドキャッシュ、DerivedData、およびモジュールキャッシュが削除されます。

1. **DerivedDataの削除**:

   ```sh
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

2. **モジュールキャッシュの削除**:

   ```sh
   rm -rf ~/Library/Developer/Xcode/Archives
   ```

3. **ビルドキャッシュの削除**:

   ```sh
   rm -rf ~/Library/Caches/com.apple.dt.Xcode
   ```

4. **iOSシミュレーターのデバイスデータのリセット**:

   ```sh
   xcrun simctl erase all
   ```

これらのコマンドを実行することで、Xcodeのキャッシュが完全にクリアされます。ターミナルでこれらのコマンドを実行する際には、Xcodeを閉じてから行うことをお勧めします。

---
