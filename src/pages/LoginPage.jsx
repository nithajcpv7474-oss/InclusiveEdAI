import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  Languages, 
  BookOpen, 
  Accessibility 
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials. Hint: use demo@sensusai.ai / password123');
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Left Column: Brand Storytelling */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-indigo-950 via-slate-950 to-indigo-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[90px]" />
        <div className="absolute bottom-[10%] left-[-15%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        
        {/* Top brand metadata */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/15">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-200">
            sensusai AI
          </span>
        </div>

        {/* Narrative core */}
        <div className="relative z-10 space-y-8 my-auto text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              AI-Powered Classroom Accessibility
            </span>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              One Lecture.<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Every Learner.
              </span>
            </h2>
            <p className="text-slate-350 leading-relaxed font-semibold text-sm max-w-sm">
              Transform every lesson into an accessible learning experience — designed for every learner.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="text-xs text-left">
                <span className="font-extrabold block text-slate-200">HEAR IT</span>
                <span className="text-slate-400 font-semibold">Synchronized audio transcript narration</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-purple-300" />
              </div>
              <div className="text-xs text-left">
                <span className="font-extrabold block text-slate-200">READ IT</span>
                <span className="text-slate-400 font-semibold">Dyslexia font and ADHD bionic layout aids</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-pink-300" />
              </div>
              <div className="text-xs text-left">
                <span className="font-extrabold block text-slate-200">UNDERSTAND IT</span>
                <span className="text-slate-400 font-semibold">AI-generated lecture notes and quizes</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4 text-teal-300" />
              </div>
              <div className="text-xs text-left">
                <span className="font-extrabold block text-slate-200">TRANSLATE IT</span>
                <span className="text-slate-400 font-semibold">Multi-language study localizations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-slate-450 font-black uppercase tracking-wider flex items-center gap-1.5 justify-center lg:justify-start">
          <Accessibility className="w-3.5 h-3.5 text-indigo-400" />
          <span>© 2026 sensusai AI. Built for inclusive learning.</span>
        </div>
      </div>

      {/* Right Column: Login Card Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-xl">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-450 leading-relaxed">
              Making learning more accessible, understandable, and inclusive with AI.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs text-rose-800 dark:text-rose-400 font-bold text-left leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
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
                  placeholder="demo@sensusai.ai"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-850 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-850 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 group hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Onboarding Trigger */}
          <div className="text-center pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-450">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-655 dark:text-indigo-400 font-extrabold hover:underline">
                Create account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
