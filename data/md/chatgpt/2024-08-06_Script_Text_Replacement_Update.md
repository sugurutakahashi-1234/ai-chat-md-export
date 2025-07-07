# Script Text Replacement Update

日付: 2024-08-06

---

## 👤 ユーザー
*2024/8/6 14:22:03*

以下のスクリプトに
private let dependency: RootDIContainer
と
import DependencyInjectionLayer
の削除も加えて欲しい

#!/bin/bash

echo "🔄 Starting replace\_text operations in the current directory and all subdirectories, ignoring .build/"

# 対象ファイルを再帰的に検索し、.build/を無視してreplace操作を実行
find . -type f -name "\*.swift" -not -path "\*/.build/\*" | while read -r file; do
    echo "📄 Processing $file"
    # 空文字へのreplace
    sed -i '' 's/private let dependency: Dependency//g' "$file"
    sed -i '' 's/dependency: dependency,//g' "$file"
    sed -i '' 's/dependency: Dependency,//g' "$file"
    sed -i '' 's/self\\.dependency = dependency//g' "$file"
    sed -i '' 's/dependency\\.//g' "$file"
    sed -i '' 's/&lt;Dependency&gt;//g' "$file"
    sed -i '' 's/init(dependency: Dependency/init(/g' "$file"
    sed -i '' 's/(dependency: dependency/(/g' "$file"

    # 少し複雑なreplace
    sed -i '' 's/Presenter&lt;Dependency: \[^&gt;\]\*PresenterDependency&gt;/Presenter/g' "$file"
    sed -i '' 's/Presenter&lt;Dependency&gt;/Presenter/g' "$file"
    sed -i '' 's/View&lt;Dependency: \[^&gt;\]\*Dependency&gt;/View/g' "$file"
    sed -i '' 's/Interactor&lt;Dependency: \[^&gt;\]\*InteractorDependency&gt;/Interactor/g' "$file"
    sed -i '' 's/Driver&lt;Dependency: \[^&gt;\]\*DriverDependency&gt;/Driver/g' "$file"

    echo "✅ Completed replace operations on $file"
done

echo "🎉 Completed all replace\_text operations"

---

## 🤖 アシスタント
*2024/8/6 14:22:11*

以下は `private let dependency: RootDIContainer` と `import DependencyInjectionLayer` の削除を加えたスクリプトです。

```bash
#!/bin/bash

echo "🔄 Starting replace_text operations in the current directory and all subdirectories, ignoring .build/"

# 対象ファイルを再帰的に検索し、.build/を無視してreplace操作を実行
find . -type f -name "*.swift" -not -path "*/.build/*" | while read -r file; do
    echo "📄 Processing $file"
    # 空文字へのreplace
    sed -i '' 's/private let dependency: Dependency//g' "$file"
    sed -i '' 's/private let dependency: RootDIContainer//g' "$file"
    sed -i '' 's/import DependencyInjectionLayer//g' "$file"
    sed -i '' 's/dependency: dependency,//g' "$file"
    sed -i '' 's/dependency: Dependency,//g' "$file"
    sed -i '' 's/self\.dependency = dependency//g' "$file"
    sed -i '' 's/dependency\.//g' "$file"
    sed -i '' 's/<Dependency>//g' "$file"
    sed -i '' 's/init(dependency: Dependency/init(/g' "$file"
    sed -i '' 's/(dependency: dependency/(/g' "$file"

    # 少し複雑なreplace
    sed -i '' 's/Presenter<Dependency: [^>]*PresenterDependency>/Presenter/g' "$file"
    sed -i '' 's/Presenter<Dependency>/Presenter/g' "$file"
    sed -i '' 's/View<Dependency: [^>]*Dependency>/View/g' "$file"
    sed -i '' 's/Interactor<Dependency: [^>]*InteractorDependency>/Interactor/g' "$file"
    sed -i '' 's/Driver<Dependency: [^>]*DriverDependency>/Driver/g' "$file"

    echo "✅ Completed replace operations on $file"
done

echo "🎉 Completed all replace_text operations"
```

このスクリプトでは、`private let dependency: RootDIContainer` と `import DependencyInjectionLayer` の削除操作も追加しています。

---
