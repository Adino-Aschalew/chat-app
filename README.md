# 💬 MyChat App

A modern real-time chat application built with Node.js, Express, and MySQL.
Supports private chats, group chats, media sharing, and user presence (online/offline status).

---

## 🚀 Features

* 👤 User registration & profile management
* 🔐 Secure authentication (ready for JWT integration)
* 💬 Private and group chats
* 🧑‍🤝‍🧑 Chat member management (admin/member roles)
* 📩 Messaging system with delivery & read status
* 🟢 Online/offline presence tracking

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL (InnoDB, utf8mb4)
* **ORM/Query:** Raw SQL / Custom models
* **File Uploads:** Multer
* **Authentication:** (JWT-ready)
* **Other:** REST API architecture

---

## 📁 Project Structure

```
mychat-app/
│
├── config/           # App configuration (DB, uploads)
├── controllers/      # Route controllers
├── models/           # Database queries
├── routes/           # API routes
├── middleware/       # Auth, error handling
├── utils/            # Helper functions
├── uploads/          # Uploaded media
├── db/               # SQL schema & seed files
└── server.js         # Entry point
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mychat-app.git
cd mychat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=chatapp
JWT_SECRET=your_secret_key
```

---

## 🗄️ Database Setup

1. Open MySQL or phpMyAdmin
2. Run the schema file:

```
db/schema.sql
```

3. (Optional) Run seed data:

```
db/seed.sql
```

---

## ▶️ Running the App

```bash
npm run dev
```

or

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### 👤 Users

| Method | Endpoint              | Description    |
| ------ | --------------------- | -------------- |
| POST   | `/api/users/register` | Register user  |
| GET    | `/api/users`          | Get all users  |
| GET    | `/api/users/:id`      | Get user by ID |
| PUT    | `/api/users/:id`      | Update profile |

---

### 💬 Chats

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/chats`     | Get user chats   |
| POST   | `/api/chats`     | Create chat      |
| GET    | `/api/chats/:id` | Get chat details |

---

### 📩 Messages

| Method | Endpoint                | Description  |
| ------ | ----------------------- | ------------ |
| GET    | `/api/messages/:chatId` | Get messages |
| POST   | `/api/messages`         | Send message |

---

## 🔒 Security Notes

* Passwords should be hashed using **bcrypt**
* Use **JWT authentication middleware**
* Validate all inputs

---

## 🧪 Testing

You can test APIs using:

* Postman
* Thunder Client
* cURL

---

## 🚀 Future Improvements

* 🔴 Real-time chat with Socket.IO
* ✅ Message delivery indicators (✔✔)
* 🧠 Typing indicators
* 📱 Mobile-friendly frontend
* 🌍 Deployment (Docker, AWS, etc.)

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Your Name
GitHub: https://github.com/Adino-Aschalew

---
