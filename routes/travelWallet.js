const express = require('express');
const router = express.Router();
const TravelDocument = require('../models/TravelDocument');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Get all documents for the logged-in user
router.get('/documents', protect, async (req, res) => {
  try {
    const documents = await TravelDocument.find({ userId: req.user._id });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new document
router.post('/documents', protect, async (req, res) => {
  try {
    const documentData = { ...req.body, userId: req.user._id };
    const document = new TravelDocument(documentData);
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(400).json({ message: 'Failed to add document', error: error.message });
  }
});

// Update a document
router.put('/documents/:id', protect, async (req, res) => {
  try {
    const document = await TravelDocument.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(400).json({ message: 'Failed to update document', error: error.message });
  }
});

// Delete a document
router.delete('/documents/:id', protect, async (req, res) => {
  try {
    const document = await TravelDocument.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;