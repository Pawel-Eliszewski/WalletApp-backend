const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");

const UserSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    token: {
        type: String,
        default: null,
    },
    balance: {
        type: Number,
        default: 0,
    }
})

UserSchema.methods.setPassword = function (password) {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

UserSchema.methods.validPassword = function (password) {
    return bCrypt.compareSync(password, this.password);
};


const User = mongoose.model('users', UserSchema);
module.exports = User;