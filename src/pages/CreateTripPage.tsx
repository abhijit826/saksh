import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripForm from '../components/TripForm';

const CreateTripPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <TripForm />
      <Footer />
    </div>
  );
};

export default CreateTripPage;