# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要な指示

**すべての作業は日本語で行います**
- チャットの言語は日本語で、コードのコメントやREADMEの記述は英語で行います。

**作業完了時の処理**
- タスクの最後に必ず`bun run ci`コマンドを実行してCI全体をチェック
- その後、ユーザーへの報告時に音で通知
- 以下のコマンドを順番に実行：

```shell
bun run ci
play /System/Library/Sounds/Frog.aiff vol 0.5
```

## 必須確認事項

**TypeScript実装前の型安全確認**:
- **必ず最初に**: @tsconfig.base.json の型安全制御設定を確認
- **型安全性は最高レベル**: `strict: true`により`noImplicitAny`を含むすべての厳格な型チェックが有効
- **よくある間違い**: エクスポートする関数・クラスの戻り値型や引数型の明示的な型注釈を忘れがち
- **注意**: このプロジェクトは型安全設定を採用しており、一般的なプロジェクトより遥かに厳格です

## Requirements

- **Node.js**: v24 以上
- **bun**: 最新版
