const { socketAuth } = require('./middleware/auth')
const { listChatsForUser, listChatMembers } = require('./models/chatModel')
const { query } = require('./db')

function registerSocket(io) {
  io.use(socketAuth)

  io.on('connection', async (socket) => {
    const userId = socket.user.id

    // Mark online
    await query('UPDATE users SET last_seen_at = NOW(), is_online = 1 WHERE id = ?', [userId])
    io.emit('user_online', { userId })

    // Join user room + all chat rooms
    socket.join(`user:${userId}`)
    const chats = await listChatsForUser(userId)
    for (const c of chats) socket.join(`chat:${c.id}`)

    socket.on('typing', ({ chatId, isTyping }) => {
      if (!chatId) return
      socket.to(`chat:${chatId}`).emit('typing', { chatId, userId, isTyping: Boolean(isTyping) })
    })

    socket.on('read_message', ({ chatId, messageId }) => {
      if (!chatId || !messageId) return
      socket.to(`chat:${chatId}`).emit('read_message', { chatId, messageId, userId })
    })

    socket.on('join_chat', async ({ chatId }) => {
      if (!chatId) return
      socket.join(`chat:${chatId}`)
    })

    socket.on('leave_chat', async ({ chatId }) => {
      if (!chatId) return
      socket.leave(`chat:${chatId}`)
    })

    socket.on('disconnect', async () => {
      await query('UPDATE users SET is_online = 0, last_seen_at = NOW() WHERE id = ?', [userId])
      io.emit('user_offline', { userId })
    })
  })
}

module.exports = { registerSocket }

