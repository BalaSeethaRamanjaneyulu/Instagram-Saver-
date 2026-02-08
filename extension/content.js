// ===== PLATFORM DETECTION =====
let lastDetectedUrl = null;
let currentPlatform = null;
let currentUrl = null;

const PLATFORM_PATTERNS = {
    instagram: {
        regex: /instagram\.com\/(?:reel|reels|p)\/([^/?]+)/,
        name: 'instagram'
    },
    youtube: {
        regex: /youtube\.com\/watch\?v=([^\u0026]+)|youtube\.com\/shorts\/([^/?]+)/,
        name: 'youtube'
    },
    twitter: {
        regex: /(?:twitter|x)\.com\/\w+\/status\/(\d+)/,
        name: 'twitter'
    },
    tiktok: {
        regex: /tiktok\.com\/@[\w.]+\/video\/(\d+)/,
        name: 'tiktok'
    }
};

// ===== URL MONITORING =====
function detectContent() {
    const url = window.location.href;

    // Check if URL changed
    if (url === lastDetectedUrl) {
        return;
    }

    // Detect platform
    let detected = false;
    for (const [platform, config] of Object.entries(PLATFORM_PATTERNS)) {
        if (config.regex.test(url)) {
            console.log('📍 Content detected:', platform, url);
            currentPlatform = config.name;
            currentUrl = url;
            lastDetectedUrl = url;
            detected = true;

            // Send to background worker
            chrome.runtime.sendMessage({
                type: 'content_detected',
                url: url,
                platform: platform,
                title: document.title
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Error sending to background:', chrome.runtime.lastError.message);
                }
            });

            break;
        }
    }

    if (!detected && lastDetectedUrl !== null) {
        // URL changed to non-content page
        lastDetectedUrl = null;
        currentPlatform = null;
        currentUrl = null;
    }
}

// Monitor URL changes with interval (fallback)
setInterval(detectContent, 1000);

// Monitor URL changes with MutationObserver (for SPA navigation)
const observer = new MutationObserver(() => {
    detectContent();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial detection
detectContent();

// ===== INSTAGRAM AUTOMATION =====
async function saveToInstagramCollection(collectionName) {
    console.log('📌 Starting Instagram save automation for:', collectionName);

    try {
        // Step 1: Find save button
        const saveButton = await findSaveButton();
        if (!saveButton) {
            throw new Error('Save button not found');
        }

        // Check if already saved
        const isSaved = saveButton.getAttribute('aria-label')?.includes('Remove');
        console.log('📍 Save status:', isSaved ? 'Already saved' : 'Not saved');

        // Click save button if not already saved
        if (!isSaved) {
            console.log('📌 Clicking save button...');
            saveButton.click();
            await sleep(800); // Wait for menu to appear
        } else {
            console.log('📌 Already saved, opening menu...');
            saveButton.click();
            await sleep(800);
        }

        // Step 2: Find collection in menu
        const collection = await findCollectionByName(collectionName);

        if (collection) {
            console.log('✅ Collection found, clicking...');
            collection.click();
            await sleep(500);
            console.log('✅ Save complete!');
            return { success: true };
        } else {
            // Step 3: Create new collection
            console.log('📝 Collection not found, creating new one...');
            const created = await createNewCollection(collectionName);

            if (created) {
                console.log('✅ Collection created and saved!');
                return { success: true };
            } else {
                throw new Error('Failed to create collection');
            }
        }
    } catch (error) {
        console.error('❌ Instagram save failed:', error);

        // Fallback: Copy URL to clipboard
        try {
            await navigator.clipboard.writeText(window.location.href);
            console.log('📋 URL copied to clipboard for manual save');
        } catch (clipError) {
            console.error('❌ Failed to copy URL:', clipError);
        }

        return { success: false, error: error.message };
    }
}

// ===== HELPER FUNCTIONS =====
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function findSaveButton() {
    // Multiple selector strategies
    const selectors = [
        'svg[aria-label="Save"]',
        'svg[aria-label="Remove"]',
        '[aria-label="Save"]',
        '[aria-label="Remove"]',
        'button svg[aria-label*="ave"]' // Matches "Save" or "save"
    ];

    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            if (isVisible(el)) {
                // Click the button, not the SVG
                const button = el.closest('button') || el.closest('[role="button"]');
                return button || el;
            }
        }
    }

    return null;
}

async function findCollectionByName(name) {
    await sleep(300); // Give menu time to fully render

    // Find all buttons in the menu
    const buttons = document.querySelectorAll('button, [role="button"]');

    for (const button of buttons) {
        const text = button.textContent.trim();
        if (text === name) {
            if (isVisible(button)) {
                return button;
            }
        }
    }

    return null;
}

async function createNewCollection(name) {
    try {
        // Find "New collection" button
        const newCollectionButton = await findButtonByText('New collection');
        if (!newCollectionButton) {
            console.error('❌ New collection button not found');
            return false;
        }

        console.log('📌 Clicking "New collection"...');
        newCollectionButton.click();
        await sleep(500);

        // Find input field
        const input = await findCollectionInput();
        if (!input) {
            console.error('❌ Collection input not found');
            return false;
        }

        console.log('📝 Entering collection name:', name);
        input.focus();
        input.value = name;

        // Trigger input event
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(200);

        // Find and click Create button
        const createButton = await findButtonByText('Create');
        if (!createButton) {
            console.error('❌ Create button not found');
            return false;
        }

        console.log('📌 Clicking "Create"...');
        createButton.click();
        await sleep(800); // Wait for creation

        return true;
    } catch (error) {
        console.error('❌ Error creating collection:', error);
        return false;
    }
}

async function findButtonByText(text) {
    const buttons = document.querySelectorAll('button, [role="button"]');

    for (const button of buttons) {
        const buttonText = button.textContent.trim();
        if (buttonText === text || buttonText.includes(text)) {
            if (isVisible(button)) {
                return button;
            }
        }
    }

    return null;
}

async function findCollectionInput() {
    const selectors = [
        'input[placeholder*="ollection"]',
        'input[placeholder*="ame"]',
        'input[type="text"]'
    ];

    for (const selector of selectors) {
        const inputs = document.querySelectorAll(selector);
        for (const input of inputs) {
            if (isVisible(input)) {
                return input;
            }
        }
    }

    return null;
}

function isVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
    );
}

// ===== MESSAGE HANDLER =====
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message from background:', message.type);

    if (message.type === 'save_to_collection') {
        // Only process if on Instagram
        if (currentPlatform !== 'instagram') {
            console.warn('⚠️  Not on Instagram, cannot save');
            sendResponse({ success: false, error: 'Not on Instagram' });
            chrome.runtime.sendMessage({
                type: 'save_complete',
                tag: message.collection,
                success: false,
                error: 'Not on Instagram'
            });
            return true;
        }

        // Perform save automation
        saveToInstagramCollection(message.collection)
            .then(result => {
                console.log('✅ Save result:', result);

                // Send confirmation back to background
                chrome.runtime.sendMessage({
                    type: 'save_complete',
                    tag: message.collection,
                    success: result.success,
                    error: result.error
                });

                sendResponse(result);
            })
            .catch(error => {
                console.error('❌ Save error:', error);

                chrome.runtime.sendMessage({
                    type: 'save_complete',
                    tag: message.collection,
                    success: false,
                    error: error.message
                });

                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }

    return false;
});

console.log('✅ Instagram Saver: Content script loaded');
