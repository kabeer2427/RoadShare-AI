# Database Schema (Supabase + PostgreSQL + PostGIS)

## Tables

### `profiles`
- `id` (uuid, PK, references auth.users)
- `name` (text)
- `phone` (text)
- `email` (text)
- `password_hash` (text)
- `role` (enum: commuter, driver, admin)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `vehicles`
- `id` (uuid, PK)
- `driver_id` (uuid, FK to profiles)
- `vehicle_number` (text)
- `vehicle_type` (enum: e_rickshaw, auto, shared_auto, taxi)
- `capacity` (int)
- `model` (text)
- `status` (text)
- `created_at` (timestamptz)

### `drivers`
- `id` (uuid, PK)
- `profile_id` (uuid, FK to profiles)
- `license_number` (text)
- `vehicle_id` (uuid, FK to vehicles)
- `is_online` (boolean)
- `current_location` (geography(Point, 4326))
- `capacity` (int)
- `current_passenger_count` (int)
- `last_location_update` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `ride_requests`
- `id` (uuid, PK)
- `commuter_id` (uuid, FK to profiles)
- `pickup_location` (geography(Point, 4326))
- `destination_location` (geography(Point, 4326))
- `pickup_lat` (float)
- `pickup_lng` (float)
- `destination_lat` (float)
- `destination_lng` (float)
- `passenger_count` (int)
- `status` (enum: pending, clustered, matched, accepted, pickup, in_progress, completed, cancelled, expired)
- `requested_at` (timestamptz)
- `expires_at` (timestamptz)
- `cluster_id` (uuid, FK to ride_clusters)
- `assigned_driver_id` (uuid, FK to drivers)

### `ride_clusters`
- `id` (uuid, PK)
- `cluster_center` (geography(Point, 4326))
- `request_count` (int)
- `status` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `cluster_members`
- `id` (uuid, PK)
- `cluster_id` (uuid, FK to ride_clusters)
- `ride_request_id` (uuid, FK to ride_requests)
- `created_at` (timestamptz)

### `driver_routes`
- `id` (uuid, PK)
- `driver_id` (uuid, FK to drivers)
- `cluster_id` (uuid, FK to ride_clusters)
- `route_geometry` (jsonb / line_string)
- `estimated_distance` (float)
- `estimated_duration` (float)
- `detour_distance` (float)
- `status` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `ride_events`
- `id` (uuid, PK)
- `ride_request_id` (uuid, FK to ride_requests)
- `event_type` (text)
- `metadata` (jsonb)
- `created_at` (timestamptz)

### `driver_locations`
- `id` (uuid, PK)
- `driver_id` (uuid, FK to drivers)
- `location` (geography(Point, 4326))
- `recorded_at` (timestamptz)
