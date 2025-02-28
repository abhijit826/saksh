import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Clock, Map, Download, Share2 } from 'lucide-react';

const TripDetails: React.FC = () => {
  const location = useLocation();
  const itinerary = location.state?.itinerary;

  const [activeDay, setActiveDay] = useState(1);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    console.log('Itinerary:', itinerary);
  }, [itinerary]);

  if (!itinerary) {
    return <div>Loading...</div>;
  }

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
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            alt={itinerary.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{itinerary.destination}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{itinerary.duration}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span>{itinerary.budget}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{itinerary.companions}</span>
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

          <div className="flex mb-6 overflow-x-auto pb-2">
            {itinerary.itinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg mr-2 ${
                  activeDay === day.day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            {itinerary.itinerary
              .filter((day) => day.day === activeDay)
              .map((day) => (
                <div key={day.day}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Day {day.day}</h3>
                  <div className="space-y-6">
                    {day.activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-20 text-gray-500 font-medium">
                            {activity.time}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-gray-900">{activity.activity}</h4>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>{activity.cost}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Estimated Total Cost:</p>
              <p className="text-xl font-bold text-gray-900">{itinerary.totalCost}</p>
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