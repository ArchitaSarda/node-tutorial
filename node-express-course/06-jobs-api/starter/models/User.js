const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email required'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please give valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: 6,
        
    },
})

UserSchema.pre('save', async function() {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
})

// UserSchema.methods.getName = function() {
//     return this.name
// }

UserSchema.methods.createJwt = function() {
    return jwt.sign({name: this.name, userId: this._id, email: this.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword =  function (canditatePassword) {
  const isMatch = bycrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema);