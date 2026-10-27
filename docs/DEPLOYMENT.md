# SkyCast — Deployment & Production Guide

This guide details deployment procedures for the backend API, web frontend, Android mobile application, and MongoDB database.

---

## 1. MongoDB Database Setup (MongoDB Atlas)

1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a user with read and write permissions (e.g. `skycast_app`).
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or restrict to your server's IP address.
5. Retrieve the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/skycast?retryWrites=true&w=majority
   ```
6. Set this value in your backend deployment environment variable `MONGODB_URI`.

---

## 2. Backend Deployment (Render, Railway, or AWS)

1. Connect your repository to your cloud host (e.g. [Render](https://render.com) or [Railway](https://railway.app)).
2. Configure service settings:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variables:
   - `PORT=5000` (or host provided `$PORT`)
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_atlas_connection_string>`
   - `JWT_SECRET=<strong_random_secret_string>`
   - `CLIENT_URL=https://your-skycast-web.vercel.app`
4. Confirm health check at `https://your-api.onrender.com/api/v1/health`.

---

## 3. Web Frontend Deployment (Vercel or Netlify)

1. Import the repository in [Vercel](https://vercel.com).
2. Configure build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL=https://your-api.onrender.com/api/v1`
4. Deploy and verify responsive interface and dark UI styling.

---

## 4. Android Application (Expo / EAS Build)

1. Install EAS CLI globally if building APK:
   ```powershell
   npm install -g eas-cli
   ```
2. In `apps/mobile`:
   ```powershell
   cd apps/mobile
   eas build --platform android --profile preview
   ```
3. Alternatively, test on a physical phone using Expo Go:
   - Connect computer and phone to the same Wi-Fi network.
   - Set `EXPO_PUBLIC_API_URL=http://<your-pc-ip>:5000/api/v1` in `apps/mobile/.env`.
   - Run `npx expo start` and scan the QR code using Expo Go on Android!
