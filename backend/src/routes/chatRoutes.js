const router = require('express').Router()
const { authRequired } = require('../middleware/auth')
const { list, details, createPrivate, createGroup, updateGroup, add, remove } = require('../controllers/chatController')
const { upload } = require('../upload')

router.get('/', authRequired, list)
router.get('/:id', authRequired, details)
router.post('/', authRequired, createPrivate)
router.post('/group', authRequired, createGroup)
router.put('/:id', authRequired, upload.single('groupPhoto'), updateGroup)
router.post('/:id/members', authRequired, add)
router.delete('/:id/members/:userId', authRequired, remove)

module.exports = router

