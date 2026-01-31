# OpenCode-Slidev-Template

1つのリポジトリで複数のSlidev資料を管理するためのテンプレートです。Web表示とPDFを主成果物にし、PPTXは例外用途とします。

## Quickstart
1. VS Codeで開く
2. Reopen in Container
3. `pnpm dev` で demo デッキを起動

## デッキ運用
- 新規作成: `pnpm deck:new mydeck minimal`
- 開発: `pnpm deck:dev mydeck`
- PDF出力: `pnpm deck:export:pdf mydeck`
- PPTX出力: `pnpm deck:export:pptx mydeck`（例外用途）
- ビルド: `pnpm deck:build mydeck`（`docs/build/mydeck` に出力）

デッキは `decks/<name>` に格納します。`slides.md` が入口で、`deck.yml` にメタ情報と出力先を持たせます。

## テンプレート・テーマ・アドオン
- `templates/` にテンプレートを追加
- `themes/` にテーマパッケージを追加
- `addons/` にアドオンパッケージを追加

詳細は `docs/usage/templates.md` を参照してください。

## Export
- PDFが標準出力（`playwright-chromium` が必要）
- PPTXは例外用途で、失敗時は出力先をディレクトリに切り替え

## Mermaid
- ` ```mermaid` ブロックで記述
- 共有設定は `mermaid.config.ts`
- 各デッキの `setup/mermaid.ts` で読み込み

詳しくは `docs/usage/mermaid.md` を参照してください。

## OpenCode コマンド

Deck:
- `/deck/new <deck> <template>`
- `/deck/dev <deck>`
- `/deck/build <deck>`
- `/deck/export_pdf <deck>`
- `/deck/export_pptx <deck>`
- `/deck/list`
- `/deck/validate`

Template:
- `/template/list`
- `/template/new_deck_template <name>`
- `/template/new_theme <name>`
- `/template/new_addon <name>`
- `/template/validate`

Mermaid:
- `/mermaid/insert <deck> <heading> <diagram>`
- `/mermaid/style`
- `/mermaid/extract <deck>`
- `/mermaid/validate <deck>`

## ドキュメント
- `docs/usage/quickstart.md`
- `docs/usage/templates.md`
- `docs/usage/mermaid.md`
- `docs/usage/troubleshooting.md`
