# Ramadan Time (Extension)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A modern, privacy-first Chrome Extension for tracking prayer times and Ramadan countdowns. Built for speed, aesthetics, and privacy.

## ✨ Features

- **🛡️ Privacy First:** No GPS tracking. Manual location search only.
- **⚡ Compact UI:** 400x500px "Cockpit" dashboard. No scrolling.
- **🎨 Modern Design:** Clean aesthetic using *Inter* and *Outfit* typography.
- **🌍 Global Search:** Integrated OpenStreetMap Nominatim city search.
- **🌙 Smart Countdowns:** Live countdown to the next prayer, Iftar, or Suhoor.
- **🔔 Notifications:** Alerts for all 5 daily prayers.
- **⚙️ Configurable:** Supports multiple calculation methods (MWL, ISNA, etc.).

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4)
- **State/Storage:** Chrome Storage API
- **Time Logic:** `adhan` + `date-fns`
- **Icons:** Heroicons + Custom SVG

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ramadan-time.git
    cd ramadan-time
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```
    *This creates a `dist` directory.*

4.  **Load in Chrome**
    1.  Open Chrome and navigate to `chrome://extensions`.
    2.  Enable **Developer mode** (top right toggle).
    3.  Click **Load unpacked**.
    4.  Select the `ramadan-time/dist` folder.

## 📦 Project Structure

```
ramadan-time/
├── public/              # Static assets (manifest.json, icons)
├── src/
│   ├── background/      # Service worker (alarms/notifications)
│   ├── components/      # React UI components (Dashboard, Onboarding)
│   ├── hooks/           # Custom hooks (usePrayerTimes, useCountdown)
│   ├── lib/             # Utilities (storage, types)
│   └── App.tsx          # Main entry component
├── index.html           # Popup HTML
├── tailwind.config.js   # Style configuration
└── vite.config.ts       # Build configuration
```

## 🤝 Contributing

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
