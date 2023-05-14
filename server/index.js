const express = require('express')
require('dotenv').config()
const dbConnect = require('./configs/dbConnect')
const initRoutes = require('./routes')

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.use("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(port, () => { console.log("Server is running on", port) })