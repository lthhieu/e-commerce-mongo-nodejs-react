const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs")
    if (req?.body?.title) req.body.slug = slugify(req.body.title, { locale: 'vi' })
    const product = await Product.findOne({ slug: req.body.slug })
    if (product) {
        throw new Error("Slug is existed!")
    } else {
        const newProduct = await Product.create(req.body)
        return res.status(200).json({
            success: newProduct ? true : false,
            product: newProduct ? newProduct : "Cannot create new product!"
        })
    }
})

const getProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params
    if (!slug) throw new Error("Required product slug")
    const product = await Product.findOne({ slug })
    if (!product) { throw new Error("Cannot find this product") }
    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : "Cannot get product!"
    })

})

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    if (!products) { throw new Error("Cannot find all products") }
    return res.status(200).json({
        success: products ? true : false,
        product: products ? products : "Cannot get all products!"
    })

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error("Reuired product ID")
    const product = await Product.findByIdAndDelete(_id)
    return res.status(200).json({
        success: product ? true : false,
        deleted: product ? `Product with slug ${product.slug} deleted` : 'Cannot delete Product'
    })

})

const updateProductByAdmin = asyncHandler(async (req, res) => {
    const { pid } = req.params //get ID from params
    if (!pid || Object.keys(req.body).length === 0) throw new Error("Missing params")
    if (req?.body?.title) req.body.slug = slugify(req.body.title, { locale: 'vi' })
    const product = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: product ? true : false,
        updated: product ? product : 'Cannot update this product'
    })

})
module.exports = {
    createProduct, getProduct, getProducts, deleteProduct, updateProductByAdmin
}