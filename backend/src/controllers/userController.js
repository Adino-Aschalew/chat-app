const path = require('path')
const { asyncHandler, httpError } = require('../utils/errors')
const { findUserById, updateProfile, updateSettings, searchUsers, getUserSettings } = require('../models/userModel')
const { uploadDir } = require('../config')

const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim()
  if (!q) return res.json({ users: [] })
  const users = await searchUsers(q, req.user.id, req.query.limit || 20)
  res.json({ users })
})

const getById = asyncHandler(async (req, res) => {
  const user = await findUserById(Number(req.params.id))
  if (!user) throw httpError(404, 'User not found')
  res.json({ user })
})

const update = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)
  if (userId !== req.user.id) throw httpError(403, 'Forbidden')

  let profile_photo = null
  if (req.file) {
    profile_photo = '/' + path.join(uploadDir, req.file.filename).replaceAll('\\', '/')
  }

  const user = await updateProfile(userId, {
    username: req.body.username,
    status: req.body.status,
    profile_photo,
  })
  res.json({ user })
})

const getUserSettingsEndpoint = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)
  if (userId !== req.user.id) throw httpError(403, 'Forbidden')
  const settings = await getUserSettings(userId)
  res.json({ settings })
})

const updateUserSettings = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)
  if (userId !== req.user.id) throw httpError(403, 'Forbidden')
  const settings = await updateSettings(userId, req.body || {})
  res.json({ settings })
})

module.exports = { search, getById, update, getUserSettingsEndpoint, updateUserSettings }

