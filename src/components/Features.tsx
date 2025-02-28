import React from 'react';
import { motion } from 'framer-motion';
import { Map, Compass, Smartphone, Headphones, CreditCard, Shield } from 'lucide-react';

const features = [
  {
    name: 'GEO-GUIDE',
    description: 'Explore Points of Interest (POIs) with our AI-powered guide that learns your preferences and provides personalized recommendations.',
    icon: Map,
  },
  {
    name: 'USER-OWNED DATA',
    description: 'Your travel data belongs to you. We use blockchain technology to ensure your data remains private and secure.',
    icon: Shield,
  },
  {
    name: 'CONTEXTUAL AI',
    description: 'Our AI understands the context of your travel needs and adapts to provide the most relevant information and suggestions.',
    icon: Compass,
  },
  {
    name: 'AR IMMERSION',
    description: 'Experience destinations before you visit with our augmented reality features that bring travel guides to life.',
    icon: Smartphone,
  },
  {
    name: 'VIRTUAL TRAVEL AGENT',
    description: 'Get 24/7 assistance from our virtual travel agent that can help with bookings, recommendations, and travel issues.',
    icon: Headphones,
  },
  {
    name: 'PERSONALIZED WALLET',
    description: 'Manage your travel documents, credit cards, passports, and visas in one secure digital wallet powered by blockchain.',
    icon: CreditCard,
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to travel
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our AI-powered platform revolutionizes how you plan, experience, and remember your travels.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;