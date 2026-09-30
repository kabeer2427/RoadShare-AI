# API Contract

Base URL: `/api`

Standard Response Format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

## Authentication (`/api/auth`)
- `POST /register`: Register a new user (commuter/driver)
- `POST /login`: Authenticate user and return session
- `POST /logout`: Invalidate session
- `GET /me`: Get current authenticated user profile

## Ride (`/api/rides`)
- `POST /`: Create a new ride request
- `GET /:id`: Get ride request details
- `PATCH /:id/cancel`: Cancel a pending ride
- `GET /history`: Get ride history for the user

## Driver (`/api/drivers`)
- `POST /online`: Set driver status to online
- `POST /offline`: Set driver status to offline
- `POST /location`: Update driver's current geographic location
- `GET /nearby`: Get nearby available drivers
- `GET /routes/current`: Get the active route assigned to the driver

## Matching (`/api/matching`)
- `POST /run`: Trigger matching engine manually (or via background job)
- `GET /clusters`: View active clusters
- `GET /cluster/:id`: Get cluster details

## Heatmap (`/api/heatmap`)
- `GET /demand`: Get aggregated demand data (geo-grid or clusters)

## Admin (`/api/admin`)
- `GET /statistics`: Get system-wide KPI metrics
- `GET /drivers`: List all drivers and status
- `GET /rides`: List all rides
- `GET /clusters`: List all clusters
