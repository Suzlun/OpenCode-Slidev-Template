---
name: slidev
description: Slidev deck workflow, CLI usage, export rules, and project conventions
compatibility: opencode
---
## 目的
- SlidevのCLI運用とデッキ構成の標準を守って作業する

## 使いどころ
- 新規デッキの作成、修正、export
- theme/addonの指定やローカルパス運用
- Mermaidやスライド分割の取り込み

## CLI
- `slidev [entry]` で開発サーバ起動（既定 `slides.md`）
- `slidev build [entry]` でSPAビルド
- `slidev export [entry]` でPDF/PPTX/PNG/MD
- `@slidev/cli` のため `npx slidev` は非推奨

## Export
- CLI exportは `playwright-chromium` が必要
- 既定PDFは `slides-export.pdf`
- `--format pptx | png | md` を利用可能

## ThemeとAddon
- headmatterで `theme` を明示
- `addons` は配列で複数指定
- ローカルパス指定が可能

## ディレクトリ構造
- `components/`, `layouts/`, `public/`, `setup/`, `styles/` を利用
- `styles/index.css` または `styles/index.ts` が自動注入

## MarkdownとFrontmatter
- `---` でスライド区切り
- 先頭のheadmatterで全体設定
- スライドごとのfrontmatterも利用可能

## Importing Slides
- `src: ./path.md` で外部Markdownを取り込み
- `#2,5-7` のように範囲指定が可能
- frontmatterはエントリ側が優先されてマージされる

## Mermaid
- ` ```mermaid` ブロックで描画
- `setup/mermaid.ts` でテーマや変数を設定

## Assets
- `public/` 配下は `/` で配信される
- 相対パスは `slides.md` の場所から解決される
