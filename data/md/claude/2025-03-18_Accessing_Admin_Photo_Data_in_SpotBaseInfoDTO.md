# Accessing Admin Photo Data in SpotBaseInfoDTO

日付: 2025-03-18

---

## 👤 ユーザー
*2025/3/18 19:54:58*



---

## 🤖 アシスタント
*2025/3/18 19:55:15*

I'll implement an extension for SpotBaseInfoDTO that accesses `.adminPhotoUrl` and `.adminPhotoId` with error handling as requested.
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



I've created an extension for the `SpotBaseInfoDTO` class that provides getters for `.adminPhotoUrl` and `.adminPhotoId`. Here's how it works:

1. The extension uses the `firstWhere()` method to search through the `spotPhotos` list for the first photo with `photoType` equal to `SpotPhotoDTOPhotoTypeEnum.ADMIN_PHOTOS`.

2. If no photo with the ADMIN_PHOTOS type is found, it will throw a `StateError` with a descriptive message indicating which spot ID is missing an admin photo.

3. The extension provides two getter methods:
   - `adminPhotoUrl`: Returns the URL of the admin photo
   - `adminPhotoId`: Returns the ID of the admin photo

To use this extension in your code, you would:

```dart
// Import the file containing your extension
import 'path_to_extension_file.dart';

// Then you can use it like this:
final spot = someSpotBaseInfoDTO;
try {
  final photoUrl = spot.adminPhotoUrl;
  final photoId = spot.adminPhotoId;
  // Use photoUrl and photoId...
} catch (e) {
  // Handle the error when no admin photo exists
  print(e);
}
```

This implementation satisfies your requirement to access admin photo information and crash with an error if none exists.

---

## 👤 ユーザー
*2025/3/18 23:27:06*

おなじくspotPhotosを持つ型があったんだけど、うまく共通化して表現できないか？そもそもspotPhotosから映えるようにすればいいかな？

import 'package:guild\_api/guild\_api.dart';

extension SpotBaseInfoDtoX on SpotBaseInfoDTO {
  String get adminPhotoUrl {
    final adminPhoto = spotPhotos.firstWhere(
      (photo) =&gt; photo.photoType == SpotPhotoDTOPhotoTypeEnum.ADMIN\_PHOTOS,
      orElse: () =&gt; throw StateError('No admin photo found for spot $spotId'),
    );
    return adminPhoto.photoUrl;
  }

  String get adminPhotoId {
    final adminPhoto = spotPhotos.firstWhere(
      (photo) =&gt; photo.photoType == SpotPhotoDTOPhotoTypeEnum.ADMIN\_PHOTOS,
      orElse: () =&gt; throw StateError('No admin photo found for spot $spotId'),
    );
    return adminPhoto.photoId;
  }
}

extension SpotWithLocationInfoDtoX on SpotWithLocationInfoDTO {
  String get adminPhotoUrl {
    final adminPhoto = spotPhotos.firstWhere(
      (photo) =&gt; photo.photoType == SpotPhotoDTOPhotoTypeEnum.ADMIN\_PHOTOS,
      orElse: () =&gt; throw StateError('No admin photo found for spot $spotId'),
    );
    return adminPhoto.photoUrl;
  }

  String get adminPhotoId {
    final adminPhoto = spotPhotos.firstWhere(
      (photo) =&gt; photo.photoType == SpotPhotoDTOPhotoTypeEnum.ADMIN\_PHOTOS,
      orElse: () =&gt; throw StateError('No admin photo found for spot $spotId'),
    );
    return adminPhoto.photoId;
  }
}

---

## 🤖 アシスタント
*2025/3/18 23:28:02*

そうですね、コードの重複を避けるために共通化するのは良い考えです。`spotPhotos`を持つインターフェースを作成して、両方のクラスで使用できるようにしましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



この共通化アプローチでは問題があります。Dartではクラスに後からミックスインを適用することができません。より適切な方法を考えましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



上記の方法でも重複が残るので、もう少し改善しましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```





上記の解決策は少し複雑すぎるようです。より単純でシンプルな方法に変更しましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```





こちらのアプローチでもまだ重複が多いので、もっとシンプルにしましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```





これで共通化がうまくできました。この実装では以下のような利点があります：

1. `BuiltList<SpotPhotoDTO>`に対する拡張メソッド `findAdminPhoto` を定義し、管理者写真を検索するロジックを共通化しています。

2. 各DTOクラス用の拡張では、単にこの共通メソッドを呼び出しているだけなので、コードの重複が最小限に抑えられています。

3. エラーメッセージも統一されているため、デバッグやエラー処理も一貫性があります。

使い方は次のとおりです：

```dart
// SpotBaseInfoDTOの場合
final spotBaseInfo = someSpotBaseInfoDTO;
try {
  final url = spotBaseInfo.adminPhotoUrl;
  final id = spotBaseInfo.adminPhotoId;
  // 使用する...
} catch (e) {
  // エラー処理...
}

// SpotWithLocationInfoDTOの場合も同様
final spotWithLocation = someSpotWithLocationInfoDTO;
try {
  final url = spotWithLocation.adminPhotoUrl;
  final id = spotWithLocation.adminPhotoId;
  // 使用する...
} catch (e) {
  // エラー処理...
}
```

この実装方法であれば、将来的に他のDTOクラスで同様の機能が必要になった場合も、拡張を追加するだけで簡単に対応できます。

---
