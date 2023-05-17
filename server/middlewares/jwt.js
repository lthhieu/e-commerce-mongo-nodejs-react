const jwt = require("jsonwebtoken")

const generateAccessToken = (uid, role) => jwt.sign({ uid, role }, process.env.JWT_SECRET, { expiresIn: '2d' })
const generateRefreshToken = (uid) => jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '7d' })

module.exports = {
    generateAccessToken, generateRefreshToken
}