# Prayer.time (Extension)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Extension Size](https://img.shields.io/badge/extension%20size-%3C100%20KB-2ea44f.svg)](https://github.com/yourusername/Prayer.time)
[![Edge Add-ons](https://img.shields.io/badge/Edge%20Add--ons-Install-0078D7?logo=microsoftedge&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/prayer-time/)
[![Mozilla Add-ons](https://img.shields.io/badge/Mozilla%20Add--ons-Install-FF7139?logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/prayer-time/)

A modern, minimalist, privacy-first, lightweight browser extension for prayer times and Ramadan countdowns. Built for speed, aesthetics, and privacy.

## 📸 Screenshots

<table>
  <tr>
    <td><img src="screenshot/screenshot (1).png" alt="Screenshot 1" width="260"/></td>
    <td><img src="screenshot/screenshot (2).png" alt="Screenshot 2" width="260"/></td>
    <td><img src="screenshot/screenshot (3).png" alt="Screenshot 3" width="260"/></td>
  </tr>
</table>

## ✨ Features

### Core

- **🛡️ Privacy First:** No GPS tracking. Manual location search only.
- **⚡ Compact UI:** 400×500px "Cockpit" dashboard. No scrolling.
- **🎨 Modern Design:** Clean aesthetic using *Inter* and *Outfit* typography.
- **🌍 Global Search:** Integrated OpenStreetMap Nominatim city search.
- **🌙 Smart Countdowns:** Live countdown to the next prayer, Iftar, or Suhoor.
- **⚙️ Configurable:** Supports 11 calculation methods (MWL, ISNA, Karachi, Umm al-Qura, and more).

### Notifications

- **🔔 In-app Popup:** A non-intrusive pill overlay slides in from the bottom-right corner of the extension at prayer time, accompanied by a soft 3-note rising chime synthesized via the Web Audio API. It auto-dismisses after a configurable duration (1–60 min) with a circular countdown ring — no interaction needed.
- **🖥️ Browser Alert:** A native OS-level notification that fires even when you are on a completely different browser tab. Requires one-time browser permission grant. Works on Chrome, Edge, and Firefox.

### Prayer Time Calibration

- **🎚️ Fine-Tune Prayer Times:** Manually adjust each of the 6 prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) by ± minutes to match your local mosque or personal preference. Adjustments are saved and applied instantly on every save.

## ⚙️ Settings Overview

| Setting | Description |
|---|---|
| Location | Search any city worldwide via OpenStreetMap |
| Calculation Method | 11 supported methods for worldwide accuracy |
| Fine-Tune Prayer Times | Per-prayer ± minute offset |
| Enable Alarms | Toggle background service worker alarms |
| In-app Popup | Pill overlay with chime when extension is open |
| Popup Duration | How long the pill stays visible (1–60 min) |
| Browser Alert | Native OS notification — works across all tabs |

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4)
- **State/Storage:** Chrome Storage API / `localStorage`
- **Prayer Times:** `adhan` + `date-fns`
- **Notifications:** Web Notifications API + Web Audio API
- **Icons:** Heroicons + Custom SVG

## 🚀 Getting Started

### Install from Browser Stores

> **Microsoft Edge Add-ons**

- <https://microsoftedge.microsoft.com/addons/detail/prayertime/iahnpaidkeghoncohilkghfhnffjadaf>

> **Mozilla Firefox Add-ons**

- <https://addons.mozilla.org/en-US/firefox/addon/prayer-time/>

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/Prayer.time.git
    cd prayer.time
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Build for Production**

    ```bash
    npm run build
    ```

    *This creates a `dist` directory.*

4. **Load in Chrome**
    1. Open Chrome and navigate to `chrome://extensions`.
    2. Enable **Developer mode** (top right toggle).
    3. Click **Load unpacked**.
    4. Select the `dist` folder.

## 📦 Project Structure

```
Prayer.time/
├── public/              # Static assets (manifest.json, icons)
├── src/
│   ├── background/      # Service worker (alarms/notifications)
│   ├── components/      # React UI components
│   │   ├── Dashboard.tsx      # Main prayer times view
│   │   ├── Onboarding.tsx     # First-run city setup
│   │   ├── SettingsModal.tsx  # Settings sheet
│   │   └── PrayerPopup.tsx    # In-app pill notification
│   ├── hooks/           # Custom hooks
│   │   ├── usePrayerTimes.ts  # Adhan calculation + adjustments
│   │   ├── useCountdown.ts    # Live next-prayer countdown
│   │   └── useCitySearch.ts   # Nominatim city search
│   ├── lib/             # Utilities
│   │   ├── storage.ts         # Settings persistence
│   │   └── notifications.ts   # Beep + OS notification helpers
│   └── App.tsx          # Root component & notification orchestration
├── index.html           # Popup HTML shell
└── vite.config.ts       # Build configuration
```

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
