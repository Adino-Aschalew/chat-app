const jwt = require('jsonwebtoken')
const { jwt: jwtCfg } = require('../config')

function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const payload = jwt.verify(token, jwtCfg.secret)
    req.user = { id: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Missing token'))
  try {
    const payload = jwt.verify(token, jwtCfg.secret)
    socket.user = { id: payload.sub }
    return next()
  } catch {
    return next(new Error('Invalid token'))
  }
}

module.exports = { authRequired, socketAuth }

