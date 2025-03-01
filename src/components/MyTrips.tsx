import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf'; // For frontend PDF mocking (optional)

const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = response.data._id;
        const tripsResponse = await axios.get(`http://localhost:5000/api/users/${userId}/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(tripsResponse.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        alert('Failed to fetch trips: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
  };

  const emptyVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, type: 'spring' } },
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(trips.filter(trip => trip._id !== tripId));
        alert('Trip deleted successfully');
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip: ' + error.message);
      }
    }
  };

  const handleViewDetails = (trip) => {
    // Mock PDF generation on frontend (replace with backend URL later)
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Trip Details: ${trip.destination}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Duration: ${trip.duration}`, 10, 30);
    doc.text(`Budget: $${trip.budget}`, 10, 40);
    doc.text(`Companions: ${trip.companions}`, 10, 50);
    doc.text('Activities:', 10, 60);
    trip.activities.forEach((activity, index) => doc.text(`- ${activity}`, 10, 70 + index * 10));
    const pdfData = doc.output('datauristring');
    window.open(pdfData, '_blank');

    // Alternative: Use backend-generated PDF
    // window.open(`http://localhost:5000/api/trips/${trip._id}/pdf`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-purple-100 to-indigo-100 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center">
          <motion.h2 
            className="text-base text-indigo-600 font-semibold tracking-wide uppercase"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            My Adventures
          </motion.h2>
          <motion.p 
            className="mt-2 text-4xl md:text-5xl leading-10 font-extrabold tracking-tight text-gray-900 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Your Travel Memories
          </motion.p>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="text-indigo-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Plane className="h-12 w-12" />
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip, index) => (
                  <motion.div
                    key={trip._id}
                    className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">{trip.destination}</h3>
                      <Plane className="h-6 w-6 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="mt-3 flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="text-sm">{trip.date || 'N/A'}</span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{trip.activities.join(', ') || 'No activities'}</p>
                    <div className="mt-4 flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-sm">{trip.destination}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <motion.button
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex-1 mr-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(trip)}
                      >
                        View Details
                      </motion.button>
                      <motion.button
  className="bg-red-600 text-white py-2 px-2 rounded-lg hover:bg-red-700 transition-colors flex-1 flex justify-center items-center"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleDelete(trip._id)}
>
  Delete
  <Trash2 className="h-6 w-6" />
</motion.button>

                    </div>
                  </motion.div>
                ))}
                {trips.length === 0 && (
                  <motion.div
                    className="col-span-full flex flex-col items-center justify-center h-64 bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-indigo-100"
                    variants={emptyVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Plus className="h-16 w-16 text-indigo-400 animate-bounce" />
                    <p className="mt-4 text-xl text-gray-600">No trips saved yet.</p>
                    <p className="text-gray-500">Start planning your next adventure!</p>
                    <motion.button
                      className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/create-trip">Create Trip</Link>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;