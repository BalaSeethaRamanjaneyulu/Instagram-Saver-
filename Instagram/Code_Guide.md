# Building Instagram Saver with Claude Code

## 🎯 What You're Building

A cross-device system that turns your old iPad into a dedicated "save panel" for Instagram content. One tap on your iPad saves the current reel/post you're watching on your MacBook to a tagged collection.

## 📦 Complete Package Contents

I've created a complete technical specification and architecture for you. Here's what's included:

### 1. **TECHNICAL_DOCUMENTATION.md** (1832 lines)
   - Complete system architecture
   - Component specifications
   - Detailed workflows
   - Network configuration
   - Security considerations
   - Error handling strategies
   - Testing methodology
   - Troubleshooting guide
   
   **This is your primary reference document.**

### 2. **README.md**
   - Quick start guide
   - 5-minute setup instructions
   - Daily usage workflow
   - Basic troubleshooting

### 3. **DEPLOYMENT_CHECKLIST.md**
   - Step-by-step deployment guide
   - Pre-deployment requirements
   - Testing procedures
   - Maintenance tasks

### 4. **Code Templates** (Ready to implement)

   #### Server Component (`/server`)
   - `server.js` - WebSocket server with HTTP hosting
   - `package.json` - Dependencies configuration
   
   #### Extension Component (`/extension`)
   - `manifest.json` - Chrome extension configuration
   - `background.js` - Service worker for WebSocket management
   - `content.js` - Instagram automation script
   - `popup.html` + `popup.js` - Extension UI
   
   #### iPad Interface (`/ipad-interface`)
   - `index.html` - Complete touch-optimized web app

### 5. **Setup Automation**
   - `setup.sh` - Automated setup script for macOS

---

## 🚀 How to Build with Claude Code

### Step 1: Review the Architecture

Start by reading the **TECHNICAL_DOCUMENTATION.md** file. Focus on these sections:

1. **Section 2: System Architecture**
   - Understand the 3-component design
   - Study the data flow diagrams
   - Review component responsibilities

2. **Section 3: Component Details**
   - Deep dive into each component
   - Understand the message protocol
   - Review automation strategies

3. **Section 4: Workflows & Data Flow**
   - Follow the sequence diagrams
   - Understand each workflow step
   - Review error handling

### Step 2: Set Up Development Environment

Using Claude Code, you'll want to:

1. **Create Project Structure:**
   ```bash
   mkdir instagram-saver
   cd instagram-saver
   mkdir server extension ipad-interface
   ```

2. **Initialize Server:**
   ```bash
   cd server
   npm init -y
   npm install ws
   ```

3. **Set Up Extension Directory:**
   - Create extension folder
   - Add manifest.json
   - Create JavaScript files

### Step 3: Build Components (Suggested Order)

#### Phase 1: Server (Start Here)
Build the WebSocket server first because it's the foundation.

**With Claude Code, ask it to:**
1. "Create a Node.js WebSocket server based on the spec in TECHNICAL_DOCUMENTATION.md Section 3.1"
2. "Add HTTP server to serve the iPad interface"
3. "Implement message routing between extension and iPad clients"
4. "Add reconnection handling and keep-alive pings"

**Test it:**
```bash
node server.js
# Should output: "🚀 Instagram Saver Server running!"
```

#### Phase 2: iPad Interface
Build the UI next so you can see real-time updates.

**With Claude Code, ask it to:**
1. "Create the iPad touch interface HTML based on TECHNICAL_DOCUMENTATION.md Section 3.3"
2. "Implement WebSocket client connection logic"
3. "Add tag button grid with animations"
4. "Implement settings modal for tag configuration"
5. "Add localStorage persistence"

**Test it:**
- Open http://localhost:8080 in browser
- Should see purple gradient interface
- Tags should be configurable
- Status should show "Connected"

#### Phase 3: Chrome Extension
Build the automation last.

**With Claude Code, ask it to:**
1. "Create manifest.json for Manifest V3 extension"
2. "Implement background service worker with WebSocket connection"
3. "Create content script for Instagram automation"
4. "Add popup UI for connection status"
5. "Implement Instagram save automation based on Section 3.2"

