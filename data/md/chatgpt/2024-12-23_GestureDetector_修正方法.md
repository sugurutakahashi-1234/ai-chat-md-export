# GestureDetector 修正方法

日付: 2024-12-23

---

## 👤 ユーザー
*2024/12/23 20:27:39*

GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      }, は bodyにしてほしい

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:flutter\_svg/flutter\_svg.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();

    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: 
             SingleChildScrollView(
              child: Column(
                children: \[
                  SvgPicture.asset(
                    Assets.images.logoLogin.path,
                  ),

                  const SizedBox(height: 38),

                  Image.asset(
                    Assets.images.animalsLogin.path,
                  ),
                  
                  TextField(
                      controller: textEditingController,
                      decoration: const InputDecoration(
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(12),
                          child: Icon(
                            Icons.email\_outlined,
                            color: ColorToken.text,
                            size: 24,
                          ),
                        ),
                        hintText: 'Enter your email',
                      ),
                  ),

                  ElevatedButton(
                    onPressed: () {
                      // TODO: ログイン処理
                      context.push(Screen.verificationCode.path);
                    },
                    child: const Text('Login'),
                  ),
                  
                \],
              ),
            ),
          ),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/23 20:27:53*

If you want to simplify your `GestureDetector` to wrap only the `body` of the `Scaffold`, you can move it to wrap around the `Padding` inside the `Scaffold`. Here's the updated code:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: SingleChildScrollView(
            child: Column(
              children: [
                SvgPicture.asset(
                  Assets.images.logoLogin.path,
                ),
                const SizedBox(height: 38),
                Image.asset(
                  Assets.images.animalsLogin.path,
                ),
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
    );
  }
}
```

### Changes:
1. **Moved `GestureDetector`:** Now it wraps the `Padding` widget, which is the `body` of the `Scaffold`.
2. **Simplified Structure:** The `GestureDetector` is scoped specifically to the `body` content where tapping outside the text field would dismiss the keyboard.

This makes your `GestureDetector` placement more precise while achieving the same functionality.

---
