const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const crypto = require("crypto")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    mobile: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
    ,
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Array,
        default: []
    },
    address: [
        { type: mongoose.Types.ObjectId, ref: "Address" }
    ],
    wishlist: [
        { type: mongoose.Types.ObjectId, ref: "Product" }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpire: {
        type: String
    }
}, {
    timestamps: true
})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = bcrypt.genSaltSync(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
    checkPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createResetPasswordToken: function () {
        const resetPasswordToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex')
        this.passwordResetExpire = Date.now() + 15 * 60 * 1000
        return resetPasswordToken
    }
}
//Export the model
module.exports = mongoose.model('User', userSchema)