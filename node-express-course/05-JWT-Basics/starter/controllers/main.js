const jwt = require('jsonwebtoken')
const {BadRequestError} = require('../errors')

const login = async (req, res) => {
    const {username,password} = req.body;
    if(!username || !password) {
        throw new BadRequestError('insufficient data');
    }

    const id = new Date().getDate();

    const token = jwt.sign({id, username}, process.env.JWT_SECRET,{expiresIn: '30d'})
    res.status(200).json({msg: 'User created', token})
}

const dashboard = async(req, res) => {
    const {id, username} = req;
    const luckynumber = Math.floor(Math.random()*100);
    res.status(200).json({msg: `hey ${username}`, secret: `${luckynumber}`})
    
}
module.exports = {login, dashboard}