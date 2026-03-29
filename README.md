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

- 連絡先メール：`index.html` / `enterprise.html` / `representative.html` 内の `daichi.kessoku@baseally.jp`
- 文章・提供形態・参加条件などの詳細は、運用に合わせて調整してください
- 代表写真：`assets/representative-placeholder.svg` を差し替えるか、`representative.html` の画像パスを変更してください
  - CMS運用にする場合は、`content/site.json` の `representativePhoto` が更新されます
- ヒーロー画像：`assets/hero.jpg` を配置すると自動で差し替わります（`styles.css` の `.hero::before`）
- サイトアイコン（ファビコン/スマホ用アイコン）：
  - 使いたい写真を用意して `scripts/generate-icons.sh` で各サイズを生成します（中央を基準に正方形へトリミングされます）
  - 例：`bash scripts/generate-icons.sh /path/to/your/photo.jpg`
  - 生成されるファイル：`assets/icon-16.png` / `assets/icon-32.png` / `assets/icon-48.png` / `assets/apple-touch-icon.png` / `assets/icon-192.png` / `assets/icon-512.png`
  - 反映されない場合：ブラウザの強制再読み込み（Chrome: `Cmd+Shift+R` / Safari: 履歴とWebサイトデータ削除）を試してください

## ページ

- トップ：`index.html`
- 企業向け：`enterprise.html`
- 代表詳細：`representative.html`

## 非エンジニア向け編集（管理画面 `/admin`）

このリポジトリには Decap CMS（旧 Netlify CMS）用の `admin/` を同梱しています。
ただし、現在はローカルでの編集・確認を優先するため、ページ側で `content/site.json` を自動読み込みして上書きする処理は無効化しています。
（HTMLを編集すれば、そのまま表示に反映されます）

### 前提（おすすめ）

- GitHub にリポジトリを置く
- Netlify にデプロイする（Git連携）

### Netlify 側の設定手順（概要）

1) Site settings で Git 連携してデプロイ
   - 本リポジトリには `netlify.toml` を同梱しているため、Publish ディレクトリはリポジトリ直下（`.`）に固定されます
2) Identity を有効化
3) Identity の設定で Git Gateway を有効化
4) 招待したユーザーだけがログインできるようにする（Invite で追加）

### 使い方

- 管理画面：`/admin`（例：`https://<your-site>.netlify.app/admin/`）
- 管理画面での編集は `content/site.json` に保存されます（※ページ側への自動反映は現状OFF）
