このファイルは表示確認用です。中身に意味はないので、ひととおり見て問題なければ削除して構いません（`lab/notes.json` からも該当ブロックを消してください）。

## 段落と強調

普通の段落はこう表示されます。**太字**、`インラインコード`、[リンク](https://kazukibass.github.io/)、~~打ち消し線~~ が使えます。

> 引用はこう表示されます。
> 複数行にまたがっても大丈夫です。

## リスト

- 箇条書き
- ネストもできます
  - 2段目
  - もう1つ
- 戻ってきた

1. 番号付き
2. 2つめ
3. 3つめ

- [x] 終わったこと
- [ ] これから

## コードブロック

```javascript
const notes = await fetch('notes.json').then(r => r.json());
const latest = notes.sort((a, b) => b.date.localeCompare(a.date))[0];
console.log(latest.title);
```

```python
def greet(name: str) -> str:
    return f"こんにちは、{name}さん"
```

## 表

| 項目 | 型 | 説明 |
|---|---|---|
| title | string | タイトル |
| tags | array | 絞り込み用のタグ |
| date | string | `YYYY-MM-DD` 形式 |

## 見出しの階層

### 小見出し

`##` と `###` が2つ以上あると、画面右に目次が出ます。スクロールすると現在地が光ります。

#### さらに小さい見出し

4段目まではスタイルを当ててあります。

---

区切り線の下も普通に書けます。
