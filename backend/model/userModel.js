const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const jwtKey = 'my_secret_key';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 25,
        min: 5,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        max: 25,
        min: 5,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    updatedDate: {
        type: Date
    },
    oldPassword: {
        type: Array,
        default: []
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
        default: null
    },
    email: {
        type: String,
        unique: true,
        required: true,
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
})

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
});

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error)
            return callback(error);
        callback(null, isMatch);
    });
};



let userModel = mongoose.model('user', userSchema);
module.exports = userModel;