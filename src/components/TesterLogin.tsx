import React, { useState } from 'react';
import { Shield, LogIn, X } from 'lucide-react';

interface TesterLoginProps {
  onLogin: (email: string) => void;
  onClose: () => void;
}

export function TesterLogin({ onLogin, onClose }: TesterLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate Kreo email domain
    if (!email.endsWith('@kreo-tech.com')) {
      setError('Only Kreo employees can access the testing interface');
      return;
    }

    // Simple password check (in production, use proper authentication)
    if (password !== 'kreo2024') {
      setError('Invalid credentials');
      return;
    }

    onLogin(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-elegant border border-blue-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Tester Login</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kreo Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@kreo-tech.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-smooth"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 gradient-bg text-white rounded-xl hover:shadow-lg transition-smooth font-semibold flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Login to Testing Interface</span>
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          <p className="font-medium mb-1">For Kreo Employees Only</p>
          <p>Access restricted to @kreo-tech.com email addresses</p>
        </div>
      </div>
    </div>
  );
}