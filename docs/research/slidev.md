# Slidev 調査メモ

## 対象バージョン
- @slidev/cli: 52.11.5
- Node.js: >= 18.0.0

## CLI
- `slidev [entry]`: 開発サーバ起動（既定は `slides.md`）
- `slidev build [entry]`: SPAビルド（`--out` で出力先指定）
- `slidev export [entry]`: PDF/PPTX/PNG/MDのエクスポート
- `slidev format [entry]`: Markdown整形

## Export
- CLI exportは `playwright-chromium` が必要
- 既定のPDF出力は `slides-export.pdf`
- `--format` で `pdf | pptx | png | md` を指定
- `--output` でファイル名やディレクトリを指定
- `--with-clicks`, `--range`, `--timeout`, `--wait` が利用可能

## Theme と Addon
- headmatter に `theme` を指定して利用
- `addons` は配列で複数指定できる
- ローカルパス指定が可能（例: `../my-theme`）

## ディレクトリ構造の慣習
- `components/`, `layouts/`, `public/`, `setup/`, `styles/`, `snippets/`
- `styles/index.css` or `styles/index.ts` が自動注入される
- `public/` は `/` で配信される

## Markdown Syntax と Frontmatter
- `---` でスライド区切り
- 先頭frontmatterはheadmatterとして全体設定
- スライドごとにfrontmatterを持てる

## Importing Slides と frontmatter merge
- `src: ./pages/toc.md` で外部Markdownを取り込み
- `#2,5-7` でスライド範囲指定が可能
- frontmatterの重複はエントリ側が優先してマージされる

## Mermaid
- ` ```mermaid` ブロックで描画
- `setup/mermaid.ts` でテーマや `themeVariables` を指定
- ブロック側で `{theme: 'neutral', scale: 0.8}` の指定が可能

## 参照
- https://sli.dev/builtin/cli.md
- https://sli.dev/guide/exporting.md
- https://sli.dev/guide/syntax.md
- https://sli.dev/guide/theme-addon.md
- https://sli.dev/custom/directory-structure.md
- https://sli.dev/features/importing-slides.md
- https://sli.dev/features/frontmatter-merging.md
- https://sli.dev/features/mermaid.md
- https://sli.dev/custom/config-mermaid.md
