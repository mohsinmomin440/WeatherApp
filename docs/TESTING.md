# SkyCast — Automated & Manual Testing Guide

## 1. Automated Test Suites

The project provides automated unit and integration tests across both the API backend and the React web frontend.

### Running Backend API Tests
Backend tests use Vitest and Supertest to verify:
- Health check route response.
- Open-Meteo geocoding search for real cities.
- Input validation on query parameters and coordinate boundaries.
- Live Open-Meteo forecast retrieval for current, hourly, and 7-day data.
- User registration, password hashing, and duplicate rejection.
- Login credential verification.
- Protected routes rejecting unauthenticated requests.
- Adding and removing favorite cities.
- Unit preference updates.

**Command:**
```powershell
npm run test:api
```

### Running Frontend Tests
Frontend tests verify:
- Temperature conversions between Celsius and Fahrenheit.
- Wind speed conversions between km/h and mph.
- WMO weather code mapping to icon identifiers.

**Command:**
```powershell
npm run test:web
```

### Running All Tests Across Monorepo
```powershell
npm run test
```

---

## 2. Production Build Verification

Verify that the web frontend bundles cleanly with zero warnings or errors:
```powershell
npm run build:web
```

---

## 3. Manual Test Checklist for Viva Demonstration

| Test Case | Steps | Expected Result | Verified |
|-----------|-------|-----------------|:--------:|
| Health Check | Visit `http://localhost:5000/api/v1/health` | Status 200, healthy JSON returned | PASS |
| Search City | Type "Ahmedabad" in top search bar | Dropdown presents matched coordinates | PASS |
| Load Forecast | Click any city from search results | Hero card, hourly bar, and 7-day outlook update | PASS |
| Unit Toggle | Click the `°C | °F` button on the top bar | All temperatures update instantly | PASS |
| Authentication | Open "Sign In", enter demo credentials, click Login | John Doe avatar appears, favorites sync | PASS |
| Add Favorite | Click heart icon on hero card | City saves to favorites list | PASS |
| Weather Radar | Inspect the Weather Map card | Interactive Leaflet dark radar map renders | PASS |
| Mobile Screen | Shrink browser width to 375px | Layout adapts with mobile drawer & responsive cards | PASS |
