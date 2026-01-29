#!/bin/bash

# Moltbot 雲端部署啟動腳本

echo "🦞 Starting Moltbot Gateway..."

# 檢查 Moltbot 是否已安裝
if ! command -v moltbot &> /dev/null; then
    echo "📦 Installing Moltbot..."
    curl -fsSL https://molt.bot/install.sh | bash
fi

# 檢查配置是否存在
if [ ! -f "$HOME/.clawdbot/clawdbot.json" ]; then
    echo "⚠️  Configuration not found. Please run setup first."
    echo "Run: moltbot onboard"
    exit 1
fi

# 啟動 Gateway
echo "🚀 Starting Gateway on port ${PORT:-18789}..."
moltbot gateway --port ${PORT:-18789} --verbose
