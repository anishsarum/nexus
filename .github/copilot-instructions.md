## Copilot Instructions for MERN Trading Platform

1. All services (frontend, backend, Python API) run in Docker for both development and production.
2. Use Vite for frontend hot-reloading and API proxy in development.
3. Mount local code for instant updates in dev containers.
4. API routes: `/api/v1/*` (Node), `/pyapi/api/v1/*` (Python).
5. Use `.env.production` and `.env.development` for config; never hardcode secrets.
6. Use bcrypt for password hashing and JWT for authentication.
7. Document new features or changes in README.md.
8. Keep code modular for strategy builder, analytics, and real-time updates.
