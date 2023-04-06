const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Not authorized')
    }
    const token = authHeader.split(' ')[1]
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: data.userId, name: data.name }
    } catch (error) {
        throw new UnauthenticatedError('no authorization');
    }
    next()
}

module.exports = auth;