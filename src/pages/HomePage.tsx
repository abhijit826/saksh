import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCreateTripClick = () => {
    if (!token) {
      navigate('/auth');
    } else {
      navigate('/create-trip');
    }
  };

  return (
    <div>
      <Hero handleCreateTripClick={handleCreateTripClick} />
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage;