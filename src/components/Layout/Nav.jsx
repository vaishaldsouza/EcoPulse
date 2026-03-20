import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Leaf } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-[1000] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-black text-green-600 tracking-tighter">
            EcoPulse<span className="text-gray-900 dark:text-white">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <>
              <Link
                to={user.role === 'Admin' ? '/admin' : '/dashboard'}
                className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {user.role === 'Admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-gray-900 dark:text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 dark:hover:bg-red-600 transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}