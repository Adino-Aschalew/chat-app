const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt: jwtCfg } = require('../config')
const { asyncHandler, httpError } = require('../utils/errors')

const {
  getAllUsers,
  createUser,
  findUserById,
  searchUsers,
  updateProfile,
  upsertDefaultSettings,
  getUserSettings,
  updateSettings
} = require('../models/userModel')

const { uploadDir } = require('../config')

function signToken(userId) {
  return jwt.sign({ sub: userId }, jwtCfg.secret, { expiresIn: jwtCfg.expiresIn })
}

/**
 * Get all users (public)
 */
const getAllUsersPublic = asyncHandler(async (req, res) => {
  const users = await getAllUsers()
  res.json({ users })
})

/**
 * Register user
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw httpError(400, 'Username, email, and password are required')
  }

  const existingUsers = await getAllUsers()

  const existingUser = existingUsers.find(
    u => u.username === username || u.email === email
  )

  if (existingUser) {
    throw httpError(409, 'User with this username or email already exists')
  }

  // Hash the password before creating user
  const passwordHash = await bcrypt.hash(password, 10)
  const userId = await createUser({ username, email, passwordHash })

  await upsertDefaultSettings(userId)

  const newUser = await findUserById(userId)
  const token = signToken(userId)

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      status: newUser.status,
      profile_photo: newUser.profile_photo,
      is_online: newUser.is_online,
      last_seen_at: newUser.last_seen_at,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    }
  })
})

/**
 * Search users
 */
const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim()

  let users

  if (!q) {
    users = await getAllUsers(req.user.id)
  } else {
    users = await searchUsers(q, req.user.id, req.query.limit || 20)
  }

  res.json({ users })
})

/**
 * Get user by ID
 */
const getById = asyncHandler(async (req, res) => {
  const user = await findUserById(Number(req.params.id))
  if (!user) throw httpError(404, 'User not found')
  res.json({ user })
})

/**
 * Update user profile
 */
const update = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  if (userId !== req.user.id) {
    throw httpError(403, 'Forbidden')
  }

  let profile_photo = null

  if (req.file) {
    profile_photo =
      '/' +
      path.join(uploadDir, req.file.filename).replace(/\\/g, '/')
  }

  const user = await updateProfile(userId, {
    username: req.body.username,
    status: req.body.status,
    profile_photo
  })

  res.json({ user })
})

/**
 * Get user settings
 */
const getUserSettingsEndpoint = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  if (userId !== req.user.id) {
    throw httpError(403, 'Forbidden')
  }

  const settings = await getUserSettings(userId)

  res.json({ settings })
})

/**
 * Update user settings
 */
const updateUserSettings = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  if (userId !== req.user.id) {
    throw httpError(403, 'Forbidden')
  }

  const settings = await updateSettings(userId, req.body || {})

  res.json({ settings })
})

module.exports = {
  getAllUsersPublic,
  register,
  search,
  getById,
  update,
  getUserSettingsEndpoint,
  updateUserSettings
}