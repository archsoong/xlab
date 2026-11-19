# 2026-11-19 內容整理、第一版網站

## 做了什麼

- 掃描 `TEMP/`（1 份 PDF、6 份 Word 填報表、30 張照片）：沒有巨集、內嵌物件或程式碼
- PDF 只取第 1–15 頁，濃縮成網站版 [content/program.md](../../content/program.md)：12 段，刪去引用文獻、註腳、申請表欄位與寫給基金會的申請語氣；第 16 頁起的參考文獻與經費表未收錄
- 6 份填報表整理成 [content/labs/](../../content/labs/)：老師的介紹文字照原稿，只整理空白、分段，刪掉表單填寫提示
- 30 張照片縮成網頁尺寸放進 `assets/labs/`（最長邊 1600px，人像 1200px）；運動人文的照片原本是相機檔名，比對表單內嵌縮圖後改名
- 英雄實驗室的 8 則媒體報導，標題取自各報導頁面
- 第一版網站：`npm run build` 產出 8 頁（首頁、計畫介紹、6 個實驗室各一頁）

## 定案

- 聯絡資料照公開：Email、LINE ID、LINE 群組、Discord、校內分機都放；個人手機與學號不放。Email 本身是學號的照放
- 每個實驗室交來的照片全部放上它的頁面：30 張全部出現在對應的實驗室頁（build 後逐檔比對）
- 每個實驗室獨立一頁
- 視覺：暖紙色系的配色、字體與背景，版面語言自訂，見 [DESIGN.md](../design/DESIGN.md)
- 第一版版面萬事屋阿泰看過：「看起來不錯」
- 呆一布的主持人是蔡炎龍老師（填報表原寫李維倫院長）
- 運動人文三位主持人的照片照表單順序對應，確認無誤
- 「讓轉化發生的四個條件」直接寫全名，不用單字縮寫
- 獨立成 repo：GitHub repo `xlab`（本機資料夾仍叫 `xlab-website`）。先建成 private，但免費方案的 private repo 不能開 GitHub Pages（GitHub 回 422），改成 public
- 網站放 GitHub Pages：網址 https://archsoong.github.io/xlab/ ，每次 push 到 main 由 `.github/workflows/pages.yml` 自動建置發布；萬事屋阿泰確認後上線
- 平台的提案與聯絡信箱：kych@nccu.edu.tw，放在首頁「點子收發室」
- repo 公開後只放可以公開的東西：工作檔留在 `TEMP/`，不進 git

## 量到的數字（基準）

- 內容：計畫介紹 12 段；實驗室 6 個；照片 30 張
- `assets/labs/` 約 11MB，單張最大 1.1MB
- 版面在 1440px 與 390px 寬檢查過，390px 沒有橫向捲動

## 沒做的

- 待確認的資料見 [todos.md](../todos.md)
