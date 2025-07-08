# Console & file output

日付: 2024-04-08

---

## 👤 ユーザー
*2024/04/08 17:23:03*

output_fileだけではなく、コンソールにも出力をだしたい。

swift run --package-path $mint_package_path mint run periphery scan \
    --skip-build --index-store-path $index_store_path \
    --retain-swift-ui-previews \
    --retain-public \
    --targets "DomainLayer" "PresentationLayer" "DependencyInjectionLayer" "DeviceFramework" "FirebaseFramework" "LicenseFramework" \
    &gt; $output_file

---

## 🤖 アシスタント
*2024/04/08 17:23:35*

コンソールにも出力を表示しつつ、ファイルにも出力を保存したい場合は、`tee` コマンドを使うと便利です。`tee` コマンドは標準入力から受け取ったデータをファイルに書き込み、同時に標準出力にも出力します。これにより、画面に表示される出力を見ながら、同じ内容をファイルに保存することができます。

あなたのケースで`tee`コマンドを使用するには、以下のようにコマンドを修正してください。

```sh
swift run --package-path $mint_package_path mint run periphery scan \
    --skip-build --index-store-path $index_store_path \
    --retain-swift-ui-previews \
    --retain-public \
    --targets "DomainLayer" "PresentationLayer" "DependencyInjectionLayer" "DeviceFramework" "FirebaseFramework" "LicenseFramework" \
    | tee $output_file
```

この変更により、指定したコマンドの出力がコンソールに表示されると同時に、`$output_file`に指定したファイルにも保存されます。`tee`コマンドはデフォルトで出力を上書きしますが、追記モードで出力したい場合は`tee -a $output_file`とすることで実現できます。

---
