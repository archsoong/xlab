# CLAUDE.md

xlab-website 是國立政治大學 X 實驗學院「共學實驗室」專區的靜態網站：介紹「共學實驗室平台」這個計畫，並替每個共學實驗室各做一頁。GitHub 上是 public repo `xlab`，網站用 GitHub Pages 發布在 https://archsoong.github.io/xlab/ （`.github/workflows/pages.yml`）。repo 是公開的：只放可以公開的東西，原始檔與工作檔留在 `TEMP/`。

## 結構

| 位置 | 內容 |
|---|---|
| `content/` | 網站上所有文字的來源（md）。改字改這裡 |
| `assets/labs/<slug>/` | 網頁尺寸的照片 |
| `src/style.css` | 樣式 |
| `scripts/build.mjs` | `content/` + `assets/` + `src/style.css` → `dist/`（`npm run build`） |
| `dist/` | 產出的網站，不進 git |
| `TEMP/` | 各實驗室交來的原始檔（PDF、Word、原尺寸照片）與設計工作檔，不進 git |
| `docs/design/DESIGN.md` | 設計決策 |

## 規則

- 網站上的字只來自 `content/`，而 `content/` 只寫有來源的內容。新資料先放 `TEMP/`，整理進 `content/` 時在 frontmatter 的 `source` 註明出處。
- 實驗室交來的聯絡資料照公開：Email、LINE ID、LINE 群組、Discord、校內分機都放。個人手機與學號不放。（萬事屋阿泰 2026-11-19）
- 每個實驗室交來的照片全部放上它的頁面。（萬事屋阿泰 2026-11-19）build 後確認 `assets/labs/<slug>/` 每個檔案都出現在 `dist/labs/<slug>/index.html`。
- 視覺照 `docs/design/DESIGN.md`：配色、字體、紙色背景，以及平面、細線分區的版面語言。
- 連結一律用相對路徑並寫到 `index.html`，讓 `dist/` 直接開檔、或放在任何子路徑都能用。
- 中文頁面保留 `text-spacing-trim: space-all`（台灣排版：全形標點佔滿一格）。

## 語言

- 網站與文件：繁體中文
- 程式註解、commit 訊息：英文

## 工作方式

- 待辦只寫在 `docs/todos.md`；做完的寫成 `docs/changelog/YYYY-MM-DD_主題.md`，並在 `docs/CHANGELOG.md` 加一行
- commit 與 push 在這個 repo 自己的 session 做
