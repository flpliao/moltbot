# Dockerfile for Moltbot deployment
FROM node:24-slim

# 安裝基本工具
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製專案檔案
COPY package*.json ./
COPY start.sh ./

# 賦予執行權限
RUN chmod +x start.sh

# 安裝 Moltbot
RUN curl -fsSL https://molt.bot/install.sh | bash

# 暴露 Gateway 端口
EXPOSE 18789

# 啟動指令
CMD ["./start.sh"]
