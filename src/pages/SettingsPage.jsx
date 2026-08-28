import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import ToggleSwitch from '../components/ToggleSwitch';
import { 
  Sparkles, 
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
    
    // Translate language code to backend preferences mapping
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Accessibility className="w-8 h-8 text-indigo-650" />
            Workspace Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            Customize display preferences, auditory aids, notifications, and language settings.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSettings}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
        >
          Reset Defaults
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* Profile details */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <User className="w-4 h-4 text-indigo-505" />
            User Account Profile
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label htmlFor="settings-name" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={user?.name || 'Alex Learner'}
                disabled
                className="w-full p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 rounded-xl text-sm focus:outline-none cursor-not-allowed font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-email" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                value={user?.email || 'demo@inclusiveed.ai'}
                disabled
                className="w-full p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-455 dark:text-slate-500 rounded-xl text-sm focus:outline-none cursor-not-allowed font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Toggles Switchboard */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-teal-505" />
            Accessibility & Visual Aids
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Learning Preferences */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-emerald-505" />
            Learning Preferences
          </h2>
          
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

        {/* Audio Toggles */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-pink-505" />
            Audio Reader settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              id="pref-auto-read"
              label="Automatically Read Content"
              description="Automatically reads out loud adapted lecture notes when pages first load."
              checked={settings.audio.autoRead}
              onChange={(val) => handleToggle('audio', 'autoRead', val)}
            />
            {/* Speed slider mapping */}
            <div className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex-1 text-left pr-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Narration Rate Speed</span>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Scale multiplier: {settings.audio.speed.toFixed(1)}x</p>
              </div>
              <input 
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.audio.speed}
                onChange={(e) => handleToggle('audio', 'speed', parseFloat(e.target.value))}
                className="w-28 accent-indigo-650 cursor-pointer focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Display Appearance segment controls */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-orange-505" />
            Display Layout & Typography
          </h2>

          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
              <div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Color Theme Scheme</span>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Toggle light mode, dark mode, or system values.</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-205/60 dark:border-slate-800 gap-1 w-full sm:w-auto">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateSetting('appearance', 'theme', opt.value)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${
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
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-205/60 dark:border-slate-800 gap-1 w-full sm:w-auto">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateSetting('appearance', 'fontSize', opt.value)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer ${
                      settings.appearance.fontSize === opt.value
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
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

        {/* Translation Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <Languages className="w-4 h-4 text-purple-505" />
            Language Localizations
          </h2>

          <div className="space-y-4 text-left">
            <div className="space-y-1.5 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
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
                className="px-5 py-2.5 border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 hover:bg-purple-100/50 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus:outline-none"
              >
                Translate Current Content
              </button>
            </div>
          </div>
        </div>

        {/* Notifications toggles */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-6">
          <h2 className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-blue-505" />
            System Notifications Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Actions Button */}
        <div className="flex justify-end pt-4 border-t border-slate-150 dark:border-slate-850/80">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>
    </div>
  );
}
