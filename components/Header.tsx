
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const BrainCircuitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-brand-secondary">
        <path d="M12 5a3 3 0 1 0-5.993.129"/><path d="M12 5a3 3 0 1 0 5.993.129"/><path d="M15 13a3 3 0 1 0-5.993.129"/><path d="M15 13a3 3 0 1 0 5.993.129"/><path d="M5 13a3 3 0 1 0-5.993.129"/><path d="M5 13a3 3 0 1 0 5.993.129"/><path d="M12 21a3 3 0 1 0-5.993.129"/><path d="M12 21a3 3 0 1 0 5.993.129"/><path d="M12 5a3 3 0 1 0-5.993.129"/><path d="M12 5a3 3 0 1 0 5.993.129"/><path d="M15 13a3 3 0 1 0-5.993.129"/><path d="M15 13a3 3 0 1 0 5.993.129"/><path d="M5 13a3 3 0 1 0-5.993.129"/><path d="M5 13a3 3 0 1 0 5.993.129"/><path d="M12 21a3 3 0 1 0-5.993.129"/><path d="M12 21a3 3 0 1 0 5.993.129"/><path d="M14 15.5c.33.17.67.33 1 .5"/><path d="M14 9.5c.33-.17.67-.33 1-.5"/><path d="m4.33 14-1.16.58"/><path d="m20.83 14 1.16.58"/><path d="m4.33 10 1.16-.58"/><path d="m20.83 10-1.16-.58"/><path d="M10 15.5c-.33.17-.67.33-1 .5"/><path d="M10 9.5c-.33-.17-.67-.33-1-.5"/><path d="M12 18v-2.5"/><path d="M12 8V5.5"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BrainCircuitIcon />
            <span className="text-xl font-bold text-base-content">System Design Evaluator</span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium hidden sm:block">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
