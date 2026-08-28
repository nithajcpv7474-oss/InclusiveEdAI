import React from 'react';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-10 transition-colors"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse-slow" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">InclusiveEd AI</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              Transforming classroom and online educational resources into fully customized learning materials.
            </p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent block">
              "One Lecture. Every Learner."
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">
              AI Hackathon 2026 Submission
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <div className="flex items-center gap-1.5 justify-center">
            <span>Built for accessibility & pedagogical inclusion with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Team InclusiveEd.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">WCAG Standards</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
