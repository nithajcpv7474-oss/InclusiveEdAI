import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer 
      className="mt-auto border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 py-12 transition-colors"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 dark:border-slate-850">
          <div className="space-y-4 md:col-span-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-650 to-pink-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">InclusiveEd AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              Making learning more accessible, understandable, and inclusive with AI.
            </p>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent block pt-1">
              "One Lecture. Every Learner."
            </span>
          </div>

          <div className="text-left">
            <h4 className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest mb-3">Product</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-350">
              <li><Link to="/dashboard" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Accessibility Options</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Easy Read Summary</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Lecture Translation</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Text-to-Speech</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest mb-3">Accessibility</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-350">
              <li><Link to="/settings" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Dyslexia Support</Link></li>
              <li><Link to="/settings" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">ADHD-Friendly Reading</Link></li>
              <li><Link to="/settings" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Language Support</Link></li>
              <li><Link to="/settings" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">WCAG Accessibility</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest mb-3">Legal</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-350">
              <li><a href="#" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-wider gap-4 pt-6">
          <div className="flex items-center gap-1 justify-center">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for inclusive learning.</span>
          </div>
          <div>
            <span>© 2026 InclusiveEd AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
