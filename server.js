const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleAuth } = require('google-auth-library');
const itineraryRoutes = require('./routes/itinerary');
const userRoutes = require('./routes/user');
const tripRoutes = require('./routes/trip'); // Keep this if it has other endpoints
const authRoutes = require('./routes/auth');
const travelWalletRoutes = require('./routes/travelWallet');
const { protect } = require('./middleware/authMiddleware');
const tripRouter = require('./routes/trip.js'); // Updated path if in routes folder

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Google Auth setup
const auth = new GoogleAuth({
  keyFile: './service-account.json',
  scopes: ['https://www.googleapis.com/auth/generative-language'],
});
app.set('googleAuth', auth);

// Routes
app.use('/api', itineraryRoutes);
app.use('/api', userRoutes); // Protected routes like /profile
app.use('/api/auth', authRoutes); // Mount auth routes separately without protect
app.use('/api/travel-wallet', travelWalletRoutes);

// Use tripRouter from trip.js as the primary trip endpoint, with authentication
app.use('/api', protect, tripRouter); // Apply protect middleware only to trip-related routes

// Optional: Keep tripRoutes if it has unique endpoints not in trip.js
// app.use('/api', tripRoutes); // Uncomment if tripRoutes has additional functionality

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});