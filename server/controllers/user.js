const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken")
const sendMail = require('../utils/sendMail')
const crypto = require("crypto")

const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body
    if (!firstname || !lastname || !email || !mobile || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing params"
        })
    }
    const user = await User.findOne({ email })
    if (user) {
        throw new Error("Email is existed!")
    } else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            message: newUser ? "Register successfully!" : "Cannot register this user!"
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing params"
        })
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Email is not existed in database!")
    } else {
        if (await user?.checkPassword(password)) {
            const { password, role, _id, refreshToken, ...data } = user.toObject()

            const accessToken = generateAccessToken(_id, role)
            const newRefreshToken = generateRefreshToken(_id)

            await User.findByIdAndUpdate(_id, { refreshToken: newRefreshToken }, { new: true })

            res.cookie('refreshToken', newRefreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true })
            return res.status(200).json({
                success: true,
                accessToken,
                data
            })
        } else {
            throw new Error("Password is not correct!")
        }
    }
})

const userInfo = asyncHandler(async (req, res) => {
    const { uid } = req.user
    const user = await User.findById(uid).select('-role -password -refreshToken')
    return res.status(200).json({
        success: user ? true : false,
        user: user ? user : "User not found"
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie?.refreshToken) {
        throw new Error("No Refresh token in cookies!")
    }
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token!"
            })
        }
        const user = await User.findOne({ _id: decoded.uid, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: user ? true : false,
            newAccessToken: user ? generateAccessToken(user._id, user.role) : "Cannot refresh access token!"
        })
    })
})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie?.refreshToken) {
        throw new Error("No Refresh token in cookies!")
    }
    await User.findOneAndUpdate({ refreshToken: cookie?.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
    return res.status(200).json({
        success: true,
        message: "Logout successfully!"
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) { throw new Error("Missing email") }
    const user = await User.findOne({ email })
    if (!user) { throw new Error("User not found") }
    const resetToken = user.createResetPasswordToken()
    await user.save()
    const html = `Nhấp vào <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Link</a>
    Hết hạn trong 30 phút`

    const data = {
        email,
        html
    }
    const result = await sendMail(data)
    return res.status(200).json({
        success: true,
        result
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) { throw new Error("Missing params") }
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpire: { $gt: Date.now() } })
    if (!user) { throw new Error("Invalid password reset token") }
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpire = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        message: user ? "User update password successfully!" : "Cannot update password"

    })
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-role -password -refreshToken')
    return res.status(200).json({
        success: users ? true : false,
        users
    })

})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error("Reuired ID")
    const user = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: user ? true : false,
        deleted: user ? `User with email ${user.email} deleted` : 'Cannot delete user'
    })

})

const updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.user //get ID from token
    if (!uid || Object.keys(req.body).length === 0) throw new Error("Missing params")

    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: user ? true : false,
        updated: user ? user : 'Cannot update this user'
    })

})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params //get ID from params
    if (!uid || Object.keys(req.body).length === 0) throw new Error("Missing params")

    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: user ? true : false,
        updated: user ? user : 'Cannot update this user'
    })

})

module.exports = {
    register, login, userInfo, refreshAccessToken, logout,
    forgotPassword, resetPassword, getUsers, deleteUser, updateUser,
    updateUserByAdmin
}