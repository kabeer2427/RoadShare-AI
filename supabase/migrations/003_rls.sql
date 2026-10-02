-- 003_rls.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- Note: In this custom authentication setup (where we generate our own JWTs and don't necessarily use Supabase auth.users),
-- RLS policies based on `auth.uid()` might require setting a custom claim in PostgreSQL local session variables during requests,
-- or we will bypass RLS from the backend using the service_role key.
-- Since the prompt requests: "Supabase will provide: PostgreSQL, Authentication support, Row Level Security..."
-- and "Use authenticated-user identity and role-based policies." we will assume the backend sets the auth context 
-- if we are rolling custom JWT, or we are using Supabase auth but intercepting passwords to hash them.
-- Assuming standard Supabase auth function `auth.uid()` will be used or a custom function if custom JWT.

-- PROFILES
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id::text = current_setting('request.jwt.claim.sub', true));

-- VEHICLES
CREATE POLICY "Drivers can view their own vehicle" ON vehicles
    FOR SELECT USING (driver_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Drivers can manage their own vehicle" ON vehicles
    FOR ALL USING (driver_id::text = current_setting('request.jwt.claim.sub', true));

-- DRIVERS
CREATE POLICY "Public can view online drivers" ON drivers
    FOR SELECT USING (is_online = true);

CREATE POLICY "Drivers can update their own status" ON drivers
    FOR UPDATE USING (profile_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Drivers can insert their own status" ON drivers
    FOR INSERT WITH CHECK (profile_id::text = current_setting('request.jwt.claim.sub', true));

-- RIDE REQUESTS
-- Commuter policies removed in driver-first migration
    
CREATE POLICY "Drivers can view assigned ride requests" ON ride_requests
    FOR SELECT USING (assigned_driver_id IN (SELECT id FROM drivers WHERE profile_id::text = current_setting('request.jwt.claim.sub', true)));

-- DRIVER ROUTES
CREATE POLICY "Drivers can view their own routes" ON driver_routes
    FOR SELECT USING (driver_id IN (SELECT id FROM drivers WHERE profile_id::text = current_setting('request.jwt.claim.sub', true)));
