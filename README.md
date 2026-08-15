# kazukibass.github.io

自作Webツールと学習メモのランディングページ。**https://kazukibass.github.io/**

ビルド工程なし。ファイルを置いて push すれば数十秒で反映されます。

## 構成

```
.
├── index.html            トップページ
├── favicon.svg
├── .nojekyll             Jekyll の自動処理を止める（消さないこと）
├── assets/
│   ├── base.css          配色トークンと共通部品（全ページ共通）
│   ├── theme.js          ライト/ダーク切替（全ページ共通）
│   └── vendor/           marked.js / DOMPurify（同梱・CDN不要）
└── lab/
    ├── index.html        ノート一覧（検索・タグ絞り込み）
    ├── viewer.html       Markdown を表示するビューア
    ├── notes.json        ノートの目録 ← ここに追記する
    └── notes/            Markdown 本体を置く場所
```

各ツール（Kanpe / FlowDraft）は別リポジトリです。このリポジトリはトップページとノート置き場だけを持ちます。

## 公開設定

リポジトリ名が `<ユーザー名>.github.io` であることがユーザーサイトの条件です。

- Settings → Pages → Source: `main` / `/ (root)`
- 各ツールは `https://kazukibass.github.io/<リポジトリ名>/` としてサブパスに共存します

---

## ノートを追加する

**Markdown を置いて、`lab/notes.json` に1ブロック足すだけ。HTMLへの変換は不要です。**

1. `.md` ファイルを `lab/notes/` に置く
2. `lab/notes.json` の配列に項目を追加する

```json
{
  "title": "CSSのz-indexが効かないとき",
  "desc": "スタッキングコンテキストの話",
  "file": "notes/z-index.md",
  "type": "md",
  "tags": ["CSS", "レイアウト"],
  "date": "2026-08-20"
}
```

| キー | 必須 | 内容 |
|---|---|---|
| `title` | 必須 | 一覧に出るタイトル |
| `file` | 必須 | `lab/` から見た相対パス |
| `type` | 必須 | `md`（Markdown）または `html`（変換済み） |
| `desc` | 任意 | 一行説明 |
| `tags` | 任意 | 絞り込み用。いくつでも |
| `date` | 任意 | `YYYY-MM-DD`。新しい順に並ぶ |

末尾の項目に余分なカンマを付けると JSON が壊れ、一覧が空になります。

### すでにHTML化したものを置く場合

`"type": "html"` にすると、ビューアを通さず直接リンクします。共通の配色を当てたい場合は、そのHTMLの `<head>` に次を追加してください。

```html
<link rel="stylesheet" href="../../assets/base.css">
<script src="../../assets/theme.js"></script>
```

### 仕様メモ

- 対応記法は GitHub Flavored Markdown（表・チェックリスト・打ち消し線など）
- `##` / `###` が2つ以上あると、画面右に目次が自動生成される
- `notes.json` に登録されていないファイルはビューアで開けない（任意のパスを読ませないため）
- 描画前に DOMPurify を通している
- marked.js と DOMPurify はリポジトリに同梱。CDN に依存せず、オフラインでも動く

### 公開範囲について

`lab/` 以下には `noindex` を入れて検索避けをしていますが、**非公開ではありません**。URLを知っていれば誰でも読めます。人に見せたくない内容は置かないこと。

---

## トップページを編集する

### ツールを追加する

`index.html` の `<section id="tools">` 内の `<article class="card">` をコピーし、以下を書き換えます。

- `.ico` の中の SVG（アイコン）
- `<h3>` … ツール名
- `<p class="role">` … 一行説明
- `<p class="desc">` … 本文
- `.chips` の `<span class="chip">` … 機能タグ（増減自由）
- `.card-act` の2つのリンク（公開URL / リポジトリURL）
- `.badge` … `b-live`（公開中）/ `b-wip`（開発中）/ `b-arc`（アーカイブ）

`.sec-hd` の `<span class="cnt">` にある件数の更新も忘れずに。

### リポジトリ行を追加する

`<ul class="repos">` 内の `<li>` をコピーし、リポジトリ名・説明・言語タグ・リンク先を書き換えます。

### 配色を変える

`assets/base.css` の先頭にある `:root`（ライト）と `html[data-theme="dark"]`（ダーク）の2ブロックだけを書き換えれば、全ページに反映されます。アクセントカラーは `--accent` / `--accent-fg` / `--accent-soft` の3つ。

## テーマ切替の挙動

1. 初回は OS の設定（`prefers-color-scheme`）に従う
2. ヘッダー右上のボタンで手動切替
3. 選択は `localStorage` に保存され、次回以降そちらが優先（使えない環境ではメモリにフォールバック）
4. 手動で選ぶまでは OS 側の変更にリアルタイムで追従

## ローカルで確認する

`file://` で開くと `fetch` がブロックされるため、簡易サーバーを立てて確認します。

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

## ライセンス

コンテンツの著作権は kazuki に帰属します。同梱ライブラリはそれぞれ MIT / Apache-2.0 です。
