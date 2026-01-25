const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todo')

//Loading environment variables
dotenv.config()

//Connect to MongoDB
connectDB()

//Initializing express app
const app = express()

//Global Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*'
}))
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'MERN Todo API is running' })
})

//Error Handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (require.main === module) {
    app.listen(PORT, (err) => {
        if (err) {
            console.log('Server failed to start:', err)
            process.exit(1)
        }
        console.log(`Server running on port ${PORT}`)
    })
}

module.exports = app