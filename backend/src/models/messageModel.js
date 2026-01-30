const { query } = require('../db')

async function listMessages(chatId, { limit = 30, beforeId = null }) {
  const lim = Math.min(Number(limit) || 30, 100)
  if (beforeId) {
    return query(
      `SELECT m.*
       FROM messages m
       WHERE m.chat_id = ? AND m.id < ?
       ORDER BY m.id DESC
       LIMIT ?`,
      [chatId, beforeId, lim],
    )
  }
  return query(
    `SELECT m.*
     FROM messages m
     WHERE m.chat_id = ?
     ORDER BY m.id DESC
     LIMIT ?`,
    [chatId, lim],
  )
}

async function createMessage({ chatId, senderId, text }) {
  const ins = await query(
    `INSERT INTO messages (chat_id, sender_id, body, status)
     VALUES (?, ?, ?, 'delivered')`,
    [chatId, senderId, text || null],
  )
  await query('UPDATE chats SET updated_at = NOW() WHERE id = ?', [chatId])
  const rows = await query('SELECT * FROM messages WHERE id = ? LIMIT 1', [ins.insertId])
  return rows[0]
}

async function addMedia(messageId, { type, path, original_name, mime_type, size_bytes }) {
  const ins = await query(
    `INSERT INTO message_media (message_id, media_type, url_path, original_name, mime_type, size_bytes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [messageId, type, path, original_name, mime_type, size_bytes],
  )
  return ins.insertId
}

async function listMediaForMessage(messageId) {
  return query(
    `SELECT id, media_type, url_path, original_name, mime_type, size_bytes, created_at
     FROM message_media WHERE message_id = ?`,
    [messageId],
  )
}

async function markRead(messageId, userId) {
  // Update message status + per-user read receipt
  await query(`INSERT IGNORE INTO message_reads (message_id, user_id) VALUES (?, ?)`, [messageId, userId])
  await query(`UPDATE messages SET status = 'read' WHERE id = ?`, [messageId])
  const rows = await query('SELECT * FROM messages WHERE id = ? LIMIT 1', [messageId])
  return rows[0] || null
}

async function reactToMessage({ messageId, userId, reaction }) {
  await query(
    `INSERT INTO message_reactions (message_id, user_id, reaction)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), updated_at = NOW()`,
    [messageId, userId, reaction],
  )
  return query(
    `SELECT reaction, COUNT(*) AS count
     FROM message_reactions
     WHERE message_id = ?
     GROUP BY reaction`,
    [messageId],
  )
}

async function getReactionsSummary(messageId) {
  return query(
    `SELECT reaction, COUNT(*) AS count
     FROM message_reactions
     WHERE message_id = ?
     GROUP BY reaction`,
    [messageId],
  )
}

async function getMessageById(messageId) {
  const rows = await query('SELECT * FROM messages WHERE id = ? LIMIT 1', [messageId])
  return rows[0] || null
}

module.exports = {
  listMessages,
  createMessage,
  addMedia,
  listMediaForMessage,
  markRead,
  reactToMessage,
  getReactionsSummary,
  getMessageById,
}

