# SkyCast — System Architecture & Technical Specifications

**Course:** Bachelor of Computer Applications (BCA) Final-Year Major Project  
**Author:** SkyCast Team  
**Year:** 2026  

---

## 1. High-Level Architecture Overview

SkyCast adopts a 3-tier decoupled monorepo architecture consisting of a responsive Web Frontend, an Android Mobile Application, a central Express REST API, and a MongoDB database with integration into the Open-Meteo Weather & Geocoding APIs.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|                                                                         |
|  +--------------------------------+   +-------------------------------+ |
|  |     React + Vite (Web)         |   |    React Native + Expo        | |
|  |  - Responsive Glassmorphic UI  |   |    (Android App)              | |
|  |  - Leaflet Weather Radar Map   |   |  - Native Bottom Tab Nav      | |
|  |  - WMO Code Icons              |   |  - Splash, Auth, & Favorites  | |
|  +--------------------------------+   +-------------------------------+ |
+-------------------------------------------------------------------------+
                                    |
                    REST API Requests over HTTP/HTTPS
                    (JSON payloads + Bearer JWT Auth)
                                    v
+-------------------------------------------------------------------------+
|                             API LAYER                                   |
|                                                                         |
|  Node.js + Express REST API (apps/api)                                  |
|  ├── Security: Helmet, CORS, Rate Limiting, Input Validation (Zod)      |
|  ├── Authentication Controller: JWT + Bcrypt Password Hashing           |
|  ├── User & Preferences Controller: Favorites Management (Max 20)       |
|  ├── In-Memory Response Caching (5-min TTL)                             |
|  └── Centralized Error Handling & Diagnostics                           |
+-------------------------------------------------------------------------+
             |                                             |
             v                                             v
+-----------------------------+               +---------------------------+
|       DATABASE LAYER        |               |    EXTERNAL DATA LAYER    |
|                             |               |                           |
|  MongoDB + Mongoose ODM     |               |  Open-Meteo Weather APIs  |
|  - Users Collection         |               |  - Forecast (Current/7d)  |
|  - Embedded Favorites       |               |  - Geocoding (200k+ cities|
|  - Unit Settings            |               |  - Air Quality (AQI)      |
+-----------------------------+               +---------------------------+
```

---

## 2. Component Design

### 2.1 Web Frontend (`apps/web`)
- **Technology:** React 18, Vite 6, Tailwind CSS, Lucide React, Leaflet & React-Leaflet.
- **Conventions:** All React UI files containing JSX use the `.jsx` extension (`App.jsx`, `main.jsx`, `Sidebar.jsx`, `WeatherCard.jsx`, `Dashboard.jsx`, etc.). Plain JavaScript utilities use `.js`.
- **UI Design System:** Deep navy palette (`#0B132B`, `#111C38`), glowing electric cyan accents (`#00D2FF`, `#38BDF8`), glassmorphism cards with subtle border luminescence.

### 2.2 Mobile Android Application (`apps/mobile`)
- **Technology:** React Native 0.76, Expo SDK 52, Expo Linear Gradient.
- **Screens:** Splash Screen, Login/Registration Screen, Home Dashboard with Hourly scroll, City Search with popular destinations, Saved Cities manager, Settings with runtime Server IP configuration.

### 2.3 Backend REST API (`apps/api`)
- **Technology:** Node.js LTS, Express 4, Zod schema validation, Helmet security middleware, Express Rate Limit, Morgan logging, Bcryptjs, JSON Web Tokens.
- **Fail-Safe Operation:** Provides automatic local memory fallback store if MongoDB is offline during initial viva demonstration or quick review.

---

## 3. Data Flow & Security
1. **User Authentication:** Passwords hashed using bcrypt (10 rounds). Tokens issued via JWT with 7-day expiration.
2. **Weather Queries:** Client requests `/api/v1/weather/forecast?lat=...&lon=...`. The backend checks a 5-minute memory cache before querying Open-Meteo, preventing rate limits and accelerating response times.
3. **Favorites Deduplication:** Checked by latitude/longitude proximity (within 0.05°) and city/country keys, capping lists at 20 items per user.
