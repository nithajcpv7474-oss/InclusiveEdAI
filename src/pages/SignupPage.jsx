import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, ArrowRight, ArrowLeft, Check, CheckCircle2, Accessibility } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 text-left">
      {/* Left Column: Storytelling panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#17153F] via-[#24205F] to-[#30286F] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle blurred accent glows */}
        <div className="absolute top-[15%] left-[-10%] w-[300px] h-[300px] bg-[#8B5CF6]/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[25%] right-[-10%] w-[320px] h-[320px] bg-[#EC4899]/6 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <img 
            src="/sensusai-logo.png" 
            alt="SensusAI Logo" 
            className="h-9 w-9 rounded-xl object-contain brightness-100" 
          />
          <span className="text-sm font-extrabold uppercase tracking-widest text-[#E0E7FF]">
            SensusAI
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <h2 className="text-4xl font-black leading-tight tracking-tight text-[#FFFFFF]">
            Design Your Own<br />
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#F0ABFC] bg-clip-text text-transparent">
              Learning Space.
            </span>
          </h2>
          <p className="text-[#C4B5FD] leading-relaxed text-sm font-medium">
            Whether you read, listen, translate, or summary-study, configure your account settings on startup. SensusAI adapts immediately to your workflow.
          </p>

          {/* Stepper indicators */}
          <div className="flex items-center gap-2.5 pt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 1 ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white font-black' : 'border-[#373275] text-[#373275] bg-transparent'
            }`}>1</div>
            <div className="w-6 h-[1.5px] bg-[#373275]" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 2 ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white font-black' : 'border-[#373275] text-[#373275] bg-transparent'
            }`}>2</div>
            <div className="w-6 h-[1.5px] bg-[#373275]" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              step >= 3 ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white font-black' : 'border-[#373275] text-[#373275] bg-transparent'
            }`}>3</div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-[#E0E7FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Accessibility className="w-3.5 h-3.5" />
          <span>© 2026 SensusAI Project Core • WCAG 2.2 compliant</span>
        </div>
      </div>

      {/* Right Column: Interactive Card Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-[#F8FAFC] relative overflow-hidden transition-colors duration-300">
        {/* Subtle lavender radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,232,255,0.45),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-lg space-y-8 bg-[#FFFFFF] p-8 sm:p-10 rounded-[20px] border border-[#E9E7F5] shadow-[0_8px_30px_rgba(23,21,63,0.02)] relative z-10">
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
                <p className="text-xs text-slate-550 dark:text-slate-450 font-medium">
                  Begin by entering your registration details.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Learner"
                      className="w-full pl-11 pr-4 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] text-[#334155] placeholder-[#94A3B8] rounded-[12px] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full pl-11 pr-4 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] text-[#334155] placeholder-[#94A3B8] rounded-[12px] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="pass-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        id="pass-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] text-[#334155] placeholder-[#94A3B8] rounded-[12px] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirm-pass-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        id="confirm-pass-input"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] text-[#334155] placeholder-[#94A3B8] rounded-[12px] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm font-semibold transition-all"
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
                    className="rounded border-[#DDE2EE] text-[#6366F1] focus:ring-[#6366F1]"
                  />
                  <label htmlFor="show-pass" className="text-xs text-slate-500 dark:text-slate-450 cursor-pointer font-semibold">
                    Show Password
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white text-xs font-black uppercase tracking-wider rounded-[12px] transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continue to Onboarding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-455">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#4F46E5] hover:text-[#7C3AED] font-extrabold transition-colors">
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
                <p className="text-xs text-slate-555 dark:text-slate-450 font-medium">
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
                      className={`w-full p-4.5 rounded-[20px] border text-left transition-all flex items-start gap-4 hover:scale-[1.01] ${
                        isSelected 
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-sm' 
                          : 'border-[#E9E7F5] bg-[#FFFFFF]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'border-[#DDE2EE] bg-[#FFFFFF]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                          {pref.label}
                        </span>
                        <p className="text-xs text-slate-455 dark:text-slate-500 leading-normal mt-1 font-semibold">
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
                  className="flex-1 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] hover:bg-slate-50 font-bold rounded-[12px] text-xs text-slate-700 dark:text-slate-300 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white font-bold rounded-[12px] transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
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
                <p className="text-xs text-slate-550 dark:text-slate-455 font-medium">
                  Select your primary language for localized summaries and workspace translation tabs.
                </p>
              </div>

              <div className="space-y-1.5 p-6 bg-[#F8FAFC] rounded-[20px] border border-[#E9E7F5]">
                <label htmlFor="lang-select" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  Primary Language Mapping
                </label>
                <select
                  id="lang-select"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full p-3 border border-[#DDE2EE] bg-[#FFFFFF] rounded-xl focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm font-bold text-slate-750 dark:text-slate-300"
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
                  className="flex-1 py-3.5 border border-[#DDE2EE] bg-[#FFFFFF] hover:bg-slate-50 font-bold rounded-[12px] text-xs text-slate-700 dark:text-slate-300 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white font-bold rounded-[12px] transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider group cursor-pointer"
                >
                  <span>{loading ? 'Creating...' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-[10px] font-bold text-slate-405 uppercase tracking-wide">
            🔒 Privacy check: your learning history stays client-side.
          </div>
        </div>
      </div>
    </div>
  );
}
