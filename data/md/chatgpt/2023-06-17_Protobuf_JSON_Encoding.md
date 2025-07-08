# Protobuf JSON Encoding

Date: 2023-06-17

---

## 👤 User
*2023-06-17 21:15:32*

protobufの以下のオプションについて押して

/// Returns a Data containing the UTF-8 JSON serialization of the message.
  ///
  /// Unlike binary encoding, presence of required fields is not enforced when
  /// serializing to JSON.
  ///
  /// - Returns: A Data containing the JSON serialization of the message.
  /// - Parameters:
  ///   - options: The JSONEncodingOptions to use.
  /// - Throws: `JSONEncodingError` if encoding fails.
  public func jsonUTF8Data(
    options: JSONEncodingOptions = JSONEncodingOptions()
  )
/// Options for JSONEncoding.
public struct JSONEncodingOptions {

  /// Always print enums as ints. By default they are printed as strings.
  public var alwaysPrintEnumsAsInts: Bool = false

  /// Whether to preserve proto field names.
  /// By default they are converted to JSON(lowerCamelCase) names.
  public var preserveProtoFieldNames: Bool = false

  public init() {}
}

---

## 🤖 Assistant
*2023-06-17 21:16:01*

この`jsonUTF8Data`関数と`JSONEncodingOptions`オプションは、ProtobufメッセージをJSON形式にシリアライズするために使用されます。具体的には以下の通りです：

1. `jsonUTF8Data(options: JSONEncodingOptions = JSONEncodingOptions())` : この関数は、ProtobufメッセージをUTF-8 JSON形式にシリアライズします。パラメータである`options`は、シリアライズの際のエンコーディングオプションを指定します。デフォルトでは、新規`JSONEncodingOptions`が作成されます。シリアライズに失敗した場合、`JSONEncodingError`がスローされます。

2. `JSONEncodingOptions` : この構造体は、JSONエンコーディングのオプションを指定するために使用します。次の2つのフィールドが含まれています：

   - `alwaysPrintEnumsAsInts` : このオプションがtrueに設定されている場合、enumは常に整数として出力されます。デフォルトでは、enumは文字列として出力されます。

   - `preserveProtoFieldNames` : このオプションがtrueに設定されている場合、protoフィールド名はそのまま保持されます。デフォルトでは、これらのフィールド名はJSON用にlowerCamelCaseに変換されます。

以上のオプションを使用して、Protobufのシリアライズの振る舞いをカスタマイズできます。

---