**Test it:**
- Load extension in Chrome
- Open Instagram
- Extension should detect URLs
- Manual save test

### Step 4: Integration Testing

**With Claude Code:**
1. "Help me test the complete workflow based on DEPLOYMENT_CHECKLIST.md"
2. "Debug WebSocket message routing"
3. "Fix Instagram selector issues if Instagram DOM changed"

---

## 💡 Claude Code Prompting Strategy

### For Each Component, Use This Pattern:

```
I'm building [component name] for Instagram Saver system.

Context: [Brief description of what this component does]

Reference: See TECHNICAL_DOCUMENTATION.md Section [X.Y]

Requirements:
1. [Requirement 1 from docs]
2. [Requirement 2 from docs]
3. [etc.]

Please create [filename] that implements this functionality.
Include error handling and logging as specified in the documentation.
```

### Example Prompt for Server:

```
I'm building the WebSocket server for Instagram Saver.

Context: This is the central hub that routes messages between the Chrome extension 
(running on MacBook) and the iPad interface. It also serves the iPad HTML interface.

Reference: TECHNICAL_DOCUMENTATION.md Section 3.1

Requirements:
1. WebSocket server on port 8080
2. HTTP server serving ipad-interface/index.html
3. Client registration (extension vs ipad)
4. Message routing:
   - extension → server → ipad (content detection)
   - ipad → server → extension (save commands)
5. Keep-alive pings every 30 seconds
6. Reconnection handling

Please create server/server.js implementing this.
```

---

## 🔧 Key Technical Considerations

### 1. Instagram DOM Automation

**Challenge:** Instagram changes their DOM frequently

**Solution Strategy:**
- Use multiple selector strategies (aria-labels, SVG paths, roles)
- Implement visibility checks before clicking
- Add configurable delays for UI rendering
- Log selector failures for debugging

**With Claude Code:**
"Help me create robust Instagram selectors that work even when Instagram updates their UI"

### 2. WebSocket Connection Management

**Challenge:** Connections drop, service workers sleep

**Solution Strategy:**
- Automatic reconnection with exponential backoff
- Keep-alive pings
- Chrome alarms to prevent worker sleep
- Connection state management

**With Claude Code:**
"Implement robust WebSocket reconnection logic as specified in Section 9.1"

### 3. Cross-Device Sync

**Challenge:** Real-time sync between MacBook and iPad

**Solution Strategy:**
- Low-latency WebSocket communication
- Message deduplication
- State synchronization
- Visual feedback for all actions

**With Claude Code:**
"Ensure messages are routed with <100ms latency and proper confirmation"

---

## 🎨 Important Implementation Details

### Network Configuration

**Your MacBook will need to:**
1. Run Node.js server on port 8080
2. Allow inbound connections on that port
3. Be discoverable on local WiFi

**Find your MacBook's IP:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Use this IP for the iPad connection: `http://192.168.1.X:8080`

### Instagram Collections

**Before using the system:**
1. Create collections in Instagram matching your tag names
2. Names must match EXACTLY (case-sensitive)
3. Example: If tag is "Technology", collection must be "Technology"

### Chrome Extension Testing

**To test during development:**
1. chrome://extensions
2. Enable Developer Mode
3. Load unpacked
4. Select extension folder
5. Refresh after changes

---

## 📋 Build Order Summary

1. ✅ **Server** (Foundation)
   - WebSocket communication
   - HTTP server for iPad interface
   - Message routing

2. ✅ **iPad Interface** (Visual feedback)
   - UI and styling
   - WebSocket client
   - Tag management

3. ✅ **Extension** (Automation)
   - Background worker
   - Content script
   - Instagram automation
   - URL detection

4. ✅ **Integration** (Put it all together)
   - End-to-end testing
   - Error handling
   - Performance optimization

---

## 🐛 Common Issues You'll Encounter (And Solutions)

### Issue: "Cannot find module 'ws'"
**Solution:** 
```bash
cd server
npm install ws
```

### Issue: Extension service worker keeps dying
**Solution:** Implement Chrome alarms every 30 seconds (included in background.js spec)

