# 雲端部署指南

本指南將幫助您將 Moltbot 部署到雲端，實現 24/7 運行，即使本機關機也能繼續使用。

## 🌐 部署選項

### 選項 1: Railway (最簡單) ⭐️ 推薦

**優點**：
- 免費額度充足
- 自動部署
- 內建環境變數管理
- 簡單易用

**步驟**：

1. **註冊 Railway**
   - 前往 [railway.app](https://railway.app)
   - 使用 GitHub 帳號登入

2. **創建新專案**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇 `flpliao/moltbot`

3. **配置環境變數**
   - 在 Railway 專案設定中添加：
   ```
   PORT=18789
   GATEWAY_AUTH_TOKEN=your-secure-token-here
   NODE_ENV=production
   ```

4. **部署設定**
   - Start Command: `bash start.sh`
   - 等待部署完成

5. **配置 WhatsApp**（首次）
   - 使用 Railway 的 Shell 功能
   - 執行: `moltbot channels login`
   - 掃描 QR Code

---

### 選項 2: Render

**優點**：
- 免費方案
- 自動 SSL
- 簡單配置

**步驟**：

1. 前往 [render.com](https://render.com)
2. 創建新的 "Web Service"
3. 連接 GitHub 儲存庫
4. 設定：
   - Build Command: `npm install -g moltbot@latest`
   - Start Command: `bash start.sh`
   - Environment: `PORT=18789`

---

### 選項 3: VPS (完全控制)

**推薦服務商**：
- DigitalOcean ($6/月)
- Linode ($5/月)
- AWS Lightsail ($3.5/月)

**部署步驟**：

```bash
# 1. SSH 連接到 VPS
ssh root@your-vps-ip

# 2. 更新系統
apt update && apt upgrade -y

# 3. 安裝 Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

# 4. 安裝 PM2 (進程管理器)
npm install -g pm2

# 5. Clone 專案
git clone https://github.com/flpliao/moltbot.git
cd moltbot

# 6. 安裝 Moltbot
curl -fsSL https://molt.bot/install.sh | bash

# 7. 執行 onboarding (首次設定)
moltbot onboard

# 8. 配置 WhatsApp
moltbot channels login
# 掃描 QR Code

# 9. 使用 PM2 啟動並保持運行
pm2 start "moltbot gateway --port 18789" --name moltbot
pm2 save
pm2 startup

# 10. 查看日誌
pm2 logs moltbot
```

---

## 📱 WhatsApp 連接到雲端

### 重要提示

⚠️ **WhatsApp 連接需要注意**：
- WhatsApp 一次只能連接到一個設備
- 如果您在本機和雲端同時運行，會互相衝突
- 建議只在雲端運行

### 遷移步驟（從本機到雲端）

1. **備份本機配置**
   ```bash
   # 在本機執行
   cd ~/.clawdbot
   tar -czf clawdbot-backup.tar.gz clawdbot.json credentials/
   ```

2. **上傳配置到 VPS**（僅 VPS 方案）
   ```bash
   # 在本機執行
   scp clawdbot-backup.tar.gz root@your-vps-ip:/root/
   
   # 在 VPS 上執行
   cd ~/.clawdbot
   tar -xzf ~/clawdbot-backup.tar.gz
   ```

3. **停止本機 Gateway**
   ```bash
   clawdbot daemon stop
   ```

4. **在雲端重新登入 WhatsApp**
   ```bash
   # 在雲端運行
   moltbot channels login
   # 掃描新的 QR Code
   ```

---

## 🔐 安全設定

### 1. 設定訪問控制

編輯配置只允許信任的號碼：

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": [
        "+886915388897",  // 您的號碼
        "+886912345678"   // 其他信任的號碼
      ]
    }
  }
}
```

### 2. 啟用 Gateway 認證

```bash
# 生成安全 token
export GATEWAY_AUTH_TOKEN=$(openssl rand -hex 32)

# 配置使用 token
moltbot configure
```

### 3. 使用 Tailscale（進階）

[Tailscale](https://tailscale.com) 可以創建私有網絡：

```bash
# 安裝 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 啟動
tailscale up

# 配置 Moltbot 使用 Tailscale
```

---

## 🛠️ 維護指令

### 查看狀態
```bash
clawdbot channels status
clawdbot doctor
```

### 重啟服務

**Railway/Render**: 在控制台點擊 "Restart"

**VPS with PM2**:
```bash
pm2 restart moltbot
pm2 logs moltbot
```

### 更新 Moltbot
```bash
moltbot update
pm2 restart moltbot
```

### 查看日誌

**VPS**:
```bash
pm2 logs moltbot --lines 100
```

**Railway**: 在控制台查看 Logs

---

## 🆘 常見問題

### Q: WhatsApp 斷線了怎麼辦？
A: 執行 `moltbot channels login` 重新掃描 QR Code

### Q: 如何確保服務一直運行？
A: 
- Railway/Render: 自動重啟
- VPS: 使用 PM2 進程管理器

### Q: 可以同時在本機和雲端運行嗎？
A: 不可以，WhatsApp 一次只能連接一個設備

### Q: 費用大概多少？
A: 
- Railway: 免費額度足夠輕度使用
- Render: 免費方案（有限制）
- VPS: $3-6/月

---

## 📊 效能建議

**最低配置**：
- RAM: 512MB
- CPU: 1 core
- 儲存: 10GB

**推薦配置**：
- RAM: 1GB+
- CPU: 2 cores
- 儲存: 20GB

---

## 🔗 相關資源

- [Moltbot 官方文檔](https://docs.molt.bot)
- [遠程 Gateway 設定](https://docs.molt.bot/gateway/remote)
- [Railway 文檔](https://docs.railway.app)
- [PM2 文檔](https://pm2.keymetrics.io)
