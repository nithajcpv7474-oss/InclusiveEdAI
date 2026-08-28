import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import ToggleSwitch from '../components/ToggleSwitch';
import { 
  User, 
  Save, 
  Languages, 
  Eye, 
  Volume2, 
  Sliders, 
  Bell, 
  Accessibility, 
  BookOpen 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updatePreferences } = useAuth();
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  const handleToggle = (category, key, val) => {
    updateSetting(category, key, val);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    
    // Sync back to auth profile context
    const prefList = [];
    if (settings.accessibility.dyslexiaFont) prefList.push('dyslexia');
    if (settings.learning.easyRead) prefList.push('adhd');
    if (settings.audio.textToSpeech) prefList.push('auditory');
    
    updatePreferences(prefList, settings.language.preferred);
    addToast("Settings and accessibility preferences saved successfully!", "success");
  };

  const handleTranslateCurrentContent = () => {
    addToast("Language settings updated! Open the Workbench and select 'Translate' to re-process current notes.", "success");
  };

  const themeOptions = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'system', label: '💻 System' }
  ];

  const sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'learning', label: 'Learning Styles', icon: BookOpen, color: 'text-teal-600 dark:text-teal-400' },
    { id: 'audio', label: 'Audio Reader', icon: Volume2, color: 'text-pink-600 dark:text-pink-400' },
    { id: 'appearance', label: 'Appearance', icon: Sliders, color: 'text-orange-500 dark:text-orange-400' },
    { id: 'language', label: 'Language', icon: Languages, color: 'text-cyan-605 dark:text-cyan-400' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-blue-600 dark:text-blue-400' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/30 dark:bg-slate-950/30 transition-colors duration-300 overflow-hidden pb-16">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 relative z-10">
        
        {/* Settings Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-205/60 dark:border-slate-850 pb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-8 h-8 text-indigo-650 dark:text-indigo-400" />
              Workspace Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              Customize display preferences, auditory aids, notifications, and language settings.
            </p>
          </div>
          
          <button
            type="button"
            onClick={resetSettings}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none self-start sm:self-center"
          >
            Reset Defaults
          </button>
        </div>

        {/* Tab Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-slate-850 pr-0 lg:pr-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 w-full text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-650/15'
                      : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <form onSubmit={handleSaveAll} className="space-y-6">
              
              {activeTab === 'profile' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">User Account Profile</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">Personal info details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="space-y-2">
                      <label htmlFor="settings-name" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                        Full Name
                      </label>
                      <input
                        id="settings-name"
                        type="text"
                        value={user?.name || 'Venky'}
                        disabled
                        className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 rounded-xl text-sm focus:outline-none cursor-not-allowed font-semibold shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="settings-email" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                        Email Address
                      </label>
                      <input
                        id="settings-email"
                        type="email"
                        value={user?.email || 'demo@sensusai.com'}
                        disabled
                        className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-455 dark:text-slate-500 rounded-xl text-sm focus:outline-none cursor-not-allowed font-semibold shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Accessibility & Visual Aids</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">Contrast & typeface aids</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ToggleSwitch
                      id="pref-dyslexia"
                      label="Dyslexia-Friendly Font"
                      description="Applies standardized letter buffers and Lexend typography."
                      checked={settings.accessibility.dyslexiaFont}
                      onChange={(val) => handleToggle('accessibility', 'dyslexiaFont', val)}
                    />
                    <ToggleSwitch
                      id="pref-contrast"
                      label="High Contrast Display"
                      description="Boosts color visibility thresholds across layout panels."
                      checked={settings.accessibility.highContrast}
                      onChange={(val) => handleToggle('accessibility', 'highContrast', val)}
                    />
                    <ToggleSwitch
                      id="pref-motion"
                      label="Reduced Motion Profiles"
                      description="Disables sliding visual transitions and keyframe animations."
                      checked={settings.accessibility.reducedMotion}
                      onChange={(val) => handleToggle('accessibility', 'reducedMotion', val)}
                    />
                    <ToggleSwitch
                      id="pref-large"
                      label="Large Target Controls"
                      description="Increases physical interaction sizes on input forms."
                      checked={settings.accessibility.largeControls}
                      onChange={(val) => handleToggle('accessibility', 'largeControls', val)}
                    />
                    <ToggleSwitch
                      id="pref-tts"
                      label="Enable Text-to-Speech"
                      description="Readies browser vocal narration controls for notes reading."
                      checked={settings.audio.textToSpeech}
                      onChange={(val) => handleToggle('audio', 'textToSpeech', val)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-605 dark:text-teal-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Learning Styles</h2>
                      <p className="text-[10px] text-slate-455 uppercase tracking-widest mt-0.5 font-bold">Preferences configuration</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <ToggleSwitch
                      id="pref-easy"
                      label="Easy Read Mode"
                      description="Displays simplified, bulleted notes (ADHD mode) by default when viewing workbench materials."
                      checked={settings.learning.easyRead}
                      onChange={(val) => handleToggle('learning', 'easyRead', val)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-650 dark:text-pink-400 flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Audio Reader settings</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">TTS reader configurations</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleSwitch
                      id="pref-auto-read"
                      label="Automatically Read Content"
                      description="Automatically reads out loud adapted lecture notes when pages first load."
                      checked={settings.audio.autoRead}
                      onChange={(val) => handleToggle('audio', 'autoRead', val)}
                    />
                    
                    <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-205/50 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex-1 text-left pr-2">
                        <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200 block">Narration Rate Speed</span>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Scale multiplier: {settings.audio.speed.toFixed(1)}x</p>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={settings.audio.speed}
                        onChange={(e) => handleToggle('audio', 'speed', parseFloat(e.target.value))}
                        className="w-28 accent-indigo-600 dark:accent-indigo-400 cursor-pointer focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Display Layout & Typography</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">Theme & styling metrics</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Color Theme Scheme</span>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Toggle light mode, dark mode, or system values.</p>
                      </div>
                      <div className="flex bg-slate-150/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-205/60 dark:border-slate-800 gap-1 w-full sm:w-auto">
                        {themeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateSetting('appearance', 'theme', opt.value)}
                            className={`flex-1 sm:flex-none px-4.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${
                              settings.appearance.theme === opt.value
                                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-250'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Baseline Font Scale</span>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Scales all readable application contents proportionally.</p>
                      </div>
                      <div className="flex bg-slate-150/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-205/60 dark:border-slate-800 gap-1 w-full sm:w-auto">
                        {sizeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateSetting('appearance', 'fontSize', opt.value)}
                            className={`flex-1 sm:flex-none px-4.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${
                              settings.appearance.fontSize === opt.value
                                ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-250'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <ToggleSwitch
                        id="pref-line-spacing"
                        label="Increased Line Spacing"
                        description="Adds breathing space between horizontal reading baselines."
                        checked={settings.accessibility.increasedLineSpacing}
                        onChange={(val) => handleToggle('accessibility', 'increasedLineSpacing', val)}
                      />
                      <ToggleSwitch
                        id="pref-letter-spacing"
                        label="Increased Letter Spacing"
                        description="Increases tracking gaps between individual word characters."
                        checked={settings.accessibility.increasedLetterSpacing}
                        onChange={(val) => handleToggle('accessibility', 'increasedLetterSpacing', val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Language Localizations</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">Preferences configurations</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-205/60 dark:border-slate-850">
                      <label htmlFor="settings-lang" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-2">
                        Preferred Language Local
                      </label>
                      <select
                        id="settings-lang"
                        value={settings.language.preferred}
                        onChange={(e) => updateSetting('language', 'preferred', e.target.value)}
                        className="w-full p-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-750 dark:text-slate-300"
                      >
                        <option value="en">English (English)</option>
                        <option value="te">Telugu (తెలుగు)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="zh">Chinese (中文)</option>
                        <option value="ar">Arabic (العربية)</option>
                      </select>
                    </div>

                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={handleTranslateCurrentContent}
                        className="px-5 py-3 border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 hover:bg-purple-100/50 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus:outline-none"
                      >
                        Translate Current Content
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">System Notifications</h2>
                      <p className="text-[10px] text-slate-450 uppercase tracking-widest mt-0.5 font-bold">Preferences configuration</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ToggleSwitch
                      id="pref-notif-ai"
                      label="AI Processing Notifications"
                      description="Alerts when Gemini begins processing lecture transcript summaries."
                      checked={settings.notifications.aiProcessing}
                      onChange={(val) => handleToggle('notifications', 'aiProcessing', val)}
                    />
                    <ToggleSwitch
                      id="pref-notif-trans"
                      label="Translation Notifications"
                      description="Alerts when translations finish mapping target locals."
                      checked={settings.notifications.translation}
                      onChange={(val) => handleToggle('notifications', 'translation', val)}
                    />
                    <ToggleSwitch
                      id="pref-notif-acc"
                      label="Accessibility Notifications"
                      description="Alerts when visual presets change on layout layers."
                      checked={settings.notifications.accessibility}
                      onChange={(val) => handleToggle('notifications', 'accessibility', val)}
                    />
                    <ToggleSwitch
                      id="pref-notif-err"
                      label="Error Notifications"
                      description="Alerts immediately upon quota exhaustion or API network drops."
                      checked={settings.notifications.errors}
                      onChange={(val) => handleToggle('notifications', 'errors', val)}
                    />
                  </div>
                </div>
              )}

              {/* Actions Button */}
              <div className="flex justify-end pt-4 border-t border-slate-150 dark:border-slate-850/80">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-650 to-indigo-600 hover:scale-[1.01] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
