# エラー解決策: GraphQL非nullタイプ

日付: 2023-06-22

---

## 👤 ユーザー
*2023/6/22 23:17:22*

このエラーメッセージから何をすべきか教えて欲しい

2023-06-22 23:15:37.369430+0900 EmomilAppDevelop\[74592:3874241\] \[network\] \[error\] Amplify API Error getResearch(): GraphQLResponseError&lt;Research&gt;: GraphQL service returned a successful response containing errors: \[Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Video\\' (/get\_research/measurements\[0\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(0.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Website\\' (/get\_research/measurements\[1\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(1.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Questionnaire\\' (/get\_research/measurements\[2\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(2.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Interview\\' (/get\_research/measurements\[3\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(3.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil)\]


Recovery suggestion: The list of `GraphQLError` contains service-specific messages
2023-06-22 23:15:37.371359+0900 EmomilAppDevelop\[74592:3873965\] \[network\] \[default\] error: GraphQLResponseError&lt;Research&gt;: GraphQL service returned a successful response containing errors: \[Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Video\\' (/get\_research/measurements\[0\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(0.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Website\\' (/get\_research/measurements\[1\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(1.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Questionnaire\\' (/get\_research/measurements\[2\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(2.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil), Amplify.GraphQLError(message: "Cannot return null for non-nullable type: \\'MeasurementType\\' within parent \\'Interview\\' (/get\_research/measurements\[3\]/measurement\_type)", locations: nil, path: Optional(\[Amplify.JSONValue.string("get\_research"), Amplify.JSONValue.string("measurements"), Amplify.JSONValue.number(3.0), Amplify.JSONValue.string("measurement\_type")\]), extensions: nil)\]

---

## 🤖 アシスタント
*2023/6/22 23:18:09*

エラーメッセージから理解するに、GraphQL APIを使用して 'get\_research'クエリを実行しようとしているようですが、各'research measurements'（調査測定）オブジェクトで 'MeasurementType'（測定タイプ）が必要とされている一方で、その値が null になっているため、エラーが発生しています。

GraphQL スキーマでは、'MeasurementType' は null 不可と定義されているようです。つまり、各 'measurement' オブジェクトは、'measurement\_type' フィールドを必ず含む必要があります。しかし、現在の状態では 'measurement\_type' フィールドが null または存在しないため、このエラーが発生していると考えられます。

解決策は次の通りです：

1. データソース（データベースまたは他のソース）を確認し、それぞれの 'measurement' オブジェクトが正しい 'MeasurementType' を持っていることを確認します。 'MeasurementType' が null または存在しない場合、それを適切な値に設定します。

2. または、GraphQL スキーマを更新して、'MeasurementType' を null 許容型に変更することもできます。ただし、これはあくまで一時的な対応であり、本質的な解決策ではない可能性があります。null を許容することで、問題を一時的に回避できるかもしれませんが、その後のクエリが想定どおりに動作するかどうかは保証されません。

---
