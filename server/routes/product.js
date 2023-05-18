const express = require('express')
const router = express.Router()
const productController = require('../controllers/prroduct')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get("/", productController.getProducts)
router.get("/:slug", productController.getProduct)
router.use(verifyAccessToken)
router.use(isAdmin)
router.post("/create-new-product", productController.createProduct)
router.delete("/delete-product", productController.deleteProduct)
router.put("/:pid", productController.updateProductByAdmin)

module.exports = router