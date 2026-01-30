const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt: jwtCfg } = require('../config')
const { httpError, asyncHandler } = require('../utils/errors')
const { findUserByEmail, findUserById, createUser, upsertDefaultSettings } = require('../models/userModel')

function signToken(userId) {
  return jwt.sign({ sub: userId }, jwtCfg.secret, { expiresIn: jwtCfg.expiresIn })
}

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) throw httpError(400, 'username, email, password are required')
  const existing = await findUserByEmail(email)
  if (existing) throw httpError(409, 'Email already in use')

  const passwordHash = await bcrypt.hash(password, 10)
  const userId = await createUser({ username, email, passwordHash })
  await upsertDefaultSettings(userId)

  const user = await findUserById(userId)
  const token = signToken(userId)
  res.status(201).json({ token, user })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) throw httpError(400, 'email and password are required')

  const userRow = await findUserByEmail(email)
  if (!userRow) throw httpError(401, 'Invalid credentials')

  const ok = await bcrypt.compare(password, userRow.password_hash)
  if (!ok) throw httpError(401, 'Invalid credentials')

  const user = await findUserById(userRow.id)
  const token = signToken(userRow.id)
  res.json({ token, user })
})

const me = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id)
  if (!user) throw httpError(404, 'User not found')
  res.json({ user })
})

module.exports = { register, login, me }

