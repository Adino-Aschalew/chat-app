const path = require('path')
const { asyncHandler, httpError } = require('../utils/errors')
const { uploadDir } = require('../config')
const {
  listChatsForUser,
  createPrivateChat,
  createGroupChat,
  isMember,
  addMember,
  removeMember,
  updateGroupInfo,
  listChatMembers,
  getChatDetails,
  getUserRole,
} = require('../models/chatModel')

const list = asyncHandler(async (req, res) => {
  const chats = await listChatsForUser(req.user.id)
  res.json({ chats })
})

const details = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const chat = await getChatDetails(chatId, req.user.id)
  if (!chat) throw httpError(404, 'Chat not found')
  const members = await listChatMembers(chatId)
  res.json({ chat, members })
})

const createPrivate = asyncHandler(async (req, res) => {
  const { userId } = req.body || {}
  if (!userId) throw httpError(400, 'userId is required')
  const chatId = await createPrivateChat(req.user.id, Number(userId))
  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('group_updated', { chatId })
  }
  res.status(201).json({ chatId })
})

const createGroup = asyncHandler(async (req, res) => {
  const { name, memberIds } = req.body || {}
  if (!name) throw httpError(400, 'name is required')
  if (!Array.isArray(memberIds) || memberIds.length === 0) throw httpError(400, 'memberIds must be a non-empty array')
  const chatId = await createGroupChat({ creatorId: req.user.id, name, photo: null, memberIds })
  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('group_updated', { chatId })
  }
  res.status(201).json({ chatId })
})

const updateGroup = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const ok = await isMember(chatId, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')
  const role = await getUserRole(chatId, req.user.id)
  if (role !== 'admin') throw httpError(403, 'Only admins can update group info')

  let photo = null
  if (req.file) {
    photo = '/' + path.join(uploadDir, req.file.filename).replaceAll('\\', '/')
  }

  const group = await updateGroupInfo(chatId, { ...(req.body || {}), ...(photo ? { photo } : {}) })
  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('group_updated', { chatId, group })
  }
  res.json({ group })
})

const add = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const ok = await isMember(chatId, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')
  const role = await getUserRole(chatId, req.user.id)
  if (role !== 'admin') throw httpError(403, 'Only admins can add members')
  const { userId } = req.body || {}
  if (!userId) throw httpError(400, 'userId is required')
  await addMember(chatId, Number(userId))
  const members = await listChatMembers(chatId)
  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('member_added', { chatId, userId: Number(userId), members })
  }
  res.status(201).json({ members })
})

const remove = asyncHandler(async (req, res) => {
  const chatId = Number(req.params.id)
  const ok = await isMember(chatId, req.user.id)
  if (!ok) throw httpError(403, 'Not a member')
  const role = await getUserRole(chatId, req.user.id)
  if (role !== 'admin') throw httpError(403, 'Only admins can remove members')
  await removeMember(chatId, Number(req.params.userId))
  const members = await listChatMembers(chatId)
  if (req.io) {
    req.io.to(`chat:${chatId}`).emit('member_removed', { chatId, userId: Number(req.params.userId), members })
  }
  res.json({ members })
})

module.exports = { list, details, createPrivate, createGroup, updateGroup, add, remove }

