const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const config = require('../utils/config')

function authorizeUser(req, res, next) {
    const path = (req.path || req.url || '').toLowerCase()

    // Public endpoints: allow signin/signup and public GETs for destinations and packageMaster
    if ((path.includes('/signin') || path.includes('/signup')) || (req.method === 'GET' && (path.startsWith('/destinations') || path.startsWith('/packagemaster')))) {
        return next()
    }

    // Allow GET access to /payments endpoints if a user_id header is present (convenience for local/dev)
    // This keeps POST /payments/process protected while allowing history/status lookups by user_id header.
    if (path.startsWith('/payments') && req.method === 'GET') {
        const uidHeader = req.headers.user_id || req.headers.uid
        if (uidHeader) {
            req.headers.uid = uidHeader
            req.headers.user_id = uidHeader
            return next()
        }
    }

    // Extract token from Authorization header, token header, or query param
    const authHeader = req.headers.authorization || req.headers.Authorization
    const token = (authHeader && authHeader.startsWith('Bearer '))
        ? authHeader.slice(7).trim()
        : req.headers.token || req.query.token

    if (!token) {
        return res.send(result.createResult('Token is Missing'))
    }

    try {
        const payload = jwt.verify(token, config.SECRET)
        const uid = payload.user_id || payload.uid || payload.id
        if (uid) {
            req.headers.uid = uid
            req.headers.user_id = uid
        }
        req.user = payload
        return next()
    } catch (ex) {
        return res.send(result.createResult('Invalid Token'))
    }
}

module.exports = authorizeUser
