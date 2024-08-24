require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Use Routes
app.use('/api/schools', schoolRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
