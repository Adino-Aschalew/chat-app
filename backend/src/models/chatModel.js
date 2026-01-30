const { query } = require('../db')

async function listChatsForUser(userId) {
  return query(
    `SELECT
       c.id,
       c.type,
       c.updated_at,
       gi.name AS group_name,
       gi.photo AS group_photo,
       -- last message body/time
       (SELECT m.body FROM messages m WHERE m.chat_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_body,
       (SELECT m.created_at FROM messages m WHERE m.chat_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_at,
       -- unread count (messages not read by user)
       (
         SELECT COUNT(*)
         FROM messages m
         LEFT JOIN message_reads mr ON mr.message_id = m.id AND mr.user_id = ?
         WHERE m.chat_id = c.id AND mr.user_id IS NULL AND m.sender_id <> ?
       ) AS unread_count,
       -- peer info for private chats
       (
         SELECT u.username
         FROM chat_members cm2
         JOIN users u ON u.id = cm2.user_id
         WHERE cm2.chat_id = c.id AND cm2.user_id <> ?
         LIMIT 1
       ) AS peer_username,
       (
         SELECT u.profile_photo
         FROM chat_members cm2
         JOIN users u ON u.id = cm2.user_id
         WHERE cm2.chat_id = c.id AND cm2.user_id <> ?
         LIMIT 1
       ) AS peer_profile_photo,
       (
         SELECT u.is_online
         FROM chat_members cm2
         JOIN users u ON u.id = cm2.user_id
         WHERE cm2.chat_id = c.id AND cm2.user_id <> ?
         LIMIT 1
       ) AS peer_online
     FROM chats c
     JOIN chat_members cm ON cm.chat_id = c.id
     LEFT JOIN group_info gi ON gi.chat_id = c.id
     WHERE cm.user_id = ?
     ORDER BY c.updated_at DESC`,
    [userId, userId, userId, userId, userId, userId],
  )
}

async function createPrivateChat(userId, otherUserId) {
  // Ensure deterministic ordering to find existing private chat
  const a = Math.min(userId, otherUserId)
  const b = Math.max(userId, otherUserId)

  const existing = await query(
    `SELECT c.id
     FROM chats c
     JOIN chat_members m1 ON m1.chat_id = c.id AND m1.user_id = ?
     JOIN chat_members m2 ON m2.chat_id = c.id AND m2.user_id = ?
     WHERE c.type = 'private'
     LIMIT 1`,
    [a, b],
  )
  if (existing[0]) return existing[0].id

  const ins = await query(`INSERT INTO chats (type, created_by) VALUES ('private', ?)`, [userId])
  const chatId = ins.insertId
  await query('INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, ?), (?, ?, ?)', [
    chatId,
    userId,
    'member',
    chatId,
    otherUserId,
    'member',
  ])
  return chatId
}

async function createGroupChat({ creatorId, name, photo, memberIds }) {
  const ins = await query(`INSERT INTO chats (type, created_by) VALUES ('group', ?)`, [creatorId])
  const chatId = ins.insertId
  await query(`INSERT INTO group_info (chat_id, name, photo) VALUES (?, ?, ?)`, [chatId, name, photo || null])

  const uniqueMembers = Array.from(new Set([creatorId, ...memberIds.map(Number)])).filter(Boolean)
  const values = []
  const placeholders = uniqueMembers.map((uid) => {
    const role = uid === creatorId ? 'admin' : 'member'
    values.push(chatId, uid, role)
    return '(?, ?, ?)'
  })
  await query(`INSERT INTO chat_members (chat_id, user_id, role) VALUES ${placeholders.join(',')}`, values)
  return chatId
}

async function isMember(chatId, userId) {
  const rows = await query('SELECT 1 FROM chat_members WHERE chat_id = ? AND user_id = ? LIMIT 1', [chatId, userId])
  return Boolean(rows[0])
}

async function addMember(chatId, userId) {
  await query('INSERT IGNORE INTO chat_members (chat_id, user_id, role) VALUES (?, ?, ?)', [chatId, userId, 'member'])
}

async function removeMember(chatId, userId) {
  await query('DELETE FROM chat_members WHERE chat_id = ? AND user_id = ?', [chatId, userId])
}

async function updateGroupInfo(chatId, { name, photo }) {
  await query(
    `UPDATE group_info SET
      name = COALESCE(?, name),
      photo = COALESCE(?, photo)
     WHERE chat_id = ?`,
    [name ?? null, photo ?? null, chatId],
  )
  const rows = await query('SELECT * FROM group_info WHERE chat_id = ? LIMIT 1', [chatId])
  return rows[0] || null
}

async function listChatMembers(chatId) {
  return query(
    `SELECT u.id, u.username, u.profile_photo, u.is_online, u.last_seen_at, cm.role
     FROM chat_members cm
     JOIN users u ON u.id = cm.user_id
     WHERE cm.chat_id = ?
     ORDER BY cm.role DESC, u.username ASC`,
    [chatId],
  )
}

async function getChatDetails(chatId, userId) {
  const rows = await query(
    `SELECT c.id, c.type, c.created_by, c.created_at, c.updated_at,
            gi.name AS group_name, gi.photo AS group_photo
     FROM chats c
     JOIN chat_members cm ON cm.chat_id = c.id AND cm.user_id = ?
     LEFT JOIN group_info gi ON gi.chat_id = c.id
     WHERE c.id = ?
     LIMIT 1`,
    [userId, chatId],
  )
  return rows[0] || null
}

async function getUserRole(chatId, userId) {
  const rows = await query('SELECT role FROM chat_members WHERE chat_id = ? AND user_id = ? LIMIT 1', [chatId, userId])
  return rows[0]?.role || null
}

module.exports = {
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
}

