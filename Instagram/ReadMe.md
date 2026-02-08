# Instagram Saver - Quick Start Guide

Transform your iPad into a dedicated save panel for Instagram content with one-tap tagging.

## ⚡ Quick Setup (5 minutes)

### Prerequisites
- MacBook with Node.js 18+ installed
- Chrome browser
- iPad on same WiFi network
- Instagram account logged in

### Step 1: Start Server
```bash
cd server
npm install
npm start
```

Note the IP address shown (e.g., `192.168.1.5`)

### Step 2: Install Extension
1. Open Chrome: `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

### Step 3: Open iPad Interface
On your iPad, navigate to: `http://[YOUR_IP]:8080`

Replace `[YOUR_IP]` with the IP shown in Step 1.

### Step 4: Configure Tags
1. Tap Settings (⚙️) on iPad
2. Add your tags (Technology, Motivation, etc.)
3. Save configuration

### Step 5: Test
1. On MacBook: Open Instagram reel
2. On iPad: Should show current reel
3. Tap a tag button
4. Verify reel saved to Instagram collection

## 🎯 Daily Usage

1. Start server on MacBook: `npm start`
2. Open iPad interface (bookmark it!)
3. Browse Instagram on MacBook
4. Tap tags on iPad to save

## 📚 Full Documentation

See `TECHNICAL_DOCUMENTATION.md` for:
- Complete architecture
- Troubleshooting
- Advanced configuration
- Extension customization

## 🔧 Troubleshooting

**Extension shows "Disconnected"**
→ Check server is running (`npm start`)

**iPad can't connect**
→ Verify you're using the correct IP address
→ Both devices must be on same WiFi network

**Saves not working**
→ Ensure Instagram collections exist
→ Names must match tag names exactly

**Need help?**
→ Check TECHNICAL_DOCUMENTATION.md Section 11 (Troubleshooting Guide)

## 📁 Project Structure

```
instagram-saver/
├── server/                 # WebSocket server (Node.js)
├── extension/             # Chrome extension
├── ipad-interface/        # iPad web app
├── TECHNICAL_DOCUMENTATION.md   # Complete tech specs
└── README.md              # This file
```

## 🚀 Features

- ✅ Real-time content detection
- ✅ One-tap saves to Instagram collections
- ✅ Large touch-friendly iPad interface
- ✅ Automatic reconnection
- ✅ Visual feedback for all actions
- ✅ Works with Instagram Reels and Posts

## 🔮 Future Enhancements

- Multi-platform support (YouTube, Twitter, TikTok)
- Analytics dashboard
- Cloud sync
- Mobile app
- Smart tagging with AI

## 📝 License

Personal use project. Modify as needed.

## 🙏 Credits

Built with ❤️ for effortless content curation.