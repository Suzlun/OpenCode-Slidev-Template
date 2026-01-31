# OpenCode 調査メモ

## Skills 探索パスと探索方式
- Project: `.opencode/skills/<name>/SKILL.md`
- Global: `~/.config/opencode/skills/<name>/SKILL.md`
- Claude互換: `.claude/skills/<name>/SKILL.md`, `~/.claude/skills/<name>/SKILL.md`
- 現在の作業ディレクトリからGitルートまで探索

## SKILL frontmatter
- 必須: `name`, `description`
- 任意: `license`, `compatibility`, `metadata`
- `name` は `^[a-z0-9]+(-[a-z0-9]+)*$`

## Commands 保存場所とプレースホルダ仕様
- Project: `.opencode/commands/*.md`
- Global: `~/.config/opencode/commands/*.md`
- `$ARGUMENTS` で引数全体
- `$1`, `$2` で位置引数
- シェル出力の埋め込み: `!` + \`command\`（例: !\`git status\`）
- `@path` でファイル内容を埋め込み

## 参照
- https://opencode.ai/docs/skills/
- https://opencode.ai/docs/commands/
