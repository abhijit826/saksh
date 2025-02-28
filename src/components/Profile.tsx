import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, Plane } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/auth');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-purple-50 flex flex-col items-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Plane className="h-8 w-8 text-indigo-600" />
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Profile</h2>
        </div>
        <p className="text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Welcome, {user.name}
        </p>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Here are your travel details and preferences.
        </p>
      </motion.div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="transform transition-all duration-300"
        >
          <div className="relative bg-gradient-to-r from-indigo-500 to-teal-500 h-24 rounded-lg shadow-lg flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Globe className="h-16 w-16 text-white" />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="bg-white rounded-full p-2 shadow-md mb-4">
                <User className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-white">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5 text-teal-500" />
              <span className="text-sm">{user.location}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Plane className="h-5 w-5 text-purple-500" />
              <span className="text-sm">{user.trips} Trips</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Globe className="h-5 w-5 text-indigo-500" />
              <span className="text-sm">Favorite: {user.favoriteDestination}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            View Travel History
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;