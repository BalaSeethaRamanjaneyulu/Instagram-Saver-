# Instagram Saver - Deployment Checklist

## Pre-Deployment Requirements

### Hardware
- [ ] MacBook (macOS 11+) with WiFi capability
- [ ] iPad (iPadOS 14+) with Safari or Chrome
- [ ] Both devices can connect to same WiFi network

### Software (MacBook)
- [ ] Node.js v18.0.0+ installed
  - Check: `node --version`
  - Download: https://nodejs.org if needed
- [ ] npm installed
  - Check: `npm --version`
- [ ] Chrome browser (v88+) installed
- [ ] Instagram account with active session in Chrome

### Network
- [ ] WiFi network available
- [ ] No corporate firewall blocking port 8080
- [ ] MacBook firewall configured to allow Node.js

---

## Installation Steps

### Phase 1: Server Setup (Estimated: 10 minutes)

#### Step 1.1: Run Setup Script
```bash
cd instagram-saver
chmod +x setup.sh
./setup.sh
```

Expected output: ✅ Setup Complete!

**Troubleshooting:**
- If "Node.js not found": Install from https://nodejs.org
- If "Permission denied": Run `chmod +x setup.sh`
- If npm install fails: Delete node_modules and retry

#### Step 1.2: Get MacBook IP Address
The setup script will show it, or manually find it:
```
System Preferences → Network → WiFi → Status
```

Write it here: `___.___.___.___ `

#### Step 1.3: Start Server
```bash
./start.sh
# OR
cd server && npm start
```

Expected output:
```
🚀 Instagram Saver Server running!
📱 iPad Interface: http://192.168.1.X:8080
```

**Keep this terminal window open!**

- [ ] Server started successfully
- [ ] No error messages
- [ ] IP address noted

### Phase 2: Extension Setup (Estimated: 5 minutes)

#### Step 2.1: Open Extension Management
1. Open Chrome
2. Navigate to: `chrome://extensions`
3. Toggle "Developer mode" ON (top right)

#### Step 2.2: Load Extension
1. Click "Load unpacked"
2. Navigate to `instagram-saver/extension` folder
3. Click "Select"

#### Step 2.3: Verify Extension
- [ ] Extension appears in list
- [ ] No errors shown
- [ ] Extension icon visible in Chrome toolbar

#### Step 2.4: Check Extension Status
1. Click extension icon in toolbar
2. Should show: "Connected to server"

If disconnected:
- Check server is running
- Verify server URL in extension popup
- Check MacBook firewall

- [ ] Extension shows "Connected" status
- [ ] No errors in popup

### Phase 3: iPad Setup (Estimated: 5 minutes)

#### Step 3.1: Test Server Accessibility
On your iPad:
1. Open Safari
2. Navigate to: `http://[YOUR_MACBOOK_IP]:8080`
3. Page should load with purple gradient background

**If page doesn't load:**
- Verify IP address is correct
- Check both devices on same WiFi
- Test on MacBook first: `http://localhost:8080`
- Check MacBook firewall settings

- [ ] iPad interface loads successfully
- [ ] Status shows "Connecting..." then "Connected"

#### Step 3.2: Configure Tags
1. Tap Settings icon (⚙️) in bottom right
2. Server URL should already be set
3. Review default tags (Technology, Motivation, etc.)
4. Add/remove/modify tags as needed:
   - Tap tag name to edit
   - Tap icon to change emoji
   - Tap color to change color
   - Tap × to remove
   - Tap "+ Add Tag" to add new
5. Tap "Save Settings"

- [ ] Tags configured
- [ ] Settings saved successfully
- [ ] Tag buttons appear on main screen

#### Step 3.3: Add to Home Screen (Optional but Recommended)
1. In Safari, tap Share button
2. Select "Add to Home Screen"
3. Name it "Instagram Saver"
4. Tap "Add"

Now you can launch it like a native app!

- [ ] Added to home screen (optional)

### Phase 4: Instagram Setup (Estimated: 5 minutes)

#### Step 4.1: Create Collections
On Instagram (web or app):
1. Go to your profile
2. Tap ☰ → Saved
3. Create a new collection for each tag:
   - Technology
   - Motivation
   - Information
   - Companies
   - (etc., matching your tag names)

**Important:** Collection names must match tag names EXACTLY (case-sensitive)

- [ ] All Instagram collections created
- [ ] Collection names match tag names

#### Step 4.2: Verify Instagram Session
1. Open Instagram in Chrome on MacBook
2. Verify you're logged in
3. Try manually saving a reel to test collections work

- [ ] Logged into Instagram in Chrome
- [ ] Can manually save to collections

### Phase 5: Integration Testing (Estimated: 10 minutes)

