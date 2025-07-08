# Schemathesis v3 vs v4

日付: 2025-05-26

---

## 👤 ユーザー
*2025/05/27 01:20:40*

このライブラリのhttps://github.com/schemathesis/schemathesis v3とv4の違いを教えて欲しい。

---

## 🤖 アシスタント
*2025/05/27 01:22:43*

### ざっくりまとめ  
| 項目 | **v3（3.39 系＝安定版）** | **v4（4.0.0-alpha 系＝次世代）** |
| --- | --- | --- |
| 位置づけ | 安定 / CI 向け本番利用推奨 | **α版**。コアを全面書き直し中。「V4 ブランチは開発中、ドキュメント更新中」citeturn14search5 |
| コアエンジン | 従来エンジン | **エンジン全面刷新で高速化** – 大規模な内部構造変更citeturn11search0 |
| 設定方法 | ほぼ CLI フラグ。長いコマンドになりがち | **`schemathesis.toml` を新導入**。API 単位や operation 単位で細かく設定・環境変数展開も可能。CLI で上書き可citeturn10view0 |
| テストフェーズ | `explicit / generate / coverage (+shrink…)` | **新フェーズ体系** `examples / fuzzing / coverage (+reuse, shrink, target)` と `--phases` で制御。CLI から段階的に実行を切り替えやすくciteturn12view0 |
| 既定のチェック | 必要に応じて個別 ON | **すべてのチェックがデフォルトで有効**citeturn10view0 |
| レポート | `--junit-xml`, `--cassette-*` など個別 | **統一レポートシステム** `--report=<fmt>` / `--report-dir`。VCR, HAR, JUnit などを同一オプションで出力citeturn13view0 |
| CLI オプション | 歴史的経緯で増加、experimental フラグ多 | **大幅整理** - 多数の experimental フラグ削除、`--set-*` 系や `--cassette-format` など廃止。リネーム多数（例 `--generation-mode` → `--mode`）citeturn10view0turn13view0 |
| Python API | `schemathesis.runner.prepare()` が中心 | **`prepare` 廃止予定 → `runner.from_schema()` に統一**。スキーマのロード場所が明確にciteturn17view0 |
| 互換性 | Python 3.8 もサポート | v4 ブランチ全体で **Python ≥ 3.9 前提**（デコレータ API などが 3.9+ 固定） |
| ステータス | 3.39.16 が最新安定リリース（細かなバグ修正のみ）citeturn10view0 | α版は *alpha.11* までリリース。毎月ペースで破壊的変更入り…本番導入は要検証 |

---

### v4 の代表的ブレークポイント

```toml
# schemathesis.toml の最小例
base-url   = "https://api.example.com"

[parameters]          # 全 API 共通パラメータ
api_version = "v2"

[[operations]]        # 個別 Operation 用の上書き
include-name     = "GET /users"
request-timeout  = 5.0
```

* **CLI 変更例**  
  * v3  
    ```bash
    schemathesis run openapi.yaml --hypothesis-phases explicit,generate
    ```
  * v4  
    ```bash
    schemathesis run openapi.yaml --phases examples,fuzzing
    ```

* **削除されたオプションの代表**  
  * `--experimental*` 系 → 完全削除  
  * `--set-header/query/path/cookie` → TOML の `[parameters]` へ  
  * `--junit-xml` → `--report=junit`  
  * `--cassette-*` → `--report=vcr|har`  

---

### 移行ガイド（最小手順）

1. **検証環境で v4 をインストール**  
   ```bash
   pip install --upgrade "schemathesis>=4.0.0a"  # α版
   ```
2. 既存 CI ジョブを複製し、`schemathesis.toml` を追加。  
3. CLI オプションを上表の新名称に変換。  
4. Python テストの場合は `from_schema` へ書き換え。  
5. 現状足りない機能（GraphQL の一部 UI、pytest のフェーズ無効化 etc.）が必要なら v3 を併用。  
6. バージョン固定 (`pip install schemathesis~=3.39`) で本番を守りつつ、α を追随して差分検証。

---

### どちらを選ぶ？

* **今すぐ CI に安定運用したい** ➜ v3（3.39.x）  
* **設定ファイル中心に構成を簡潔にしたい / さらに高速化を狙いたい / 将来の機能を先取りしたい** ➜ v4 α を試行 → 問題がなければ正式リリース後に置き換え

&gt; α版は API・CLI がまだ変動中なので、固定リビジョンでテストを回し、破壊的変更が入ったら追従する運用がおすすめです。

---
