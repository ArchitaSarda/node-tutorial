const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
// const jwt = require('jsonwebtoken');
// const bycrypt = require('bcryptjs');

const register = async(req, res) => {
    //const {name, password, email} = req.body;
    // const salt = await bycrypt.genSalt(10);
    // const hashPassword = await bycrypt.hash(password, salt);
    // const tempUser = {name, email, password: hashPassword}
    // const user = await User.create(tempUser)
    const user = await User.create(req.body)

    // const token = jwt.sign({name, userId: user._id, email},process.env.JWT_SECRET, {expiresIn: '30d'})
    const token = user.createJwt();

    res.status(StatusCodes.CREATED).json({success: true, user: {name: user.name}, token})
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email});
    if(!user) {
        throw new UnauthenticatedError('Invalid creds')    
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) {
        throw new UnauthenticatedError('Incorrect password')
    }
    const token = user.createJwt();
    res.status(StatusCodes.OK).json({success: true, user: {name: user.name}, token})
}

module.exports = {register, login}