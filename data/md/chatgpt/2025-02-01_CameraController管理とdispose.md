# CameraController管理とdispose

日付: 2025-02-01

---

## 👤 ユーザー
*2025/2/1 11:17:03*

以下によって撮影画面を作成しているが、カメラをdisposeする処理がない。
どうやってカメラを管理してdisposeするのがよいか検討して欲しい。

なにか別の@riverpodでカメラのCameraControllerを保持した方が良いのか、別の方法がよいかも検討して欲しい  
@riverpod
Future&lt;CameraController?&gt; getCameraController(Ref ref) async {
  final cameras = await availableCameras();

  if (cameras.isEmpty) {
    return null;
  }

  final cameraController = CameraController(
    cameras\[0\],
    ResolutionPreset.max,
    imageFormatGroup: ImageFormatGroup.jpeg,
  );

  await cameraController.initialize();
  await cameraController.lockCaptureOrientation(DeviceOrientation.portraitUp);

  return cameraController;
}



import 'dart:io';
import 'package:cached\_network\_image/cached\_network\_image.dart';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:image/image.dart' as img;
import 'package:snpit\_guild\_app/domain/design/color\_pallet.dart';
import 'package:snpit\_guild\_app/domain/design/color\_token.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/presentation/providers/camera\_controller\_provider.dart';
import 'package:snpit\_guild\_app/presentation/providers/current\_location.dart';
import 'package:snpit\_guild\_app/presentation/providers/shot\_photo.dart';
import 'package:snpit\_guild\_app/presentation/providers/weave\_target\_spot.dart';

class ShootingPage extends HookConsumerWidget {
  const ShootingPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cameraControllerAsyncValue = ref.watch(getCameraControllerProvider);
    final spotStateValue = ref.watch(weaveTargetSpotNotifierProvider);
    final overlayOpacityState = useState&lt;double&gt;(0.5);
    final isProcessingState = useState&lt;bool&gt;(false);
    final overlayImageUrl = spotStateValue?.photoUrl ?? '';

    // カメラで撮影した画像を正方形にクロップして返す
    Future&lt;File&gt; takeSquarePicture(CameraController controller) async {
      final xFile = await controller.takePicture();

      final originalBytes = await xFile.readAsBytes();
      final originalImage = img.decodeImage(originalBytes);
      if (originalImage == null) {
        throw Exception('Failed to decode image');
      }

      final width = originalImage.width;
      final height = originalImage.height;
      final croppedSize = width &lt; height ? width : height;

      final xOffset = (width - croppedSize) ~/ 2;
      final yOffset = (height - croppedSize) ~/ 2;

      final cropped = img.copyCrop(
        originalImage,
        x: xOffset,
        y: yOffset,
        width: croppedSize,
        height: croppedSize,
      );

      final croppedBytes = img.encodeJpg(cropped);
      final file = File(xFile.path);
      await file.writeAsBytes(croppedBytes);

      return file;
    }

