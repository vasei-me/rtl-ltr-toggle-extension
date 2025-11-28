# Text Direction Controller Extension

A Chrome extension for controlling text direction (RTL/LTR) on web pages

## 🚀 Features

- 🔄 Toggle text direction on web pages with one click
- 💾 Save settings per domain separately
- 🎯 Simple and intuitive user interface
- ⚡ Fast performance without affecting page load
- 🌍 Supports all websites and web applications

## 📦 Installation

### Method 1: From Chrome Web Store (When Published)

1. Open Chrome Browser
2. Go to [Chrome Web Store - Text Direction Controller]
3. Click "Add to Chrome"
4. Confirm installation by clicking "Add Extension"

### Method 2: Manual Installation (Developer Mode)

1. **Download the Extension**

   ```bash
   git clone https://github.com/vasei-me/rtl-ltr-toggle-extension.git
   ```

   Or download the ZIP file and extract it

2. **Open Chrome Extensions Page**

   - Open Chrome browser
   - Type `chrome://extensions/` in the address bar
   - Or click ⋮ (Menu) → **More Tools** → **Extensions**

3. **Enable Developer Mode**

   - Toggle the **"Developer mode"** switch in the top-right corner
   - This will reveal additional options

4. **Load the Extension**

   - Click the **"Load unpacked"** button
   - Select the folder containing the extension files
   - Make sure to select the root folder where `manifest.json` is located

5. **Verify Installation**
   - You should see the extension in the extensions list
   - The extension icon should appear in the Chrome toolbar

## 🎯 How to Use

### Basic Usage

1. **Navigate to any website** where you want to change text direction
2. **Click the extension icon** in the Chrome toolbar
3. **Use the toggle button** to switch between:
   - **RTL (Right-to-Left)** - For languages like Arabic, Hebrew, Persian
   - **LTR (Left-to-Right)** - For languages like English, French, Spanish
4. **The page will immediately update** with the new text direction

## 🔧 Troubleshooting

### Extension Not Appearing?

- Refresh the extensions page
- Ensure you selected the correct folder
- Check that all files are present

### Extension Not Working on Some Websites?

- Some websites may have strict Content Security Policies
- Try refreshing the page after enabling the extension
- The extension works on most modern websites

### Settings Not Saving?

- Ensure you're not in incognito mode (extension needs storage permission)
- Check if storage is available in your Chrome browser

## 🛠️ Development

### Prerequisites

- Node.js and npm
- TypeScript
- React

### Building from Source

```bash
# Clone the repository
git clone  https://github.com/vasei-me/rtl-ltr-toggle-extension.git

# Install dependencies
npm install

# Build the extension
npm run build

# Load the built extension in Chrome
```
