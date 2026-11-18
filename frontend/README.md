# LeadDesk Frontend

Vue 3 + Vite + Pinia + Vue Router.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` if the API is not at `http://localhost:3000`, then set `VITE_API_URL`.
3. Start the app with `npm run dev`.

The public form submits to `POST /api/v1/leads`. Admin authentication uses an HttpOnly cookie; the frontend intentionally does not store JWTs in localStorage or sessionStorage. Admin routes call `GET /api/v1/auth/me` to verify the session.
