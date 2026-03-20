import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Leaf } from 'lucide-react';

export default function Login() {
  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      let data;
      try { data = await res.json(); }
      catch { setError('Invalid response from server'); return; }

      if (res.ok) {
        const role   = data.role === 'Admin' ? 'Admin' : 'Community';
        const target = role === 'Admin' ? '/admin' : '/dashboard';
        flushSync(() => login({ ...data, role }));
        navigate(target, { replace: true });
      } else {
        setError(data.msg || 'Invalid credentials');
      }
    } catch (err) {
      setError('Could not connect to server. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900 rounded-2xl mb-4">
            <Leaf className="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-green-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to your EcoPulse account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1 ml-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              className="w-full p-4 rounded-2xl outline-none transition-all text-sm
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                border border-gray-200 dark:border-gray-600
                placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full p-4 pr-12 rounded-2xl outline-none transition-all text-sm
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  border border-gray-200 dark:border-gray-600
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg
              hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none
              transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 dark:text-green-400 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}