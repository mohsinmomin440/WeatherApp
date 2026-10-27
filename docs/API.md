# SkyCast — REST API Reference Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 1. System Health

### `GET /health`
Returns runtime operational metrics and database connectivity status.

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "platform": "SkyCast Smart Weather Platform",
  "version": "1.0.0",
  "timestamp": "2026-10-27T14:27:00.000Z",
  "uptime": 128,
  "database": {
    "status": "connected",
    "engine": "MongoDB / Mongoose"
  },
  "services": {
    "openMeteo": "active",
    "geocoding": "active"
  }
}
```

---

## 2. Weather & Geocoding Endpoints

### `GET /weather/search?q={cityName}`
Queries Open-Meteo Geocoding API for global city suggestions matching the query string.

**Parameters:**
- `q` (string, required): Minimum 2 characters.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 5128581,
      "name": "New York",
      "latitude": 40.7128,
      "longitude": -74.006,
      "country": "United States",
      "countryCode": "US",
      "admin1": "New York",
      "timezone": "America/New_York",
      "elevation": 10
    }
  ]
}
```

---

### `GET /weather/forecast?lat={latitude}&lon={longitude}&timezone={timezone}`
Returns comprehensive weather data: current conditions, next 24 hourly data points, 7-day daily forecast, and rule-based insights.

**Parameters:**
- `lat` (number, required): -90 to 90.
- `lon` (number, required): -180 to 180.
- `timezone` (string, optional): Default `'auto'`.

**Response (200 OK):**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "coordinates": { "latitude": 40.7128, "longitude": -74.006 },
    "timezone": "America/New_York",
    "current": {
      "temperature": 22,
      "feelsLike": 24,
      "humidity": 68,
      "pressure": 1013,
      "windSpeed": 12,
      "uvIndex": 3,
      "weatherCode": 2,
      "condition": "Partly Cloudy",
      "icon": "cloud-sun"
    },
    "todayHighlights": {
      "sunrise": "06:12 AM",
      "sunset": "07:45 PM",
      "uvIndex": 3,
      "uvCategory": "Moderate",
      "visibilityKm": 10
    },
    "hourly": [ ... ],
    "daily": [ ... ],
    "insights": [ ... ]
  }
}
```

---

### `GET /weather/air-quality?lat={latitude}&lon={longitude}`
Fetches real-time Air Quality Index (AQI) and atmospheric pollutant levels.

---

## 3. Authentication Endpoints

### `POST /auth/register`
Creates a new user profile with encrypted password hash.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### `POST /auth/login`
Validates credentials and issues a signed JSON Web Token (JWT).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 4. User Profile, Favorites & Settings

All endpoints require header: `Authorization: Bearer <jwt_token>`

- `GET /users/me`: Current user data.
- `GET /users/favorites`: Array of saved cities.
- `POST /users/favorites`: Adds a new city (Max 20, deduplicated).
- `DELETE /users/favorites/:id`: Removes saved city.
- `PATCH /users/settings`: Body `{ "unit": "celsius" | "fahrenheit" }`.