    Future&lt;void&gt; onTapCamera() async {
      if (cameraControllerAsyncValue is AsyncData&lt;CameraController?&gt;) {
        final cameraController = cameraControllerAsyncValue.value;
        if (cameraController == null) {
          debugPrint('CameraController is null');
          return;
        }

        if (!cameraController.value.isInitialized) {
          debugPrint('CameraController not initialized');
          return;
        }

        try {
          isProcessingState.value = true;

          final xFile = await takeSquarePicture(cameraController);
          if (xFile.path.isNotEmpty) {
            final currentLocation = await ref
                .read(currentLocationNotifierProvider.notifier)
                .getCurrentLocation();

            ref
                .read(shotPhotoNotifierProvider.notifier)
                .shotPhoto(xFile.path, currentLocation);

            if (context.mounted) {
              await context.push(Screen.weaveSpot.path);
            }
          }
        } on Exception catch (error) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: $error'),
              ),
            );
          }
        } finally {
          isProcessingState.value = false;
        }
      } else {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Camera is not available'),
            ),
          );
        }
      }
    }

    final screenWidth = MediaQuery.of(context).size.width;

    return cameraControllerAsyncValue.when(
      data: (cameraController) {
        if (cameraController == null) {
          return const Scaffold(
            body: Center(child: Text('Camera is not available')),
          );
        }

        if (!cameraController.value.isInitialized) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        var cameraAspectRatio = cameraController.value.aspectRatio;
        if (cameraAspectRatio &gt; 1) {
          cameraAspectRatio = 1 / cameraAspectRatio;
        }

        return Scaffold(
          appBar: AppBar(
            backgroundColor: ColorPallet.gray1000,
          ),
          body: Stack(
            alignment: Alignment.center,
            children: \[
              Column(
                children: \[
                  Container(
                    height: 80,
                    color: ColorPallet.gray1000,
                  ),
                  Stack(
                    children: \[
                      SizedBox(
                        width: screenWidth,
                        height: screenWidth,
                        child: ClipRect(
                          child: FittedBox(
                            fit: BoxFit.cover,
                            child: SizedBox(
                              width: screenWidth,
                              height: screenWidth / cameraAspectRatio,
                              child: CameraPreview(cameraController),
                            ),
                          ),
                        ),
                      ),
                      if (overlayImageUrl.isNotEmpty)
                        Opacity(
                          opacity: overlayOpacityState.value,
                          child: ClipRect(
                            child: FittedBox(
                              fit: BoxFit.cover,
                              child: SizedBox(
                                width: screenWidth,
                                height: screenWidth,
                                child: CachedNetworkImage(
                                  imageUrl: overlayImageUrl,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),
                        ),
                    \],
                  ),
                  Expanded(
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: \[
                        Container(color: ColorPallet.gray1000),
                        Column(
                          children: \[
                            const SizedBox(height: 40),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 80,
                              ),
                              child: Slider(
                                activeColor: ColorToken.primary,
                                inactiveColor: ColorToken.secondary,
                                value: overlayOpacityState.value,
                                onChanged: (v) =&gt; overlayOpacityState.value = v,
                              ),
                            ),
                            Expanded(
                              child: Stack(
                                alignment: Alignment.center,
                                children: \[
                                  // バツボタンが押せるように Row と Spacer で描画範囲を広げている
                                  Row(
                                    children: \[
                                      const Spacer(),
                                      GestureDetector(
                                        onTap: () async {
                                          await onTapCamera();
                                        },
                                        child: const CircleAvatar(
                                          radius: 36,
                                          backgroundColor:
                                              ColorToken.primaryLight,
                                          child: CircleAvatar(
                                            radius: 34,
                                            backgroundColor:
                                                ColorToken.primaryDark,
                                            child: Icon(
                                              Icons.camera\_alt\_outlined,
                                              color: ColorToken.text,
                                              size: 36,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const Spacer(),
                                    \],
                                  ),
                                  Positioned(
                                    right: 56,
                                    child: Stack(
                                      alignment: Alignment.center,
                                      children: \[
                                        CircleAvatar(
                                          radius: 18,
                                          backgroundColor: ColorToken.bgWhite
                                              .withValues(alpha: 0.2),
                                        ),
                                        IconButton(
                                          icon: const Icon(
                                            Icons.close,
                                            size: 24,
                                          ),
                                          color: ColorToken.text,
                                          onPressed: () async {
                                            context.pop();
                                          },
                                        ),
                                      \],
                                    ),
                                  ),
                                \],
                              ),
                            ),
                          \],
                        ),
                      \],
                    ),
                  ),
                \],
              ),
              if (isProcessingState.value)
                const Positioned.fill(
                  child: ColoredBox(
                    color: Colors.black45,
                    child: Center(
                      child: CircularProgressIndicator(),
                    ),
                  ),
                ),
            \],
          ),
        );
      },
      loading: () {
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      },
      error: (error, \_) {
        return Scaffold(
          body: Center(
            child: Text('Failed to initialize the camera: $error'),
          ),
        );
      },
    );
  }
}

---

## 🔧 ツール
*2025/2/1 11:17:26*

\*\*Managing CameraController disposal\*\*

I'm working through the best way to manage CameraController disposal, considering Riverpod's stateful provider and onDispose methods to ensure proper cleanup.

\*\*Managing camera controller\*\*

I’m thinking through using a Riverpod provider with autoDispose for CameraController. This manages lifecycle, ensuring disposal when no longer in use, and aligns with best practices.

\*\*Contemplating state management\*\*

I'm examining the use of StateNotifier for camera management, potentially within the same provider with autoDispose. This approach suits asynchronous CameraController initialization and lifecycle management in the widget tree.

\*\*Organizing the provider\*\*

I’m mapping out best practices for storing CameraController in a separate @riverpod, keeping the provider's disposal logic separate from the widget's file to ensure smooth Riverpod handling.

---

## 🤖 アシスタント
*2025/2/1 11:17:26*

Riverpod（あるいは hooks_riverpod）で `CameraController` を管理する場合の最大のポイントは、**「ライフサイクル管理（dispose）」** をどうやって行うかです。

Flutter の `CameraController` は特にリソースが大きいため、`dispose()` を呼ばずに放置するとアプリのメモリ使用量が増えたり、デバイスのカメラリソースが開放されず正常に動作しなくなったりする可能性があります。

---

## Riverpod で管理する場合のベストプラクティス

### 1. `FutureProvider` または `AsyncNotifier` を利用する

Riverpod には次のようないくつかの選択肢があります。  
- `FutureProvider.autoDispose` を使う  
- `@riverpod`（`AsyncNotifier` あるいは `Notifier` のサブクラス）を使う

どちらを使うかは好みや設計方針によりますが、**「カメラコントローラを初期化して非同期で返す」** というケースでは `FutureProvider`（あるいは `AsyncNotifier`) がわかりやすいです。

なお **autoDispose** を付けることで、**参照されなくなったタイミング** で自動的に dispose を呼んでくれるメリットがあります。

#### `FutureProvider.autoDispose` の例

```dart
final cameraControllerProvider = FutureProvider.autoDispose<CameraController?>((ref) async {
  final cameras = await availableCameras();
  if (cameras.isEmpty) {
    return null;
  }

  final controller = CameraController(
    cameras[0],
    ResolutionPreset.max,
    imageFormatGroup: ImageFormatGroup.jpeg,
  );

  // 初期化
  await controller.initialize();
  await controller.lockCaptureOrientation(DeviceOrientation.portraitUp);

  // Providerが破棄されるときにコントローラも破棄する
  ref.onDispose(() {
    controller.dispose();
  });

  return controller;
});
```

このように書いておけば、`ref.watch(cameraControllerProvider)` を行っているウィジェットがツリーから外れた際に `onDispose` が呼ばれ、カメラを確実に解放できます。  
たとえば **ShootingPage** が破棄される（ページ遷移で離れるなど）と同時に自動で `cameraController.dispose()` が呼ばれます。

### 2. Widget 側の実装

上記の `cameraControllerProvider` を使って、Widget 側では以下のように書きます。

```dart
class ShootingPage extends HookConsumerWidget {
  const ShootingPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // autoDispose 付きの FutureProvider を watch
    final cameraControllerAsyncValue = ref.watch(cameraControllerProvider);

    // 以下は現状の実装とほぼ同じ
    return cameraControllerAsyncValue.when(
      data: (cameraController) {
        if (cameraController == null) {
          return const Scaffold(
            body: Center(child: Text('Camera is not available')),
          );
        }
        if (!cameraController.value.isInitialized) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // あとはご質問コードと同様にプレビュー・撮影などを行う

        ...
      },
      loading: () {
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      },
      error: (error, _) {
        return Scaffold(
          body: Center(
            child: Text('Failed to initialize the camera: $error'),
          ),
        );
      },
    );
  }
}
```

このように **Provider が参照されている間だけコントローラが生存し**、Widget が破棄されると **自動で dispose()** される、という形が構築できます。

---

## @riverpod アノテーション (AsyncNotifier) を使う場合

`@riverpod` アノテーションのバージョンが十分新しければ、`AsyncNotifier` や `Notifier` を継承して書くことも可能です。  
概念的には同じで、`build` メソッドで初期化して `onDispose` や `dispose` をオーバーライドして片付けるイメージです。

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'camera_controller_provider.g.dart';

@riverpod
class MyCameraController extends AsyncNotifier<CameraController?> {
  @override
  Future<CameraController?> build() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) {
      return null;
    }
    final controller = CameraController(
      cameras[0],
      ResolutionPreset.max,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );

    await controller.initialize();
    await controller.lockCaptureOrientation(DeviceOrientation.portraitUp);

    return controller;
  }

  @override
  FutureOr<void> onDispose() {
    final controller = state.value;
    controller?.dispose();
    super.onDispose();
  }
}
```

このように書いておけば、`ref.watch(myCameraControllerProvider)` するだけで、`Provider` が使われなくなったタイミングで自動的に `onDispose()` が呼ばれ、カメラリソースが解放されます。  
使う側は同じく

```dart
final cameraControllerAsyncValue = ref.watch(myCameraControllerProvider);
```

で済むので、あとは同様に `when(...)` を使う流れです。

---

## Hook で管理する場合はどうなる？

`HookConsumerWidget` で `useEffect` を使って `CameraController` を管理するアプローチもあります。  
ただし、カメラの初期化や状態の管理を **Widget 単位のライフサイクルに寄せる** と、再利用やロジック切り出しがしにくくなります。

具体的には下記のような問題が生じます。

- 再ビルドのタイミングとカメラ管理ロジックが複雑に絡む可能性がある  
- 他のWidget から同じカメラリソースを参照したくなった場合に拡張が難しい

そのため、**「複数画面でカメラを使う可能性がある」** あるいは **「テストやメンテナンス性、再利用性」** を考えると、**Provider でライフサイクルごとまとめて管理** する方が圧倒的に楽になります。

もちろん「Widget が一つに完結していて使い回しもしない」というケースであれば、`Hook` だけでも十分に書けますが、Riverpod をすでに導入しているなら Provider 化がおすすめです。

---

## まとめ

- **CameraController の dispose を確実に呼ぶ** ためには、  
  Riverpod の `autoDispose` 系機能や `onDispose()` フックを活用するのがおすすめ
- **`FutureProvider.autoDispose`** か **`@riverpod` + `AsyncNotifier`** でカメラ管理ロジックを切り出すのがベストプラクティス
- Widget 内で管理するより、Provider 化しておくほうが**再利用性とメンテナンス性**が向上する

質問文の例では、すでに `@riverpod` の `Future<CameraController?> getCameraController` として実装されているので、  
```dart
@riverpod
Future<CameraController?> getCameraController(Ref ref) async {
  ...
  ref.onDispose(() {
    cameraController.dispose();
  });
  return cameraController;
}
```
のように **`ref.onDispose` で明示的に `cameraController.dispose()`** を呼ぶだけでシンプルに対応できます。  
かつ、この Provider を **`autoDispose`** 付きに変更しておけばより安全です。  

したがって、

> なにか別の @riverpod で保持するか、他の方法がよいか

といった問いに対しては、**「（いまの形でも構わないので）`ref.onDispose` を使い、できれば `autoDispose` もつけて使うのがベスト」** と言えます。

---

## 👤 ユーザー
*2025/2/1 11:21:08*

@riverpod アノテーションの以下の記述のどちらを使った方がいいのか？
現状プロジェクトではAsyncNotifierとはせずに\_$の表記を使っている。
また、どちらでもonDisposeは定義できるのか？

@riverpod
class MyCameraController extends AsyncNotifier&lt;CameraController?&gt; {

}

@riverpod
class MyCameraControllerNotifier extends \_$MyCameraControllerNotifier {}

---

## 🔧 ツール
*2025/2/1 11:21:30*

\*\*Deciding between Riverpod approaches\*\*

The question involves deciding between function-based declarators like `@riverpod` versus class-based ones like `@riverpod class MyCameraControllerNotifier`. The current Riverpod 2.x recommends functions for simplicity.

\*\*Analyzing approaches\*\*

I'm examining function-based and class-based Riverpod approaches. Classes are ideal for advanced functionality, including onDispose. It's interesting to see that classes offer greater control.

\*\*Evaluating methods\*\*

The new approach auto-generates code, while the older approach requires explicit base class definition. The latest method is more efficient and adaptable.

\*\*Adopting the new method\*\*

The new approach uses class naming with a `$` prefix to avoid conflicts. `onDispose` can be defined in either method, offering a more streamlined and conflict-free implementation.

\*\*Choosing the optimal method\*\*

I’m leaning towards naming classes with a `$` prefix to prevent conflicts. Defining `onDispose` is also feasible in both approaches. Essentially, the type of functionality remains the same.

---

## 🤖 アシスタント
*2025/2/1 11:21:30*

Riverpod 2.x 以降のドキュメントでは、**大きく2種類の書き方**が紹介されています。

1. **「`AsyncNotifier` を直接継承するパターン」**  
   ```dart
   @riverpod
   class MyCameraController extends AsyncNotifier<CameraController?> {
     @override
     FutureOr<CameraController?> build() async {
       // 初期化処理
     }

     @override
     FutureOr<void> onDispose() {
       // 解放処理
       super.onDispose();
     }
   }
   ```
2. **「`_$` の付いた自動生成クラスを継承するパターン」**  
   ```dart
   @riverpod
   class MyCameraControllerNotifier extends _$MyCameraControllerNotifier {
     @override
     FutureOr<CameraController?> build() async {
       // 初期化処理
     }

     @override
     void dispose() {
       // 解放処理
       super.dispose();
     }
   }
   ```
（クラス名やメソッド名は例です）

結論からいうと、**どちらを使っても問題ありません**。どちらも `onDispose` / `dispose` でリソース解放（`cameraController.dispose()` など）が可能であり、機能的に大きな違いはありません。  
ただし、Riverpod の公式ドキュメントでは **後者の「`_$` クラスを継承する」書き方** が新しい書き方として、より推奨されている印象です。

---

## 2つの書き方の違い

### 1. 「`AsyncNotifier` を直接継承するパターン」

- クラス宣言で `extends AsyncNotifier<T>` と明示的に書きます。
- `build()` メソッドや `onDispose()` を手動でオーバーライドする必要があります。  
- シンプルで直感的な分、**細かい設定を自前で書く機会**が多い。

### 2. 「`_$xxxx` クラスを継承するパターン（コードジェネレーションベース）」

- `@riverpod` アノテーションを付与すると、ビルド時に `_$MyCameraControllerNotifier` というクラスが自動生成されます。
- `extends _$MyCameraControllerNotifier` とすることで、**Riverpod の生成コードと自作クラスを合体**させるイメージです。  
- `build()` や `dispose()` をオーバーライドする点は同じですが、**拡張性のためのコードが自動生成される**ため、公式ドキュメントの最新ガイドではこちらがメインになっています。

> **補足**: 旧バージョンの Riverpod だと `FutureProvider` / `StateNotifierProvider` などを自力で書く方法が一般的でした。  
> Riverpod 2.x 以降は **「アノテーション + コードジェネレーションでまとめて管理する」** のが推奨される流れになり、このため `_$(アンダーバー＋ドル)` というクラスが自動生成されるようになっています。

---

## `onDispose` / `dispose` はどちらも使える？

- **はい、どちらでも使えます**。  
  - `AsyncNotifier` には `onDispose()` が用意されており、  
  - `_@riverpod` で自動生成されるクラスでも `override void dispose()` が呼ばれるため、リソース解放のタイミングを確保できます。

実際には以下のようなパターンがよく使われます。

1. **`onDispose` を使う**  
   ```dart
   @override
   FutureOr<void> onDispose() {
     cameraController?.dispose();
     super.onDispose();
   }
   ```
2. **`dispose` を使う**  
   ```dart
   @override
   void dispose() {
     cameraController?.dispose();
     super.dispose();
   }
   ```
3. **`ref.onDispose(() => ...)` を使う**  
   ```dart
   @override
   FutureOr<CameraController?> build() async {
     final controller = CameraController(...);
     await controller.initialize();

     // Providerが破棄されるときにコントローラも破棄する
     ref.onDispose(controller.dispose);

     return controller;
   }
   ```
   
これらはいずれでもOKですが、**Riverpod が提供する「`ref.onDispose()` フック」を使う**パターンを好む方も多いです。シンプルに「build() 内でまとめて初期化と破棄処理の定義ができる」からです。

---

## まとめ

1. **`@riverpod` + `AsyncNotifier` を直接継承**するか、**`@riverpod` + 自動生成 `_$MyNotifier` を継承**するかは、  
   - どちらも同様に動作し、**dispose を定義可能**。  
   - **最近の公式ドキュメント的には `_$MyNotifier` を継承する書き方が推奨**される流れが多い。
2. **`onDispose`, `dispose`, `ref.onDispose`** のいずれでもカメラリソース解放を定義できる。  
   - 実装の好みやチームの方針次第。

現時点でプロジェクトが「`AsyncNotifier` を直接継承する書き方」や「`_$` を使う書き方」を混在していても、**動作としては問題ありません**。  
最終的にはリポジトリ全体でコードスタイルを統一してあげると、読みやすさ・保守性が高まるでしょう。

---

## 👤 ユーザー
*2025/2/1 12:50:32*

以下で参照されなくなったタイミングでautoDisposeeしてほしい

@riverpod
class CameraControllerNotifier extends \_$CameraControllerNotifier {
  @override
  Future&lt;CameraController?&gt; build() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) {
      return null;
    }
    final controller = CameraController(
      cameras\[0\],
      ResolutionPreset.max,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );

    await controller.initialize();
    await controller.lockCaptureOrientation(DeviceOrientation.portraitUp);

    return controller;
  }
}

---

## 🔧 ツール
*2025/2/1 12:51:03*

\*\*Maximizing the code\*\*  
I’m enhancing the code snippet for `CameraControllerNotifier` with an auto-dispose mechanism using the `@riverpod` annotation and `ref.onDispose` to manage resources effectively.

\*\*Considering `@riverpod(keepAlive: false)`\*\*  
Hmm, it seems like the `@autoDispose` annotation might be more optimal for managing resource disposal effectively, as it ensures the controller is disposed of when no longer needed.

\*\*Implementing resource disposal\*\*  
I’m exploring the use of `@riverpod` with `@autoDispose`, ensuring that the `CameraController` is properly disposed of when it’s no longer needed, streamlining resource management effectively.

\*\*Finalizing the solution\*\*  
I’m concluding that using `@autoDispose` with `@riverpod` for `CameraControllerNotifier` ensures proper resource management, especially for asynchronous builders and lock controllers, optimizing performance reliability.

\*\*Clarifying the option\*\*  
By examining the official documentation, I'm confirming that `@Riverpod(keepAlive: false)` ensures automatic disposal for providers, optimizing resource management and enhancing performance reliability.

\*\*Confirming autogrowth\*\*

I’m revisiting the idea that `@Riverpod(keepAlive: false)`, `@riverpodAutoDispose`, and `@autoDispose` annotations effectively ensure automatic disposal in Riverpod 2. The `ref.onDispose` method is also utilized.

\*\*Enhancing automatic disposal\*\*  
Integrating `autoDispose` into the annotation, along with `ref.onDispose(() =&gt; controller.dispose())` in the build method, ensures providers automatically dispose of when no longer active, streamlining resource management.

\*\*Leaning towards automatic disposal\*\*  
I’m concluding that adding `@Riverpod(autoDispose: true)` is the best approach. It simplifies the setup and ensures efficient resource management.

\*\*Considering manual disposal\*\*

This marks a shift towards using `ref.onDispose` for resource management in Riverpod 2, ensuring efficient cleanup and avoiding potential memory leaks.

---

## 🤖 アシスタント
*2025/2/1 12:51:03*

`Riverpod` で「参照されなくなったタイミングで自動的に dispose したい」場合は、**autoDispose を有効にする**のがポイントです。  
Riverpod 2.x のアノテーションでは、`@Riverpod(autoDispose: true)` を付けるか、`@riverpodAutoDispose` を使う方法があります。

以下は、`@Riverpod(autoDispose: true)` を使う例です。  
「`CameraController` を返す `AsyncNotifier`」スタイルをアノテーションで書く場合、  
`class CameraControllerNotifier extends _$CameraControllerNotifier` に対してこのように記述できます。

```dart
import 'dart:async';
import 'package:camera/camera.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'camera_controller_notifier.g.dart';

