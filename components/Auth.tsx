
import React, { useState } from 'react';
import { createUser, getUserByEmail } from '../services/dbService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;
    setAuthError('');

    if (!isLogin) {
      if (name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters long.';
        isValid = false;
      }
    }

    if (!email.trim()) {
        newErrors.email = 'Email address is required.';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (!isLogin) {
      // Must be 8+ characters and contain an uppercase, lowercase, number, and special character.
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Must be 8+ chars, with uppercase, lowercase, number, & special character.';
        isValid = false;
      }
    }
    
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (isLogin) {
      // Handle Login
      const existingUser = getUserByEmail(email);
      if (!existingUser || existingUser.password !== password) {
        setAuthError('Invalid email or password.');
        return;
      }
      onLogin(existingUser);
    } else {
      // Handle Signup
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        setAuthError('An account with this email already exists.');
        return;
      }
      const newUser = createUser(name, email, password);
      onLogin(newUser);
    }
  };
  
  // When switching tabs, clear all state
  const handleTabSwitch = (loginView: boolean) => {
    setIsLogin(loginView);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setAuthError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-base-200 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <div className="flex border-b border-base-300">
          <button
            onClick={() => handleTabSwitch(true)}
            className={`w-1/2 py-4 text-sm font-medium text-center ${isLogin ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabSwitch(false)}
            className={`w-1/2 py-4 text-sm font-medium text-center ${!isLogin ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Sign Up
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${errors.name ? 'border-red-500' : 'border-base-300'} bg-base-100 placeholder-gray-500 text-base-content focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm`}
                placeholder="Full Name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${errors.email ? 'border-red-500' : 'border-base-300'} bg-base-100 placeholder-gray-500 text-base-content focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm`}
              placeholder="Email address"
            />
             {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-base-300'} bg-base-100 placeholder-gray-500 text-base-content focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm`}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-base-300'} bg-base-100 placeholder-gray-500 text-base-content focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary transition-colors"
            >
              {isLogin ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