#### Test 5.1: Connection Test
1. Server running? ✓
2. Extension connected? ✓
3. iPad connected? ✓

All three should show "Connected" status.

- [ ] All components connected

#### Test 5.2: Content Detection Test
1. On MacBook Chrome, navigate to Instagram
2. Open any reel: `instagram.com/reels`
3. Click on a reel
4. Check iPad - should immediately show:
   - Platform: INSTAGRAM
   - Current URL

**If not appearing:**
- Refresh Instagram page
- Check extension is active (click extension icon)
- Check browser console for errors (F12)

- [ ] Content detection working
- [ ] iPad updates when navigating to new reel

#### Test 5.3: Save Test
1. While viewing a reel on MacBook
2. On iPad, tap a tag button (e.g., "Technology")
3. Watch for:
   - Button animation
   - Success toast message
4. On Instagram, check:
   - Save icon is filled
   - Reel appears in "Technology" collection

**If save fails:**
- Check collection exists in Instagram
- Try manual save to verify Instagram is working
- Check extension console for errors

- [ ] Save successful
- [ ] Reel appears in correct collection
- [ ] Success feedback shown

#### Test 5.4: Multiple Saves Test
1. Navigate to different reels
2. Save each to different tags
3. Verify all saves successful

- [ ] Multiple saves working
- [ ] No errors or lag

#### Test 5.5: Disconnection Recovery Test
1. Stop server (Ctrl+C in terminal)
2. Verify iPad and extension show "Disconnected"
3. Restart server (`./start.sh`)
4. Verify automatic reconnection
5. Test saving still works

- [ ] Disconnection detected
- [ ] Automatic reconnection working
- [ ] System functional after reconnection

---

## Daily Usage Workflow

### Starting the System

1. **On MacBook:**
   ```bash
   cd instagram-saver
   ./start.sh
   ```
   Keep terminal open.

2. **On iPad:**
   - Tap "Instagram Saver" app (if added to home screen)
   - OR navigate to `http://[IP]:8080` in Safari
   - Verify "Connected" status

3. **Start browsing:**
   - Open Instagram in Chrome on MacBook
   - Browse reels
   - Tap tags on iPad to save

### Stopping the System

1. Close iPad interface (or let it stay open)
2. Press Ctrl+C in server terminal
3. Extension will auto-disconnect (harmless)

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Extension disconnected | Check server is running |
| iPad disconnected | Verify IP address and WiFi |
| Content not detected | Refresh Instagram page |
| Save not working | Verify collection exists in Instagram |
| iPad interface not loading | Check firewall, try on MacBook first |
| Tags not appearing | Configure in Settings |

For detailed troubleshooting, see TECHNICAL_DOCUMENTATION.md Section 11.

---

## Maintenance Tasks

### Weekly
- [ ] Verify Instagram saves still working
- [ ] Check for Chrome updates
- [ ] Test reconnection functionality

### Monthly
- [ ] Update Node.js dependencies: `npm update`
- [ ] Review and clean unused tags
- [ ] Clean unused Instagram collections

### As Needed
- [ ] Update extension selectors if Instagram changes UI
- [ ] Add new tags as interests evolve
- [ ] Backup tag configuration

---

## Success Criteria

You're ready to use the system when:
- [ ] Server starts without errors
- [ ] Extension shows "Connected"
- [ ] iPad shows "Connected"
- [ ] Instagram reels detected on iPad within 1 second
- [ ] Tapping tag saves reel to Instagram collection
- [ ] Success animation plays on iPad
- [ ] Saved reel appears in Instagram collection

---

## Support & Resources

- **Technical Documentation:** TECHNICAL_DOCUMENTATION.md
- **Quick Start:** README.md
- **Check Server Status:** Look for "🚀 Instagram Saver Server running!" message
- **Check Extension:** Click extension icon for connection status
- **Check iPad:** Look for green status dot

---

## Common Initial Setup Issues

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org (includes npm)

### Issue: "Port 8080 already in use"
**Solution:** 
```bash
# Find what's using port 8080:
lsof -i :8080
# Kill that process or change port in server.js
```

### Issue: Extension won't load
**Solution:**
- Enable Developer Mode in chrome://extensions
- Check for manifest.json errors
- Ensure all files in extension folder

### Issue: iPad can't connect
**Solution:**
1. Verify IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Test on MacBook: `http://localhost:8080`
3. Check MacBook firewall allows port 8080
4. Ensure both devices on same WiFi network

### Issue: Saves not working
**Solution:**
1. Verify logged into Instagram
2. Create collections manually
3. Test manual save first
4. Check browser console for errors

---

## Congratulations! 🎉

If you've checked all boxes, your Instagram Saver system is ready to use!

Enjoy effortless content curation! 🚀