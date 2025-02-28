import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripDetails from '../components/TripDetails';

const TripDetailsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <TripDetails />
      <Footer />
    </div>
  );
};

export default TripDetailsPage;