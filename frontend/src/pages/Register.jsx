import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ switchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-1">Create Account 🚀</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Start tracking your career journey</p>

        {error && <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Alex Johnson"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Password</label>
            <input
              required
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <button onClick={switchToLogin} className="text-indigo-600 font-bold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
