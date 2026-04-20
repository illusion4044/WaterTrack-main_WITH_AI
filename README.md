# Water Tracker (React JSX + Node backend)

This project contains two folders: `frontend` (React JSX) and `backend` (Node/Express + MongoDB).

Steps to run locally:
1. Start MongoDB (Compass / local mongod / Atlas) and set MONGO_URI in backend/.env
2. Run backend:
   - cd backend
   - npm install
   - npm start
3. Run frontend:
   - cd frontend
   - npm install
   - npm start

The frontend expects the API at http://localhost:5000 by default. You can change REACT_APP_API_URL in frontend/.env
