const fs = require('fs');
const path = require('path');

const configPath = path.join(process.env.HOME, '.clawdbot', 'clawdbot.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 更新 WhatsApp allowFrom 為您信任的電話號碼
config.channels.whatsapp.allowFrom = [
  "+886915388897",  // 您的號碼
  // 在這裡添加其他允許的電話號碼，格式："+886912345678"
];

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ WhatsApp allowlist 已更新！');
console.log('📝 記得執行：clawdbot daemon restart');
