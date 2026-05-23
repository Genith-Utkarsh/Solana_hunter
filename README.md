# Solana Hunter System - Leveling Roadmap (MERN Stack)

A gamified, responsive, and gorgeous RPG-style MERN website based on the "Solana Hunter System" leveling roadmap design. It provides developer quest tracking, statistics bento cards, inventory achievements, and system guides powered by Google Gemini AI.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or use the pre-configured database URI in environment variables)

### Installation
1. **Clone this repository** to your local workspace.
2. **Install all dependencies** for the root, backend, and frontend concurrently:
   ```bash
   npm run install-all
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here (optional, unlocks dynamic guides)
   ```

4. **Seed the database** with the 100 default quests:
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the development server** (runs both frontend and backend concurrently):
   ```bash
   cd ..
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to start leveling!

---

## 🛠️ Architecture Details

### Backend (`/backend`)
- **Express & Node.js**: High-performance JSON API.
- **Mongoose / MongoDB**: Saves player data, quest progress, and custom quests.
- **JWT Authentication**: User registration and secure authentication state.
- **RPG Calculations**: Updates player levels, statistics (Intelligence, Strength, Agility, Luck), and backpack items (Silicon Badge, Sword of Solana, etc.) in real time.
- **Gemini AI Integration**: Fetches detailed conceptual guides and exercises for any level from Google's Gemini models, with offline templates.

### Frontend (`/frontend`)
- **Vite + React**: Fast SPA rendering with responsive components.
- **Tailwind CSS**: Custom styling extending the cyberpunk color tokens (neon green, violet overlays).
- **Single Page View Switcher**: High-performance client-side rendering preserving states.

---

## 🌐 Deployment Guide (Ready for Production)

The codebase is structured to build the React application into static assets and serve them directly from Express in production, allowing you to deploy the entire stack as a single service (zero cost, zero configurations).

### Deploying to Render / Railway / Heroku

1. **Create a Web Service** and connect it to your GitHub repository.
2. **Specify Build Command**:
   ```bash
   npm install && npm run build
   ```
   This will install all root dependencies, build the frontend Vite app, and prepare production outputs.
3. **Specify Start Command**:
   ```bash
   npm start
   ```
   This runs `node server.js` from the backend, serving static frontends on port 5000 (or `process.env.PORT`).
4. **Define Env Variables** in the hosting dashboard:
   - `MONGODB_URI` = `your mongo url`
   - `JWT_SECRET` = (any long random string)
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = (your Gemini key, optional)
