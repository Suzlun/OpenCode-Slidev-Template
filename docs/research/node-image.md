# Node 公式イメージ調査メモ

## 推奨タグ
- `node:<version>` がデフォルト推奨（buildpack-deps ベース）
- `node:slim` は最小構成で、サイズ重視時に推奨
- `node:bookworm` は Debian 12 ベース

## 本リポジトリの採用
- Node 24: `node:24-bookworm-slim`

## 参照
- https://github.com/nodejs/docker-node/blob/main/README.md
