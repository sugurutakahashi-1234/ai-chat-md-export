# Sendable Dependency Issue

日付: 2024-11-14

---

## 👤 ユーザー
*2024/11/14 18:39:01*

Showing All Issues
Resolving package dependencies…
x-xcode-log://B9D79A25-91EC-40FD-A4A4-9F710FB52962: Failed to resolve package dependencies


Showing All Issues
/Users/sugurutakahashi/git/suguruTakahashi-1234/advanced-fia-practical-sample/DISampleAppPackage/Package.swift:60:9: Stored property 'dependencies' of 'Sendable'-conforming struct 'DependencyLibrary' has non-sendable type '[Target.Dependency]'

---

## 🤖 アシスタント
*2024/11/14 18:39:10*

The error you're seeing stems from the fact that in Swift's concurrency model, types that conform to `Sendable` must contain only other `Sendable` types. In this case, the `dependencies` property in your `DependencyLibrary` struct contains a type (`[Target.Dependency]`) that isn’t marked as `Sendable`, which causes the compiler to complain.

To resolve this issue, you have a few options:

1. **Check if `Target.Dependency` is Sendable**: If `Target.Dependency` can conform to `Sendable`, consider adding a `Sendable` conformance to it, if you have control over its definition.

2. **Remove `Sendable` Conformance on `DependencyLibrary`**: If `DependencyLibrary` doesn’t need to be used across concurrency domains, you can remove the `Sendable` conformance on it. This will bypass the need for its properties to be `Sendable`.

3. **Redefine `dependencies` as a Non-stored Property**: If `dependencies` can be computed dynamically, consider making it a computed property rather than a stored property. This way, the `Sendable` conformance can focus on other properties that are `Sendable`.

4. **Use

---
