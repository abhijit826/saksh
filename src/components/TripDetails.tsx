import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Map, 
  Download, 
  Share2, 
  Sun, 
  CloudRain, 
  Cloud, 
  Wind,
  Tag,
  Users as UsersIcon,
} from 'lucide-react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';

const TripDetails: React.FC = () => {
  const location = useLocation();
  const itineraryData = location.state?.itinerary;
  const preferences = location.state?.preferences;

  const [activeDay, setActiveDay] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const itinerary = itineraryData?.itinerary || { dailyPlans: [], rawText: 'No itinerary available' };

  useEffect(() => {
    console.log('Raw Itinerary Data:', itineraryData);
    console.log('Extracted Itinerary:', itinerary);
    console.log('Preferences:', preferences);
    if (showMap && itinerary.dailyPlans[activeDay - 1]?.activities) {
      console.log('Map Locations:', itinerary.dailyPlans[activeDay - 1].activities.map(a => a.location));
    }
  }, [itineraryData, itinerary, preferences, showMap, activeDay]);

  const WeatherIcon = ({ condition }: { condition: string }) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'clear': case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      default: return <Wind className="h-6 w-6 text-gray-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const mapContainerStyle = {
    height: '20rem',
    width: '100%',
  };

  const center = { lat: 34.0522, lng: -118.2437 }; // Default to LAX

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY';
  if (!apiKey || apiKey === 'YOUR_FALLBACK_API_KEY') {
    console.warn('Google Maps API Key is not defined or using fallback. Check your .env file.');
    setMapError('Google Maps API Key is missing or invalid. Please configure VITE_GOOGLE_MAPS_API_KEY in .env.');
  }

  const normalizeLocation = (location) => {
    const locationMap = {
      'LAX Airport & Union Station': 'Los Angeles International Airport, Los Angeles, CA to Union Station, Los Angeles, CA',
      'LAX': 'Los Angeles International Airport, Los Angeles, CA',
      'Chennai Central Railway Station': 'Chennai Central, Chennai, India',
      'Hyderabad Deccan Railway Station': 'Hyderabad Deccan, Hyderabad, India',
      'Charminar': 'Charminar, Hyderabad, India',
      'Near Charminar': 'Charminar, Hyderabad, India',
    };
    return locationMap[location] || location;
  };

  const drawRoute = useCallback((response, status) => {
    if (status === 'OK' && directionsRenderer) {
      console.log('Directions Response:', response);
      directionsRenderer.setDirections(response);
      if (response.routes[0] && response.routes[0].legs) {
        const legs = response.routes[0].legs;
        const activities = itinerary.dailyPlans[activeDay - 1].activities;
        console.log(`Legs: ${legs.length}, Activities: ${activities.length}`);
        // Place markers for each activity using leg start locations and last leg end location
        activities.forEach((activity, index) => {
          let position;
          if (index < legs.length) {
            position = legs[index].start_location; // Use start location for intermediate points
          } else if (index === activities.length - 1 && legs.length > 0) {
            position = legs[legs.length - 1].end_location; // Use end location for the last activity
          } else {
            console.warn(`No position for activity ${index}:`, activity);
            // Fallback: Use the last known position or center if no legs match
            position = index > 0 ? legs[legs.length - 1].end_location : center;
          }
          new google.maps.Marker({
            map: directionsRenderer.getMap(),
            position: position,
            title: activity.description,
            label: `${index + 1}`,
          });
        });
      } else {
        console.warn('No valid route or legs in response:', response);
      }
    } else {
      console.error('Directions request failed with status:', status, 'Response:', response);
      setMapError(`Failed to load route: ${status}. Locations used: ${itinerary.dailyPlans[activeDay - 1].activities.map(a => a.location).join(', ')}`);
    }
  }, [directionsRenderer, activeDay, itinerary.dailyPlans]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-r from-indigo-600 to-purple-700">
          <img
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1974&q=80"
            alt={itinerary.destination}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-md">{itinerary.destination}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-white">
                <span className="flex items-center"><Calendar className="h-5 w-5 mr-2" />{itinerary.startDate} ({itinerary.durationDays} days)</span>
                <span className="flex items-center"><DollarSign className="h-5 w-5 mr-2" />${itinerary.totalCost}</span>
                <span className="flex items-center"><Users className="h-5 w-5 mr-2" />{preferences?.companions || 'N/A'}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Travel Itinerary</h2>
            <div className="flex space-x-3">
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowMap(!showMap)}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
              >
                <Map className="h-5 w-5 mr-2" />
                <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
              >
                <Download className="h-5 w-5 mr-2" />
                <span>Download</span>
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span>Share</span>
              </motion.button>
            </div>
          </motion.div>

          {showMap && (
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={['directions']} // Using only directions library with google.maps.Marker
              onError={(error) => {
                console.error('Google Maps Load Error:', error);
                setMapError('Failed to load Google Maps. Check API key or network.');
              }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                onLoad={(mapInstance) => {
                  console.log('Map Loaded:', mapInstance);
                }}
                onUnmount={() => {
                  setMapError(null);
                }}
              >
                <TrafficLayer />
                {itinerary.dailyPlans[activeDay - 1]?.activities.length > 1 && (
                  <DirectionsService
                    options={{
                      origin: normalizeLocation(itinerary.dailyPlans[activeDay - 1].activities[0].location),
                      destination: normalizeLocation(itinerary.dailyPlans[activeDay - 1].activities[itinerary.dailyPlans[activeDay - 1].activities.length - 1].location),
                      waypoints: itinerary.dailyPlans[activeDay - 1].activities
                        .slice(1, -1)
                        .filter((item, index, self) => 
                          index === self.findIndex((t) => t.location === item.location)
                        )
                        .map((activity) => ({ location: normalizeLocation(activity.location), stopover: true })),
                      optimizeWaypoints: true,
                      travelMode: 'DRIVING',
                      drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: 'optimistic',
                      },
                    }}
                    callback={drawRoute}
                  />
                )}
                <DirectionsRenderer
                  options={{
                    suppressMarkers: true,
                  }}
                  onLoad={(renderer) => {
                    setDirectionsRenderer(renderer);
                    console.log('Directions Renderer Loaded:', renderer);
                  }}
                  onError={(error) => {
                    console.error('Directions Renderer Error:', error);
                    setMapError('Failed to render route due to an error.');
                  }}
                />
              </GoogleMap>
              {mapError && <p className="text-red-600 text-center mt-2">{mapError}</p>}
            </LoadScript>
          ) || (showMap && <div className="mb-6 rounded-lg overflow-hidden bg-gray-200 h-[20rem] flex items-center justify-center"><p className="text-gray-500">Map failed to load. Check console for details.</p></div>)}

          {/* Day Tabs */}
          <motion.div variants={itemVariants} className="flex mb-6 overflow-x-auto pb-2 space-x-2">
            {itinerary.dailyPlans.map((day) => (
              <motion.button
                key={day.day}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                onClick={() => setActiveDay(day.day)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeDay === day.day
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day {day.day}
              </motion.button>
            ))}
          </motion.div>

          {/* Daily Plan Details */}
          <motion.div variants={containerVariants} className="bg-gray-50 rounded-xl p-6">
            {itinerary.dailyPlans
              .filter((day) => day.day === activeDay)
              .map((day) => (
                <motion.div key={day.day} variants={itemVariants}>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-indigo-600" />
                    Day {day.day} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>

                  {/* Crowd and Weather Info */}
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 p-4 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-indigo-500"
                  >
                    {/* Crowd Level */}
                    <div className="flex items-center space-x-4">
                      <UsersIcon className="h-6 w-6 text-indigo-500" />
                      <div>
                        <p className="text-gray-700 font-medium">Crowd Level:</p>
                        <p className={`text-lg font-bold ${
                          itinerary.crowdLevel === 'high' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {itinerary.crowdLevel || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {itinerary.crowdLevel === 'high' ? 'Consider early visits to avoid crowds.' : 'Enjoy a relaxed trip!'}
                        </p>
                      </div>
                    </div>

                    {/* Weather Info */}
                    <div className="flex items-center space-x-4">
                      <WeatherIcon condition={day.weather?.condition || 'Unknown'} />
                      <div>
                        <p className="text-gray-700 font-medium flex items-center">
                          <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                          Temp: {day.weather?.temperature || 'N/A'}°F
                        </p>
                        <p className="text-gray-700 font-medium flex items-center">
                          <CloudRain className="h-5 w-5 mr-2 text-blue-500" />
                          Rain: {day.weather?.rainProbability || 'N/A'}%
                        </p>
                        <p className="text-gray-600">
                          Condition: <span className="font-medium">{day.weather?.condition || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Activities */}
                  <motion.div variants={containerVariants} className="space-y-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-indigo-500" />
                      Daily Activities
                    </h4>
                    {day.activities.length === 0 ? (
                      <p className="text-gray-500 italic text-center py-4 bg-white rounded-lg">No activities planned for this day.</p>
                    ) : (
                      day.activities.map((activity, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 transition-all duration-300"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-20 text-gray-600 font-medium bg-green-50 p-2 rounded-md">
                              {activity.time || 'N/A'}
                            </div>
                            <div className="flex-grow ml-4">
                              <h5 className="text-lg font-semibold text-gray-900">{activity.description || 'No description'}</h5>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                <span>{activity.location || 'N/A'}</span>
                              </div>
                              <div className="flex items-center text-gray-600 mt-1">
                                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                <span>${activity.cost || 0}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>

          {/* Footer Section */}
          <motion.div variants={itemVariants} className="mt-6 flex justify-between items-center py-4 bg-gray-100 rounded-lg">
            <div>
              <p className="text-gray-700 font-medium">Total Estimated Cost:</p>
              <p className="text-2xl font-bold text-gray-900">${itinerary.totalCost || 0}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/create-trip"
                className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium flex items-center"
              >
                <span>Modify Trip</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium flex items-center"
              >
                <span>Book Now</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {mapError && <p className="text-red-600 text-center mt-2">{mapError}</p>}
    </div>
  );
};

export default TripDetails;