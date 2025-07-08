# npxでOpenAPI生成

Date: 2024-10-30

---

## 👤 User
*2024-10-30 12:48:46*

npm install せずに実行したい

openapi-generator-cli generate \                                                                                                                                                                                                                            127 ↵
              -i daVinciAppApi/fastapi/app/openapi/openapi.json \
              -g swift5 \
              -o DaVinciIOSOpenAPI \
              --additional-properties=removeMigrationProjectNameClass=true,responseAs=AsyncAwait \
              --skip-validate-spec \
              --model-name-suffix=DTO

---

## 🤖 Assistant
*2024-10-30 12:48:50*

`npx`を使うことで、`npm install`をせずにコマンドを実行できます。次のように変更してください。

```bash
npx @openapitools/openapi-generator-cli generate \
    -i daVinciAppApi/fastapi/app/openapi/openapi.json \
    -g swift5 \
    -o DaVinciIOSOpenAPI \
    --additional-properties=removeMigrationProjectNameClass=true,responseAs=AsyncAwait \
    --skip-validate-spec \
    --model-name-suffix=DTO
```

`npx`は、ローカルにパッケージをインストールせずに必要なCLIを直接実行することができます。

---
