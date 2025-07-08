# MultipartFile to ResponseBody

日付: 2025-02-04

---

## 👤 ユーザー
*2025/2/4 20:15:42*

型に合わせて欲しい
ResponseBodyが指定なんだ。ResponseBodyは変えらなれない。MultipartFileを変換してResponseBodyに変えて欲しい

@riverpod
class UploadPhotoNotifier extends _$UploadPhotoNotifier {
  @override
  Future&lt;UploadedPhoto?&gt; build() async =&gt; null;

  Future&lt;UploadedPhoto&gt; uploadPhoto(
    MultipartFile multipartFile,
    LatLng location,
  ) async {
    state = const AsyncValue.loading();
    try {
      try {
        final api = await ref.watch(photosApiProvider.future);
        final response = await api.photosControllerUploadPhoto(
          ResponseBody.fromBytes(
            await multipartFile.finalize().toBytes(),
            contentType: multipartFile.contentType,
          ),
          UploadPhotoRequestForYamlType.USER_PHOTOS,
          location.latitude,
          location.longitude,
        );

  /// Uploaded a photo, separate Admin and User photo using PhotoType [ADM0101, GME0302]
  /// post: /v1/photos
  ///
  Future&lt;Response&lt;PhotoUploadResponseDTO&gt;&gt; photosControllerUploadPhoto(
    ResponseBody file,
    UploadPhotoRequestForYamlType type,
    num latitute,
    num longitude,
  ) async {
    final queryParams = &lt;String, dynamic&gt;{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/photos');
    final response = await dio.postUri&lt;Map&lt;String, dynamic&gt;&gt;(uri,
        data: FormData.fromMap(&lt;String, dynamic&gt;{
          'file': file,
          'type': type,
          'latitute': latitute,
          'longitude': longitude
        }));
    final parsed = PhotoUploadResponseDTO.fromJson(response.data!);
    return Response&lt;PhotoUploadResponseDTO&gt;(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }
ChatGPT:
ChatGPT

---

## 🤖 アシスタント
*2025/2/4 20:15:56*

`MultipartFile` を `ResponseBody` に変換するには、 `MultipartFile` のストリームをバイト配列に変換し、それを `ResponseBody.fromBytes` に渡す形にする必要があります。

`MultipartFile` の `finalize()` メソッドは `Stream<List<int>>` を返すので、それをバイト配列に変換するために `toList()` を使います。

以下のように変更してください。

```dart
import 'dart:async';
import 'dart:typed_data';

@riverpod
class UploadPhotoNotifier extends _$UploadPhotoNotifier {
  @override
  Future<UploadedPhoto?> build() async => null;

  Future<UploadedPhoto> uploadPhoto(
    MultipartFile multipartFile,
    LatLng location,
  ) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(photosApiProvider.future);

      // MultipartFile をバイト配列に変換
      final List<int> byteList = await multipartFile.finalize()
          .expand((chunk) => chunk)
          .toList();
      final Uint8List bytes = Uint8List.fromList(byteList);

      // ResponseBody に変換
      final responseBody = ResponseBody.fromBytes(
        bytes,
        contentType: multipartFile.contentType,
      );

      final response = await api.photosControllerUploadPhoto(
        responseBody,
        UploadPhotoRequestForYamlType.USER_PHOTOS,
        location.latitude,
        location.longitude,
      );

      state = AsyncValue.data(response.data);
      return response.data;
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }
}
```

### 変更点:
1. `multipartFile.finalize()` で `Stream<List<int>>` を取得。
2. `expand((chunk) => chunk).toList()` で `List<int>` に変換。
3. `Uint8List.fromList(byteList)` で `Uint8List` に変換。
4. `ResponseBody.fromBytes()` を使用して `ResponseBody` に変換。

この方法で、 `MultipartFile` を `ResponseBody` に変換してアップロードできます。

---
