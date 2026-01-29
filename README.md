# Moltbot - Personal AI Assistant

這是一個基於 [Moltbot](https://github.com/moltbot/moltbot) 的個人 AI 助理部署，可以透過 WhatsApp、Telegram 等多個通訊平台與 AI 互動。

## 🚀 功能特色

- ✅ **WhatsApp 整合**：透過 WhatsApp 與 AI 助理對話
- ✅ **多模型支援**：支援 Claude、GPT、Gemini 等多種 AI 模型
- ✅ **雲端部署**：可部署到 Railway、Render 或 VPS 實現 24/7 運行
- ✅ **安全配對機制**：DM pairing 確保只有授權用戶可以使用

## 📦 安裝需求

- Node.js >= 24
- pnpm >= 10 或 npm

## 🔧 本地安裝

```bash
# 安裝 Moltbot
curl -fsSL https://molt.bot/install.sh | bash

# 或使用 npm
npm install -g moltbot@latest

# 啟動 onboarding 精靈
moltbot onboard --install-daemon
```

## ☁️ 雲端部署

### 選項 1: Railway (推薦)

1. Fork 這個儲存庫
2. 在 [Railway](https://railway.app) 創建新項目
3. 連接您的 GitHub 儲存庫
4. 設定環境變數（見下方）
5. 部署！

### 選項 2: Render

1. 在 [Render](https://render.com) 創建新的 Web Service
2. 連接此儲存庫
3. 設定啟動命令：`npm start`
4. 配置環境變數

### 選項 3: VPS (DigitalOcean, Linode, AWS)

```bash
# SSH 到您的 VPS
ssh user@your-vps-ip

# 安裝 Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone 儲存庫
git clone https://github.com/flpliao/moltbot.git
cd moltbot

# 安裝 Moltbot
curl -fsSL https://molt.bot/install.sh | bash

# 配置並啟動
moltbot onboard
```

## 🔐 環境變數配置

創建 `.env` 檔案或在雲端平台設定以下環境變數：

```bash
# Moltbot Gateway
GATEWAY_PORT=18789
GATEWAY_AUTH_TOKEN=your-secure-token

# AI 模型 (選擇一個)
# Anthropic Claude
ANTHROPIC_API_KEY=your-api-key

# 或 Google/Antigravity
GOOGLE_ANTIGRAVITY_EMAIL=your-email@gmail.com

# WhatsApp (會在首次登入時自動配置)
WHATSAPP_ENABLED=true
WHATSAPP_DM_POLICY=pairing
```

## 📱 WhatsApp 連接

1. 執行 `clawdbot channels login`
2. 掃描 QR Code
3. 完成配對！

## 🛠️ 常用指令

```bash
# 查看狀態
clawdbot channels status

# 重啟 Gateway
clawdbot daemon restart

# 健康檢查
clawdbot doctor

# 查看日誌
clawdbot gateway logs
```

## 📚 文檔

- [官方文檔](https://docs.molt.bot)
- [WhatsApp 設定](https://docs.molt.bot/channels/whatsapp)
- [遠程部署](https://docs.molt.bot/gateway/remote)

## 🔒 安全注意事項

- 使用強密碼和 token
- 限制 `allowFrom` 只包含信任的電話號碼
- 定期更新 Moltbot
- 啟用 DM pairing 保護

## 📄 授權

MIT License

## 🙋 支援

如有問題請訪問 [Moltbot Discord](https://discord.gg/clawd)