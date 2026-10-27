# SkyCast — Smart Weather Forecasting Platform
## Complete Project Plan, Product Requirements, Architecture, and Implementation Guide

**Project type:** BCA Final-Year Major Project  
**Platforms:** Responsive Web Application + Android Application  
**Experience:** Advanced, portfolio-quality, production-minded  
**Design direction:** Premium dark UI  
**Frontend:** React + Vite (web), React Native + Expo (Android)  
**Backend:** Node.js + Express  
**Language:** JavaScript initially, with consistent module conventions  
**Database:** MongoDB + Mongoose  
**Weather provider:** Open-Meteo Forecast API + Geocoding API; evaluate Air Quality API for AQI features  
**Repository name:** `skycast`

---

## 0. Instructions for the AI Coding Agent (Antigravity)

Treat this document as the source of truth for building the project.

### Required working style
1. Inspect the existing repository and environment before changing files. Do not assume the repository is empty.
2. Produce a short implementation plan, then implement the project in small, verifiable phases.
3. Work in the repository; create and edit real files rather than merely describing code.
4. Do not leave core features as placeholders, TODOs, mock responses, or non-functional buttons.
5. Use real weather API data. Clearly label unavailable data and never fabricate weather values.
6. Use exact filenames and correct imports. Ensure each package's `package.json` accurately declares its dependencies and scripts.
7. Use stable, mutually compatible package versions. Check official documentation when package behavior or commands may have changed.
8. Run formatting/linting, type or syntax checks where configured, tests, and production builds. Fix errors before proceeding.
9. Do not claim a command, test, build, deployment, or feature succeeded unless it was actually run and verified.
10. Keep secrets in environment variables. Never commit credentials, tokens, database connection strings, or real `.env` files.
11. Add `.env.example` files with safe dummy values and a root `.gitignore`.
12. Ask before destructive actions, deleting user files, overwriting unrelated work, pushing commits, deploying, spending money, or creating external resources.
13. If credentials, API access, a physical Android device, or a paid service is unavailable, build what can be built, explain the limitation, and provide precise manual steps.
14. After each phase, report changed files, commands run, results, known issues, and the next phase. Do not dump large code snippets into the chat when the code has been written to the repository.
15. Prioritize correctness, security, accessibility, responsiveness, maintainability, and a professional student-project deliverable.
16. Keep code beginner-readable and include useful comments where they explain non-obvious logic. Avoid unnecessary complexity and overengineering.
17. Never use hardcoded secrets or expose private user data in logs.
18. If the repository already contains useful code, preserve and adapt it rather than blindly replacing it.

### Definition of done
The project is not complete until:
- The web app and Android app can use the same backend.
- The documented setup works from a clean checkout.
- Core routes, weather search, forecast rendering, authentication, favorites, and unit settings are tested.
- The frontend production build succeeds.
- API validation and error handling are implemented.
- Mobile API networking is configurable and does not assume `localhost` on a physical device.
- The README explains setup, environment variables, testing, architecture, and deployment.
- No `.env`, secrets, or generated build artifacts are committed.
- The agent provides an honest final verification report.

---

## 1. Product Summary

**SkyCast** is a modern weather forecasting platform that provides current weather conditions, hourly forecasts, a 7-day outlook, searchable cities, saved locations, user accounts, weather insights, and a consistent experience across web and Android.

### Product goals
- Deliver a polished, responsive weather experience.
- Demonstrate full-stack skills appropriate for a BCA final-year project.
- Use a real external weather data provider.
- Share backend business logic between web and mobile clients.
- Include authentication, persistent preferences, testing, documentation, and deployment readiness.
- Provide a clear GitHub portfolio project with meaningful architecture and commits.

### Target users
- Students and everyday users checking local and travel weather.
- Users who want to compare and save multiple cities.
- Users who want a simple forecast and practical weather information.

### Scope principles
- Build a reliable MVP first, then add advanced features.
- Do not represent forecast estimates as guarantees.
- Do not claim official emergency alerts unless a trustworthy alert source is integrated.
- Do not present unsupported data such as visibility or AQI if the provider does not return it.
- Location access is optional; manual city search must always work.

