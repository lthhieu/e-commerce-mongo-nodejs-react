const userRouter = require('./user')
const { pageNotFound, errorHandler } = require('../middlewares/errorHandler')
const productRouter = require('./product')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use(pageNotFound)
    app.use(errorHandler)
}

module.exports = initRoutes