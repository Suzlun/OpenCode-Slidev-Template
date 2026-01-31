# Dev Container 調査メモ

## devcontainer.json 主要プロパティ
- `name`: 表示名
- `image`: ベースイメージ
- `forwardPorts`: ポートフォワード
- `postCreateCommand`: コンテナ初回セットアップ
- `customizations`: ツール固有の設定（VS Code拡張など）
- `features`: Dev Container Features を追加

## Lifecycle
- `onCreateCommand`, `updateContentCommand`, `postCreateCommand` の順で実行
- コマンドはコンテナ内で実行される

## 参照
- https://containers.dev/implementors/json_reference/