---

## 2. Main Features

### 2.1 Weather dashboard
- Selected city name and country.
- Current temperature and feels-like temperature.
- Human-readable weather condition from WMO weather codes.
- Humidity, wind speed/direction, pressure, and precipitation when available.
- UV index, sunrise, sunset, and daily temperature range when available.
- Loading skeletons, empty states, and clear error/retry states.
- Last-updated/local-time display based on API timezone.
- Celsius/Fahrenheit unit switch.

### 2.2 City search
- Search by city name using Open-Meteo Geocoding API.
- Show city, region/admin area, and country to distinguish similar names.
- Handle no results, slow network, provider errors, and rate limits.
- Debounce search if live suggestions are implemented.
- Do not issue a request for every keystroke without a debounce or explicit submit.
- Store selected coordinates with a city label; never infer coordinates from a city name.

### 2.3 Forecasts
- Hourly forecast for the next 24 hours, based on the provider's local timezone.
- 7-day daily forecast with high/low temperature.
- Precipitation probability where supplied.
- Daily sunrise/sunset and maximum UV index where supplied.
- Accessible forecast cards and horizontal scrolling on narrow screens.
- Correctly handle dates and time zones; avoid assuming the browser's timezone matches the city's timezone.

### 2.4 Accounts and profile
- Registration with name, email, and password.
- Login and logout.
- Password hashing using bcrypt or a suitable maintained password-hashing library.
- Validated input and generic login failure messages.
- User profile endpoint.
- Never return password hashes from APIs.
- Authentication token lifecycle documented and implemented securely.
- Do not store long-lived bearer tokens in insecure browser local storage for a production deployment without explicitly documenting the risk. Prefer a secure, HttpOnly cookie for web sessions where feasible; use a carefully designed mobile token store for Android.
- If a simple bearer-token MVP is used, document its limitations and add expiry, validation, and safe storage. Do not log tokens.
- Add rate limits to authentication endpoints.
- Handle duplicate email registration cleanly.

### 2.5 Favorites and preferences
- Authenticated users can save up to 20 cities.
- Add, remove, and list favorites.
- Prevent duplicate favorites by normalized coordinates or a stable location ID.
- Persist temperature unit preference (`celsius` or `fahrenheit`).
- Store preferences in MongoDB for signed-in users.
- For guest users, local preference persistence is optional and must not break the app.

### 2.6 Weather insights
- Display precipitation probability and UV index when supplied.
- Provide simple, rule-based activity suggestions with transparent logic.
- Label recommendations as informational, not medical or safety advice.
- Do not create unsupported severe-weather notifications.
- If air-quality support is added, use the official provider API and clearly show its source and timestamp.
- Missing provider values should display “Not available” or be omitted.

### 2.7 Advanced polish
- Premium dark theme with subtle blue/cyan accents.
- Responsive desktop, tablet, and mobile layouts.
- Accessible contrast, keyboard navigation, visible focus states, semantic elements, and useful labels.
- Weather icons mapped from WMO codes.
- Charts only where they improve readability.
- Friendly empty, loading, offline, and retry states.
- Reduced-motion support.
- Avoid excessive animation and visual clutter.

### 2.8 Optional stretch goals (only after core acceptance criteria)
- Browser geolocation with explicit permission and manual-search fallback.
- Android location permission flow with a clear explanation.
- Air-quality information.
- Weather history snapshots, with timestamps and data-source caveats.
- PWA support for the web app.
- Push notifications only if a real notification system and suitable alert source are implemented.
- Internationalization, including English and Gujarati/Hindi.
- CI workflow for linting and tests.

---

## 3. Technology Stack

### Web
- React
- Vite
- React Router if multiple pages are needed
- Fetch API or Axios (choose one consistently)
- Lucide React icons
- Recharts only for useful charts
- CSS Modules, plain CSS, or a consistent styling system; avoid mixing multiple UI systems without reason

### Android
- React Native
- Expo
- Expo Router or React Navigation (choose one and use it consistently)
- Expo SecureStore for secure token storage if bearer tokens are used
- AsyncStorage only for non-sensitive preferences/cache
- Expo Location only if location is implemented, with permission handling
- Shared API client conventions with the web app

