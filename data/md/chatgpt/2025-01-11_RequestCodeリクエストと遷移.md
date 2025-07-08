# RequestCodeリクエストと遷移

日付: 2025-01-11

---

## 👤 ユーザー
*2025/1/11 17:26:26*

Loginボタンをタップ時にRequestCodeNotifierを使ってリクエストしてほしい。
成功時は遷移して、失敗時はスナックバーを表示してほしい

import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';

part 'request_code.g.dart';

@riverpod
class RequestCodeNotifier extends _$RequestCodeNotifier {
  @override
  Future&lt;String?&gt; build() async =&gt; null;

  Future&lt;void&gt; requestCode(String email) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(authApiProvider.future);
      final response = await api.authControllerSendCode(
        AuthEamilDTO(email: email),
      );
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/accounts/get_accounts_info.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();
    final accountState = ref.watch(getMyAccountNotifierProvider);

    useEffect(
      () {
        Future.microtask(() {
          ref.read(getMyAccountNotifierProvider.notifier).getMyAccount();
        });
        return null;
      },
      [],
    );

    useEffect(
      () {
        if (accountState is AsyncData && accountState.value != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            context.go(Screen.map.path);
          });
        }
        return null;
      },
      [accountState],
    );

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onLongPress: () {
                      // TODO: flavor が dev の場合のみの機能
                      context.push(Screen.debugMenu.path);
                    },
                    child: SvgPicture.asset(
                      Assets.images.logoLogin.path,
                    ),
                  ),
                  const SizedBox(height: 38),
                  Image.asset(
                    Assets.images.loginFig.path,
                  ),
                  const SizedBox(height: 54),
                  TextField(
                    controller: textEditingController,
                    decoration: const InputDecoration(
                      prefixIcon: Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(
                          Icons.email_outlined,
                          color: ColorToken.text,
                          size: 24,
                        ),
                      ),
                      hintText: 'Enter your email',
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: ログイン処理
                      context.push(Screen.verificationCode.path);
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2025/1/11 17:26:45*

以下のコードで、`RequestCodeNotifier`を利用してログインボタンをタップ時にリクエストを行い、成功時には画面遷移、失敗時にはスナックバーを表示するように対応しました。

---

## 🤖 アシスタント
*2025/1/11 17:26:45*

{"name": "login_request_code", "type": "code/dart", "content": "import 'package:flutter/material.dart';\nimport 'package:flutter_hooks/flutter_hooks.dart';\nimport 'package:flutter_svg/flutter_svg.dart';\nimport 'package:go_router/go_router.dart';\nimport 'package:hooks_riverpod/hooks_riverpod.dart';\nimport 'package:snpit_guild_app/domain/screen.dart';\nimport 'package:snpit_guild_app/gen/assets.gen.dart';\nimport 'package:snpit_guild_app/presentation/design_token/color_token.dart';\nimport 'package:snpit_guild_app/presentation/providers/api_client/accounts/get_accounts_info.dart';\nimport 'package:snpit_guild_app/presentation/providers/request_code.dart';\n\nclass LoginPage extends HookConsumerWidget {\n  const LoginPage({super.key});\n\n  @override\n  Widget build(BuildContext context, WidgetRef ref) {\n    final textEditingController = useTextEditingController();\n    final accountState = ref.watch(getMyAccountNotifierProvider);\n    final requestCodeState = ref.watch(requestCodeNotifierProvider);\n\n    useEffect(\n      () {\n        Future.microtask(() {\n          ref.read(getMyAccountNotifierProvider.notifier).getMyAccount();\n        });\n        return null;\n      },\n      [],\n    );\n\n    useEffect(\n      () {\n        if (accountState is AsyncData && accountState.value != null) {\n          WidgetsBinding.instance.addPostFrameCallback((_) {\n            context.go(Screen.map.path);\n          });\n        }\n        return null;\n      },\n      [accountState],\n    );\n\n    return Scaffold(\n      body: GestureDetector(\n        onTap: () {\n          FocusScope.of(context).unfocus();\n        },\n        child: Center(\n          child: SingleChildScrollView(\n            child: Padding(\n              padding: const EdgeInsets.symmetric(horizontal: 24),\n              child: Column(\n                mainAxisAlignment: MainAxisAlignment.center,\n                children: [\n                  GestureDetector(\n                    onLongPress: () {\n                      // TODO: flavor が dev の場合のみの機能\n                      context.push(Screen.debugMenu.path);\n                    },\n                    child: SvgPicture.asset(\n                      Assets.images.logoLogin.path,\n                    ),\n                  ),\n                  const SizedBox(height: 38),\n                  Image.asset(\n                    Assets.images.loginFig.path,\n                  ),\n                  const SizedBox(height: 54),\n                  TextField(\n                    controller: textEditingController,\n                    decoration: const InputDecoration(\n                      prefixIcon: Padding(\n                        padding: EdgeInsets.all(12),\n                        child: Icon(\n                          Icons.email_outlined,\n                          color: ColorToken.text,\n                          size: 24,\n                        ),\n                      ),\n                      hintText: 'Enter your email',\n                    ),\n                  ),\n                  const SizedBox(height: 24),\n                  ElevatedButton(\n                    onPressed: () async {\n                      final email = textEditingController.text.trim();\n\n                      if (email.isEmpty) {\n                        ScaffoldMessenger.of(context).showSnackBar(\n                          const SnackBar(\n                            content: Text('Please enter a valid email.'),\n                          ),\n                        );\n                        return;\n                      }\n\n                      await ref\n                          .read(requestCodeNotifierProvider.notifier)\n                          .requestCode(email);\n\n                      final requestState = ref.read(requestCodeNotifierProvider);\n\n                      if (requestState is AsyncData && requestState.value != null) {\n                        context.push(Screen.verificationCode.path);\n                      } else if (requestState is AsyncError) {\n                        ScaffoldMessenger.of(context).showSnackBar(\n                          SnackBar(\n                            content: Text(\n                              'Failed to send request: ${requestState.error}',\n                            ),\n                          ),\n                        );\n                      }\n                    },\n                    child: const Text('Login'),\n                  ),\n                ],\n              ),\n            ),\n          ),\n        ),\n      ),\n    );\n  }\n}"}

---

## 🔧 ツール
*2025/1/11 17:26:45*

{"result": "Successfully created text document 'login_request_code' which will be referenced in all future messages with the unique identifier textdoc_id: '67822b4118948191a9f0a57af4a35f61'", "textdoc_id": "67822b4118948191a9f0a57af4a35f61", "name": "login_request_code"}

---

## 🤖 アシスタント
*2025/1/11 17:26:45*

### 修正内容
1. **RequestCodeNotifierの呼び出し**:
   - `ref.read(requestCodeNotifierProvider.notifier).requestCode(email)` でリクエストを実行。

2. **エラーハンドリング**:
   - `AsyncError` を監視してスナックバーでエラーメッセージを表示。

3. **画面遷移**:
   - リクエストが成功 (`AsyncData`) した場合に `Screen.verificationCode.path` へ遷移。

4. **入力バリデーション**:
   - 空のメールアドレスが入力された場合のエラーメッセージをスナックバーで表示。

必要に応じてカスタマイズしてください。

---

## 👤 ユーザー
*2025/1/11 17:27:29*

ログインが複雑なので、requestCodeStateをuseEffectでかんしたほうがいいかも

---

## 🤖 アシスタント
*2025/1/11 17:27:49*

{"updates": [{"pattern": ".*", "replacement": "import 'package:flutter/material.dart';\nimport 'package:flutter_hooks/flutter_hooks.dart';\nimport 'package:flutter_svg/flutter_svg.dart';\nimport 'package:go_router/go_router.dart';\nimport 'package:hooks_riverpod/hooks_riverpod.dart';\nimport 'package:snpit_guild_app/domain/screen.dart';\nimport 'package:snpit_guild_app/gen/assets.gen.dart';\nimport 'package:snpit_guild_app/presentation/design_token/color_token.dart';\nimport 'package:snpit_guild_app/presentation/providers/api_client/accounts/get_accounts_info.dart';\nimport 'package:snpit_guild_app/presentation/providers/request_code.dart';\n\nclass LoginPage extends HookConsumerWidget {\n  const LoginPage({super.key});\n\n  @override\n  Widget build(BuildContext context, WidgetRef ref) {\n    final textEditingController = useTextEditingController();\n    final accountState = ref.watch(getMyAccountNotifierProvider);\n    final requestCodeState = ref.watch(requestCodeNotifierProvider);\n\n    useEffect(\n      () {\n        Future.microtask(() {\n          ref.read(getMyAccountNotifierProvider.notifier).getMyAccount();\n        });\n        return null;\n      },\n      [],\n    );\n\n    useEffect(\n      () {\n        if (accountState is AsyncData && accountState.value != null) {\n          WidgetsBinding.instance.addPostFrameCallback((_) {\n            context.go(Screen.map.path);\n          });\n        }\n        return null;\n      },\n      [accountState],\n    );\n\n    useEffect(\n      () {\n        if (requestCodeState is AsyncData && requestCodeState.value != null) {\n          WidgetsBinding.instance.addPostFrameCallback((_) {\n            context.go(Screen.verificationCode.path);\n          });\n        } else if (requestCodeState is AsyncError) {\n          WidgetsBinding.instance.addPostFrameCallback((_) {\n            ScaffoldMessenger.of(context).showSnackBar(\n              SnackBar(\n                content: Text('Failed to send request: ${requestCodeState.error}'),\n              ),\n            );\n          });\n        }\n        return null;\n      },\n      [requestCodeState],\n    );\n\n    return Scaffold(\n      body: GestureDetector(\n        onTap: () {\n          FocusScope.of(context).unfocus();\n        },\n        child: Center(\n          child: SingleChildScrollView(\n            child: Padding(\n              padding: const EdgeInsets.symmetric(horizontal: 24),\n              child: Column(\n                mainAxisAlignment: MainAxisAlignment.center,\n                children: [\n                  GestureDetector(\n                    onLongPress: () {\n                      // TODO: flavor が dev の場合のみの機能\n                      context.push(Screen.debugMenu.path);\n                    },\n                    child: SvgPicture.asset(\n                      Assets.images.logoLogin.path,\n                    ),\n                  ),\n                  const SizedBox(height: 38),\n                  Image.asset(\n                    Assets.images.loginFig.path,\n                  ),\n                  const SizedBox(height: 54),\n                  TextField(\n                    controller: textEditingController,\n                    decoration: const InputDecoration(\n                      prefixIcon: Padding(\n                        padding: EdgeInsets.all(12),\n                        child: Icon(\n                          Icons.email_outlined,\n                          color: ColorToken.text,\n                          size: 24,\n                        ),\n                      ),\n                      hintText: 'Enter your email',\n                    ),\n                  ),\n                  const SizedBox(height: 24),\n                  ElevatedButton(\n                    onPressed: () async {\n                      final email = textEditingController.text.trim();\n\n                      if (email.isEmpty) {\n                        ScaffoldMessenger.of(context).showSnackBar(\n                          const SnackBar(\n                            content: Text('Please enter a valid email.'),\n                          ),\n                        );\n                        return;\n                      }\n\n                      await ref\n                          .read(requestCodeNotifierProvider.notifier)\n                          .requestCode(email);\n                    },\n                    child: const Text('Login'),\n                  ),\n                ],\n              ),\n            ),\n          ),\n        ),\n      ),\n    );\n  }\n}"}]}

---

## 🔧 ツール
*2025/1/11 17:27:49*

{"result": "Successfully updated text document with textdoc_id '67822b4118948191a9f0a57af4a35f61'", "textdoc_id": "67822b4118948191a9f0a57af4a35f61"}

---

## 🤖 アシスタント
*2025/1/11 17:27:49*

`requestCodeState` を `useEffect` 内で監視するように変更しました。これにより、状態変化に応じて適切なアクション（遷移またはスナックバーの表示）が自動的にトリガーされます。必要に応じてさらに調整してください！

---

## 👤 ユーザー
*2025/1/11 17:30:32*

ちなみにこの画面にルーターでgoで飛ばしたら以下のエラーになった

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/accounts/get_accounts_info.dart';
import 'package:snpit_guild_app/presentation/providers/request_code.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();
    final accountState = ref.watch(getMyAccountNotifierProvider);
    final requestCodeState = ref.watch(requestCodeNotifierProvider);

    useEffect(
      () {
        Future.microtask(() {
          ref.read(getMyAccountNotifierProvider.notifier).getMyAccount();
        });
        return null;
      },
      [],
    );

    useEffect(
      () {
        if (accountState is AsyncData && accountState.value != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            context.go(Screen.map.path);
          });
        }
        return null;
      },
      [accountState],
    );

    useEffect(
      () {
        if (requestCodeState is AsyncData && requestCodeState.value != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            context.go(Screen.verificationCode.path);
          });
        } else if (requestCodeState is AsyncError) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Failed to send request: ${requestCodeState.error}'),
              ),
            );
          });
        }
        return null;
      },
      [requestCodeState],
    );

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onLongPress: () {
                      // TODO: flavor が dev の場合のみの機能
                      context.push(Screen.debugMenu.path);
                    },
                    child: SvgPicture.asset(
                      Assets.images.logoLogin.path,
                    ),
                  ),
                  const SizedBox(height: 38),
                  Image.asset(
                    Assets.images.loginFig.path,
                  ),
                  const SizedBox(height: 54),
                  TextField(
                    controller: textEditingController,
                    decoration: const InputDecoration(
                      prefixIcon: Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(
                          Icons.email_outlined,
                          color: ColorToken.text,
                          size: 24,
                        ),
                      ),
                      hintText: 'Enter your email',
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () async {
                      final email = textEditingController.text.trim();

                      if (email.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Please enter a valid email.'),
                          ),
                        );
                        return;
                      }

                      await ref
                          .read(requestCodeNotifierProvider.notifier)
                          .requestCode(email);
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2025/1/11 17:30:35*

`GoRouter`で`LoginPage`に遷移した際のエラーの原因は、次のいずれかが考えられます：

1. **`ref`が正しく提供されていない**:
   - `HookConsumerWidget`では`ref`を使用する必要がありますが、適切なプロバイダーが提供されていない場合、エラーが発生します。
   - この場合、`ProviderScope`がルートウィジェットでラップされているか確認してください。

2. **`context.go`の呼び出しタイミング**:
   - `useEffect`内で`context.go`を呼び出すと、ウィジェットツリーが未マウントの状態で実行される可能性があります。
   - 解決策としては、`addPostFrameCallback`を利用して、遷移処理をフレームの後にスケジュール

---
