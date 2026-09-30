-- 006_realtime.sql
-- Enable realtime for tables

BEGIN;
  -- Remove the supabase_realtime publication
  DROP PUBLICATION IF EXISTS supabase_realtime;

  -- Re-create the supabase_realtime publication with no tables
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Add tables to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE ride_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE ride_clusters;
ALTER PUBLICATION supabase_realtime ADD TABLE driver_routes;
ALTER PUBLICATION supabase_realtime ADD TABLE ride_events;
