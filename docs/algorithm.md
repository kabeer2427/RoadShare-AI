# Clustering & Routing Algorithm

## 1. Spatial Candidate Search (Stage 1)
When a new `ride_request` comes in, the engine queries PostgreSQL/PostGIS to find pending requests within a configurable `RADIUS` (e.g., 1-2 km). 
```sql
SELECT * FROM ride_requests 
WHERE status = 'pending' 
AND ST_DWithin(pickup_location, $new_request_pickup, $RADIUS)
```

## 2. Compatibility Scoring (Stage 2)
For each candidate found, a compatibility score is calculated:
- **Pickup Proximity**: Inversely proportional to distance between pickups.
- **Destination Similarity**: Compare bearing angle of `(pickup -> destination)` for both requests.
- **Time Compatibility**: Check if difference in requested time is within `MAX_WAIT_DIFFERENCE`.

`compatibility_score = pickup_score * destination_score * direction_score * time_score`

If `compatibility_score` > `MIN_THRESHOLD`, they are considered for a cluster.

## 3. Vehicle Capacity Constraints
The system checks if `existing_passengers + new_passengers <= vehicle_capacity`. If true, the request is added to the candidate cluster.

## 4. Route Cost & Detour Calculation
The system evaluates route permutations for the cluster (e.g., Pickup A -> Pickup B -> Drop B -> Drop A).
It calculates:
- `direct_route_distance` (if passenger A traveled alone).
- `shared_route_distance` (total route assigned).
- `detour_percent = ((shared_route_distance - direct_route_distance) / direct_route_distance) * 100`

If `detour_percent` > `MAX_DETOUR_PERCENT`, the permutation is rejected.

## 5. Greedy Driver Matching
Once a valid cluster is formed, the system performs a spatial search for nearby available drivers with sufficient capacity.
The driver closest to the first pickup is assigned the cluster.

## 6. Scoring Weights (Configurable)
- `0.30 x pickup_proximity`
- `0.25 x destination_similarity`
- `0.20 x route_alignment`
- `0.15 x driver_proximity`
- `0.10 x time_compatibility`
