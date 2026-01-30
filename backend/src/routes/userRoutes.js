const router = require('express').Router()
const { authRequired } = require('../middleware/auth')
const { upload } = require('../upload')
const { search, getById, update, getUserSettingsEndpoint, updateUserSettings } = require('../controllers/userController')

router.get('/', authRequired, search)
router.get('/:id', authRequired, getById)
router.put('/:id', authRequired, upload.single('profilePhoto'), update)
router.get('/:id/settings', authRequired, getUserSettingsEndpoint)
router.put('/:id/settings', authRequired, updateUserSettings)

module.exports = router

