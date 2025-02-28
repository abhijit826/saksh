import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, CreditCard, Users, ArrowRight, Loader } from 'lucide-react';
import { TripPreferences } from '../types';

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<TripPreferences>({
    destination: '',
    duration: '',
    budget: '',
    companions: '',
  });

  const handleInputChange = (field: keyof TripPreferences, value: string) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const generateTrip = () => {
    setIsGenerating(true);
    // Simulate API call to generate trip
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/trip-details', { state: { preferences } });
    }, 3000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
              <MapPin className="h-8 w-8 text-indigo-600" />
              <h2>Where do you want to Explore? 🏖</h2>
            </div>
            <input
              type="text"
              value={preferences.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Enter a destination (e.g., Paris, Japan, Caribbean)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                disabled={!preferences.destination}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  preferences.destination
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
              <Clock className="h-8 w-8 text-indigo-600" />
              <h2>How long is your Trip? 🕜</h2>
            </div>
            <select
              value={preferences.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select duration</option>
              <option value="weekend">Weekend Getaway (1-3 days)</option>
              <option value="short">Short Trip (4-7 days)</option>
              <option value="medium">Medium Trip (1-2 weeks)</option>
              <option value="long">Long Trip (2+ weeks)</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!preferences.duration}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  preferences.duration
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
              <CreditCard className="h-8 w-8 text-indigo-600" />
              <h2>What is your Budget? 💳</h2>
            </div>
            <select
              value={preferences.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select budget range</option>
              <option value="budget">Budget Friendly</option>
              <option value="moderate">Moderate</option>
              <option value="luxury">Luxury</option>
              <option value="ultra-luxury">Ultra Luxury</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!preferences.budget}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  preferences.budget
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
              <Users className="h-8 w-8 text-indigo-600" />
              <h2>Who are you traveling with? 🚗</h2>
            </div>
            <select
              value={preferences.companions}
              onChange={(e) => handleInputChange('companions', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select travel companions</option>
              <option value="solo">Solo Travel</option>
              <option value="couple">Couple</option>
              <option value="family">Family with Kids</option>
              <option value="friends">Group of Friends</option>
              <option value="business">Business Trip</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={generateTrip}
                disabled={!preferences.companions || isGenerating}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                  preferences.companions && !isGenerating
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Trip</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Perfect Trip</h1>
          <p className="text-gray-600">
            Answer a few questions and our AI will generate a personalized travel itinerary for you.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    i <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i < step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default TripForm;