### Backend
- Node.js LTS
- Express
- MongoDB and Mongoose
- Zod for request validation
- Helmet for security headers
- CORS configured from environment variables
- Rate limiting for API and especially authentication
- bcrypt/bcryptjs or another appropriate password hashing implementation
- JWT or a documented cookie-session approach
- Centralized error handler and request logging that excludes secrets

### External services
- Open-Meteo Forecast API: `https://api.open-meteo.com/v1/forecast`
- Open-Meteo Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Open-Meteo Air Quality API only if AQI is included: `https://air-quality-api.open-meteo.com/v1/air-quality`
- Review current provider terms, attribution, usage limits, and commercial-use requirements before public deployment.

### Database
- MongoDB Atlas for hosted deployment.
- Local MongoDB may be used for development.
- No database credential may be embedded in frontend or mobile bundles.

### Testing and quality
- Vitest and React Testing Library for web tests.
- Jest/Expo-compatible testing setup or a documented compatible choice for mobile.
- Node test runner, Vitest, or Jest for API tests; choose one consistent framework.
- Supertest for API integration tests.
- ESLint and optionally Prettier.
- GitHub Actions for CI once local tests work.

---

## 4. Repository Structure

Use an npm-workspaces monorepo unless the existing repository has a strong reason not to.

```text
skycast/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── favorites/
│   │   │   │   ├── forecast/
│   │   │   │   └── search/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── utils/
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── .env.example
│   │   └── package.json
│   ├── mobile/
│   │   ├── app/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── app.json
│   │   ├── .env.example
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── schemas/
│       │   ├── services/
│       │   │   ├── weather/
│       │   │   └── geocoding/
│       │   ├── utils/
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/
│       ├── .env.example
│       └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── package.json
├── PROJECT_PLAN.md
└── README.md
```

The agent may adjust the exact structure if the installed Expo template or existing repository requires it, but must preserve separation between clients, API, data models, and provider services.

---

## 5. API Design

Use `/api/v1` as the API prefix unless an existing project convention dictates otherwise.

### Public routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/weather/search?q=Ahmedabad` | City geocoding |
| GET | `/api/v1/weather/forecast?lat=23.02&lon=72.57` | Current/hourly/daily forecast |
| GET | `/api/v1/weather/air-quality?lat=...&lon=...` | Optional AQI feature |

### Authentication routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout/invalidate session as applicable |
| GET | `/api/v1/auth/me` | Current authenticated user |

### Authenticated user routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/v1/users/me` | Profile and preferences |
| GET | `/api/v1/users/favorites` | List saved cities |
| PUT | `/api/v1/users/favorites` | Replace validated favorites list, or use documented CRUD routes |
| PATCH | `/api/v1/users/settings` | Update unit/preferences |

### API requirements
- Validate query parameters and request bodies with schemas.
- Return consistent JSON error responses.
- Use appropriate HTTP status codes.
- Never expose stack traces or internal error details in production responses.
- Set request timeouts when calling upstream weather services.
- Handle upstream timeouts, provider errors, malformed responses, and rate limits.
- Avoid unrestricted proxy endpoints; only call fixed, approved provider hosts.
- Normalize and validate coordinates.
- Cache public weather responses briefly where appropriate, with cache keys based on coordinates and requested fields.
- Do not cache private user responses publicly.
- Document provider units, timestamps, timezone behavior, and missing-data behavior.
- Ensure CORS is configured for exact production frontend origins.
- Add pagination only if a collection can realistically grow beyond the bounded limits.

---

## 6. Database Models

### User
- `name`: required, trimmed, length-limited string.
- `email`: required, normalized lowercase, unique index, validated.
- `passwordHash`: required, never selected by default and never returned.
- `favorites`: bounded array of city objects.
- `settings.unit`: enum of `celsius` or `fahrenheit`.
- `createdAt`, `updatedAt`: timestamps.

### Favorite city
- `name`
- `country` and optional region
- `latitude` in `[-90, 90]`
- `longitude` in `[-180, 180]`
- Optional stable provider location ID
- Deduplication rule

