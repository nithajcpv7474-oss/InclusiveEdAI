import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import ToggleSwitch from './ToggleSwitch';
import { Settings, RefreshCw, Type, Eye, Palette, Contrast, Check, X } from 'lucide-react';

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    setFontSize,
    dyslexiaMode,
    setDyslexiaMode,
    themeTint,
    setThemeTint,
    highContrast,
    setHighContrast,
    resetSettings
  } = useAccessibility();

  const fontSizes = [
    { key: 'sm', label: 'A-', desc: 'Small text', title: 'Small' },
    { key: 'md', label: 'A', desc: 'Normal text', title: 'Default' },
    { key: 'lg', label: 'A+', desc: 'Large text', title: 'Large' },
    { key: 'xl', label: 'A++', desc: 'Extra large text', title: 'X-Large' }
  ];

  const tints = [
    { key: 'default', label: 'Default Light', bgClass: 'bg-white border-slate-205 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100' },
    { key: 'warm', label: 'Warm Sepia', bgClass: 'bg-[#faf6ee] border-[#eadecd] text-[#2b2519]' },
    { key: 'cool', label: 'Cool Blue', bgClass: 'bg-[#f0f4f8] border-[#dbe4ee] text-[#1b2633]' },
    { key: 'dark', label: 'High Contrast Dark', bgClass: 'bg-[#12131a] border-[#2b2e3f] text-[#e3e6ed]' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button with Glowing hover effect */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-xs uppercase tracking-wider relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        aria-label="Toggle accessibility menu"
        aria-expanded={isOpen}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-650 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <Settings className={`w-4 h-4 relative z-10 ${isOpen ? 'rotate-90' : 'animate-spin-slow'} transition-transform duration-500`} />
        <span className="relative z-10">Display Helper</span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div 
          className="mt-3 w-84 p-6 rounded-3xl shadow-2xl border bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200"
          role="dialog"
          aria-label="Accessibility Settings"
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-left">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                READABILITY DECK
              </h2>
              <p className="text-[10px] text-slate-405 dark:text-slate-500 uppercase tracking-widest mt-0.5">Adapt screen styles</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={resetSettings}
                className="p-1.5 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-650 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                title="Reset accessibility options"
                aria-label="Reset accessibility settings"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Font Size Selector */}
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                Font Size Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {fontSizes.map((size) => (
                  <button
                    key={size.key}
                    onClick={() => setFontSize(size.key)}
                    className={`py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${
                      fontSize === size.key
                        ? 'bg-indigo-600 border-transparent text-white shadow-md shadow-indigo-650/10 scale-[1.03]'
                        : 'bg-slate-50 border-slate-200/60 dark:bg-slate-850 dark:border-slate-800 text-slate-755 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={size.desc}
                    aria-label={`Set font size to ${size.title}`}
                  >
                    <span className="text-xs font-black">{size.label}</span>
                    <span className="text-[8px] mt-0.5 opacity-80">{size.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia Mode Toggle */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-left">
              <ToggleSwitch
                id="deck-dyslexia"
                label="Dyslexic Typeface"
                description="Applies Lexend typeface and heavy character offsets."
                checked={dyslexiaMode}
                onChange={setDyslexiaMode}
              />
            </div>

            {/* Background Tint Selector */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-left">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Tint Contrast Deck
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tints.map((tint) => (
                  <button
                    key={tint.key}
                    onClick={() => setThemeTint(tint.key)}
                    className={`py-2 px-3 text-[10px] font-bold rounded-xl border flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${tint.bgClass} ${
                      themeTint === tint.key
                        ? 'ring-2 ring-indigo-500 ring-offset-1 border-transparent shadow-sm'
                        : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Apply ${tint.label} theme tint`}
                  >
                    <span>{tint.label}</span>
                    {themeTint === tint.key && <Check className="w-3 h-3 text-indigo-650" />}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Option */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-left">
              <ToggleSwitch
                id="deck-contrast"
                label="High Contrast Text"
                description="Increases text color densities against backgrounds."
                checked={highContrast}
                onChange={setHighContrast}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
