---
name: mermaid
description: Mermaid syntax, theming, and Slidev integration guidance
compatibility: opencode
---
## 目的
- Mermaidの基本記法と運用を統一する

## よく使う図
- flowchart
- sequenceDiagram
- classDiagram
- stateDiagram-v2
- gantt
- timeline

## Slidevでの使い方
- ` ```mermaid` ブロックで描画
- `setup/mermaid.ts` でテーマを共通化
- `themeVariables` で配色や変数を調整

## 推奨運用
- デッキ内に直接埋め込む
- 共有テーマはリポジトリ規約に従う
