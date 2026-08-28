import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import ToggleSwitch from './ToggleSwitch';
import { Sparkles, Brain, PlusCircle, LayoutDashboard, Settings, LogOut, CheckCircle2, UserCheck } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useAccessibility();
  
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const quickSettingsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (quickSettingsRef.current && !quickSettingsRef.current.contains(e.target)) {
        setShowQuickSettings(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300"
      role="banner"
    >
      {/* Visual Accent top bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1 group transition-all"
            aria-label="SensusAI home"
          >
            <img 
              src="/sensusai-logo.png" 
              alt="SensusAI Logo" 
              className="h-8.5 w-8.5 rounded-xl object-contain hover:scale-[1.02] transition-transform"
            />
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              SensusAI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2" role="navigation" aria-label="Main Navigation">
            {user ? (
              <>
                {/* Logged in Navigation */}
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] ${
                    location.pathname === '/dashboard'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/10'
                      : 'text-slate-605 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/new-lesson"
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] ${
                    location.pathname === '/new-lesson'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/10'
                      : 'text-slate-605 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Lecture</span>
                </Link>

                <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] ${
                    location.pathname === '/settings'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/10'
                      : 'text-slate-605 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                {/* Quick Accessibility settings shortcut */}
                <div className="relative flex items-center" ref={quickSettingsRef}>
                  <button
                    onClick={() => setShowQuickSettings(!showQuickSettings)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-205 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                      showQuickSettings
                        ? 'bg-indigo-500/10 text-indigo-605 dark:bg-indigo-500/15 dark:text-indigo-400 font-extrabold'
                        : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-label="Toggle quick accessibility settings menu"
                    aria-expanded={showQuickSettings}
                  >
                    <span className="text-sm">♿</span>
                    <span className="hidden sm:inline">Accessibility</span>
                  </button>

                  {showQuickSettings && (
                    <div 
                      className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-xl p-4 space-y-3 z-50 text-left"
                      role="dialog"
                      aria-label="Quick accessibility settings panel"
                    >
                      <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Quick settings</span>
                        <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Accessibility Preferences</h4>
                      </div>
                      
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                        <ToggleSwitch
                          id="quick-dyslexia"
                          label="Dyslexia Font"
                          checked={settings.accessibility.dyslexiaFont}
                          onChange={(val) => updateSetting('accessibility', 'dyslexiaFont', val)}
                        />
                        <ToggleSwitch
                          id="quick-contrast"
                          label="High Contrast"
                          checked={settings.accessibility.highContrast}
                          onChange={(val) => updateSetting('accessibility', 'highContrast', val)}
                        />
                        <ToggleSwitch
                          id="quick-easy"
                          label="Easy Read Mode"
                          checked={settings.learning.easyRead}
                          onChange={(val) => updateSetting('learning', 'easyRead', val)}
                        />
                        <ToggleSwitch
                          id="quick-tts"
                          label="Text-to-Speech"
                          checked={settings.audio.textToSpeech}
                          onChange={(val) => updateSetting('audio', 'textToSpeech', val)}
                        />
                        <ToggleSwitch
                          id="quick-large"
                          label="Large Controls"
                          checked={settings.accessibility.largeControls}
                          onChange={(val) => updateSetting('accessibility', 'largeControls', val)}
                        />
                        <ToggleSwitch
                          id="quick-motion"
                          label="Reduced Motion"
                          checked={settings.accessibility.reducedMotion}
                          onChange={(val) => updateSetting('accessibility', 'reducedMotion', val)}
                        />
                      </div>
                      <div className="text-center pt-2.5 border-t border-slate-100 dark:border-slate-850">
                        <Link
                          to="/settings"
                          onClick={() => setShowQuickSettings(false)}
                          className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider block"
                        >
                          Configure All Settings
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                {/* User Greeting (Desktop) */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 rounded-full border border-slate-200/50 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wide">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-550" />
                  <span>{user.name}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-955/15 transition-all focus:outline-none"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Logged out Navigation */}
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-250 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
