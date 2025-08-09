# MRSOLRUGGER Wallet Sync

A Solana wallet connection interface with Telegram notifications. When users connect their Phantom wallets, you receive instant notifications via Telegram bot.

## 🚀 Features

- **Phantom Wallet Integration** - Real wallet connections
- **Mobile Support** - Deep linking for mobile Phantom app
- **Demo Mode** - Works without Phantom installed
- **Telegram Notifications** - Instant alerts when wallets connect
- **Detailed Logging** - IP, device, timestamp, and wallet info

## 🎯 Quick Deploy

### 1. Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow instructions
3. Save your bot token

### 2. Get Chat ID
- Message [@userinfobot](https://t.me/userinfobot) to get your chat ID
- Or message your bot and check updates

### 3. Deploy on Railway
1. Fork this repository
2. Go to [Railway.app](https://railway.app)
3. Connect GitHub and deploy this repo
4. Add environment variables:
   - `TELEGRAM_BOT_TOKEN`: Your bot token
   - `TELEGRAM_CHAT_ID`: Your chat ID

## 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/mrsolrugger-wallet.git
cd mrsolrugger-wallet

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Telegram credentials

# Start server
npm run dev