### Issue: Instagram selectors not finding elements
**Solution:** 
1. Open Instagram in Chrome
2. F12 → Console
3. Test selectors: `document.querySelector('svg[aria-label="Save"]')`
4. Update selectors based on current DOM

### Issue: iPad can't connect to server
**Solution:**
1. Check firewall on MacBook
2. Verify both devices on same WiFi
3. Test server locally first: http://localhost:8080

---

## 🎯 Success Metrics

Your implementation is complete when:

- [ ] Server starts and shows IP address
- [ ] Extension loads in Chrome without errors
- [ ] iPad interface loads at http://[IP]:8080
- [ ] All three show "Connected" status
- [ ] Opening Instagram reel shows URL on iPad within 1 second
- [ ] Tapping tag button on iPad saves reel to Instagram collection
- [ ] Green success animation plays
- [ ] Reel appears in correct Instagram collection

---

## 🔮 Future Enhancements (After MVP)

Once basic system works, you can extend it:

1. **Multi-platform Support**
   - YouTube, Twitter, TikTok detection
   - Platform-specific save handlers

2. **Analytics**
   - Track saves per tag
   - Most-saved content
   - Usage statistics

3. **Smart Features**
   - AI-suggested tags
   - Auto-categorization
   - Duplicate detection

4. **Cloud Sync**
   - Backup save history
   - Multi-device access
   - Web dashboard

---

## 📚 Documentation Reference Guide

| When You Need... | Read This... |
|-----------------|-------------|
| Overall architecture | TECHNICAL_DOCUMENTATION.md Section 2 |
| Component details | TECHNICAL_DOCUMENTATION.md Section 3 |
| Workflow diagrams | TECHNICAL_DOCUMENTATION.md Section 4 |
| Network setup | TECHNICAL_DOCUMENTATION.md Section 6 |
| Setup instructions | DEPLOYMENT_CHECKLIST.md |
| Quick reference | README.md |
| Error handling | TECHNICAL_DOCUMENTATION.md Section 9 |
| Troubleshooting | TECHNICAL_DOCUMENTATION.md Section 11 |

---

## 🚀 Ready to Build?

### Your next steps:

1. **Read TECHNICAL_DOCUMENTATION.md Sections 1-4**
   - Understand the architecture
   - Study the workflows
   - Review component specifications

2. **Start with Server**
   - Open Claude Code
   - Ask it to implement server.js based on Section 3.1
   - Test it runs successfully

3. **Build iPad Interface**
   - Implement the touch UI
   - Test WebSocket connection
   - Configure tags

4. **Create Extension**
   - Build manifest and structure
   - Implement automation
   - Test on Instagram

5. **Integrate and Test**
   - Follow DEPLOYMENT_CHECKLIST.md
   - Test all workflows
   - Debug and refine

---

## 💬 Sample Claude Code Conversation

Here's how your conversation with Claude Code might look:

```
YOU: I want to build the Instagram Saver system. I have the complete 
     technical documentation. Let's start with the WebSocket server.
     
     Please create server/server.js based on TECHNICAL_DOCUMENTATION.md 
     Section 3.1. It should:
     1. Create WebSocket server on port 8080
     2. Serve iPad interface from ipad-interface/index.html
     3. Handle two client types: extension and ipad
     4. Route messages between clients
     5. Keep connections alive with pings

CLAUDE CODE: [Creates server.js file]

YOU: Great! Now create package.json with the required dependencies.

CLAUDE CODE: [Creates package.json]

YOU: Let's test it. Can you create a simple test to verify the WebSocket 
     server is working?

CLAUDE CODE: [Creates test.js or provides manual test instructions]

[Continue iteratively through each component...]
```

---

## 📖 Final Thoughts

This project is designed to be:
- **Learnable:** Clear documentation and examples
- **Buildable:** Modular components you can build independently
- **Testable:** Each component can be tested in isolation
- **Extensible:** Easy to add new features later

The complete technical specification gives you everything you need. Use Claude Code to implement each component, test it, then move to the next.

**Good luck with your build! 🎉**

You have all the specifications, architecture, and implementation details you need. 
Time to code! 💻