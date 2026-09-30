# AI-Driven Micro-Mobility Heatmap & Dynamic Rerouting

## Project Overview
This platform connects commuters with shared micro-mobility vehicles (e-rickshaws, shared autos). It uses real-time location data, spatial clustering, and an optimization heuristic to group nearby requests and dynamically route drivers, reducing empty vehicle kilometers and passenger waiting time.

## Features
- Commuter ride request with real-time tracking
- Driver route assignment and navigation
- Spatial clustering engine for grouping ride requests
- Real-time heatmaps for demand visibility
- Role-based access control (Commuter, Driver, Admin)

## Architecture & Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Realtime**: Supabase Realtime (WebSockets)

## Setup Instructions

### 1. Database Setup
Ensure you have a Supabase project created. Run the SQL scripts in `database/` in the Supabase SQL editor:
1. `schema.sql`
2. `functions.sql`
3. `triggers.sql`
4. `rls.sql`

### 2. Environment Variables
Copy `.env.example` to `.env` in the `backend` and root where needed, and fill in your Supabase details.

### 3. Running Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Running Frontend
```bash
cd frontend
npm install
npm run dev
```
