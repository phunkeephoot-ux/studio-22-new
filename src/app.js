const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Phaste API', status: 'running' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const fastingRoutes = require('./routes/fasting.routes');
const userRoutes = require('./routes/user.routes');
const mealRoutes = require('./routes/meals.routes');
const bookingRoutes = require('./routes/booking.routes');


// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/fasting', fastingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/bookings', bookingRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
