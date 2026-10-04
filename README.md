# HotelPick｜釜山海雲台住宿選手

給好友看的靜態比較網站。純 HTML/CSS/JS，沒有任何後端，也不需要編譯。

## 檔案結構

```
index.html              主頁（全部內容都在這一頁）
assets/style.css        樣式（含手機 / 平板 / 深色模式）
assets/app.js           相片燈箱 + 地圖
booking_photos_01/      選手 01 Banwol Poolvilla 的 15 張照片
booking_photos_02/      選手 02 UH Suite The Haeundae 的 17 張照片
住宿選手名單與資料.md     原始資料來源
```

## 在本機看

直接用瀏覽器打開 `index.html` 就可以（雙擊即可）。

## 分享給好友

把整個資料夾上傳到任何靜態空間都能用，不需要設定：

- **Netlify Drop** — 開 <https://app.netlify.com/drop>，把整個 `HotelSelect` 資料夾拖進去，馬上得到網址。最快。
- **Cloudflare Pages / Vercel** — 建立專案時選「上傳資料夾」，Build command 留空，輸出目錄填 `/`。
- **GitHub Pages** — push 到 repo 後在 Settings → Pages 選分支根目錄。

> 資料夾名稱有中文（`住宿選手名單與資料.md`）不影響網站運作；若上傳後想更乾淨，刪掉那個 .md 也沒關係。

## 網站內容

| 區塊 | 說明 |
|---|---|
| Hero | 兩間並排大卡，點了跳到各自的詳細區 |
| 快速比較 | 六個最關鍵的差異，左右對照 |
| 選手 01 / 02 | 價格、床型、設備、優點、位置、全部照片 |
| 位置地圖 | Leaflet + OpenStreetMap，兩個標點與連線 |
| 完整比較表 | 約 30 個項目逐條對照，有優勢的那格有底色 |
| 結論 | 價差拆解與排名建議 |

## 幾個設計上的決定

- **不放投票或表單**：你說討論在群組進行，所以網站上唯一的互動只有「點照片看大圖」。
- **手機優先**：照片兩欄、比較表三欄都在 360px 寬測試過，不會左右捲動。
- **自動深色模式**：跟著手機系統設定切換。
- **地圖會優雅降級**：沒有網路時會改顯示文字說明＋Google 地圖連結，不會變成一塊空白。

## 要改資料的話

價格、設備、優點這些都直接寫在 `index.html` 裡（搜尋數字就找得到），改完存檔重新整理即可。
照片只要丟進 `booking_photos_01/` 或 `02/`，再到 `index.html` 對應的 `<div class="gal">` 裡複製一行
`<button class="shot" ...>` 改檔名與說明文字就好。

地圖座標寫在 `assets/app.js` 最上面的 `SPOTS` 陣列。

## 外部資源

- 字型：Google Fonts（Noto Sans TC、Instrument Serif）
- 地圖：Leaflet 1.9.4 + OpenStreetMap 圖磚

這三個都從 CDN 載入。沒有網路時字型會退回系統字型、地圖會顯示替代說明，頁面其餘部分照常顯示。
