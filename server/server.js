const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const PING_INTERVAL = 30000; // 30 seconds

// Store connected clients
const clients = {
    extension: null,
    ipad: null
};

// Create HTTP server to serve iPad interface
const httpServer = http.createServer((req, res) => {
    console.log(`📨 HTTP Request: ${req.url}`);

    if (req.url === '/' || req.url === '/index.html') {
        const indexPath = path.join(__dirname, '../ipad-interface/index.html');

        fs.readFile(indexPath, (err, data) => {
            if (err) {
                console.error('❌ Error reading iPad interface:', err.message);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - iPad interface not found. Please create ipad-interface/index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server: httpServer });

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Send message to specific client
function sendToClient(clientType, message) {
    const client = clients[clientType];
    if (client && client.readyState === WebSocket.OPEN) {
        try {
            client.send(JSON.stringify(message));
            console.log(`📤 Sent to ${clientType}:`, message.type);
            return true;
        } catch (error) {
            console.error(`❌ Error sending to ${clientType}:`, error.message);
            return false;
        }
    } else {
        console.warn(`⚠️  ${clientType} not connected`);
        return false;
    }
}

// Handle WebSocket connection
wss.on('connection', (ws, req) => {
    console.log('🔌 New WebSocket connection from', req.socket.remoteAddress);

    let clientType = null;

    // Set up ping interval for this connection
    const pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, PING_INTERVAL);

    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📨 Received message:', message.type, 'from', clientType || 'unknown');

            // Handle client registration
            if (message.type === 'register') {
                clientType = message.client; // 'extension' or 'ipad'

                if (clientType === 'extension' || clientType === 'ipad') {
                    // Disconnect previous client of same type if exists
                    if (clients[clientType]) {
                        console.log(`🔄 Replacing existing ${clientType} connection`);
                        clients[clientType].close();
                    }

                    clients[clientType] = ws;
                    console.log(`✅ ${clientType} registered and connected`);

                    // Send confirmation
                    ws.send(JSON.stringify({
                        type: 'registered',
                        client: clientType,
                        message: 'Successfully registered'
                    }));
                } else {
                    console.warn('⚠️  Unknown client type:', clientType);
                }
                return;
            }

            // Route messages based on type
            if (!clientType) {
                console.warn('⚠️  Message from unregistered client');
                return;
            }

            switch (message.type) {
                case 'current_content':
                    // Extension → iPad
                    if (clientType === 'extension') {
                        console.log('📍 Content detected:', message.platform, message.url);
                        sendToClient('ipad', message);
                    }
                    break;

                case 'save_to_tag':
                    // iPad → Extension
                    if (clientType === 'ipad') {
                        console.log('📌 Save requested:', message.tag, 'for', message.url);
                        sendToClient('extension', message);
                    }
                    break;

                case 'save_confirmation':
                    // Extension → iPad
                    if (clientType === 'extension') {
                        const status = message.success ? '✅ Success' : '❌ Failed';
                        console.log(`${status} Save to ${message.tag}`);
                        sendToClient('ipad', message);
                    }
                    break;

                default:
                    console.log('📨 Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('❌ Error parsing message:', error.message);
        }
    });

    // Handle pong responses
    ws.on('pong', () => {
        // Connection is alive
    });

    // Handle connection close
    ws.on('close', () => {
        console.log(`🔌 ${clientType || 'Unknown'} disconnected`);
        clearInterval(pingTimer);

        // Remove from clients registry
        if (clientType && clients[clientType] === ws) {
            clients[clientType] = null;
        }
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`❌ WebSocket error (${clientType || 'unknown'}):`, error.message);
    });
});

// Start server
httpServer.listen(PORT, () => {
    const localIP = getLocalIP();

    console.log('\n🚀 Instagram Saver Server running!\n');
    console.log('📱 iPad Interface:');
    console.log(`   • Local:  http://localhost:${PORT}`);
    console.log(`   • iPad:   http://${localIP}:${PORT}`);
    console.log('\n🌐 WebSocket Server:');
    console.log(`   • Extension: ws://localhost:${PORT}`);
    console.log(`   • iPad:      ws://${localIP}:${PORT}`);
    console.log('\n📊 Status:');
    console.log('   • Waiting for connections...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        process.exit(0);
    });
});
