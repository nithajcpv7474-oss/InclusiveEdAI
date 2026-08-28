import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, ArrowRight, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Step 2 & 3 States (Preferences)
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [selectedLang, setSelectedLang] = useState('es');
  const [loading, setLoading] = useState(false);

  const preferencesList = [
    { id: 'auditory', label: '🎧 I prefer audio readouts', desc: 'Prepares vocal narration and text-to-speech triggers.' },
    { id: 'dyslexia', label: '👁 I prefer highly readable text', desc: 'Applies spacing buffers and readable Lexend typography.' },
    { id: 'esl', label: '🌎 I learn best in another language', desc: 'Highlights glossary tooltips and translates scripts.' },
    { id: 'adhd', label: '🧠 I prefer simplified summaries', desc: 'Trims down verbose paragraphs and highlights key terms.' }
  ];

  const handleTogglePref = (id) => {
    setSelectedPrefs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate database network load
    setTimeout(() => {
      const result = signup(name, email, password, selectedPrefs, selectedLang);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Signup failed.');
        setStep(1); // Go back to credentials if fail
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Storytelling panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-955 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[90px]" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <img 
            src="/sensusai-logo.png" 
            alt="SensusAI Logo" 
            className="h-9 w-9 rounded-xl object-contain brightness-100" 
          />
          <span className="text-sm font-extrabold uppercase tracking-widest text-slate-355">
            SensusAI
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Design Your Own<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-350 to-pink-300 bg-clip-text text-transparent">
              Learning Space.
            </span>
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            Whether you read, listen, translate, or summary-study, configure your account settings on startup. sensusai adapts immediately to your workflow.
          </p>

          {/* Stepper indicators */}
          <div className="flex items-center gap-2.5 pt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 1 ? 'bg-indigo-600 border-indigo-550 text-white' : 'border-slate-800 text-slate-500'
            }`}>1</div>
            <div className="w-6 h-[1.5px] bg-slate-800" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 2 ? 'bg-indigo-600 border-indigo-550 text-white' : 'border-slate-800 text-slate-500'
            }`}>2</div>
            <div className="w-6 h-[1.5px] bg-slate-800" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 3 ? 'bg-indigo-600 border-indigo-550 text-white' : 'border-slate-800 text-slate-500'
            }`}>3</div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-550 font-bold uppercase tracking-wider">
          © 2026 sensusai AI Project Core • WCAG 2.2 compliant
        </div>
      </div>

      {/* Right Column: Interactive Card Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-lg space-y-8 bg-white dark:bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-805/80 shadow-md">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs text-rose-800 dark:text-rose-455 font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Personal Credentials */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Create account
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Begin by entering your registration details.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Learner"
                      className="w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-850 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-850 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="pass-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="pass-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-850 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirm-pass-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="confirm-pass-input"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-850 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="show-pass"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="show-pass" className="text-xs text-slate-500 dark:text-slate-450 cursor-pointer">
                    Show Password
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continue to Onboarding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-450">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Onboarding Questionnaire */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  How do you prefer to learn?
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Select all adaptations that support your preferred classroom study workflow.
                </p>
              </div>

              <div className="space-y-3.5">
                {preferencesList.map((pref) => {
                  const isSelected = selectedPrefs.includes(pref.id);
                  return (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => handleTogglePref(pref.id)}
                      className={`w-full p-4.5 rounded-2xl border text-left transition-all flex items-start gap-4 hover:scale-[1.01] ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-500/5 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                          {pref.label}
                        </span>
                        <p className="text-xs text-slate-450 dark:text-slate-500 leading-normal mt-1">
                          {pref.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-bold rounded-xl text-xs text-slate-700 dark:text-slate-350 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Language Default */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Choose your native language
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Select your primary language for localized summaries and workspace translation tabs.
                </p>
              </div>

              <div className="space-y-1.5 p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-200/50 dark:border-slate-805">
                <label htmlFor="lang-select" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  Primary Language Mapping
                </label>
                <select
                  id="lang-select"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-750 dark:text-slate-300"
                >
                  <option value="es">Spanish (Español)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="fr">French (Français)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="en">English (English)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-bold rounded-xl text-xs text-slate-700 dark:text-slate-350 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider group cursor-pointer"
                >
                  <span>{loading ? 'Creating...' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            🔒 Privacy check: your learning history stays client-side.
          </div>
        </div>
      </div>
    </div>
  );
}
