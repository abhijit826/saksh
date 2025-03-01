import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Clock, Map, Download, Share2 } from 'lucide-react';

const TripDetails: React.FC = () => {
  const location = useLocation();
  const itineraryData = location.state?.itinerary; // Raw response from backend

  const [activeDay, setActiveDay] = useState(1);
  const [showMap, setShowMap] = useState(false);

  // Extract itinerary (backend wraps it in { success: true, itinerary: {...} })
  const itinerary = itineraryData?.itinerary;

  useEffect(() => {
    console.log('Raw Itinerary Data:', itineraryData);
    console.log('Extracted Itinerary:', itinerary);
  }, [itineraryData, itinerary]);

  if (!itineraryData || !itinerary) {
    return <div>No itinerary data available. Please try creating a trip again.</div>;
  }

  // Fallback: Use preferences from TripForm if API doesn't provide structured data
  const preferences = location.state?.preferences || {
    destination: 'Unknown Destination',
    duration: 'Unknown Duration',
    budget: 'Unknown Budget',
    companions: 'Unknown Companions',
  };

  // For now, display the raw text from the API
  const itineraryText = itinerary.candidates?.[0]?.content?.parts?.[0]?.text || 'No itinerary generated';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative h-64 sm:h-80">
          <img
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80"
            alt={preferences.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{preferences.destination}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{preferences.duration}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span>{preferences.budget || preferences.maxPrice}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{preferences.companions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
              >
                <Map className="h-5 w-5 mr-1" />
                <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                <Download className="h-5 w-5 mr-1" />
                <span>Download</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                <Share2 className="h-5 w-5 mr-1" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {showMap && (
            <div className="mb-6 rounded-lg overflow-hidden h-80 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Interactive map would be displayed here</p>
            </div>
          )}

          {/* Temporary display of raw itinerary text */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Itinerary</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{itineraryText}</p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Estimated Total Cost:</p>
              <p className="text-xl font-bold text-gray-900">{preferences.maxPrice || 'Not specified'}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/create-trip"
                className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                Modify Trip
              </Link>
              <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TripDetails;