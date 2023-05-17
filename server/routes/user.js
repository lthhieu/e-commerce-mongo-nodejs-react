const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post("/register", userControllers.register)
router.post("/login", userControllers.login)
router.put("/refresh-access-token", userControllers.refreshAccessToken)
router.get("/logout", userControllers.logout)
router.get("/forgot-password", userControllers.forgotPassword)
router.put("/reset-password", userControllers.resetPassword)
router.use(verifyAccessToken)
router.get("/user-info", userControllers.userInfo)
router.put("/update-user", userControllers.updateUser)
router.use(isAdmin)
router.get("/all-users", userControllers.getUsers)
router.delete("/delete-user", userControllers.deleteUser)
router.put("/update-user-by-admin/:uid", userControllers.updateUserByAdmin)

module.exports = router