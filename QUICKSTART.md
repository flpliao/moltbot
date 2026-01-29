# 🚀 Moltbot 雲端部署 - 快速參考

## 📦 GitHub 儲存庫
https://github.com/flpliao/moltbot

---

## ⚡ Railway 快速部署（推薦）

### 1️⃣ 部署專案
```
1. 前往 https://railway.app
2. 使用 GitHub 登入
3. New Project → Deploy from GitHub
4. 選擇 flpliao/moltbot
```

### 2️⃣ 設定環境變數
```bash
PORT=18789
NODE_ENV=production
```

### 3️⃣ 配置 WhatsApp
在 Railway Shell 中執行：
```bash
curl -fsSL https://molt.bot/install.sh | bash
moltbot channels login
# 掃描 QR Code
```

---

## 💻 VPS 快速部署

### 一鍵安裝腳本
```bash
# 安裝 Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

# 安裝 PM2
npm install -g pm2

# Clone & Setup
git clone https://github.com/flpliao/moltbot.git
cd moltbot
curl -fsSL https://molt.bot/install.sh | bash

# WhatsApp 設定
moltbot onboard
moltbot channels login  # 掃描 QR Code

# 啟動服務
pm2 start "moltbot gateway --port 18789" --name moltbot
pm2 save
pm2 startup
```

---

## 📱 WhatsApp 遷移

### 從本機到雲端
```bash
# 1. 停止本機
clawdbot daemon stop

# 2. 在雲端重新登入
moltbot channels login
# 掃描新 QR Code
```

---

## 🔧 常用指令

```bash
# 查看狀態
clawdbot channels status

# 重啟 Gateway
clawdbot daemon restart

# 健康檢查
clawdbot doctor

# PM2 (VPS)
pm2 logs moltbot
pm2 restart moltbot
```

---

## 📊 費用參考

| 平台 | 費用 | 推薦度 |
|------|------|--------|
| Railway | 免費 (有限額) | ⭐⭐⭐⭐⭐ |
| Render | 免費 (有限制) | ⭐⭐⭐⭐ |
| DigitalOcean | $6/月 | ⭐⭐⭐⭐⭐ |
| Linode | $5/月 | ⭐⭐⭐⭐ |

---

## 🆘 故障排除

### WhatsApp 斷線
```bash
moltbot channels login
# 重新掃描 QR Code
```

### Gateway 無法啟動
```bash
# 檢查配置
clawdbot doctor --fix

# 查看日誌
clawdbot gateway logs
```

### 更新 Moltbot
```bash
moltbot update
pm2 restart moltbot  # VPS only
```

---

## 📚 完整文檔

- README: `/README.md`
- 部署指南: `/DEPLOYMENT.md`
- 官方文檔: https://docs.molt.bot

---

**完成後您的 WhatsApp AI 助理將 24/7 在雲端運行！**