### Optional WeatherSnapshot
Only add this model if weather history is implemented:
- `latitude`, `longitude`
- `locationLabel`
- selected, explicitly documented weather fields
- `observedAt`
- `provider`
- TTL/index strategy if automatic expiry is desired

Do not save every upstream request by default. Keep data collection limited and document retention.

---

## 7. Security Requirements

- Keep MongoDB URI, JWT/session secrets, and deployment secrets in server-side environment variables.
- Use strong randomly generated secrets in production.
- Do not commit `.env` files.
- Passwords must be hashed with an appropriate cost factor.
- Validate all input on the server, even if the frontend validates it too.
- Add authentication rate limits and sensible global rate limits.
- Configure CORS to allow only expected origins.
- Use Helmet and appropriate security headers.
- Apply request body size limits.
- Use short-lived access tokens or secure cookie-based sessions with a documented lifecycle.
- For browser cookies, consider `HttpOnly`, `Secure` in production, `SameSite`, and CSRF protections appropriate to the chosen architecture.
- For Android bearer tokens, use secure platform storage; never hardcode secrets in the mobile bundle.
- Do not store passwords, authorization headers, or tokens in logs.
- Ensure every user-specific database query is scoped to the authenticated user ID.
- Prevent users from reading or modifying another user's favorites/profile.
- Validate environment variables at startup and fail with a clear message if required values are missing.
- Use HTTPS in production.
- Apply safe dependency updates and check for known vulnerabilities.
- Do not expose stack traces or database details in production error responses.

---

## 8. UI/UX Requirements

### Visual style
- Premium dark theme.
- Background: deep navy/charcoal with subtle gradients.
- Accent: restrained cyan/sky blue.
- Rounded cards with subtle borders and restrained shadows.
- Clear typography hierarchy and generous spacing.
- Weather icons should be consistent and mapped from weather codes.
- Avoid excessive glassmorphism, glow effects, and animation.
- Use the same visual language across web and Android, adapted to each platform.

### Web pages
1. Weather dashboard.
2. City search/results.
3. Login.
4. Registration.
5. Saved cities.
6. Settings/profile.
7. Not-found/error state.

### Android screens
1. Dashboard.
2. City search.
3. Login.
4. Registration.
5. Saved cities.
6. Settings/profile.

### Shared UI states
- Initial loading.
- Loading forecast after a city change.
- No city search results.
- Network disconnected or timeout.
- Provider service unavailable.
- Authentication expired.
- Empty favorites.
- Permission denied.
- Data field unavailable.
- Successful save/update feedback.

### Accessibility
- Semantic web markup.
- Accessible names for icon-only controls.
- Keyboard navigation and visible focus rings.
- Sufficient color contrast.
- Dynamic text should remain readable at larger font settings.
- Respect reduced-motion preferences.
- Android controls need suitable touch targets and labels.

---

## 9. Weather Data Handling

### WMO weather codes
Create a centralized utility that maps the provider's WMO weather codes to:
- Condition label.
- Icon.
- Optional presentation category.

Do not scatter magic numbers across UI components.

### Units
- Keep the API's units consistent and documented.
- Prefer Celsius and km/h as the default.
- Convert temperature and any other supported display units in a shared utility.
- Do not convert only the displayed number while leaving unit labels unchanged.
- Make sure charts and forecasts use the same unit preference.

### Time zones
- Request provider-local time using `timezone=auto` where supported.
- Use the returned timezone/local timestamps correctly.
- Do not assume the browser or phone's local timezone is the selected city's timezone.
- Handle daylight-saving transitions and date boundaries carefully.

### Data quality
- Treat missing/null values safely.
- Distinguish current observations/estimates from forecasts as the provider defines them.
- Display source attribution.
- Do not present calculated guesses as provider observations.
- Do not infer air quality, visibility, or official alerts from unrelated weather fields.

### Location privacy
- City search must work without location permission.
- Request geolocation only after the user chooses the feature.
- Explain why permission is requested.
- Do not transmit precise coordinates without user consent.
- Do not persist location history unless the user explicitly uses a feature that needs it and the retention is documented.

---

## 10. Implementation Phases

