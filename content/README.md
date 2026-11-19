# 內容

網站上的字都從這裡來。改字改這裡，再跑 `npm run build`。

## 檔案

| 檔案 | 內容 | 來源 |
|---|---|---|
| [program.md](program.md) | 計畫介紹（網站版） | 仲尼基金提案 PDF 第 1–15 頁，濃縮改寫，刪去引用、註腳與申請表欄位 |
| [labs/01-green-care.md](labs/01-green-care.md) | 綠色照顧與生態倫理：冒險體驗教育 | 李維倫老師填報表 |
| [labs/02-ai-democracy.md](labs/02-ai-democracy.md) | AI 與民主共學讀書會 | 陳建綱老師填報表 |
| [labs/03-sport-humanities.md](labs/03-sport-humanities.md) | 運動人文共學實驗室 | 呂潔如老師填報表 |
| [labs/04-diveai.md](labs/04-diveai.md) | 呆一布共學實驗室 | 呆一布填報表 |
| [labs/05-open-nccu.md](labs/05-open-nccu.md) | Open NCCU 共學實驗室 | 陳宜秀老師填報表 |
| [labs/06-shero-lab.md](labs/06-shero-lab.md) | 英雄實驗室 | 英雄實驗室填報表 |

圖片在 `../assets/labs/<slug>/`，從 `../TEMP/` 原檔縮成網頁尺寸，原檔沒動。

## 寫法

- 每個實驗室檔案上方是結構化欄位（名稱、主持人、聯絡、連結、照片說明），下方是老師寫的介紹。介紹文字照原稿，只整理空白、標點與分段，並刪掉表單的填寫提示。
- 聯絡欄位：`name`、`role`、`email`、`line_id`、`line_group`、`discord`、`phone`，有填才顯示。
- `photos` 的第一張是實驗室頁的封面，也是首頁照片帶與索引的縮圖。
- `tagline`（一句話介紹）是從各實驗室介紹裡濃縮的，原稿沒有這一欄。
- 以 `#` 開頭的行是註記，不會出現在網站上。
- 還沒確認的資料列在 [../docs/todos.md](../docs/todos.md)。
