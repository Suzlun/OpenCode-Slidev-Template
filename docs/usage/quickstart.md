# Quickstart

## Dev Container
1. VS Codeでリポジトリを開く
2. Reopen in Container
3. `postCreateCommand` 完了を待つ
4. `pnpm dev` で demo デッキを起動

## 新規デッキの作成
1. `pnpm deck:new mydeck minimal`
2. `pnpm deck:dev mydeck`
3. `pnpm deck:export:pdf mydeck`

## ビルド
- `pnpm deck:build mydeck` で `docs/build/mydeck` に出力
