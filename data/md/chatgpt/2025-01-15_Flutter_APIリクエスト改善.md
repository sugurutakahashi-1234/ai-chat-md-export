# Flutter APIリクエスト改善

日付: 2025-01-15

---

## 👤 ユーザー
*2025/1/15 16:58:29*

Flutterで以下を使ってリクエストした後に

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';

part 'upload_photo.g.dart';

@riverpod
class UploadPhotoNotifier extends _$UploadPhotoNotifier {
  @override
  Future&lt;PhotoUploadResponseDTOData?&gt; build() async =&gt; null;

  Future&lt;void&gt; uploadPhoto(MultipartFile multipartFile, LatLng location) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(photosApiProvider.future);
      final response = await api.photosControllerUploadPhoto(
        // TODO: 適切なパラメーターを定義する
        UploadPhotoRequestDTO(
          name: '',
          type: null,
          latitute: location.latitude,
          longitude: location.longitude,
        ),
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

/// Photo data
@freezed
class PhotoUploadResponseDTOData with _$PhotoUploadResponseDTOData {
  factory PhotoUploadResponseDTOData({
    @JsonKey(name: 'hash') required String? hash,
    @JsonKey(name: 'url') required String? url,
    @JsonKey(name: 'message') String? message,
  }) = _PhotoUploadResponseDTOData;

  factory PhotoUploadResponseDTOData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$PhotoUploadResponseDTODataFromJson(jsonMap);
}

---

## 🤖 アシスタント
*2025/1/15 16:58:31*

コード全体の構成は良いですが、いくつかの改良点や補足事項を提案します。

---

### 改善案

####

---
