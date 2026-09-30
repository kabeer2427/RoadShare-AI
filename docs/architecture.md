# AI-Driven Micro-Mobility Heatmap & Dynamic Rerouting - Architecture

## 1. System Overview
The platform connects commuters with shared micro-mobility vehicles (e-rickshaws, shared autos). It uses real-time location data, spatial clustering, and an optimization heuristic to group nearby requests and dynamically route drivers. 

## 2. Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [Frontend (React + Vite + Tailwind)]
        C[Commuter Web App]
        D[Driver Web App]
        A[Admin Dashboard]
    end

    subgraph Backend [Backend (Node.js + Express)]
        API[REST API Layer]
        Auth[Auth Middleware]
        Controllers[Controllers]
        Services[Business Logic & Algorithms]
        Repos[Data Access / Supabase Repository]
    end

    subgraph Database [Database (Supabase)]
        PG[PostgreSQL + PostGIS]
        RLS[Row Level Security]
        RT[Realtime Channels]
    end

    C -->|HTTP REST| API
    D -->|HTTP REST| API
    A -->|HTTP REST| API

    C -.->|WebSockets| RT
    D -.->|WebSockets| RT
    A -.->|WebSockets| RT

    API --> Auth
    Auth --> Controllers
    Controllers --> Services
    Services --> Repos
    Repos --> PG

    Services -.->|Publishes events| RT
```

## 3. Directory Structure
```
ai-mobility-platform/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/ (auth/, commuter/, driver/, admin/)
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── algorithms/ (clustering/, routing/, matching/, heatmap/)
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── jobs/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── database/
│   ├── migrations/
│   ├── schema.sql
│   ├── functions.sql
│   ├── triggers.sql
│   └── rls.sql
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── algorithm.md
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

## 4. Required Dependencies

### Frontend
- **Framework**: `react`, `react-dom`, `vite`
- **Routing**: `react-router-dom`
- **Styling**: `tailwindcss`, `postcss`, `autoprefixer`
- **Icons**: `lucide-react`
- **API Client**: `axios`
- **Map**: `leaflet`, `react-leaflet` (or `maplibre-gl`)
- **Realtime**: `@supabase/supabase-js`

### Backend
- **Core**: `express`, `cors`, `helmet`, `dotenv`
- **Validation**: `zod`
- **Auth & DB**: `@supabase/supabase-js`, `bcrypt`
- **Logging**: `morgan` (or `winston`)
- **Rate Limiting**: `express-rate-limit`

## 5. Deployment Strategy
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: Supabase (Postgres + PostGIS)
