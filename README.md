# Pet Care Platform

Monorepo scaffold for a pet care web application with a React frontend and an Express + MySQL backend.

Technologies
- Frontend: React, React Router, Axios, Formik, Yup, styled-components (or CSS)
- Backend: Node.js, Express, Sequelize, MySQL, JWT
- DB: MySQL (schema included)
- Dev: nodemon, dotenv

Quick local setup
1. Clone the repo
2. Checkout branch: `init-pet-care-platform`
3. Backend:
   - cd backend
   - copy `.env.example` to `.env` and fill DB and JWT secrets
   - npm install
   - node app.js (or `npm run dev` for nodemon)
4. Frontend:
   - cd frontend
   - npm install
   - npm start

Developer tooling
- VS Code settings are included in `.vscode/`
- ESLint, Prettier and EditorConfig configs included

What I pushed
- Backend scaffold (Express, Sequelize connection, basic auth controller)
- Frontend scaffold (Create React App–style entry, routing, basic home page)
- Database schema SQL
- VS Code recommended extensions and launch/tasks for debugging

Next steps I can do for you:
- Add Sequelize migrations and seeders
- Wire up full auth endpoints and models
- Add CI (GitHub Actions)