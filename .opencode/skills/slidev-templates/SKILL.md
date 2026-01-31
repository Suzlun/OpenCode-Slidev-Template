---
name: slidev-templates
description: Manage multiple deck templates, themes, and addons in one repo
compatibility: opencode
---
## 目的
- decksとtemplatesの運用契約を守る
- themesとaddonsのパッケージ構造を維持する

## デッキテンプレの契約
- `templates/<name>` は `slides.md` と `deck.yml` を持つ
- `public/` はテンプレの静的アセット置き場
- テンプレ適用はコピーで完結

## Themesの契約
- `themes/<theme>` は `package.json` と `styles/` と `layouts/` が必須
- パッケージ名は `slidev-theme-` で始める

## Addonsの契約
- `addons/<addon>` は `package.json` と `styles/` が必須
- パッケージ名は `slidev-addon-` で始める

## 命名規約
- 英小文字とハイフンで統一
- ディレクトリ名とpackage.jsonのnameを一致させる

## 互換性
- 既存デッキが壊れない変更を優先
- 破壊的変更はテンプレ側の新バージョンとして追加
