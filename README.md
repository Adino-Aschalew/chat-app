## ChatApp (React + Node/Express + MySQL + Socket.IO)

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1) Database setup
- Create DB + tables:

```sql
SOURCE backend/db/schema.sql;
```

Or paste the file contents into your MySQL client.

### 2) Backend (API + Socket.IO)
From `d:\chat app\backend`:
- Copy `env.example` to `.env` (or set the same environment variables in your shell)
- Install + run:

```bash
npm install
npm run dev
```

API will run on `http://localhost:4000` and serve uploads at `http://localhost:4000/uploads/<file>`.

### 3) Frontend (React)
From `d:\chat app\frontend\chatapp`:
- Copy `env.example` to `.env` (or set Vite env vars)
- Install + run:

```bash
npm install
npm run dev
```

### 4) Postman
Import `backend/postman/ChatApp.postman_collection.json` and set:
- `baseUrl` = `http://localhost:4000`
- `token` = JWT returned by login/register

