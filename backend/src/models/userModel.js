const { query } = require('../db')

async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
  return rows[0] || null
}

async function findUserById(id) {
  const rows = await query(
    `SELECT id, username, email, status, profile_photo, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id],
  )
  return rows[0] || null
}

async function createUser({ username, email, passwordHash }) {
  const res = await query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [
    username,
    email,
    passwordHash,
  ])
  return res.insertId
}

async function upsertDefaultSettings(userId) {
  await query(
    `INSERT INTO user_settings (user_id, theme, notifications_enabled, privacy_last_seen)
     VALUES (?, 'dark', 1, 'everyone')
     ON DUPLICATE KEY UPDATE user_id = user_id`,
    [userId],
  )
}

async function updateProfile(userId, { username, status, profile_photo }) {
  await query(
    `UPDATE users SET
      username = COALESCE(?, username),
      status = COALESCE(?, status),
      profile_photo = COALESCE(?, profile_photo)
     WHERE id = ?`,
    [username ?? null, status ?? null, profile_photo ?? null, userId],
  )
  return findUserById(userId)
}

async function updateSettings(userId, { theme, notifications_enabled, privacy_last_seen }) {
  await query(
    `UPDATE user_settings SET
      theme = COALESCE(?, theme),
      notifications_enabled = COALESCE(?, notifications_enabled),
      privacy_last_seen = COALESCE(?, privacy_last_seen)
     WHERE user_id = ?`,
    [theme ?? null, notifications_enabled ?? null, privacy_last_seen ?? null, userId],
  )
  const rows = await query('SELECT * FROM user_settings WHERE user_id = ? LIMIT 1', [userId])
  return rows[0] || null
}

async function searchUsers(q, excludeUserId, limit = 20) {
  const term = `%${q}%`
  return query(
    `SELECT id, username, email, status, profile_photo, is_online, last_seen_at
     FROM users
     WHERE id <> ?
       AND (username LIKE ? OR email LIKE ?)
     ORDER BY username ASC
     LIMIT ?`,
    [excludeUserId, term, term, Number(limit)],
  )
}

async function getUserSettings(userId) {
  const rows = await query('SELECT * FROM user_settings WHERE user_id = ? LIMIT 1', [userId])
  return rows[0] || null
}

async function getAllUsers(excludeUserId = null) {
  const whereClause = excludeUserId ? 'WHERE id <> ?' : ''
  const params = excludeUserId ? [excludeUserId] : []
  
  return query(
    `SELECT id, username, email, status, profile_photo, is_online, last_seen_at, created_at
     FROM users
     ${whereClause}
     ORDER BY username ASC`,
    params
  )
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  upsertDefaultSettings,
  updateProfile,
  updateSettings,
  searchUsers,
  getAllUsers,
  getUserSettings,
}

