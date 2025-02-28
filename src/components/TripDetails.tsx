import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Clock, Map, Download, Share2 } from 'lucide-react';
import { TripPreferences } from '../types';

// Mock data for a generated trip
const mockTrip = {
  id: 'trip-123',
  destination: 'Tokyo, Japan',
  duration: '7 days',
  budget: 'Moderate',
  companions: 'Couple',
  itinerary: [
    {
      day: 1,
      activities: [
        {
          time: '09:00 AM',
          activity: 'Arrival and Check-in',
          location: 'Hotel in Shinjuku',
          cost: '$0 (pre-paid)',
        },
        {
          time: '11:00 AM',
          activity: 'Explore Shinjuku Gyoen National Garden',
          location: 'Shinjuku',
          cost: '$5 per person',
        },
        {
          time: '01:00 PM',
          activity: 'Lunch at local ramen shop',
          location: 'Shinjuku',
          cost: '$15 per person',
        },
        {
          time: '03:00 PM',
          activity: 'Visit Tokyo Metropolitan Government Building Observation Deck',
          location: 'Shinjuku',
          cost: 'Free',
        },
        {
          time: '06:00 PM',
          activity: 'Dinner at Izakaya',
          location: 'Shinjuku',
          cost: '$30 per person',
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          time: '08:00 AM',
          activity: 'Breakfast at hotel',
          location: 'Hotel',
          cost: 'Included',
        },
        {
          time: '09:30 AM',
          activity: 'Visit Senso-ji Temple',
          location: 'Asakusa',
          cost: 'Free',
        },
        {
          time: '12:00 PM',
          activity: 'Lunch at Asakusa street food',
          location: 'Asakusa',
          cost: '$12 per person',
        },
        {
          time: '02:00 PM',
          activity: 'Tokyo Skytree',
          location: 'Sumida',
          cost: '$25 per person',
        },
        {
          time: '05:00 PM',
          activity: 'Akihabara Electric Town',
          location: 'Akihabara',
          cost: 'Free (shopping extra)',
        },
        {
          time: '07:00 PM',
          activity: 'Dinner at Maid Cafe',
          location: 'Akihabara',
          cost: '$35 per person',
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          time: '08:00 AM',
          activity: 'Breakfast at hotel',
          location: 'Hotel',
          cost: 'Included',
        },
        {
          time: '09:30 AM',
          activity: 'Tsukiji Outer Market',
          location: 'Tsukiji',
          cost: 'Free (food extra)',
        },
        {
          time: '12:00 PM',
          activity: 'Sushi lunch',
          location: 'Tsukiji',
          cost: '$40 per person',
        },
        {
          time: '02:00 PM',
          activity: 'Hamarikyu Gardens',
          location: 'Chuo',
          cost: '$3 per person',
        },
        {
          time: '04:00 PM',
          activity: 'Ginza Shopping District',
          location: 'Ginza',
          cost: 'Free (shopping extra)',
        },
        {
          time: '07:00 PM',
          activity: 'Dinner at upscale restaurant',
          location: 'Ginza',
          cost: '$60 per person',
        },
      ],
    },
  ],
  totalCost: 'Approximately $450 per person',
};

const TripDetails: React.FC = () => {
  const location = useLocation();
  const preferences = location.state?.preferences as TripPreferences || {
    destination: 'Unknown',
    duration: 'Unknown',
    budget: 'Unknown',
    companions: 'Unknown',
  };
  
  const [activeDay, setActiveDay] = useState(1);
  const [showMap, setShowMap] = useState(false);

  // Use the preferences to display the trip details
  // In a real app, this would come from an API call
  const trip = {
    ...mockTrip,
    destination: preferences.destination || mockTrip.destination,
  };

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
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{trip.destination}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span>{trip.budget}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{trip.companions}</span>
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
            {trip.itinerary.map((day) => (
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
            {trip.itinerary
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
              <p className="text-xl font-bold text-gray-900">{trip.totalCost}</p>
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