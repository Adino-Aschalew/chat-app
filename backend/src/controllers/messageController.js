const path = require('path')
const { asyncHandler, httpError } = require('../utils/errors')
const { isMember } = require('../models/chatModel')
const {
  listMessages,
  createMessage,
  addMedia,
  listMediaForMessage,
  markRead,
  reactToMessage,
  getReactionsSummary,
  getMessageById,
} = require('../models/messageModel')
const { uploadDir } = require('../config')

const list = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const ok = await isMember(chatId, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')

  const rows = await listMessages(chatId, { limit: req.query.limit, beforeId: req.query.beforeId })
  const withMedia = await Promise.all(
    rows.map(async (m) => {
      const media = await listMediaForMessage(m.id)
      const reactions = await getReactionsSummary(m.id)
      return { ...m, media, reactions }
    }),
  )
  res.json({ messages: withMedia })
})

const create = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const ok = await isMember(chatId, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')

  const text = req.body?.text ?? null
  if (!text && (!req.files || req.files.length === 0)) throw httpError(400, 'text or files required')

  const message = await createMessage({ chatId, senderId: req.user.id, text })

  const media = []
  for (const f of req.files || []) {
    const urlPath = '/' + path.join(uploadDir, f.filename).replaceAll('\\', '/')
    const type = f.mimetype.startsWith('image/')
      ? 'image'
      : f.mimetype.startsWith('video/')
        ? 'video'
        : 'file'
    await addMedia(message.id, {
      type,
      path: urlPath,
      original_name: f.originalname,
      mime_type: f.mimetype,
      size_bytes: f.size,
    })
    media.push({
      media_type: type,
      url_path: urlPath,
      original_name: f.originalname,
      mime_type: f.mimetype,
      size_bytes: f.size,
    })
  }

  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('new_message', { chatId, message, media })
  }

  res.status(201).json({ message, media })
})

const markAsRead = asyncHandler(async (req, res) => {
  const messageId = Number(req.params.id)
  const message = await markRead(messageId, req.user.id)
  if (!message) throw httpError(404, 'Message not found')
  if (req.io) {
    req.io.to(`chat:${message.chat_id}`).emit('read_message', { chatId: message.chat_id, messageId, userId: req.user.id })
  }
  res.json({ message })
})

const react = asyncHandler(async (req, res) => {
  const messageId = Number(req.params.id)
  const { reaction } = req.body || {}
  if (!reaction) throw httpError(400, 'reaction is required')

  const msg = await getMessageById(messageId)
  if (!msg) throw httpError(404, 'Message not found')
  const ok = await isMember(msg.chat_id, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')

  const summary = await reactToMessage({ messageId, userId: req.user.id, reaction })
  if (req.io) {
    req.io.to(`chat:${msg.chat_id}`).emit('message_reacted', { chatId: msg.chat_id, messageId, reactions: summary })
  }
  res.json({ reactions: summary })
})

module.exports = { list, create, markAsRead, react }

