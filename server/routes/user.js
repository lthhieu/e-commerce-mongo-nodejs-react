const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')

router.post("/register", userControllers.register)

module.exports = router