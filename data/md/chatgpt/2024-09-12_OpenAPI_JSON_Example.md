# OpenAPI JSON Example

日付: 2024-09-12

---

## 👤 ユーザー
*2024/9/12 17:48:02*

openapi形式の簡単なjson

---

## 🤖 アシスタント
*2024/9/12 17:48:19*

以下は、OpenAPI 3.0形式の簡単なJSONサンプルです。APIエンドポイントが1つ（`/users`）あり、ユーザー情報を取得するGETリクエストを定義しています。

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "User API",
    "version": "1.0.0",
    "description": "A simple API to manage users"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get list of users",
        "responses": {
          "200": {
            "description": "A list of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "integer",
                        "example": 1
                      },
                      "name": {
                        "type": "string",
                        "example": "John Doe"
                      },
                      "email": {
                        "type": "string",
                        "example": "john.doe@example.com"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

このJSONは、ユーザー情報を取得するGETエンドポイントを表しています。`/users`エンドポイントにリクエストを送ると、ID、名前、メールアドレスが含まれたユーザーのリストが返されます。

---
