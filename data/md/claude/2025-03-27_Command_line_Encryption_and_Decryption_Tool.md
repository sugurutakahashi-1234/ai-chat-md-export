# Command-line Encryption and Decryption Tool

日付: 2025-03-27

---

## 👤 ユーザー
*2025/3/27 11:12:18*

macのローカルで動かせるようにしたい。コンソールから引数で渡したい。node.jsの環境はある

import \* as crypto from 'crypto';
// 型定義
type EncryptDataType = {
  latitude: number;
  longitude: number;
  timestamp: Date;
};
// 定数
const ALGORITHM = 'aes-256-cbc';
const KEY\_STRING = 'f93kdL02x!vB7@qZm#9Tws6Uo$YePn';
// 暗号化関数
export function encrypt(object: EncryptDataType): string {
  const key = crypto.createHash('sha256').update(KEY\_STRING).digest();
  const iv = crypto.randomBytes(16);
  const json = JSON.stringify(object);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat(\[
    cipher.update(json, 'utf8'),
    cipher.final(),
  \]);
  
  return `${iv.toString('base64')}:${encrypted.toString('base64')}`;
}
// 復号化関数
export function decrypt(encryptedData: string): EncryptDataType {
  const key = crypto.createHash('sha256').update(KEY\_STRING).digest();
  
  const \[ivBase64, encryptedBase64\] = encryptedData.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat(\[
    decipher.update(encrypted),
    decipher.final(),
  \]);
  
  return JSON.parse(decrypted.toString('utf8'));
}

---

## 🤖 アシスタント
*2025/3/27 11:12:43*

TypeScriptのコードをNode.jsの環境でコンソールから引数を渡して実行できるようにしますね。以下に必要な修正を加えたコードを作成します。


コードを作成しました。このスクリプトを使うと、コマンドラインから緯度・経度のデータを暗号化したり、暗号化されたデータを復号化したりできます。

## 使い方

### ファイルの準備
1. 上記のコードを `crypto-cli.ts` として保存します。
2. TypeScriptをコンパイルするために、必要に応じて `npm install -g typescript ts-node` を実行します。

### 暗号化の実行
緯度と経度を指定して暗号化します：
```bash
ts-node crypto-cli.ts encrypt 35.6812 139.7671
```

### 復号化の実行
暗号化された文字列を復号化します：
```bash
ts-node crypto-cli.ts decrypt "暗号化された文字列"
```

### 使用例
1. まず暗号化を実行：
   ```
   ts-node crypto-cli.ts encrypt 35.6812 139.7671
   ```
   これにより暗号化された文字列が出力されます。

2. その暗号化された文字列を使って復号化を実行：
   ```
   ts-node crypto-cli.ts decrypt "出力された暗号化文字列"
   ```
   すると元のデータ（緯度、経度、タイムスタンプ）が表示されます。

必要であれば、このスクリプトを更に拡張して、ファイルから読み込んだり、結果をファイルに保存したりする機能も追加できます。

---

## 👤 ユーザー
*2025/3/27 11:19:08*

鍵文字列を2つ用意したいdevとprdを引数にして切り替えをしたい。あとでprdの鍵文字列は連携します

---

## 🤖 アシスタント
*2025/3/27 11:19:42*

開発環境と本番環境で異なる鍵文字列を使えるように修正しますね。環境（dev/prd）を引数として受け取り、それに応じて鍵を切り替える機能を追加します。


コードを修正しました。これで開発環境と本番環境で異なる鍵を使用できます。

## 主な変更点

1. **環境別の鍵設定**
   ```typescript
   const ENV_KEYS = {
     dev: 'f93kdL02x!vB7@qZm#9Tws6Uo$YePn', // 開発環境用鍵
     prd: 'YOUR_PRODUCTION_KEY_HERE'        // 本番環境用鍵（後で設定）
   };
   ```

2. **関数に環境パラメータ追加**
   - `encrypt`と`decrypt`関数に環境パラメータを追加しました

3. **`--env`オプション**
   - コマンドラインから`--env`オプションで環境を指定できるようにしました
   - 指定しない場合は`dev`がデフォルトで使用されます

## 使用例

### 開発環境での実行
```bash
# 開発環境での暗号化（--envを省略するとdevがデフォルト）
ts-node crypto-cli.ts encrypt 35.6812 139.7671

# 明示的に開発環境を指定
ts-node crypto-cli.ts encrypt 35.6812 139.7671 --env dev

# 開発環境での復号化
ts-node crypto-cli.ts decrypt "暗号化された文字列" --env dev
```

### 本番環境での実行
```bash
# 本番環境での暗号化
ts-node crypto-cli.ts encrypt 35.6812 139.7671 --env prd

# 本番環境での復号化
ts-node crypto-cli.ts decrypt "暗号化された文字列" --env prd
```

準備ができましたら、PRD環境用の鍵文字列を`ENV_KEYS`オブジェクトの`prd`キーに設定してください。現在は`'YOUR_PRODUCTION_KEY_HERE'`というプレースホルダーになっています。

---

## 👤 ユーザー
*2025/3/27 11:20:59*

ありがとう。これをts-nodeでコンパイルをするしないについてよくわかっていない。

---

## 🤖 アシスタント
*2025/3/27 11:21:10*

TS-Nodeの使い方についてご説明しますね。TS-Nodeは、TypeScriptファイルを直接実行するためのツールで、事前にコンパイルする必要がなく便利です。

## TS-Nodeの基本

1. **インストール方法**
   ```bash
   # グローバルにインストール
   npm install -g ts-node typescript

   # または、プロジェクト内にインストール
   npm install --save-dev ts-node typescript
   ```

2. **実行方法**
   ```bash
   # グローバルインストールした場合
   ts-node crypto-cli.ts encrypt 35.6812 139.7671 --env dev

   # プロジェクト内にインストールした場合
   npx ts-node crypto-cli.ts encrypt 35.6812 139.7671 --env dev
   ```

## TS-Nodeのメリット

- TypeScriptファイルを直接実行できる（コンパイルのステップが不要）
- 開発時の迅速なテストに最適
- デバッグがしやすい

## 従来のコンパイル方法との比較

TS-Nodeを使わない場合は、以下の2ステップが必要です：

1. **コンパイル**
   ```bash
   tsc crypto-cli.ts
   # これにより crypto-cli.js が生成される
   ```

2. **実行**
   ```bash
   node crypto-cli.js encrypt 35.6812 139.7671 --env dev
   ```

## 本番環境での使用

開発時はTS-Nodeが便利ですが、本番環境では事前にコンパイルする方法が一般的です：

```bash
# コンパイル
tsc crypto-cli.ts

# コンパイル済みのJSファイルを実行
node crypto-cli.js encrypt 35.6812 139.7671 --env prd
```

コンパイル時のオプションを細かく設定したい場合は、`tsconfig.json`ファイルを作成して設定を記述できます。

必要であれば、package.jsonにスクリプトを追加して実行を簡単にすることもできます：

```json
{
  "scripts": {
    "start": "ts-node crypto-cli.ts",
    "build": "tsc crypto-cli.ts",
    "encrypt:dev": "ts-node crypto-cli.ts encrypt",
    "decrypt:dev": "ts-node crypto-cli.ts decrypt",
    "encrypt:prd": "ts-node crypto-cli.ts encrypt --env prd",
    "decrypt:prd": "ts-node crypto-cli.ts decrypt --env prd"
  }
}
```

これで使い方がより明確になりましたでしょうか？

---
