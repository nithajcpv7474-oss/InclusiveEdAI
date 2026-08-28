import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    // Simulate brief API loading latency
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials. Hint: use demo@inclusiveed.ai / password123');
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Brand Storytelling */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[90px]" />
        
        {/* Top brand metadata */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-widest text-slate-350">
            InclusiveEd AI
          </span>
        </div>

        {/* Narrative core */}
        <div className="relative z-10 space-y-6 my-auto">
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            One Lecture.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Every Learner.
            </span>
          </h2>
          <p className="text-slate-400 leading-relaxed font-medium text-sm">
            Empowering students through AI accessibility engine layers. We map raw academic media into adaptive outputs optimized for individual learning paths.
          </p>

          <div className="space-y-3.5 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0" />
              <span>HEAR IT — Synchronous captions terminal</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0" />
              <span>READ IT — Dyslexia and ADHD typography aids</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0" />
              <span>UNDERSTAND IT — Short-sentence summaries</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0" />
              <span>SPEAK IT — Multi-language audio readouts</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          © 2026 InclusiveEd AI Project Core • WCAG 2.2 compliant
        </div>
      </div>

      {/* Right Column: Login Card Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-805/80 shadow-md">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-450">
              Sign in to access your saved lectures and preferences.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs text-rose-800 dark:text-rose-455 font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-850 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
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
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-650/10 flex items-center justify-center gap-2 group hover:scale-[1.01]"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Onboarding Trigger */}
          <div className="text-center pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-450">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Create account
              </Link>
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              🔒 Your learning content stays private.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
