# Arvyax Wellness Platform [🌐 Live Demo](https://arvyaxwellness.netlify.app/)

<h2 align="center">🎥 App Demo</h2>
<p align="center">
  <img src="https://github.com/user-attachments/assets/69b1d811-1f3e-4867-bb41-1962379595ef" width="500" />
</p>

---

## 🌿 Features
- User registration & login (JWT-based, passwords hashed)
- View public wellness sessions
- Draft and publish your own sessions
- Auto-save drafts as you type (5s debounce)
- Responsive, modern UI (React + Tailwind)
- Toast feedback for actions
- Secure backend (Node.js, Express, MongoDB)

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken + bcryptjs)

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/SN7k/arvyax-wellness-platform
cd arvyax-wellness-platform
```

### 2. Setup Backend
```bash
cd backend
npm install
# Copy and edit .env
cp .env.example .env
# Start dev server
npm run dev
```

#### .env.example
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arvyax
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Start dev server
npm run dev
```
- Vite default port: 5173
- Update API URLs in `src/context/AuthContext.tsx` and `SessionContext.tsx` if needed.

---

## 📘 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Get current user (protected)

### Sessions
- `GET /api/sessions` — List public sessions
- `GET /api/sessions/my-sessions` — List your sessions (protected)
- `GET /api/sessions/my-sessions/:id` — Get one session (protected)
- `POST /api/sessions/my-sessions/save-draft` — Save/update draft (protected)
- `POST /api/sessions/my-sessions/publish` — Publish session (protected)
- `DELETE /api/sessions/my-sessions/:id` — Delete session (protected)

---

## 🧘 Frontend Pages
- **Login/Register:** Auth forms, token handling
- **Dashboard:** View published sessions
- **My Sessions:** View/edit your drafts & published sessions
- **Session Editor:** Create/edit session (title, tags, JSON URL, auto-save, publish)

---

## ✨ Bonus Features
- Auto-save feedback (last saved time, saving...)
- Fully working logout
- Responsive UI (Tailwind)
- Toast notifications

---

## 📦 Scripts

### Backend
- `npm run dev` — Start backend with nodemon
- `npm start` — Start backend (production)

### Frontend
- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## 🏗 Deployment
- **Backend:** Deploy to Render, Railway, or similar (set env vars)
- **Frontend:** Deploy `dist/` to Netlify, Vercel, or similar
- Update CORS configuration in `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
```
- Update API URLs in frontend for production domains

---

## 📂 Folder Structure
```
arvyax-wellness-platform/
  backend/    # Node.js + Express API
  frontend/   # React + Vite app
  README.md   # Project documentation
```

---

## 📄 License
MIT

---

## 🙏 Credits
Arvyax Full Stack Internship Assignment

---

