import React from 'react';
import { Link } from 'react-router-dom';
import Impact from './Impact';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            Direct Eco Action
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-green-900 tracking-tighter leading-[0.9] mb-8">
            Protect Nature, <br />
            <span className="text-green-600">Together.</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Report environmental issues, track eco resolutions, and protect your 
            surroundings with EcoPulse—the bridge between citizens and nature.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-green-200 hover:bg-green-700 transition-all active:scale-95">
              Get Started
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all">
              Sign In
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px]"></div>
        </div>
      </section>

      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl">🌊</div>
            <h3 className="text-xl font-bold text-gray-900">Report Pollution</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Flag water contamination, air pollution from burning, or noise violations on our live map — in seconds.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl">🌳</div>
            <h3 className="text-xl font-bold text-gray-900">Protect Green Spaces</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Report illegal tree felling, encroachments, and deforestation before it's too late for authorities to act.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl">�</div>
            <h3 className="text-xl font-bold text-gray-900">Track Eco Impact</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Watch trees saved, waste removed, and water bodies protected grow as your community takes action.</p>
          </div>
        </div>
      </section>

      <Impact />
    </div>
  );
}