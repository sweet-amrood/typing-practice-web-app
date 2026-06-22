# Typing Practice — MERN Stack

Full-stack starter with React (Vite) frontend and Express + MongoDB backend.

## Project Structure

```
backend/
├── config/          # Database connection
├── controllers/     # Route handlers
├── middleware/      # Error handling
├── models/          # Mongoose schemas
├── routes/          # API routes
└── server.js        # Entry point

frontend/
└── src/
    ├── components/  # Reusable UI
    ├── pages/       # Route pages
    ├── context/     # React context
    ├── services/    # Axios API layer
    └── App.jsx
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                          | Default                              |
|----------------|--------------------------------------|--------------------------------------|
| `PORT`         | Server port                          | `5000`                               |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://localhost:27017/typing-practice` |
| `NODE_ENV`     | Environment                          | `development`                        |
| `CLIENT_URL`   | Frontend origin for CORS             | `http://localhost:5173`              |
| `JWT_SECRET`   | Secret key for signing JWTs          | — (required)                         |
| `JWT_EXPIRES_IN` | Token expiration time              | `7d`                                 |

### Frontend (`frontend/.env`)

| Variable        | Description     | Default                        |
|-----------------|-----------------|--------------------------------|
| `VITE_API_URL`  | Backend API URL | `http://localhost:5000/api`    |

## API Endpoints

### Auth

| Method | Endpoint            | Auth     | Description        |
|--------|---------------------|----------|--------------------|
| POST   | `/api/auth/register`| Public   | Register a user    |
| POST   | `/api/auth/login`   | Public   | Login and get JWT  |
| GET    | `/api/auth/me`      | Required | Get current user   |

### Items

| Method | Endpoint         | Auth     | Description   |
|--------|------------------|----------|---------------|
| GET    | `/api/health`    | Public   | Health check  |
| GET    | `/api/items`     | Public   | List items    |
| GET    | `/api/items/:id` | Public   | Get one item  |
| POST   | `/api/items`     | Required | Create item   |
| PUT    | `/api/items/:id` | Required | Update item   |
| DELETE | `/api/items/:id` | Required | Delete item   |

Protected routes require an `Authorization: Bearer <token>` header.