The coding agent must work phase by phase and verify each phase before starting the next.

### Phase 0 — Repository and environment inspection
- Inspect files, package managers, Node version, Git state, and existing conventions.
- Identify existing work that must be preserved.
- Check official docs for current React, Vite, Expo, Express, MongoDB, and provider API usage.
- Create a short task checklist.
- Do not install packages or overwrite files until the plan is understood.

**Acceptance criteria**
- Repository structure is documented.
- Planned changes are identified.
- No unrelated files are removed or overwritten.

### Phase 1 — Monorepo foundation
- Configure root npm workspaces and shared scripts if suitable.
- Scaffold web, mobile, and API apps with compatible versions.
- Add `.gitignore`, `.env.example` files, and README skeleton.
- Configure linting/formatting and environment-variable validation.
- Add API health endpoint.
- Add a basic dark responsive web shell.
- Add a basic Expo mobile shell.

**Acceptance criteria**
- Install works from repository root.
- Web dev server starts.
- Mobile Expo server starts.
- API starts.
- Health endpoint returns a valid JSON response.
- No secrets are committed.

### Phase 2 — Weather provider integration
- Build geocoding and forecast services in backend.
- Add input validation, timeouts, upstream error handling, and response normalization.
- Implement city search UI.
- Implement dashboard current conditions, hourly forecast, and 7-day forecast.
- Add units and weather-code utility.
- Add data source attribution.

**Acceptance criteria**
- A user can search for a city and choose a result.
- Weather values come from real provider responses.
- Invalid coordinates are rejected.
- Provider errors show friendly messages.
- Missing data does not crash the app.
- Tests cover mapping, validation, and provider failures.

### Phase 3 — Web design and responsive behavior
- Complete dashboard UI and cards.
- Add loading skeletons, empty states, retry states, and responsive layouts.
- Add accessible labels, focus states, and reduced-motion behavior.
- Add reusable components and avoid duplicate UI logic.

**Acceptance criteria**
- Works on desktop, tablet, and phone widths.
- No horizontal page overflow at narrow widths.
- Search, unit switch, and forecasts work.
- Accessibility checks and production build pass.

### Phase 4 — Authentication and security
- Implement registration, login, logout, current-user endpoint, and auth middleware.
- Implement a secure, documented session/token strategy for web and Android.
- Add input schemas, password hashing, rate limits, and safe error handling.
- Add frontend forms and authenticated navigation.
- Add protected-route and unauthorized-state handling.

**Acceptance criteria**
- Valid registration and login work.
- Invalid input and duplicate email are handled.
- Wrong password does not reveal whether unrelated account details are valid.
- Password hashes are never returned.
- Expired/invalid credentials are rejected.
- User-specific routes enforce ownership.
- Security tests pass.

### Phase 5 — Favorites and settings
- Implement saved city operations.
- Implement persisted Celsius/Fahrenheit preference.
- Add favorites UI to web and mobile.
- Prevent duplicates and enforce a reasonable maximum.
- Handle guest behavior cleanly.

**Acceptance criteria**
- Signed-in user can add/remove/reload favorites.
- Favorites persist across sessions.
- One user cannot access another user's data.
- Units are consistent throughout the UI.

### Phase 6 — Android implementation
- Build native dashboard and search screens.
- Connect the same backend.
- Add login/registration, favorites, and settings.
- Configure API base URL through Expo environment configuration.
- Use Expo SecureStore for sensitive tokens where needed.
- Add optional location permission flow with manual-search fallback.
- Test with Android emulator and/or physical device.

**Acceptance criteria**
- App starts on a supported Android test environment.
- It does not assume `localhost` on a physical phone.
- Search and forecast work.
- Login and favorites work.
- Permission denial does not block manual search.
- Android build errors are resolved or documented with precise external prerequisites.

### Phase 7 — Advanced features
Prioritize based on available time:
- Weather charts.
- Rule-based weather insights.
- Optional air quality using a real provider endpoint.
- Optional PWA support.
- Optional weather history.
- Optional notifications only with a trustworthy source and complete permission/opt-in handling.

