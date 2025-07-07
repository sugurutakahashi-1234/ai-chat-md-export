# OpenAPI 3.1.0 Error Required

日付: 2024-05-31

---

## 👤 ユーザー
*2024/5/31 15:16:10*

Errorのパラメーターを必須にしてほしいのとopenapiのバージョンを3.1.0にあげてほしい

openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
servers:
  - url: https://jsonplaceholder.typicode.com
paths:
  /users:
    get:
      summary: Get a list of users
      operationId: getUsers
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
        404:
          description: Not Found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /users/{id}:
    get:
      summary: Get a user by ID
      operationId: getUserById
      parameters:
        - in: path
          name: id
          schema:
            type: integer
          required: true
          description: The id of the user to retrieve
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        404:
          description: Not Found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - username
        - email
        - address
        - phone
        - website
        - company
      properties:
        id:
          type: integer
        name:
          type: string
        username:
          type: string
        email:
          type: string
        address:
          type: object
          required:
            - street
            - suite
            - city
            - zipcode
            - geo
          properties:
            street:
              type: string
            suite:
              type: string
            city:
              type: string
            zipcode:
              type: string
            geo:
              type: object
              required:
                - lat
                - lng
              properties:
                lat:
                  type: string
                lng:
                  type: string
        phone:
          type: string
        website:
          type: string
        company:
          type: object
          required:
            - name
            - catchPhrase
            - bs
          properties:
            name:
              type: string
            catchPhrase:
              type: string
            bs:
              type: string
    Error:
      type: object
      properties:
        code:
          type: integer
        message:
          type: string

---
