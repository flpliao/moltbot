const fs = require('fs');
const path = require('path');

const configPath = path.join(process.env.HOME, '.clawdbot', 'clawdbot.json');

// 讀取現有配置
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 添加 WhatsApp 配置
if (!config.channels) {
    config.channels = {};
}

config.channels.whatsapp = {
    dmPolicy: "pairing",
    groupPolicy: "allowlist",
    allowFrom: ["*"],  // 暫時允許所有人，您可以稍後修改
    groups: {}  // groups 應該是 object 不是 array
};

// 確保 WhatsApp 外掛已啟用
if (!config.plugins) {
    config.plugins = { entries: {} };
}
if (!config.plugins.entries) {
    config.plugins.entries = {};
}
config.plugins.entries.whatsapp = {
    enabled: true
};

// 寫回配置檔案
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('✅ WhatsApp 配置已添加到', configPath);
console.log('📝 下一步：執行 clawdbot channels login 來連接 WhatsApp');
