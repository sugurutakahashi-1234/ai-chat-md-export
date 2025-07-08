# onPressed 処理の修正

Date: 2024-12-23

---

## 👤 User
*2024-12-23 22:24:28*

onPressed の処理が何か間違っている

import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guild_api_provider.dart';

part 'create_guild.g.dart';

@riverpod
class CreateGuildNotifier extends _$CreateGuildNotifier {
  @override
  Future&lt;String?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest(String guildName) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(guildApiProvider.future);
      final response = await api.guildControllerCreateGuild(
        CreateGuildRequestDto(
          guildName: guildName,
        ),
      );
      debugPrint('Response Body: ${response.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error in CreateGuildNotifier: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

ElevatedButton(
              onPressed: () async {
                try {
                  // TODO: テキストフィールドから取得する
                  const guildName = 'Example Guild';
                  await ref.read(createGuildNotifierProvider).executeRequest(
                        guildName: guildName,
                      );
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('ギルドが作成されました！')),
                  );
                  ref.read(onCreatedGuildNotifierProvider.notifier).trigger();
                  context.pop();
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('ギルドの作成に失敗しました。')),
                  );
                }
              },
              child: const Text('Create'),
            ),

---

## 🤖 Assistant
*2024-12-23 22:25:04*

コードを確認しました。以下のポイントを確認すると問題を特定できるかもしれません。

---

### **考えられる問題点**

1. **`executeRequest` メソッドのシグネチャの不一致**
   - `executeRequest` メソッドの引数は `String` 型の `guildName` を受け取りますが、ボタンの `onPressed` 内で渡される引数の形が間違っている可能性があります。
   - 現在のコードで `guildName` を指定する箇所にエラーは見当たりませんが、以下のように確認してください。
     ```dart
     await ref.read(createGuildNotifierProvider).executeRequest(guildName);
     ```
     引数名を省略している場合、エラーになります。

2. **`ref.read` の使い方**
   - `createGuildNotifierProvider` が正しく宣言されているか確認してください。`Provider` が正常に動作していないと、`onPressed` の処理が失敗します。
   - 定義例：
     ```dart
     final createGuildNotifierProvider =
         NotifierProvider<CreateGuildNotifier, AsyncValue<String?>>(
       () => CreateGuildNotifier(),
     );
     ```
     必要であれば `final` の定義を確認してください。

3. **スナックバーや `context.pop()` によるエラー**
   - `context.pop()` を使用するには、ウィジェットが `Navigator` の中で有効である必要があります。そうでない場合、`No MaterialLocalizations found` のようなエラーが発生する可能性があります。
   - スナックバーの表示も、現在の `context` が適切でないとエラーになります。

4. **`onCreatedGuildNotifierProvider` の挙動**
   - `ref.read(onCreatedGuildNotifierProvider.notifier).trigger();` の部分が正しく定義されていない場合、エラーになります。該当の `trigger()` メソッドが存在するか確認してください。

5. **API 呼び出しのエラー**
   - API 呼び出しの部分で例外が発生している場合、`try-catch` ブロックでエラーメッセージが表示されます。その際、`ref.watch(guildApiProvider.future)` が適切に `CreateGuildRequestDto` を送信しているか確認してください。

---

### **修正提案**

- **引数名の確認**  
  `executeRequest` に渡す引数を正しく渡します。
  ```dart
  await ref.read(createGuildNotifierProvider).executeRequest(guildName);
  ```

- **`guildApiProvider` の確認**
  API プロバイダーの初期化が正しいか再確認してください。例えば、正しい型を提供しているか、エンドポイントが正しいかなどです。

- **スナックバーのエラーハンドリング**
  `catch` ブロックでエラー内容をログに記録します。
  ```dart
  catch (e) {
    debugPrint('Error creating guild: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('ギルドの作成に失敗しました。')),
    );
  }
  ```

- **UI のリファクタリング**
  ボタンの処理が複雑である場合、ロジックをメソッドに切り出して可読性を向上させます。
  ```dart
  Future<void> _createGuild(BuildContext context) async {
    try {
      const guildName = 'Example Guild';
      await ref.read(createGuildNotifierProvider).executeRequest(guildName);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('ギルドが作成されました！')),
      );
      ref.read(onCreatedGuildNotifierProvider.notifier).trigger();
      context.pop();
    } catch (e) {
      debugPrint('Error creating guild: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('ギルドの作成に失敗しました。')),
      );
    }
  }
  ```

  そして、ボタンの `onPressed` はシンプルにします。
  ```dart
  onPressed: () => _createGuild(context),
  ```

---

### **デバッグの進め方**
1. `executeRequest` の引数をログで確認する。
2. `guildApiProvider` を単体テストして正しい値を返すか確認する。
3. `context.pop()` の挙動が期待通りか検証する（`Navigator` のスタック状態をチェック）。
4. 例外時のスタックトレースを収集し、どこで失敗しているか特定する。

もし問題が解消しなければ、追加のログや具体的なエラー内容を共有してください！

---
