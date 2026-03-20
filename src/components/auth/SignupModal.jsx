import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Leaf, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

function getPasswordStrength(password) {
  if (!password) return null;
  if (password.length < 6) return { label: 'Too short', color: 'bg-red-400',    width: 'w-1/4' };
  if (password.length < 8) return { label: 'Weak',      color: 'bg-orange-400', width: 'w-2/4' };
  const hasNum     = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  if (hasNum && hasSpecial) return { label: 'Strong',  color: 'bg-green-500', width: 'w-full' };
  if (hasNum || hasSpecial) return { label: 'Medium',  color: 'bg-yellow-400', width: 'w-3/4' };
  return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
}

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Community'
  });
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [error, setError]                       = useState('');
  const [fieldErrors, setFieldErrors]           = useState({});
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const strength     = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())                              errs.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    if (formData.password.length < 6)                       errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)     errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     formData.name,
          email:    formData.email,
          password: formData.password,
          role:     formData.role,
        }),
      });
      let data;
      try { data = await res.json(); }
      catch { setError('Invalid response from server.'); return; }

      if (res.ok) {
        const role   = data.role === 'Admin' ? 'Admin' : 'Community';
        const target = role === 'Admin' ? '/admin' : '/dashboard';
        flushSync(() => login({ ...data, role }));
        navigate(target, { replace: true });
      } else {
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Is backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full p-4 rounded-2xl outline-none transition-all text-sm
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    ${fieldErrors[field]
      ? 'border border-red-400 focus:ring-2 focus:ring-red-300'
      : 'border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500'}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-4">
            <Leaf className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-green-900">Join EcoPulse</h2>
          <p className="text-gray-500 mt-1 text-sm">Create your account and start protecting nature.</p>
        </div>

        {/* Global error */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <input
              name="name" type="text" placeholder="Full Name" required
              className={inputClass('name')}
              value={formData.name} onChange={handleChange}
            />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email" type="email" placeholder="Email Address" required
              className={inputClass('email')}
              value={formData.email} onChange={handleChange}
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                name="password" type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)" required
                className={inputClass('password') + ' pr-12'}
                value={formData.password} onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {strength && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className={`text-xs font-semibold ml-1
                  ${strength.label === 'Strong' ? 'text-green-600' :
                    strength.label === 'Medium' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {strength.label}
                </p>
              </div>
            )}
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password" required
                className={inputClass('confirmPassword') + ' pr-12'}
                value={formData.confirmPassword} onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-xs text-green-600 mt-1 ml-1 font-semibold">✓ Passwords match</p>
            )}
            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.confirmPassword}</p>}
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'Community' })}
              className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all
                ${formData.role === 'Community'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
            >
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-bold">Citizen</span>
              <span className="text-[10px] text-center opacity-70 leading-tight">Report eco issues</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'Admin' })}
              className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all
                ${formData.role === 'Admin'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-bold">Admin</span>
              <span className="text-[10px] text-center opacity-70 leading-tight">Manage & resolve</span>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg
              hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}