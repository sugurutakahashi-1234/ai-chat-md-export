# Flutter SharedPreferences JSON管理

Date: 2025-01-12

---

## 👤 User
*2025-01-12 19:18:21*

Flutterでshared_preferencesでjsonで簡単に扱うことのできるライブラリ

---

## 🔧 Tool
*2025-01-12 19:18:37*

**Piecing together solutions**

I’m considering libraries like "json_shared_preferences" for handling JSON in Flutter, but also exploring alternatives such as "shared_preferences" and other storage options like "easy_local_storage" and "flutter_cache_manager".

**Reviewing libraries**

I'm considering "shared_preference_helper" and checking alternatives like "get_storage," "flutter secure storage," and "json_preference" for managing JSON in Flutter.

**Investigating options**

I'm digging into libraries like "json_serializable" with a wrapper around shared_preferences, and "flutter secure storage" for integrated JSON support, considering their suitability for managing JSON in Flutter.

**Weighing alternatives**

I’m comparing various options like "PrefHelper" and "JsonConverter" for managing JSON with shared_preferences. Considering "flutter_secure_storage" for integrated JSON support and "GetStorage" for lightweight storage.

**Balancing options**

I'm weighing the convenience of managing JSON with "shared_preferences" versus considering "GetStorage" or "Hive" for automatic transformations, factoring in ease of manual encoding/decoding.

**Evaluating shared_preferences_helper**

Considering "shared_preferences_helper" for simplifying shared_preferences operations and converting JSON, despite its uncertain maintenance status. Also thinking about combining shared_preferences with json_annotation/json_serializable for custom object management.

---

## 🤖 Assistant
*2025-01-12 19:18:37*

Flutterで、`shared_preferences`自体は文字列や数値などのプリミティブ型しかサポートしていませんが、Dartの標準ライブラリである `dart:convert` の `jsonEncode` / `jsonDecode` を組み合わせることで、JSON形式でデータの保存・取得が可能になります。しかし、これらの処理をラッピングして、より簡潔に扱えるようにしてくれるライブラリもいくつか存在します。

以下、いくつかの選択肢を紹介します。

---

## 1. [shared_preferences_helper](https://pub.dev/packages/shared_preferences_helper)

- **概要**:  
  このライブラリは、`shared_preferences` の操作をより簡単に行えるようにラップしており、JSON形式のオブジェクトのシリアライズ／デシリアライズも内部で処理してくれます。  
- **使い方の例**:  
  インストール後、以下のような感じで利用できます。

  ```dart
  import 'package:shared_preferences_helper/shared_preferences_helper.dart';

  // JSON形式のMapを保存する例
  Future<void> saveUser(Map<String, dynamic> user) async {
    await SharedPreferencesHelper.setJson('user', user);
  }

  // 保存されたJSONを読み出す例
  Future<Map<String, dynamic>?> loadUser() async {
    return await SharedPreferencesHelper.getJson('user');
  }
  ```

  ※ パッケージの詳細な使い方は、[公式ページ](https://pub.dev/packages/shared_preferences_helper) のREADMEを参照してください。

---

## 2. 自前で `jsonEncode` / `jsonDecode` を使う方法

ライブラリを追加せずに、`shared_preferences` のみでJSONを扱う方法もとてもシンプルです。  
例えば、カスタムオブジェクト `User` を保存する場合:

```dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  Map<String, dynamic> toJson() => {
    'name': name,
    'age': age,
  };

  factory User.fromJson(Map<String, dynamic> json) => User(
    name: json['name'],
    age: json['age'],
  );
}

Future<void> saveUser(User user) async {
  final prefs = await SharedPreferences.getInstance();
  String jsonString = jsonEncode(user.toJson());
  await prefs.setString('user', jsonString);
}

Future<User?> loadUser() async {
  final prefs = await SharedPreferences.getInstance();
  String? jsonString = prefs.getString('user');
  if (jsonString != null) {
    Map<String, dynamic> jsonMap = jsonDecode(jsonString);
    return User.fromJson(jsonMap);
  }
  return null;
}
```

この方法は、追加のパッケージに頼らずに柔軟に実装できるので、必要に応じて検討してみてください。

---

## 3. 代替ストレージライブラリの活用（GetStorageなど）

もし、SharedPreferencesにこだわらず、もっと簡潔にキー・バリュー形式でJSONを取り扱いたい場合は、[GetStorage](https://pub.dev/packages/get_storage) などのライブラリもおすすめです。  
- **特徴**:  
  - 非同期の初期化が不要で、シンプルなAPIで利用可能
  - JSON形式のデータもそのまま保存・取得できる  
- **使い方の例**:

  ```dart
  import 'package:get_storage/get_storage.dart';

  final box = GetStorage();

  // JSONデータを保存
  void saveData(Map<String, dynamic> data) {
    box.write('user', data);
  }

  // JSONデータを取得
  Map<String, dynamic>? loadData() {
    return box.read('user');
  }
  ```

※ ただし、ストレージの実装や利用ケースによっては、`shared_preferences` の方が適している場合もあるため、用途に合わせて選択してください。

---

## まとめ

- **shared_preferences_helper**:  
  `shared_preferences` のラッパーライブラリとして、JSONのエンコード／デコードも自動で行ってくれるため、コードがシンプルになります。

- **自前実装**:  
  標準の `shared_preferences` と `dart:convert` を組み合わせれば、追加のライブラリなしで十分扱えます。

- **GetStorage** などの代替ライブラリ:  
  もしSharedPreferencesに限定せず、もっと手軽なキー・バリュー型ストレージを使いたい場合に選択肢となります。

ご自身のプロジェクトの要件に合わせて、最適な方法を選んでみてください。

---
