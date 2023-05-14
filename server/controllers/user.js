const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body
    if (!firstname || !lastname || !email || !mobile || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing params"
        })
    }
    const response = await User.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        response
    })
})
module.exports = {
    register
}