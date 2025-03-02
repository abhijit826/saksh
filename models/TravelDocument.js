const mongoose = require('mongoose');

const travelDocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to user
  type: {
    type: String,
    enum: ['passport', 'visa', 'creditCard', 'vaccination', 'drivingLicense', 'internationalPermit', 'nationalId', 'insurance'],
    required: true,
  },
  number: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  country: { type: String },
  embassy: {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  issuer: { type: String },
  vaccineType: { type: String },
  doseDates: [{ type: Date }],
  insuranceProvider: { type: String },
  policyNumber: { type: String },
  coverageDetails: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('TravelDocument', travelDocumentSchema);