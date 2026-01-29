# SEO & GEO 分析工具

一個強大的網站 SEO 和內容質量分析工具，基於 [Next.js](https://nextjs.org) 構建。

## 功能特性

- 📊 **SEO 分析**
  - Meta 標籤檢測（Title、Description）
  - 標題結構分析（H1、H2、H3）
  - 圖片 Alt 標籤檢查
  - 內部/外部連結計數
  - Open Graph 和 Schema.org 標記檢測
  - Robots 和 Viewport 配置

- 🧠 **GEO 分析**（Google E-E-A-T）
  - 結構化內容檢測
  - 常見問題（FAQ）識別
  - 清晰度評分
  - 可讀性分析
  - 引用指標檢查

- 📈 **綜合評分**
  - SEO 評分
  - GEO 評分
  - 整體評分
  - 改進建議

## 快速開始

### 開發環境

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用。

### 生產環境

```bash
npm run build
npm start
```

## 部署

### Vercel（推薦）

1. 前往 [vercel.com](https://vercel.com)
2. 導入此 GitHub 儲存庫
3. 選擇 `seo-analyzer` 為根目錄
4. 點擊部署

### Railway

1. 前往 [railway.app](https://railway.app)
2. 建立新專案
3. 連接 GitHub 儲存庫
4. 選擇 `seo-analyzer` 目錄
5. 設定 Start Command: `npm run build && npm start`

## API 端點

### POST /api/analyze

分析指定 URL 的 SEO 和 GEO 指標。

**請求：**
```json
{
  "url": "https://example.com"
}
```

**回應：**
```json
{
  "success": true,
  "seo": {},
  "geo": {},
  "score": {
    "seo": 85,
    "geo": 78,
    "overall": 82
  },
  "recommendations": []
}
```

## 技術棧

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Cheerio](https://cheerio.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 授權

MIT
