# コントリビューション

## 開発環境のセットアップ

```bash
# 依存関係のインストール
bun install

# すべてのチェックを実行
bun run ci
```

## スクリプト

| コマンド            | 説明               |
| ------------------- | ------------------ |
| `bun run build`     | バイナリをビルド   |
| `bun run typecheck` | 型チェック         |
| `bun run lint`      | リントと修正       |
| `bun test`          | テストを実行       |
| `bun run ci`        | すべてのCIチェック |

## プルリクエストプロセス

1. リポジトリをフォークしてクローン
2. 機能ブランチを作成
3. 変更を加える
4. `bun run ci`を実行
5. プルリクエストを送信

## コミットメッセージのガイドライン

[Conventional Commits](https://www.conventionalcommits.org/)を使用してください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメントの変更
- `chore:` メンテナンスタスク
- `test:` テストの更新

例：`feat: 新しいチャット形式のサポートを追加`