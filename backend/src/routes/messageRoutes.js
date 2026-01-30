const router = require('express').Router()
const { authRequired } = require('../middleware/auth')
const { upload } = require('../upload')
const { list, create, markAsRead, react } = require('../controllers/messageController')

router.get('/chats/:id/messages', authRequired, list)
router.post('/chats/:id/messages', authRequired, upload.array('files', 10), create)
router.put('/messages/:id/read', authRequired, markAsRead)
router.post('/messages/:id/react', authRequired, react)

module.exports = router

