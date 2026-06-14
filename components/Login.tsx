import React, { useState } from 'react';
import { UserRole } from '../types';
import { Logo } from './icons';
import Button from './ui/Button';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'government' | 'public'>('government');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGovernmentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication: In a real app, this would be an API call.
    if (email === 'admin@gov.in' && password === 'password123') {
      setError('');
      onLogin(UserRole.Policymaker);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const TabButton = ({ tab, label }: { tab: 'government' | 'public', label: string }) => (
    <button
      type="button"
      onClick={() => {
        setActiveTab(tab);
        setError(''); // Clear error on tab switch
      }}
      className={`w-1/2 py-2.5 text-sm font-medium leading-5 rounded-md focus:outline-none transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow'
          : 'text-slate-600 hover:bg-slate-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-slate-200 shadow-lg">
        <div className="text-center">
            <div className="inline-block">
                <Logo className="w-20 h-20" />
            </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">DigiTwin</h1>
          <p className="mt-2 text-slate-600">Simulate Today. Shape Tomorrow.</p>
        </div>
        
        <div className="flex p-1 space-x-1 bg-slate-200 rounded-lg">
          <TabButton tab="government" label="Government User" />
          <TabButton tab="public" label="Public User" />
        </div>
        
        <div>
          {activeTab === 'government' ? (
            <form onSubmit={handleGovernmentLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter Email Address"
                  autoComplete="email"
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 pt-4">
              <p className="text-sm text-slate-600">
                Continue as a Public User to view simulations and analysis reports. 
                You will have read-only access to the platform.
              </p>
              <Button 
                onClick={() => onLogin(UserRole.Public)}
                variant="secondary"
                className="w-full"
              >
                Continue as Public User
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;