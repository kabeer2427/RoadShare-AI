-- 002_indexes.sql

-- General indexing for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_drivers_is_online ON drivers(is_online);
CREATE INDEX idx_drivers_last_location_update ON drivers(last_location_update);
CREATE INDEX idx_ride_requests_status ON ride_requests(status);
CREATE INDEX idx_ride_requests_requested_at ON ride_requests(requested_at);
CREATE INDEX idx_ride_requests_cluster_id ON ride_requests(cluster_id);
CREATE INDEX idx_ride_requests_assigned_driver_id ON ride_requests(assigned_driver_id);
CREATE INDEX idx_cluster_members_cluster_id ON cluster_members(cluster_id);
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_ride_events_ride_request_id ON ride_events(ride_request_id);

-- Spatial indexing (PostGIS)
CREATE INDEX idx_drivers_current_location ON drivers USING GIST(current_location);
CREATE INDEX idx_ride_requests_pickup_location ON ride_requests USING GIST(pickup_location);
CREATE INDEX idx_ride_requests_destination_location ON ride_requests USING GIST(destination_location);
CREATE INDEX idx_ride_clusters_center ON ride_clusters USING GIST(cluster_center);
