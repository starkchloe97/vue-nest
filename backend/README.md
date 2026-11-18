# Lead Management API

NestJS (JavaScript) + Sequelize + MySQL. Database schema changes are managed with Umzug migrations; the application never runs schema synchronization on startup.

## Setup

1. Copy `.env.example` to `.env`.
2. Set your MySQL credentials, a random `JWT_SECRET` (at least 32 characters), and initial admin credentials. Use a unique admin password of at least 12 characters.
3. Install dependencies: `npm install`.
4. Run migrations: `npm run db:migrate`.
5. Create the first admin: `npm run db:seed-admin`.
6. Start the API: `npm run start:dev`.

The migration and seed commands are explicit deployment steps. They are not executed when the API starts.

## API

- `POST /api/v1/leads` — public lead submission. Required: `name`, `email`, `phone`, `message`; optional: `company`.
- `POST /api/v1/auth/login` — admin login; sets an HttpOnly `admin_token` cookie.
- `POST /api/v1/auth/logout` — clears the session cookie.
- `GET /api/v1/auth/me` — current admin.
- `GET /api/v1/leads?page=1&limit=20&search=&status=` — authenticated, paginated lead list.
- `GET /api/v1/leads/:id` — authenticated lead details.
- `PATCH /api/v1/leads/:id/status` — authenticated status update. Allowed: `new`, `contacted`, `qualified`, `converted`, `rejected`.

The API allows credentialed CORS only from `FRONTEND_URL`. In production, serve frontend and API over HTTPS so the session cookie is Secure.
