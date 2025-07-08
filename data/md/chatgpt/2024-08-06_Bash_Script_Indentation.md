# Bash Script Indentation

日付: 2024-08-06

---

## 👤 ユーザー
*2024/08/06 13:39:53*

コメントをそのままでインデントを4つにしてほしい
```
#!/bin/bash

echo "🔄 Starting replace_text operations in the current directory and all subdirectories, ignoring .build/"

# 対象ファイルを再帰的に検索し、.build/を無視してreplace操作を実行
find . -type f -name "*.swift" -not -path "*/.build/*" | while read -r file; do
  echo "📄 Processing $file"
  # 空文字へのreplace
  sed -i '' 's/private let dependency: Dependency//g' "$file"
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

```
#!/bin/bash

echo "🔍 Starting presenter_init_gen dependency analysis and init method append"

# 全ての.swiftファイルに対してreplace操作を実行、.build/を無視
echo "🔄 Starting replace_text operations in the current directory and all subdirectories, ignoring .build/"
find . -type f -name "*.swift" -not -path "*/.build/*" | while read -r file; do
  echo "📄 Processing $file"
  sed -i '' 's/CommonPresenterDependency/LogDriverProvider/g' "$file"
  echo "✅ Completed replace operations on $file"
done

# CommonPresenterDependency.swift ファイルを削除
find . -type f -name "CommonPresenterDependency.swift" -not -path "*/.build/*" | while read -r file; do
  echo "🗑️ Deleting $file"
  rm "$file"
done

# 対象ファイルを再帰的に検索し、.build/を無視して処理を実行
find . -type f -name "*PresenterDependency.swift" -not -path "*/.build/*" | while read -r file; do
  # AppPresenterDependency.swift を除外
  if [[ "$file" == *"AppPresenterDependency.swift" ]]; then
    echo "⏭️ Skipping $file"
    continue
  fi

  if [ ! -f "$file" ]; then
    echo "❌ Error: File $file not found."
    exit 1
  fi

  presenter_file="${file/Dependency/}"
  presenter_file="${presenter_file/PresenterDependency/Presenter}"

  if [ ! -f "$presenter_file" ]; then
    echo "❌ Error: Corresponding presenter file $presenter_file not found for $file."
    exit 1
  fi

  echo "📄 Processing $file and updating $presenter_file"

  providers=$(grep 'DriverProvider' "$file" | awk -F': ' '{print $2}' | tr -d '{} ' | tr ',' '\n')

  if [ -z "$providers" ]; then
    echo "⚠️ No providers found in $file"
    continue
  fi

  echo "🔧 Found providers: $providers"

  properties=""
  init_params=""
  init_body=""

  for provider in $providers; do
    protocol_name=$(echo "$provider" | sed 's/Provider/Protocol/')
    driver_var=$(echo "$provider" | sed 's/Provider//' | awk '{print tolower(substr($0,1,1)) substr($0,2)}')
    instance_name=$(echo "$provider" | sed 's/Provider/()/')
    properties+="    private let $driver_var: any $protocol_name\n"
    init_params+="$driver_var: any $protocol_name = $instance_name, "
    init_body+="        self.$driver_var = $driver_var\n"
  done

  # Remove trailing comma and space
  init_params=${init_params%, }

  init_method="$properties\n    init($init_params) {\n$init_body    }\n"

  # Append init method to presenter file
  echo -e "$init_method" >> "$presenter_file"
  echo "✅ Appended init method to $presenter_file"
done

echo "🎉 Completed presenter_init_gen dependency analysis and init method append"

```


```
#!/bin/bash

echo "🗑️ Starting find_delete_file operations, ignoring .build/"

# パターンに一致するファイルを削除
file_patterns=(
    "*DriverProvider.swift"
    "*PresenterDependency.swift"
    "*DIContainerDependency.swift"
    "*InteractorDependency.swift"
)

for pattern in "${file_patterns[@]}"; do
  files=$(find . -type f -name "$pattern" -not -path "*/.build/*")
  if [ -z "$files" ]; then
    echo "❌ Error: No files found for pattern $pattern"
    exit 1
  fi

  for file in $files; do
    echo "🗑️ Deleting file $file"
    rm "$file"
    echo "✅ Deleted file $file"
  done
