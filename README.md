# SkyCast — Smart Weather Forecasting Platform

<p align="center">
  <b>BCA Final-Year Major Project (2026)</b><br>
  <i>"Your Weather, Our Priority"</i>
</p>

---

## 🌤️ Project Overview

**SkyCast** is a cross-platform, full-stack weather intelligence platform inspired by modern premium dark UI aesthetics. It features:
- **Responsive Web Dashboard** (React 18 + Vite) with glassmorphism cards, interactive Leaflet weather maps, real-time WMO weather codes, and 7-day outlooks.
- **Android Mobile Application** (React Native + Expo SDK 52) featuring Splash, Login, Home Dashboard, City Search, and Saved Cities screens matching the visual design showcase.
- **Node.js & Express REST Backend** providing caching, validation (Zod), JWT authentication, rate limiting, and seamless Open-Meteo integration.
- **MongoDB & Mongoose Database Layer** storing user accounts, favorites, and synchronized temperature preferences (with automatic local in-memory fallback for offline demonstrations).

---

## 💎 Design System & Visual Specification

Inspired directly by `SkyCast Weather App UI Showcase.png`:
- **Palette:** Dark Navy `#0B132B`, Card `#111C38`, glowing Electric Cyan `#00D2FF` and Sky Blue `#38BDF8`.
- **Card Aesthetics:** 1px subtle neon borders, backdrop blur, rounded corners (24px/16px), and skyline silhouettes.
- **File Naming Conventions:** All React UI components and entry files containing JSX strictly use the `.jsx` extension (`App.jsx`, `main.jsx`, `Dashboard.jsx`, `Sidebar.jsx`, `WeatherCard.jsx`, `Navbar.jsx`, etc.). Plain JavaScript utilities use `.js`.

---

## 🛠️ Technology Stack

| Tier | Technologies |
|---|---|
| **Web Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, Leaflet & React-Leaflet |
| **Mobile App** | React Native 0.76, Expo SDK 52, Expo Linear Gradient |
| **Backend API** | Node.js LTS, Express 4, Zod, Helmet, CORS, Express-Rate-Limit, Morgan |
| **Database** | MongoDB, Mongoose ODM (Atlas Cloud / Local / Memory-Safe Fallback) |
| **Weather APIs** | Open-Meteo Forecast API, Geocoding API, Air Quality API |
| **Testing** | Vitest, Supertest |

---

## 📁 Repository Structure

```text
skycast/
├── apps/
│   ├── web/                     # React + Vite Web Application (.jsx components)
│   │   ├── src/
│   │   │   ├── api/client.js
│   │   │   ├── components/      # Sidebar.jsx, TopBar.jsx, WeatherCard.jsx, etc.
│   │   │   ├── pages/           # Dashboard.jsx, FavoritesPage.jsx, SearchPage.jsx, SettingsPage.jsx
│   │   │   ├── utils/           # units.js, wmo.js
│   │   │   ├── App.jsx          # Root React Component
│   │   │   └── main.jsx         # Vite Frontend Entry Point
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── mobile/                  # React Native + Expo Android App
│   │   ├── src/
│   │   │   ├── api/client.js
│   │   │   ├── screens/         # SplashScreen.js, HomeScreen.js, SearchScreen.js, etc.
│   │   │   └── components/      # BottomNavBar.js
│   │   ├── App.js
│   │   ├── app.json
│   │   └── package.json
│   └── api/                     # Node.js + Express REST API
│       ├── src/
│       │   ├── config/          # db.js, env.js
│       │   ├── controllers/     # weatherController.js, authController.js, userController.js
│       │   ├── middleware/      # auth.js, errorHandler.js
│       │   ├── models/          # User.js (Mongoose Schema + Memory Fallback)
│       │   ├── routes/          # api.js
│       │   ├── services/        # forecastService.js, geocodingService.js, airQualityService.js
│       │   ├── utils/           # units.js, wmo.js
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/               # api.test.js
│       └── package.json
├── docs/                        # ARCHITECTURE.md, API.md, TESTING.md, DEPLOYMENT.md
├── .github/workflows/ci.yml     # Automated CI pipeline
├── .gitignore
├── PROJECT_PLAN.md              # Project Master Specification
├── SkyCast Weather App UI Showcase.png # Primary visual reference
├── package.json                 # Monorepo Workspace Configuration
└── README.md                    # Project Documentation
```

---

## 🚀 Quickstart & Setup (Windows PowerShell)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS verified)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
Run the command below in the project root:
```powershell
npm install
```

### 3. Start the Backend API Server
```powershell
npm run dev:api
```
The API starts at `http://localhost:5000`.  
- Health check: `http://localhost:5000/api/v1/health`
- Weather search: `http://localhost:5000/api/v1/weather/search?q=London`

### 4. Start the Web Frontend (React + Vite)
In a separate terminal:
```powershell
npm run dev:web
```
Open your browser at `http://localhost:5173`.

### 5. Start Both API & Web Concurrently
```powershell
npm run dev
```

### 6. Start the Mobile Android Application (Expo)
```powershell
npm run dev:mobile
```
Press `a` to launch in Android Emulator, or scan the QR code with **Expo Go** on your Android phone!

---

## 🧪 Testing & Verification

Run all test suites across the monorepo:
```powershell
npm test
```

Run API integration tests:
```powershell
npm run test:api
```

Run Web frontend tests:
```powershell
npm run test:web
```

Run Web production build:
```powershell
npm run build:web
```

---

## 🔐 Demo Credentials for Evaluation

You can test user authentication, cloud favorites syncing, and persistent settings with these pre-seeded demo credentials:
- **Email:** `john@example.com`
- **Password:** `password123`

*(Alternatively, register any new account directly in the UI)*

---

## 📜 Provider Attribution & Academic Disclaimer

- Weather data and geocoding services provided by [Open-Meteo](https://open-meteo.com/) under non-commercial and commercial attribution licensing.
- Developed as a major project for BCA Final-Year University Evaluation.
