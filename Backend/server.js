require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('./config/db');
const express = require('express');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware (body parser, etc.)
app.use(express.json());

// Example route
app.get('/', (req, res) => {
	res.send('API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));