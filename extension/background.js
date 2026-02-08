// ===== WEBSOCKET CONNECTION =====
let ws = null;
let isConnected = false;
let reconnectTimer = null;
const WS_SERVER = 'ws://localhost:8080';
const RECONNECT_DELAY = 3000;
const KEEP_ALIVE_INTERVAL = 30000;

console.log('✅ Instagram Saver: Background worker started');

// ===== CONNECTION MANAGEMENT =====
function connectWebSocket() {
    console.log('📡 Connecting to WebSocket server:', WS_SERVER);

    try {
        ws = new WebSocket(WS_SERVER);

        ws.onopen = () => {
            console.log('✅ Connected to server');
            isConnected = true;
            clearTimeout(reconnectTimer);

            // Register as extension client
            sendToServer({
                type: 'register',
                client: 'extension'
            });
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('📨 Received from server:', message.type);
                handleServerMessage(message);
            } catch (error) {
                console.error('❌ Error parsing server message:', error);
            }
        };

        ws.onclose = () => {
            console.log('🔌 Disconnected from server');
            isConnected = false;
            ws = null;

            // Auto-reconnect
            console.log(`🔄 Reconnecting in ${RECONNECT_DELAY / 1000}s...`);
            reconnectTimer = setTimeout(connectWebSocket, RECONNECT_DELAY);
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        reconnectTimer = setTimeout(connectWebSocket, RECONNECT_DELAY);
    }
}

function sendToServer(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log('📤 Sent to server:', message.type);
        return true;
    } else {
        console.error('⚠️  WebSocket not connected, cannot send:', message.type);
        return false;
    }
}

// ===== MESSAGE HANDLING =====
function handleServerMessage(message) {
    switch (message.type) {
        case 'registered':
            console.log('✅ Registration confirmed');
            break;

        case 'save_to_tag':
            console.log('📌 Save command received:', message.tag);
            // Forward to content script on active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    relayToContentScript(tabs[0].id, {
                        type: 'save_to_collection',
                        collection: message.tag,
                        url: message.url
                    });
                }
            });
            break;

        default:
            console.log('📨 Unknown message type:', message.type);
    }
}

function relayToContentScript(tabId, message) {
    chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ Error sending to content script:', chrome.runtime.lastError.message);
        } else {
            console.log('✅ Message sent to content script');
        }
    });
}

// ===== CONTENT SCRIPT MESSAGES =====
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message from content script:', message.type);

    switch (message.type) {
        case 'content_detected':
            // Forward to server (to iPad)
            sendToServer({
                type: 'current_content',
                url: message.url,
                platform: message.platform,
                title: message.title || ''
            });
            sendResponse({ success: true });
            break;

        case 'save_complete':
            // Forward confirmation to server (to iPad)
            sendToServer({
                type: 'save_confirmation',
                tag: message.tag,
                success: message.success,
                error: message.error || null
            });
            sendResponse({ success: true });
            break;

        case 'get_connection_status':
            sendResponse({ connected: isConnected });
            break;

        default:
            console.log('⚠️  Unknown message type from content script:', message.type);
            sendResponse({ success: false, error: 'Unknown message type' });
    }

    return true; // Keep message channel open for async response
});

// ===== TAB MONITORING =====
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('🔄 Tab updated:', tab.url);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            console.log('👁️  Active tab changed:', tab.url);
        }
    });
});

// ===== KEEP-ALIVE =====
// Create alarm to keep service worker alive
chrome.alarms.create('keepAlive', {
    periodInMinutes: 0.5
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // Send ping to keep service worker active
        if (ws && ws.readyState === WebSocket.OPEN) {
            // WebSocket will handle its own ping/pong
        } else if (!ws || ws.readyState === WebSocket.CLOSED) {
            console.log('🔄 Service worker keep-alive: Reconnecting...');
            connectWebSocket();
        }
    }
});

// ===== INITIALIZATION =====
console.log('🚀 Initializing Instagram Saver extension');
connectWebSocket();

// Reconnect on service worker activation
self.addEventListener('activate', () => {
    console.log('🔄 Service worker activated');
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectWebSocket();
    }
});