done

echo "🎉 Completed find_delete_file operations"

```

```
#!/bin/bash

package_name="SmallTalkPackage"

echo "🗑️ Starting delete_file_and_folder operations, ignoring .build/"

# 削除対象フォルダ
folders_to_delete=(
    "$package_name/Sources/DependencyInjection"
    "$package_name/Sources/UICatalog"
    "$package_name/Sources/Presentation/DIContainerDependency"
    "$package_name/Tests/DriverTest"
    "$package_name/Tests/InteractorTest"
    "$package_name/Tests/PresenterTest"
    "$package_name/Tests/ViewSnapshotTest"
    ".github/ISSUE_TEMPLATE/retrospective.md"
    ".github/workflows/swift_docc_hosting.yml"
    "asset/image/all_targets.svg"
    "asset/image/library_targets_including_app.svg"
    "asset/image/library_targets.svg"
    "asset/image/my_targets_including_app.svg"
    "asset/image/my_targets.svg"
    "asset/image/test_targets.svg"
    "asset/mermaid/all_targets.mmd"
    "asset/mermaid/library_targets_including_app.mmd"
    "asset/mermaid/library_targets.mmd"
    "asset/mermaid/my_targets_including_app.mmd"
    "asset/mermaid/my_targets.mmd"
    "asset/mermaid/test_targets.mmd"
    "depermaid"
    "pixelmatch"
    "sourcery"
    "swift_docc"
    "script/run_snapshot_test.sh"
    "script/run_ui_test.sh"
    "script/run_unit_test.sh"
    "package-lock.json"
    "package.json"
    "TestPlans/ViewSnapshotTest.xctestplan"
    "UICatalog"
)

# フォルダ削除
for folder in "${folders_to_delete[@]}"; do
  if [ -d "$folder" ] || [ -f "$folder" ]; then
    echo "🗑️ Deleting $folder"
    rm -rf "$folder"
    echo "✅ Deleted $folder"
  else
    echo "❌ Error: $folder not found."
    exit 1
  fi
done

echo "🎉 Completed delete_file_and_folder operations"

```

---

## 🤖 アシスタント
*2024/08/06 13:40:03*

```bash
#!/bin/bash

echo "🔄 Starting replace_text operations in the current directory and all subdirectories, ignoring .build/"

    # 対象ファイルを再帰的に検索し、.build/を無視してreplace操作を実行
    find . -type f -name "*.swift" -not -path "*/.build/*" | while read -r file; do
        echo "📄 Processing $file"
        # 空文字へのreplace
        sed -i '' 's/private let dependency: Dependency//g' "$file"
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

#!/bin/bash

echo "🔍 Starting presenter_init_gen dependency analysis and init method append"

    # 全ての.swiftファイルに対してreplace操作を実行、.build/を無視
    echo "🔄 Starting replace_text operations in the current directory and all subdirectories, ignoring .build/"
    find . -type f -name "*.swift" -not -path "*/.build/*" | while read -r file; do
        echo "📄 Processing $file"
        sed -i '' 's/CommonPresenterDependency/LogDriverProvider/g' "$file"
        echo "✅ Completed replace operations on $file"
    done

    # CommonPresenterDependency.swift ファイルを削除
    find . -type f -name "CommonPresenterDependency.swift" -not -path "*/.build/*" | while read -r file; do
        echo "🗑️ Deleting $file"
        rm "$file"
    done

    # 対象ファイルを再帰的に検索し、.build/を無視して処理を実行
    find . -type f -name "*PresenterDependency.swift" -not -path "*/.build/*" | while read -r file; do
        # AppPresenterDependency.swift を除外
        if [[ "$file" == *"AppPresenterDependency.swift" ]]; then
            echo "⏭️ Skipping $file"
            continue
        fi

        if [ ! -f "$file" ]; then
            echo "❌ Error: File $file not found."
            exit 1
        fi

        presenter_file="${file/Dependency/}"
        presenter_file="${presenter_file/PresenterDependency/Presenter}"

        if [ ! -f "$presenter_file" ]; then
            echo "❌ Error: Corresponding presenter file $presenter_file not found for $file."
            exit 1
        fi

        echo "📄 Processing $file and updating $presenter_file"

        providers=$(grep 'DriverProvider' "$file" | awk -F': ' '{print $2}' | tr -d '{} ' | tr ',' '\n')

        if [ -z "$providers" ]; then
            echo "⚠️ No providers found in $file"
            continue
        fi

        echo "🔧 Found providers: $providers"

        properties=""
        init_params=""
        init_body=""

        for provider in $providers; do
            protocol_name=$(echo "$provider" | sed 's/Provider/Protocol/')
            driver_var=$(echo "$provider" | sed 's/Provider//' | awk '{print tolower(substr($0,1,1)) substr($0,2)}')
            instance_name=$(echo "$provider" | sed 's/Provider/()/')
            properties+="    private let $driver_var: any $protocol_name\n"
            init_params+="$driver_var: any $protocol_name = $instance_name, "
            init_body+="        self.$driver_var = $driver_var\n"
        done

        # Remove trailing comma and space
        init_params=${init_params%, }

        init_method="$properties\n    init($init_params) {\n$init_body    }\n"

        # Append init method to presenter file
        echo -e "$init_method" >> "$presenter_file"
        echo "✅ Appended init method to $presenter_file"
    done

