import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
      Logout
    </button>
  );
};

export default Logout;