**Acceptance criteria**
- Every displayed feature is functional.
- Provider attribution and missing-data handling are present.
- No fabricated official alerts.
- Tests cover key business rules.

### Phase 8 — Testing and reliability
- Unit tests for weather-code mapping, unit conversion, validation, and helper functions.
- API integration tests for health, search, forecast validation, auth, favorites, and settings.
- Frontend tests for loading, success, empty, and error states.
- Test upstream timeout and provider error handling.
- Add lint, test, and build scripts.
- Add GitHub Actions CI after local scripts pass.

**Acceptance criteria**
- Documented test commands pass.
- Web production build passes.
- API tests pass using test configuration.
- Mobile checks/build are verified where supported.
- No known critical security or build errors remain unreported.

### Phase 9 — Deployment and BCA submission
- Prepare production environment variable list.
- Deploy backend to a Node.js-capable host.
- Configure MongoDB Atlas access and credentials securely.
- Deploy web app.
- Configure production CORS and HTTPS.
- Build Android APK/AAB using Expo EAS as appropriate.
- Write final README and technical documentation.
- Prepare project report, diagrams, screenshots, test evidence, and viva notes.

**Acceptance criteria**
- Clean setup documented.
- Deployed URL(s) verified if deployment credentials are available.
- Android artifact built if EAS account/configuration is available.
- No secret is present in Git history or frontend bundle.
- Final report accurately lists what is complete and what remains.

---

## 11. Testing Plan

### Backend tests
- Health endpoint returns success.
- Search rejects missing/short/oversized queries.
- Forecast rejects invalid latitude/longitude.
- Provider timeout returns a controlled error.
- Provider non-success response returns a controlled error.
- Registration rejects malformed email and short passwords.
- Password is hashed, not stored in plain text.
- Duplicate registration returns a controlled conflict.
- Login rejects invalid credentials.
- Auth middleware rejects missing, malformed, and expired tokens.
- User profile and favorites require authentication.
- A user cannot alter another user's data.
- Unit settings only accept supported values.

### Web tests
- Dashboard loading state appears.
- Forecast renders returned data.
- Search results can be selected.
- No-results state appears.
- Provider/network error shows a retry path.
- Temperature units change consistently.
- Layout remains usable at narrow widths.
- Forms show validation and server errors accessibly.

### Mobile tests
- Dashboard loads from configured API URL.
- Search results can be selected.
- API failure has a retry state.
- Login and favorites work.
- Secure token storage works as intended.
- Location permission denial preserves manual search.

### Manual test checklist
- [ ] Fresh install from documented steps.
- [ ] API health endpoint.
- [ ] Search a city with multiple matching results.
- [ ] Search a nonexistent city.
- [ ] Load a forecast.
- [ ] Test Celsius/Fahrenheit.
- [ ] Stop network and check error UI.
- [ ] Register, log in, and log out.
- [ ] Add/remove favorites.
- [ ] Restart app and verify persistent data.
- [ ] Test phone-sized web viewport.
- [ ] Test Android on emulator or device.
- [ ] Run tests and production build.
- [ ] Verify `.env` is ignored by Git.

---

## 12. Deployment Guide

### MongoDB Atlas
1. Create an Atlas account and project.
2. Create a cluster following the current Atlas instructions.
3. Create a database user with only the required database permissions.
4. Restrict network access to the hosting environment where feasible.
5. Copy the connection string into the backend environment configuration.
6. Never use database administrator credentials in application code.
7. Verify connection from the deployed backend.

### Backend
1. Push the verified project to GitHub only after reviewing staged files for secrets.
2. Create a service on a Node.js-compatible hosting platform.
3. Configure build/install and start commands for the API workspace.
4. Set `NODE_ENV=production`, `MONGODB_URI`, a strong `JWT_SECRET` or session secret, and production CORS origins.
5. Configure health checks and logs without sensitive data.
6. Verify health, auth, search, and forecast endpoints over HTTPS.

### Web
1. Create a web deployment with the correct app root/workspace settings.
2. Set `VITE_API_URL` to the production API URL.
3. Build the web app.
4. Verify routing, CORS, auth, weather search, and responsive UI.
5. Remember that Vite environment variables are embedded in client assets; never place secrets in `VITE_*`.

