const router = require('express').Router()
const { authRequired } = require('../middleware/auth')
const { upload } = require('../upload')
const { search, getById, update, getUserSettingsEndpoint, updateUserSettings, getAllUsersPublic, register } = require('../controllers/userController')

// Public endpoint to get all users (no auth required for demo purposes)
router.get('/all', getAllUsersPublic)

// Public endpoint to get specific user by ID (no auth required for demo purposes)
router.get('/:id/public', getById)

// Public registration endpoint (no auth required for demo purposes)
router.post('/register', register)

// Protected endpoints
router.get('/', authRequired, search)
router.get('/:id', authRequired, getById)
router.put('/:id', authRequired, upload.single('profilePhoto'), update)
router.get('/:id/settings', authRequired, getUserSettingsEndpoint)
router.put('/:id/settings', authRequired, updateUserSettings)

module.exports = router

