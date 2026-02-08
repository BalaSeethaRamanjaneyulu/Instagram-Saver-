// UI Elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const currentUrl = document.getElementById('currentUrl');
const platformInfo = document.getElementById('platformInfo');
const serverUrl = document.getElementById('serverUrl');
const testBtn = document.getElementById('testBtn');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 Popup opened');

    // Load server URL from storage
    chrome.storage.local.get(['serverUrl'], (result) => {
        if (result.serverUrl) {
            serverUrl.value = result.serverUrl;
        } else {
            serverUrl.value = 'ws://localhost:8080';
        }
    });

    // Get connection status
    updateConnectionStatus();

    // Get current tab info
    updateCurrentTab();
});

// ===== CONNECTION STATUS =====
function updateConnectionStatus() {
    chrome.runtime.sendMessage({ type: 'get_connection_status' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ Error getting status:', chrome.runtime.lastError.message);
            setStatus(false);
            return;
        }

        if (response && response.connected) {
            setStatus(true);
        } else {
            setStatus(false);
        }
    });
}

function setStatus(connected) {
    if (connected) {
        statusDot.classList.add('connected');
        statusText.textContent = 'Connected';
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = 'Disconnected';
    }
}

// ===== CURRENT TAB INFO =====
function updateCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            const tab = tabs[0];
            currentUrl.textContent = tab.url || 'Unknown';

            // Detect platform
            const platform = detectPlatform(tab.url);
            if (platform) {
                platformInfo.textContent = `${platform.charAt(0).toUpperCase() + platform.slice(1)} (Supported)`;
            } else {
                platformInfo.textContent = 'Not supported';
            }
        }
    });
}

function detectPlatform(url) {
    if (!url) return null;

    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('tiktok.com')) return 'tiktok';

    return null;
}

// ===== SERVER URL CONFIG =====
serverUrl.addEventListener('change', () => {
    const url = serverUrl.value.trim();
    chrome.storage.local.set({ serverUrl: url }, () => {
        console.log('💾 Server URL saved:', url);
    });
});

// ===== TEST CONNECTION =====
testBtn.addEventListener('click', () => {
    testBtn.textContent = 'Testing...';
    testBtn.disabled = true;

    // Check connection status
    setTimeout(() => {
        updateConnectionStatus();
        testBtn.textContent = 'Test Connection';
        testBtn.disabled = false;
    }, 1000);
});

// Refresh status every 2 seconds
setInterval(updateConnectionStatus, 2000);
