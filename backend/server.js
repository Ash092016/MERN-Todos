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

const allowedOrigins = [
    process.env.ALLOWED_ORIGIN, // Uses the variable you set in Vercel
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
            if (!allowed) return false;
            // Handle both exact match and trailing slash differences
            return origin.replace(/\/$/, '') === allowed.replace(/\/$/, '');
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
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