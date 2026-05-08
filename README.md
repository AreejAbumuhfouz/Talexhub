# منصة وظيفتي — AI-Powered Career Platform

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS (RTL)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **AI**: OpenAI GPT-4o + Embeddings
- **Realtime**: Socket.io
- **Payments**: Stripe + HyperPay
- **Storage**: S3-compatible (Hostinger / Contabo)

## Quick Start

### 1. Clone & Install
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Environment Setup
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in your values
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb career_platform

# Install pgvector extension (for AI matching)
psql career_platform -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Run migrations
cd backend && npm run db:migrate
```

### 4. Run Development
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Backend:  http://localhost:5000
Frontend: http://localhost:5173

## Project Structure
```
career-platform/
├── backend/
│   ├── config/          # DB, OpenAI, Storage, Mailer, Stripe
│   ├── controllers/     # Route handlers (1 per feature)
│   ├── middleware/       # Auth, Error, Validate, Upload
│   ├── models/          # Sequelize models (index.js = all 33 models)
│   ├── routes/          # Express routers (1 per feature)
│   ├── services/        # Business logic (AI, Email, Payment...)
│   ├── utils/           # Logger, Token generator, Socket handler
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route-level pages
        ├── store/       # Zustand state management
        ├── services/    # Axios API calls
        └── hooks/       # Custom React hooks
```
