const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const { port, clientOrigin, uploadDir } = require('./config')
const { registerSocket } = require('./socket')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()

// Support multiple origins specified in CLIENT_ORIGIN (comma-separated)
const allowedOrigins = (clientOrigin || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json())

// Static uploads
app.use(`/${uploadDir}`, express.static(path.join(process.cwd(), uploadDir)))

// Make io available to controllers
let ioRef = null
app.use((req, _res, next) => {
  req.io = ioRef
  next()
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api', messageRoutes)

app.use((err, _req, res, _next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Server error' })
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins, credentials: true },
})
ioRef = io
registerSocket(io)

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

