import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import GeoGuidePage from './pages/GeoGuidePage';
import WalletPage from './pages/WalletPage';
import Profile from './components/Profile';
import MyTrips from './components/MyTrips';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/trip-details" element={<TripDetailsPage />} />
        <Route path="/geo-guide" element={<GeoGuidePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mytrips" element={<MyTrips />} />
      </Routes>
    </Router>
  );
}

export default App;