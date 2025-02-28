import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GeoGuide from '../components/GeoGuide';

const GeoGuidePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <GeoGuide />
      <Footer />
    </div>
  );
};

export default GeoGuidePage;