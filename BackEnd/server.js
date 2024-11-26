const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const payment = require('./routes/payment')
require('dotenv').config();

const app = express();

// Security middleware
// app.use(helmet());
app.use(cors());
// app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded());
// Connect to database
connectDB();

// Routes
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stripe', require('./routes/payment'));
app.use('/api/contact',require('./routes/contact'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
