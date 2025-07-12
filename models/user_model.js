const mongoose = require('mongoose');
const validator = require('validator');
const UserRoles = require('../utils/roles');

const UserSchema = new mongoose.Schema({
    fullname:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        validate:[validator.isEmail, 'Invalid Email Address']
    },
    password:
    {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:[UserRoles.ADMIN, UserRoles.USER, UserRoles.MANAGER],
        default: UserRoles.USER,
    },
    avatar:
    {
        type: String,
        default: 'uploads/profile.jpeg',
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;