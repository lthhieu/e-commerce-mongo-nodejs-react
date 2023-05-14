const mongoose = require('mongoose')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState === 1) {
            console.log("Connect to database successfully!")
        } else {
            console.log("Cannot to connect the database!")
        }
    } catch (e) { console.log(e) }
}
module.exports = dbConnect