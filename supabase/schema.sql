-- 001_initial_schema.sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('driver', 'admin');
CREATE TYPE vehicle_type_enum AS ENUM ('e_rickshaw', 'auto', 'shared_auto', 'taxi');
CREATE TYPE ride_status_enum AS ENUM ('pending', 'clustered', 'matched', 'accepted', 'pickup', 'in_progress', 'completed', 'cancelled', 'expired');

-- 1. profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'driver'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_number TEXT UNIQUE NOT NULL,
    vehicle_type vehicle_type_enum NOT NULL,
    capacity INT NOT NULL,
    model TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    license_number TEXT UNIQUE NOT NULL,
    vehicle_id UUID UNIQUE REFERENCES vehicles(id) ON DELETE SET NULL,
    is_online BOOLEAN DEFAULT false,
    current_location GEOGRAPHY(Point, 4326),
    capacity INT NOT NULL DEFAULT 4,
    current_passenger_count INT DEFAULT 0,
    last_location_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ride_clusters table
CREATE TABLE ride_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_center GEOGRAPHY(Point, 4326),
    request_count INT DEFAULT 0,
    status TEXT DEFAULT 'forming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ride_requests table
CREATE TABLE ride_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Commuter is removed in driver-first migration
    pickup_location GEOGRAPHY(Point, 4326) NOT NULL,
    destination_location GEOGRAPHY(Point, 4326) NOT NULL,
    pickup_lat FLOAT NOT NULL,
    pickup_lng FLOAT NOT NULL,
    destination_lat FLOAT NOT NULL,
    destination_lng FLOAT NOT NULL,
    passenger_count INT DEFAULT 1 NOT NULL,
    status ride_status_enum DEFAULT 'pending'::ride_status_enum,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    cluster_id UUID REFERENCES ride_clusters(id) ON DELETE SET NULL,
    assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL
);

-- 6. cluster_members table
CREATE TABLE cluster_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID REFERENCES ride_clusters(id) ON DELETE CASCADE,
    ride_request_id UUID REFERENCES ride_requests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. driver_routes table
CREATE TABLE driver_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES ride_clusters(id) ON DELETE CASCADE,
    route_geometry JSONB,
    estimated_distance FLOAT,
    estimated_duration FLOAT,
    detour_distance FLOAT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ride_events table
CREATE TABLE ride_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_request_id UUID REFERENCES ride_requests(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. driver_locations table
CREATE TABLE driver_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