### Android
1. Set the API URL to the public HTTPS API URL for production.
2. Configure app name, package identifier, icons, and Android permissions.
3. Follow the current Expo EAS Build instructions.
4. Build an APK for direct testing or AAB for supported store submission workflows.
5. Test the installed build on a real device.
6. Document any EAS account or signing prerequisites.

### Provider terms
Review the weather provider's current terms, attribution, rate limits, and any commercial-use restrictions before public release. Do not assume a free development API is suitable for every production or commercial scenario.

---

## 13. GitHub Quality

The root README should include:
- Project overview and screenshots.
- Feature list.
- Architecture diagram.
- Technology stack.
- Prerequisites.
- Exact setup steps for Windows and general shell environments where practical.
- `.env.example` explanation.
- How to run API, web, and mobile.
- Test and build commands.
- API route documentation.
- Data provider attribution.
- Deployment instructions.
- Known limitations.
- Future improvements.
- License only after an appropriate license is deliberately chosen.

Suggested Git commit milestones:
1. `chore: initialize SkyCast monorepo`
2. `feat(api): add weather and geocoding services`
3. `feat(web): build responsive weather dashboard`
4. `feat(auth): add secure registration and login`
5. `feat(users): add favorites and preferences`
6. `feat(mobile): connect Android client to API`
7. `test: add core API and UI coverage`
8. `docs: add setup and deployment guide`

Do not create commits or push them unless the user has authorized that workflow.

---

## 14. Final Deliverables

The final project should contain:
- [ ] Working React web application.
- [ ] Working Expo Android application.
- [ ] Shared Express API.
- [ ] MongoDB models and setup guide.
- [ ] Real weather and geocoding integration.
- [ ] Authentication and user-specific data protection.
- [ ] Favorites and settings.
- [ ] Responsive dark UI.
- [ ] Error/loading/empty states.
- [ ] Tests and lint/build scripts.
- [ ] `.env.example` files and `.gitignore`.
- [ ] GitHub README.
- [ ] API and architecture documentation.
- [ ] Deployment guide.
- [ ] BCA report material: abstract, problem statement, objectives, requirements, diagrams, implementation, testing, limitations, conclusion, and future scope.
- [ ] Screenshots and honest verification report.

---

## 15. Suggested BCA Report Content

### Abstract
SkyCast is a cross-platform weather forecasting application designed to present current weather conditions and forecast information through a responsive web application and an Android application. The system uses a shared backend API, an external weather data provider, and MongoDB to manage registered users, saved locations, and preferences. The project demonstrates frontend development, REST API integration, database design, authentication, responsive interface design, and software testing.

### Problem statement
Weather information is often presented across separate services and interfaces. SkyCast aims to provide a clear, consistent interface for checking weather, comparing cities, and saving preferred locations across web and mobile platforms.

### Objectives
- Retrieve weather data from a real provider.
- Present current conditions and forecasts clearly.
- Support city search and saved locations.
- Provide user accounts and preferences.
- Share backend logic across web and Android.
- Apply input validation, secure data handling, and testing.
- Produce a maintainable, documented project suitable for academic evaluation.

### Limitations
- Forecast accuracy depends on the data provider and location coverage.
- Internet access is required for fresh weather data.
- Provider usage terms and availability may change.
- Push alerts, AQI, and history are optional features and should only be included when fully implemented and tested.

### Future scope
- Additional languages.
- Better offline caching.
- Additional weather data providers.
- More advanced visualizations.
- Opt-in notifications using reliable alert data.
- Further accessibility and performance improvements.

---

## 16. First Action Required from Antigravity

Begin with **Phase 0 only**:
1. Inspect the repository and available runtimes.
2. Report the existing structure, Git status, and relevant package versions.
3. Identify any existing work that must be preserved.
4. Present a concise plan for Phase 1.
5. Then proceed to Phase 1 after inspection, unless a destructive or paid/external action requires user approval.

Do not try to generate the entire project in one unverified pass. Build incrementally, run the project, test the result, and fix issues before continuing.

**Success standard:** a working, tested, documented project—not just a large collection of generated files.
