const {UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')

const authentication = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('no token');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        const {id, username} = decoded;
        req.username = username;
        req.id = id;
        next()
    } catch (error) {
        throw new UnauthenticatedError('no authorization');
    }
}

module.exports = authentication;
