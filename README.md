# 共學實驗室網站（xlab-website）

國立政治大學 X 實驗學院「共學實驗室」專區的靜態網站。首頁介紹共學實驗室平台與六個實驗室，另有計畫介紹頁，每個實驗室各一頁。

## 現況（2026-11-19）

- 內容：計畫介紹（仲尼基金提案第 1–15 頁濃縮）與 6 個實驗室，從各實驗室的填報表整理，見 [content/](content/)
- 內容頁：第一版，共 8 頁（首頁、計畫介紹、6 個實驗室），版面萬事屋阿泰已看過
- GitHub：public repo [archsoong/xlab](https://github.com/archsoong/xlab)（本機資料夾叫 `xlab-website`）
- 網站：https://archsoong.github.io/xlab/ （GitHub Pages）。每次 push 到 main，`.github/workflows/pages.yml` 會自動建置發布

## 怎麼用

```bash
npm run build          # content/ + assets/ + src/style.css → dist/
open dist/index.html   # 直接開檔就能看
```

## 文件

- [docs/todos.md](docs/todos.md)：還沒做的事
- [docs/design/DESIGN.md](docs/design/DESIGN.md)：設計決策
- [content/README.md](content/README.md)：內容檔案與寫法
- [docs/CHANGELOG.md](docs/CHANGELOG.md)：做完的批次
