const fs = require('fs')
const path = require('path')
const multer = require('multer')
const mime = require('mime-types')
const { uploadDir } = require('./config')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const absUploadDir = path.join(process.cwd(), uploadDir)
ensureDir(absUploadDir)

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, absUploadDir)
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || (mime.extension(file.mimetype) ? `.${mime.extension(file.mimetype)}` : '')
    const safeBase = String(Date.now()) + '_' + Math.random().toString(16).slice(2)
    cb(null, safeBase + ext)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
})

module.exports = { upload, absUploadDir }

