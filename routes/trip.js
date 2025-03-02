const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Middleware to validate trip data
const validateTrip = (req, res, next) => {
  const { destination, duration, budget, companions, activities } = req.body;
  if (!destination || !duration || !budget || !companions || !activities) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

// Create a new trip
router.post('/trips', validateTrip, async (req, res) => {
  try {
    const trip = new Trip({
      userId: req.user.id,
      destination: req.body.destination,
      duration: req.body.duration,
      budget: req.body.budget,
      companions: req.body.companions,
      activities: req.body.activities,
    });
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all trips for a user
router.get('/users/:userId/trips', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a trip
router.delete('/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate PDF for a trip
router.get('/trips/:id/pdf', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="trip-details.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text(`Trip Details: ${trip.destination}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Duration: ${trip.duration}`);
    doc.text(`Budget: $${trip.budget}`);
    doc.text(`Companions: ${trip.companions}`);
    doc.text('Activities:');
    trip.activities.forEach((activity, index) => doc.text(`- ${activity}`, 10, 70 + index * 10));
    doc.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;