// autoDispose=true を指定すると、
// 参照が切れた段階で自動的に dispose が呼ばれるようになります。
@Riverpod(autoDispose: true)
class CameraControllerNotifier extends _$CameraControllerNotifier {
  @override
  Future<CameraController?> build() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) {
      return null;
    }
    final controller = CameraController(
      cameras[0],
      ResolutionPreset.max,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );

    await controller.initialize();
    await controller.lockCaptureOrientation(DeviceOrientation.portraitUp);

    // Providerが破棄されるときにカメラを解放したいので ref.onDispose(...) を呼ぶ
    ref.onDispose(() {
      controller.dispose();
    });

    return controller;
  }
}
```

### これで実現できること

1. **autoDispose: true**  
   - ウィジェットが `ref.watch(...)` していた Provider を使わなくなったタイミングで、Riverpod が自動で「その Provider インスタンスは不要」と判断します。  
   - すると、`onDispose` が呼ばれ、`controller.dispose()` によりリソースが解放されます。

2. **`ref.onDispose(...)` の利用**  
   - `onDispose` は `build()` 中で呼び出しておくことで、**Provider が破棄される際に実行されるコールバック**を登録できます。  
   - ここで `CameraController.dispose()` を呼ぶことで、カメラリソースを確実に解放できます。  

### もし `dispose()` をオーバーライドしたい場合

`onDispose` ではなく、クラス自体の `dispose()` メソッドをオーバーライドしても同様に処理できます。  
以下のように書けば、同じタイミング（Provider 破棄時）に呼ばれます。

```dart
@Riverpod(autoDispose: true)
class CameraControllerNotifier extends _$CameraControllerNotifier {
  late final CameraController _controller;

  @override
  Future<CameraController?> build() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) {
      return null;
    }
    _controller = CameraController(
      cameras[0],
      ResolutionPreset.max,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );
    await _controller.initialize();
    await _controller.lockCaptureOrientation(DeviceOrientation.portraitUp);
    return _controller;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

どちらのやり方も **「Provider が破棄されるときにカメラを解放する」** という目的は同じです。  
コード量が少なく、メソッド内で完結しやすい `ref.onDispose` のほうを好む方も多いです。

---

## まとめ

- **自動破棄 (`autoDispose`) を有効化**したい場合は、`@Riverpod(autoDispose: true)` または `@riverpodAutoDispose` を使う  
- **カメラリソースの解放**は、`ref.onDispose` か `dispose()` のオーバーライドで行う  
- これにより「参照されなくなったタイミングで `CameraController.dispose()` が呼ばれる」ようになり、リソースリークを防げる

---
