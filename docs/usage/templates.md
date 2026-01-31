# Templates

## templates
- `templates/<name>` は `slides.md` と `deck.yml` を持つ
- `public/` はテンプレ固有の静的アセット
- `pnpm template:list` で一覧

## themes
- `themes/<name>` はテーマパッケージ
- 必須: `package.json`, `styles/index.css`, `layouts/default.vue`
- demo デッキで動作確認する

## addons
- `addons/<name>` はアドオンパッケージ
- 必須: `package.json`, `styles/index.css`
- demo デッキで動作確認する

## 追加フロー
1. テンプレ/テーマ/アドオンを作成
2. demo デッキで動作確認
3. `pnpm template:validate`
