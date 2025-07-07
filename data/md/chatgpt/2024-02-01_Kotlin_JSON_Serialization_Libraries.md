# Kotlin JSON Serialization Libraries

日付: 2024-02-01

---

## 👤 ユーザー
*2024/2/1 11:11:00*

KotolinにSwiftのCodableのような機能はあるのか？ JSONのエンコード、デコード処理を簡単に書きたいい

---

## 🤖 アシスタント
*2024/2/1 11:11:20*

Kotlinでは、Swiftの`Codable`に相当する機能を持つライブラリやフレームワークがいくつか存在します。これらはJSONのエンコードやデコードを簡単に行うために利用できます。

1. \*\*Kotlin Serialization\*\*: Kotlin公式のシリアライゼーションライブラリです。`kotlinx.serialization`は、JSONなどのデータフォーマットを簡単にKotlinオブジェクトに変換（デコード）したり、その逆を行う（エンコード）ための機能を提供します。アノテーションを使って、どのプロパティがシリアライズされるかを指定することができます。

2. \*\*Gson\*\*: Googleが開発したライブラリで、JSONのシリアライゼーションとデシリアライゼーションを行います。KotlinオブジェクトとJSON間の変換を行うために使われます。Gsonは使いやすく、設定もシンプルですが、Kotlinのいくつかの特徴（例えばnull安全性）を完全にはサポートしていません。

3. \*\*Moshi\*\*: Squareによって開発されたもう一つのJSONライブラリです。Gsonに似ていますが、Kotlinでの使用に特化しており、Kotlinの特徴をより良くサポートしています。Moshiもアノテーションベースで、カスタムシリアライザやデシリアライザの作成も可能です。

これらのライブラリをプロジェクトに組み込むことで、Swiftの`Codable`のように、JSONのエンコードやデコードを簡単に行うことができます。プロジェクトのニーズや好みに応じて適切なライブラリを選択してください。

---

## 👤 ユーザー
*2024/2/1 11:11:39*

Kotlin Serialization の使い方について教えて、キャメルケースをスネークケースに変換したいんだ。

---

## 🤖 アシスタント
*2024/2/1 11:12:29*

Kotlin Serializationを使用してキャメルケースのプロパティ名をスネークケースに変換するには、いくつかのステップを踏む必要があります。ここでは基本的な手順を説明します。

### 1. 依存関係の追加

まず、`build.gradle`（または`build.gradle.kts`）ファイルにKotlin Serializationの依存関係を追加する必要があります。

#### Gradleの場合（Groovy構文）

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.serialization' version '1.5.0'
}

dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-serialization-json:1.2.1"
}
```

#### Gradleの場合（Kotlin構文）

```kotlin
plugins {
    kotlin("plugin.serialization") version "1.5.0"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.2.1")
}
```

### 2. シリアライズ可能なクラスの作成

次に、シリアライズ可能なデータクラスを作成します。`@Serializable`アノテーションを使用して、クラスがシリアライズ可能であることを示します。

```kotlin
import kotlinx.serialization.*

@Serializable
data class ExampleClass(
    val exampleProperty: String
    // 他のプロパティ
)
```

### 3. カスタムシリアライザの作成

Kotlin Serializationでは、カスタムのシリアライザを作成してプロパティ名の変換を行うことができます。以下の例では、キャメルケースのプロパティ名をスネークケースに変換するシリアライザを作成します。

```kotlin
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration

val json = Json { 
    // キャメルケースからスネークケースへの変換を有効にする
    encodeDefaults = true
    propertyNamingStrategy = JsonNames.PropertyNamingStrategy.SNAKE_CASE
}
```

### 4. オブジェクトのエンコードとデコード

最後に、作成したシリアライザを使用してオブジェクトをJSONにエンコードし、JSONからオブジェクトにデコードします。

```kotlin
fun main() {
    val example = ExampleClass("value")
    
    // オブジェクトをJSONにエンコード
    val jsonString = json.encodeToString(ExampleClass.serializer(), example)
    println(jsonString)

    // JSONをオブジェクトにデコード
    val obj = json.decodeFromString(ExampleClass.serializer(), jsonString)
    println(obj)
}
```

この手順に従うことで、Kotlin Serializationを使用してキャメルケースのプロパティ名をスネークケースに変換することができます。依存関係のバージョンはプロジェクトの状況に応じて適宜更新してください。

---
