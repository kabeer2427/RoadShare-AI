-- 005_triggers.sql

-- Attach update_timestamp_func to relevant tables
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_func();

CREATE TRIGGER set_timestamp_drivers
BEFORE UPDATE ON drivers
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_func();

CREATE TRIGGER set_timestamp_ride_clusters
BEFORE UPDATE ON ride_clusters
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_func();

CREATE TRIGGER set_timestamp_driver_routes
BEFORE UPDATE ON driver_routes
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_func();