echo "🎉 Completed presenter_init_gen dependency analysis and init method append"

#!/bin/bash

echo "🗑️ Starting find_delete_file operations, ignoring .build/"

    # パターンに一致するファイルを削除
    file_patterns=(
        "*DriverProvider.swift"
        "*PresenterDependency.swift"
        "*DIContainerDependency.swift"
        "*InteractorDependency.swift"
    )

    for pattern in "${file_patterns[@]}"; do
        files=$(find . -type f -name "$pattern" -not -path "*/.build/*")
        if [ -z "$files" ]; then
            echo "❌ Error: No files found for pattern $pattern"
            exit 1
        fi

        for file in $files; do
            echo "🗑️ Deleting file $file"
            rm "$file"
            echo "✅ Deleted file $file"
        done
    done

echo "🎉 Completed find_delete_file operations"

#!/bin/bash

package_name="SmallTalkPackage"

echo "🗑️ Starting delete_file_and_folder operations, ignoring .build/"

    # 削除対象フォルダ
    folders_to_delete=(
        "$package_name/Sources/DependencyInjection"
        "$package_name/Sources/UICatalog"
        "$package_name/Sources/Presentation/DIContainerDependency"
        "$package_name/Tests/DriverTest"
        "$package_name/Tests/InteractorTest"
        "$package_name/Tests/PresenterTest"
        "$package_name/Tests/ViewSnapshotTest"
        ".github/ISSUE_TEMPLATE/retrospective.md"
        ".github/workflows/swift_docc_hosting.yml"
        "asset/image/all_targets.svg"
        "asset/image/library_targets_including_app.svg"
        "asset/image/library_targets.svg"
        "asset/image/my_targets_including_app.svg"
        "asset/image/my_targets.svg"
        "asset/image/test_targets.svg"
        "asset/mermaid/all_targets.mmd"
        "asset/mermaid/library_targets_including_app.mmd"
        "asset/mermaid/library_targets.mmd"
        "asset/mermaid/my_targets_including_app.mmd"
        "asset/mermaid/my_targets.mmd"
        "asset/mermaid/test_targets.mmd"
        "depermaid"
        "pixelmatch"
        "sourcery"
        "swift_docc"
        "script/run_snapshot_test.sh"
        "script/run_ui_test.sh"
        "script/run_unit_test.sh"
        "package-lock.json"
        "package.json"
        "TestPlans/ViewSnapshotTest.xctestplan"
        "UICatalog"
    )

    # フォルダ削除
    for folder in "${folders_to_delete[@]}"; do
        if [ -d "$folder" ] || [ -f "$folder" ]; then
            echo "🗑️ Deleting $folder"
            rm -rf "$folder"
            echo "✅ Deleted $folder"
        else
            echo "❌ Error: $folder not found."
            exit 1
        fi
    done

echo "🎉 Completed delete_file_and_folder operations"
```

---
