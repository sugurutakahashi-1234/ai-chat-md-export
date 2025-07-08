# ApiErrorResponseDTO 処理関数化

日付: 2025-03-06

---

## 👤 ユーザー
*2025/03/06 21:55:51*

このApiErrorResponseDTOに変換する処理を関数化してほしい

final errorResponse = error.response?.data as Map&lt;String, dynamic&gt;?;
      final code = errorResponse?['code'] as num?;
      final statusCode = errorResponse?['statusCode'] as num?;
      ApiErrorResponseDTOErrorTypeEnum? errorType;
      if (errorResponse?['errorType'] != null) {
        final errorTypeStr = errorResponse?['errorType'] as String;
        errorType = ApiErrorResponseDTOErrorTypeEnum.values.firstWhere(
          (e) =&gt; e.name == errorTypeStr,
          orElse: () =&gt; ApiErrorResponseDTOErrorTypeEnum.UNKNOWN,
        );
      }
      final errorMessage = errorResponse?['errorMessage'] as String?;
      final apiErrorResponseDTO = ApiErrorResponseDTO(
        (b) =&gt; b
          ..code = code
          ..statusCode = statusCode
          ..errorType = errorType
          ..errorMessage = errorMessage,
      );

@riverpod
class LeaveGuildNotifier extends _$LeaveGuildNotifier {
  @override
  Future&lt;String?&gt; build() async =&gt; null;

  Future&lt;String&gt; leaveGuild() async {
    final oldData = state.valueOrNull;
    if (oldData == null) {
      state = const AsyncValue.loading();
    }
    try {
      final api = await ref.watch(guildMembersApiProvider.future);
      final response = await api.guildMemberControllerLeaveFromGuild();
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      final data = response.data?.data;
      if (data == null) {
        throw Exception('No data found');
      }
      state = AsyncValue.data(data);
      return data;
    } on DioException catch (error, stackTrace) {
      dioExceptionHandling(error);
      // checkForApiError(error.response?.data);
      final errorResponse = error.response?.data as Map&lt;String, dynamic&gt;?;
      final code = errorResponse?['code'] as num?;
      final statusCode = errorResponse?['statusCode'] as num?;
      ApiErrorResponseDTOErrorTypeEnum? errorType;
      if (errorResponse?['errorType'] != null) {
        final errorTypeStr = errorResponse?['errorType'] as String;
        errorType = ApiErrorResponseDTOErrorTypeEnum.values.firstWhere(
          (e) =&gt; e.name == errorTypeStr,
          orElse: () =&gt; ApiErrorResponseDTOErrorTypeEnum.UNKNOWN,
        );
      }
      final errorMessage = errorResponse?['errorMessage'] as String?;
      final apiErrorResponseDTO = ApiErrorResponseDTO(
        (b) =&gt; b
          ..code = code
          ..statusCode = statusCode
          ..errorType = errorType
          ..errorMessage = errorMessage,
      );
      // apiErrorHandling(apiErrorResponseDTO, ref);
      state = AsyncValue.error(apiErrorResponseDTO, stackTrace);
      rethrow;
    } on Exception catch (error, stackTrace) {
      debugPrint('Error: $error');
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }
}

---

## 🔧 ツール
*2025/03/06 21:55:52*

APIエラーメッセージを解釈している

**エラーハンドリングの最適化**

エラーメッセージを `ApiErrorResponseDTO` に変換する関数を構築中。エラーコード、ステータスコード、エラータイプ、エラーメッセージを適切に抽出し、変換を効率化している。

---

## 🤖 アシスタント
*2025/03/06 21:55:52*

以下のように、`ApiErrorResponseDTO` を生成する処理部分を関数化し、例外処理部分で使いまわすようにすると、コードがすっきりします。

```dart
/// ApiErrorResponseDTO に変換する関数
ApiErrorResponseDTO parseApiErrorResponseDTO(Map<String, dynamic>? errorResponse) {
  final code = errorResponse?['code'] as num?;
  final statusCode = errorResponse?['statusCode'] as num?;
  ApiErrorResponseDTOErrorTypeEnum? errorType;
  if (errorResponse?['errorType'] != null) {
    final errorTypeStr = errorResponse?['errorType'] as String;
    errorType = ApiErrorResponseDTOErrorTypeEnum.values.firstWhere(
      (e) => e.name == errorTypeStr,
      orElse: () => ApiErrorResponseDTOErrorTypeEnum.UNKNOWN,
    );
  }
  final errorMessage = errorResponse?['errorMessage'] as String?;

  return ApiErrorResponseDTO(
    (b) => b
      ..code = code
      ..statusCode = statusCode
      ..errorType = errorType
      ..errorMessage = errorMessage,
  );
}
```

そして、`leaveGuild` 内の例外捕捉部分では以下のように呼び出してください:

```dart
@riverpod
class LeaveGuildNotifier extends _$LeaveGuildNotifier {
  @override
  Future<String?> build() async => null;

  Future<String> leaveGuild() async {
    final oldData = state.valueOrNull;
    if (oldData == null) {
      state = const AsyncValue.loading();
    }
    try {
      final api = await ref.watch(guildMembersApiProvider.future);
      final response = await api.guildMemberControllerLeaveFromGuild();
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      final data = response.data?.data;
      if (data == null) {
        throw Exception('No data found');
      }
      state = AsyncValue.data(data);
      return data;
    } on DioException catch (error, stackTrace) {
      // DioException 時の処理
      dioExceptionHandling(error);

      // 変換関数を使って DTO を生成
      final errorResponse = error.response?.data as Map<String, dynamic>?;
      final apiErrorResponseDTO = parseApiErrorResponseDTO(errorResponse);

      // API エラーに対する状態更新
      state = AsyncValue.error(apiErrorResponseDTO, stackTrace);
      rethrow;
    } on Exception catch (error, stackTrace) {
      debugPrint('Error: $error');
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }
}
```

これにより、`ApiErrorResponseDTO` に変換する処理がひとつの関数にまとまり、エラー時のコードが簡潔になります。

---
