import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Navigation, Info, Star, MapPin, Compass } from 'lucide-react';
import { POI } from '../types';

// Mock data for Points of Interest
const mockPOIs: POI[] = [
  {
    id: 'poi-1',
    name: 'Tokyo Tower',
    description: 'A communications and observation tower in the Shiba-koen district of Minato, Tokyo, Japan.',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80',
    location: 'Minato, Tokyo',
    category: 'Landmark',
  },
  {
    id: 'poi-2',
    name: 'Senso-ji Temple',
    description: 'An ancient Buddhist temple located in Asakusa, Tokyo. It is Tokyo\'s oldest temple, and one of its most significant.',
    image: 'https://images.unsplash.com/photo-1583400223100-98520561c593?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Asakusa, Tokyo',
    category: 'Temple',
  },
  {
    id: 'poi-3',
    name: 'Shibuya Crossing',
    description: 'The busiest intersection in the world, located in Shibuya, Tokyo. It is famous for its scramble crossing.',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: 'Shibuya, Tokyo',
    category: 'Urban',
  },
  {
    id: 'poi-4',
    name: 'Meiji Shrine',
    description: 'A Shinto shrine dedicated to Emperor Meiji and Empress Shōken, located in Shibuya, Tokyo.',
    image: 'https://images.unsplash.com/photo-1526711657229-e7e080961c85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Shibuya, Tokyo',
    category: 'Shrine',
  },
];

const GeoGuide: React.FC = () => {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showARMode, setShowARMode] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GEO-GUIDE</h1>
        <p className="text-gray-600">
          Explore Points of Interest with our AI-powered guide that learns your preferences and provides personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Compass className="h-5 w-5 mr-2 text-indigo-600" />
              Nearby Points of Interest
            </h2>
            <div className="space-y-4">
              {mockPOIs.map((poi) => (
                <motion.div
                  key={poi.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedPOI?.id === poi.id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPOI(poi)}
                >
                  <div className="flex items-center">
                    <img
                      src={poi.image}
                      alt={poi.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{poi.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{poi.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {poi.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPOI ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="relative">
                <img
                  src={selectedPOI.image}
                  alt={selectedPOI.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setShowARMode(!showARMode)}
                    className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
                    title="AR Mode"
                  >
                    <Navigation className="h-5 w-5 text-indigo-600" />
                  </button>
                  <button
                    className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
                    title="Save to Favorites"
                  >
                    <Star className="h-5 w-5 text-indigo-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPOI.name}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{selectedPOI.location}</span>
                </div>
                <p className="text-gray-700 mb-6">{selectedPOI.description}</p>

                {showARMode ? (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                      <div className="text-center">
                        <Navigation className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                        <p className="text-gray-600">AR Mode would display here</p>
                        <p className="text-sm text-gray-500">
                          Point your camera at the location to see augmented information
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                      <div className="text-center">
                        <Map className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                        <p className="text-gray-600">Interactive map would display here</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Navigation className="h-5 w-5 mr-2" />
                    <span>Navigate</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <Info className="h-5 w-5 mr-2" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Point of Interest</h3>
                <p className="text-gray-500">
                  Choose a location from the list to see detailed information and options.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoGuide;