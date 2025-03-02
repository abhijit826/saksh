const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  companions: {
    type: String,
    required: true,
  },
  activities: {
    type: [String],
    required: true,
  },
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
