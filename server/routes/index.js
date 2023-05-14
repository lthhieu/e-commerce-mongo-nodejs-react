const userRouter = require('./user')
const { pageNotFound, errorHandler } = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use(pageNotFound)
    app.use(errorHandler)
}

module.exports = initRoutes