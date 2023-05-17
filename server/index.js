const express = require('express')
require('dotenv').config()
var cookieParser = require('cookie-parser')
const dbConnect = require('./configs/dbConnect')
const initRoutes = require('./routes')

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

dbConnect()
initRoutes(app)

app.use("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(port, () => { console.log("Server is running on", port) })