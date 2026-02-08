# 📱 Instagram Saver

> Transform your old iPad into a dedicated save panel for Instagram content with one-tap cross-device curation.

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()

## 🎯 What It Does

Instagram Saver is a cross-device content curation system that lets you save Instagram reels/posts with a single tap on your iPad while browsing on your MacBook. No more interrupting your flow with multiple taps through Instagram's save menu!

**The Magic:** Browse Instagram on your MacBook → Current reel appears on iPad instantly → Tap a tag → Saved automatically to Instagram collection!

![System Demo](https://raw.githubusercontent.com/BalaSeethaRamanjaneyulu/Instagram-Saver-/main/.github/demo.gif)

## ✨ Features

- 🚀 **Real-Time Sync** - iPad updates instantly when you view new content (<500ms latency)
- 🎨 **Touch-Optimized UI** - Large 150×150px buttons perfect for tapping
- 🤖 **Automated Saving** - No manual Instagram navigation required
- 📊 **Customizable Tags** - Create unlimited collections with custom colors and emojis
- 🔄 **Auto-Reconnection** - Seamless recovery from network interruptions
- 🌐 **Multi-Platform Ready** - Extensible to YouTube, Twitter, TikTok
- 🔒 **Privacy-First** - All data stays on your local network

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR MACBOOK                            │
│                                                              │
│  ┌────────────┐           ┌──────────────┐                 │
│  │  Chrome    │◄─────────►│  WebSocket   │                 │
│  │  Extension │           │  Server      │                 │
│  │            │           │  (Node.js)   │                 │
│  └────────────┘           └──────┬───────┘                 │
│                                  │                          │
└──────────────────────────────────┼──────────────────────────┘
                                   │
                                   │ WiFi
                                   │
┌──────────────────────────────────┼──────────────────────────┐
│                      YOUR IPAD   │                          │
│                                  ▼                          │
│                      ┌──────────────────┐                   │
│                      │  Touch Interface │                   │
│                      │  (Web App)       │                   │
│                      └──────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Components

1. **WebSocket Server** (Node.js)
   - Routes messages between devices
   - Serves iPad interface
   - Handles reconnections

2. **Chrome Extension** (Manifest V3)
   - Detects Instagram content
   - Automates save actions
   - Maintains WebSocket connection

3. **iPad Touch Interface** (HTML/CSS/JS)
   - Displays current content
   - Provides tag buttons
   - Manages configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed on MacBook
- Chrome browser
- iPad on same WiFi network
- Instagram account logged in

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/BalaSeethaRamanjaneyulu/Instagram-Saver-.git
cd Instagram-Saver-
```

**2. Start the server**
```bash
cd server
npm install
npm start
```

You'll see:
```
🚀 Instagram Saver Server running!
📱 iPad Interface: http://192.168.X.X:8080
```

**3. Load Chrome Extension**
1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

**4. Open iPad Interface**

On your iPad, navigate to the URL shown in server output (e.g., `http://192.168.X.X:8080`)

Or test locally: `http://localhost:8080`

### First Use

1. Open an Instagram reel in Chrome
2. See it appear on iPad instantly ✨
3. Tap a tag button (e.g., "Technology")
4. Watch automatic save happen! 🎉
5. Check Instagram → Saved → Collections

## 📖 Documentation

- [Quick Start Guide](README.md) - You are here
- [Complete Walkthrough](Instagram/Technical_Documentation.md) - Detailed system documentation
- [Code Guide](Instagram/Code_Guide.md) - Implementation details
- [Deployment Checklist](Instagram/Deployment_Checklist.md) - Testing procedures

## 🎨 Customization

### Adding Custom Tags

1. Open iPad interface
2. Tap Settings (⚙️)
3. Click "+ Add Tag"
4. Set name, emoji, and color
5. Done! New tag appears immediately

### Default Tags

- 💻 Technology
- 💪 Motivation
- 📚 Information
- 🏢 Companies
- 🎨 Design
- ⌨️ Coding

## 🔧 Configuration

### Server

Edit `server/server.js`:
```javascript
const PORT = 8080; // Change port if needed
```

### Extension

Edit `extension/background.js`:
```javascript
const WS_SERVER = 'ws://localhost:8080'; // Server URL
```

### iPad

Configure via Settings UI:
- Server URL (auto-detected)
- Tags and colors
- Stored in localStorage

## 📂 Project Structure

```
Instagram-Saver-/
├── server/
│   ├── server.js          # WebSocket + HTTP server
│   └── package.json       # Dependencies
├── extension/
│   ├── manifest.json      # Extension config
│   ├── background.js      # Service worker
│   ├── content.js         # Instagram automation
│   ├── popup.html/js      # Extension popup
│   └── icons/             # Extension icons
├── ipad-interface/
│   └── index.html         # Touch interface
└── Instagram/
    └── *.md               # Documentation
```

## 🐛 Troubleshooting

### Extension Won't Connect

**Check:**
- Server is running (`npm start`)
- Extension shows `ws://localhost:8080`

**Fix:**
- Restart server
- Reload extension

### iPad Can't Connect

**Check:**
- Both devices on same WiFi
- Correct IP in server output
- Firewall not blocking port 8080

**Fix:**
- Test locally first: `http://localhost:8080`
- Check MacBook firewall settings

### Instagram Automation Fails

**Cause:** Instagram changed their DOM (happens frequently)

**Fix:**
- Check browser console for errors
- Update selectors in `extension/content.js`
- URL will be copied to clipboard as fallback

## 🛣️ Roadmap

- [ ] Multi-platform support (YouTube, Twitter, TikTok)
- [ ] Save analytics and history
- [ ] AI-powered auto-tagging
- [ ] Cloud sync for tags
- [ ] Mobile app versions
- [ ] Keyboard shortcuts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with vanilla JavaScript (no frameworks needed!)
- Icons generated with AI
- Inspired by the need for effortless content curation

## 📧 Contact

Bala Seetha Raman - [@BalaSeethaRamanjaneyulu](https://github.com/BalaSeethaRamanjaneyulu)

Project Link: [https://github.com/BalaSeethaRamanjaneyulu/Instagram-Saver-](https://github.com/BalaSeethaRamanjaneyulu/Instagram-Saver-)

---

<div align="center">
  
**Made with ❤️ for effortless content curation**

⭐ Star this repo if you find it useful!

</div>
