-- 004_functions.sql

CREATE OR REPLACE FUNCTION update_timestamp_func()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;
