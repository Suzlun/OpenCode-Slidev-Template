# Troubleshooting

## PDF/PPTX exportが失敗する
- `playwright-chromium` が未導入の可能性
- devcontainerなら `pnpm dlx playwright install --with-deps chromium` を再実行

## PPTXが生成できない
- `--output` をディレクトリ指定に切り替える
- `pnpm deck:export:pptx <deck>` 失敗時はログの代替手順を参照

## 絵文字が欠ける
- Linux環境でフォント不足の可能性
- Noto Emojiなどのフォントを導入

## アセットのパスが崩れる
- `public/` 配下は `/` 起点で参照される
- 相対パスは `slides.md` の場所から解決される
