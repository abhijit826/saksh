import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Compass className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TravelAI</span>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/trips" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600">
              My Trips
            </Link>
            <Link to="/wallet" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600">
              Travel Wallet
            </Link>
            <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600">
              <User className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/trips" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              My Trips
            </Link>
            <Link 
              to="/wallet" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Travel Wallet
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;