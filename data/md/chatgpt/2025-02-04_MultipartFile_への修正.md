# MultipartFile への修正

日付: 2025-02-04

---

## 👤 ユーザー
*2025/02/04 20:14:57*

型に合わせて欲しい
ResponseBodyが指定なんだ。

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

---

## 🤖 アシスタント
*2025/02/04 20:15:09*

`ResponseBody` を正しく `FormData` に含めるためには、`MultipartFile` の形でデータを扱う必要があります。現在の `uploadPhoto` メソッドで `ResponseBody.fromBytes()` を使っていますが、Dio の `FormData` に対応する `MultipartFile` に変更する必要があります。

以下の修正を行います：
- `ResponseBody` を `MultipartFile` に変換
- `FormData` に `MultipartFile` を追加

修正後の `uploadPhoto` メソッドは以下のようになります：

### 修正後の `uploadPhoto`
```dart
@riverpod
class UploadPhotoNotifier extends _$UploadPhotoNotifier {
  @override
  Future&lt;UploadedPhoto?&gt; build() async =&gt; null;

  Future&lt;UploadedPhoto&gt; uploadPhoto(
    MultipartFile multipartFile,
    LatLng location,
  ) async {
    state = const AsyncValue

---
