import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapPin, Clock, CreditCard, Users, ArrowRight, Loader } from 'lucide-react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { TripPreferences } from '../types';

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<TripPreferences>({
    origin: '',
    destination: '',
    maxPrice: '',
    departureDate: '',
    duration: '',
    budget: '',
    companions: '',
  });

  // State for detected location
  const [detectedOrigin, setDetectedOrigin] = useState<string | null>(null);

  // Refs for Autocomplete components
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Automatically detect user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY';
          if (!apiKey || apiKey === 'YOUR_FALLBACK_API_KEY') {
            console.warn('Google Maps API Key is missing. Location detection limited.');
            return;
          }

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const address = response.data.results[0]?.formatted_address || 'Current Location';
            const city = address.split(',')[0].trim();
            setDetectedOrigin(city);
            setPreferences((prev) => ({ ...prev, origin: city }));
          } catch (error) {
            console.error('Error fetching location:', error);
            setDetectedOrigin('Current Location (Unable to fetch)');
          }
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          setDetectedOrigin('Current Location (Permission denied)');
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      setDetectedOrigin('Current Location (Not supported)');
    }
  }, []);

  const handleInputChange = (field: keyof TripPreferences, value: string) => {
    // Restrict maxPrice to numbers only
    if (field === 'maxPrice' && !/^\d*$/.test(value)) return;
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const onPlaceChanged = (field: keyof TripPreferences) => {
    const autocomplete = field === 'origin' ? originAutocompleteRef.current : destinationAutocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const city = place.formatted_address.split(',')[0].trim();
        setPreferences((prev) => ({ ...prev, [field]: city }));
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generateTrip = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-itinerary', preferences);
      console.log('Full API Response:', response);
      console.log('Response Data:', response.data);
      // Navigate to trip-details with state
      navigate('/trip-details', { state: { itinerary: response.data, preferences } });
    } catch (error) {
      console.error('Error generating itinerary:', error.response ? error.response.data : error.message);
      console.error('Full error details:', error);
      alert('Failed to generate itinerary: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    const stepComponents = [
      { 
        icon: MapPin, 
        title: 'Where are you starting from?', 
        field: 'origin', 
        placeholder: 'Enter your origin or use detected location', 
        type: 'text', 
        detected: detectedOrigin 
      },
      { 
        icon: MapPin, 
        title: 'Where do you want to Explore?', 
        field: 'destination', 
        placeholder: 'Enter a destination (e.g., LAX)', 
        type: 'text' 
      },
      { 
        icon: CreditCard, 
        title: 'What is your Budget?', 
        field: 'maxPrice', 
        placeholder: 'Enter your budget (e.g., 1000)', 
        type: 'number' 
      },
      { 
        icon: Clock, 
        title: 'When do you want to depart?', 
        field: 'departureDate', 
        placeholder: 'Choose departure date', 
        type: 'date', 
        min: new Date().toISOString().split('T')[0] 
      },
      { 
        icon: Clock, 
        title: 'How long is your Trip?', 
        field: 'duration', 
        options: ['Weekend Getaway (1-3 days)', 'Short Trip (4-7 days)', 'Medium Trip (1-2 weeks)', 'Long Trip (2+ weeks)'] 
      },
      { 
        icon: Users, 
        title: 'Who are you traveling with?', 
        field: 'companions', 
        options: ['Solo Travel', 'Couple', 'Family with Kids', 'Group of Friends', 'Business Trip'] 
      },
    ];

    const { icon: Icon, title, field, placeholder, type, options, detected } = stepComponents[step - 1];
    return (
      <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="space-y-6">
        <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
          <Icon className="h-8 w-8 text-indigo-600" />
          <h2>{title}</h2>
        </div>
        {options ? (
          <select
            value={preferences[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase().replace(/ /g, '-')}>{option}</option>
            ))}
          </select>
        ) : (
          <div>
            {field === 'origin' || field === 'destination' ? (
              <Autocomplete
                ref={field === 'origin' ? originAutocompleteRef : destinationAutocompleteRef}
                onPlaceChanged={() => onPlaceChanged(field)}
                onLoad={(autocomplete) => {
                  if (field === 'origin') originAutocompleteRef.current = autocomplete;
                  else destinationAutocompleteRef.current = autocomplete;
                }}
                options={{
                  types: ['(cities)'], // Restrict to cities
                }}
              >
                <input
                  type={type}
                  value={preferences[field] as string}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={detected ? `${placeholder} (Detected: ${detected})` : placeholder}
                  min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </Autocomplete>
            ) : (
              <input
                type={type}
                value={preferences[field] as string}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={detected ? `${placeholder} (Detected: ${detected})` : placeholder}
                min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
        )}
        <div className="flex justify-between">
          {step > 1 && (
            <button onClick={prevStep} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Back
            </button>
          )}
          {step < stepComponents.length ? (
            <button
              onClick={nextStep}
              disabled={!preferences[field]}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                preferences[field] ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={generateTrip}
              disabled={!preferences[field] || isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                preferences[field] && !isGenerating ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY'}
        libraries={['geocoding', 'places']}
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Perfect Trip</h1>
          <p className="text-gray-600">Answer a few questions and our AI will generate a personalized travel itinerary for you.</p>
          <div className="mb-8 flex items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    i <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 6 && <div className={`flex-1 h-1 mx-2 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>
          {renderStep()}
        </div>
      </LoadScript>
    </div>
  );
};

export default TripForm;