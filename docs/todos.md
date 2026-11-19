# 待辦

只放還沒做完的事，依優先順序。做完的移到 `changelog/`。

1. 上線：萬事屋阿泰確認之後，執行 workflow（`gh workflow run pages.yml`），確認 https://archsoong.github.io/xlab/ 打得開，再把 `.github/workflows/pages.yml` 改成每次 push 到 main 自動部署
2. 補上平台本身的提案與聯絡方式；首頁「點子收發室」目前顯示「聯絡方式待確認」
3. 請各實驗室確認「一句話介紹」（frontmatter 的 `tagline`）；原表單沒有這一欄，是從介紹文字濃縮的
4. 部署前把照片轉成較小的格式；目前 `assets/labs/` 共約 11MB，最大一張 1.1MB
