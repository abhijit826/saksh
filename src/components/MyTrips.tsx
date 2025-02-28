import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin } from 'lucide-react';

const trips = [
  { id: 1, destination: 'Paris', date: '2024-05-20', description: 'A wonderful trip to Paris.' },
  { id: 2, destination: 'Tokyo', date: '2023-11-15', description: 'Exploring the vibrant city of Tokyo.' },
  { id: 3, destination: 'New York', date: '2022-08-10', description: 'A memorable visit to New York.' },
];

const MyTrips: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2 
            className="text-base text-indigo-600 font-semibold tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            My Trips
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Past Travel Details
          </motion.p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <motion.div 
                key={trip.id} 
                className="bg-white rounded-lg px-6 py-8 shadow-lg transform transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{trip.destination}</h3>
                  <Plane className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-2 flex items-center text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{trip.date}</span>
                </div>
                <p className="mt-2 text-base text-gray-500">{trip.description}</p>
                <div className="mt-4 flex items-center text-gray-500">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{trip.destination}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;