const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000; // Define your server port

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const MONGO_URI = 'mongodb://localhost:27017/prototype';

// Middleware
app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Register your routes
app.use('/api/users', userRoutes); // Route for handling user-related requests
app.use('/api/transactions', transactionRoutes); // Route for handling transaction requests

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

