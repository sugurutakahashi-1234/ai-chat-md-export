# TypeScript Function Name Conflicts

日付: 2025-06-15

---

## 👤 ユーザー
*2025/6/15 18:31:07*

タイプスクリプトで関数名が被る時には どのようにして回避すればいいのか。

---

## 🤖 アシスタント
*2025/6/15 18:31:28*

TypeScriptで関数名が被る場合の回避方法をいくつか紹介します。

## 1. 名前空間（namespace）を使用

```typescript
namespace UserModule {
  export function save() {
    console.log("ユーザーを保存");
  }
}

namespace ProductModule {
  export function save() {
    console.log("商品を保存");
  }
}

// 使用時
UserModule.save();
ProductModule.save();
```

## 2. モジュール分割とインポート時の名前変更

```typescript
// userService.ts
export function save() {
  console.log("ユーザーを保存");
}

// productService.ts
export function save() {
  console.log("商品を保存");
}

// main.ts
import { save as saveUser } from './userService';
import { save as saveProduct } from './productService';

saveUser();
saveProduct();
```

## 3. オブジェクトでグループ化

```typescript
const userService = {
  save() {
    console.log("ユーザーを保存");
  }
};

const productService = {
  save() {
    console.log("商品を保存");
  }
};

userService.save();
productService.save();
```

## 4. クラスを使用

```typescript
class UserService {
  save() {
    console.log("ユーザーを保存");
  }
}

class ProductService {
  save() {
    console.log("商品を保存");
  }
}

const userService = new UserService();
const productService = new ProductService();

userService.save();
productService.save();
```

## 5. 関数名を具体的にする

```typescript
function saveUser() {
  console.log("ユーザーを保存");
}

function saveProduct() {
  console.log("商品を保存");
}

saveUser();
saveProduct();
```

最も推奨されるのは、モジュール分割と適切な命名を組み合わせる方法です。これにより、コードの可読性と保守性が向上します。

---
