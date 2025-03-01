import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import GeoGuidePage from './pages/GeoGuidePage';
import WalletPage from './pages/WalletPage';
import Profile from './components/Profile';
import MyTrips from './components/MyTrips';
import Navbar from './components/Navbar';
import AuthPage from './components/auth/AuthPage';
import Logout from './components/auth/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfile from './components/EditProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
        <Route path="/trip-details" element={<TripDetailsPage />} />
        <Route path="/geo-guide" element={<GeoGuidePage />} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/mytrips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;