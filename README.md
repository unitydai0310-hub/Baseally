# Baseally Official Website

Baseallyの公式ホームページ（静的サイト）です。

## ローカルでの確認

### そのまま開く（最短）

- `index.html` をブラウザで開きます（ダブルクリックでもOK）

### npmで開く（`npm run dev`）

```bash
npm run dev
```

### ローカルサーバーで開く（推奨）

1) このリポジトリ直下で実行

```bash
python3 -m http.server 8000
```

2) ブラウザで開く

- `http://localhost:8000`

## 差し替えポイント

- 連絡先メール：`index.html` 内の `daichi.kessoku@baseally.jp`
- 文章・提供形態・参加条件などの詳細は、運用に合わせて調整してください
- 代表写真：`assets/representative-placeholder.svg` を差し替えるか、`representative.html` の画像パスを変更してください
  - CMS運用にする場合は、`content/site.json` の `representativePhoto` が更新されます

## ページ

- トップ：`index.html`
- 代表詳細：`representative.html`

## 非エンジニア向け編集（管理画面 `/admin`）

このサイトは、Decap CMS（旧 Netlify CMS）を使ってフォーム入力で編集できる構成にしています。
編集内容は Git にコミットされ、サイト側は `content/site.json` を読み込んで反映します。

### 前提（おすすめ）

- GitHub にリポジトリを置く
- Netlify にデプロイする（Git連携）

### Netlify 側の設定手順（概要）

1) Site settings で Git 連携してデプロイ
2) Identity を有効化
3) Identity の設定で Git Gateway を有効化
4) 招待したユーザーだけがログインできるようにする（Invite で追加）

### 使い方

- 管理画面：`/admin`（例：`https://<your-site>.netlify.app/admin/`）
- 変更は `content/site.json` に保存されます
