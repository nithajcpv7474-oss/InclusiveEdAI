import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  FileText, 
  Layers, 
  Languages, 
  Volume2, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Activity, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, sessions, deleteSession } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Navigate to workbench with cached session state
  const handleOpenSession = (session) => {
    navigate('/result', {
      state: {
        originalText: session.originalText,
        simplifiedText: session.simplifiedText,
        translatedText: session.translatedText,
        profiles: session.profiles,
        lang: session.lang,
        title: session.title
      }
    });
  };

  // Stats Calculations
  const totalLectures = sessions.length;
  const uniqueLangs = [...new Set(sessions.map(s => s.lang))].length;
  const totalOutputs = sessions.reduce((acc, s) => acc + s.profiles.length, 0);

  // Categories list
  const categories = ['All', 'Lecture', 'Meetings', 'Announcements', 'Study Notes'];

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.originalText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || session.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/30 dark:bg-slate-950/30 transition-colors duration-300 overflow-hidden pb-16">
      {/* Subtle Background Glow Circles */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[550px] h-[550px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
        
        {/* Dashboard Header Banner */}
        <div className="bg-gradient-to-tr from-indigo-50/50 via-purple-50/20 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-indigo-900 rounded-3xl p-8 sm:p-10 border border-indigo-100/80 dark:border-slate-800 text-slate-900 dark:text-white relative overflow-hidden shadow-sm text-left">
          <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Subtle decorative circles */}
          <div className="absolute top-8 right-12 w-24 h-24 rounded-full border border-indigo-500/5 pointer-events-none" />
          <div className="absolute bottom-6 right-28 w-16 h-16 rounded-full border border-indigo-500/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-500/10 dark:bg-white/10 rounded-full border border-indigo-500/20 dark:border-white/15 text-indigo-600 dark:text-indigo-300 text-[9px] font-black uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>ACCESSIBILITY DASHBOARD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Good morning, {user?.name || 'Venky'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-semibold">
                Ready to learn your way? Transform lectures into personalized learning experiences.
              </p>
            </div>
            
            <Link
              to="/new-lesson"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Lecture</span>
            </Link>
          </div>
        </div>

        {/* Workflow & Core capabilities */}
        <div className="space-y-6 text-left">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Core capabilities</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Adaptive Learning Workspace</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* HEAR IT */}
            <div className="bg-gradient-to-br from-white/90 to-cyan-50/40 dark:from-slate-900/90 dark:to-cyan-955/10 rounded-3xl p-6 border border-cyan-100 dark:border-cyan-950/30 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-cyan-300/60 dark:hover:border-cyan-800/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">HEAR IT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Synchronized audio narration and interactive highlighted captions.
              </p>
            </div>

            {/* READ IT */}
            <div className="bg-gradient-to-br from-white/90 to-purple-50/40 dark:from-slate-900/90 dark:to-purple-955/10 rounded-3xl p-6 border border-purple-100 dark:border-purple-950/30 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-purple-300/60 dark:hover:border-purple-800/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-655 dark:text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">READ IT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Dyslexia Lexend overlays and ADHD-friendly bionic focal text.
              </p>
            </div>

            {/* UNDERSTAND IT */}
            <div className="bg-gradient-to-br from-white/90 to-indigo-50/40 dark:from-slate-900/90 dark:to-indigo-955/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-950/30 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-indigo-300/60 dark:hover:border-indigo-800/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">UNDERSTAND IT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                AI-generated bullet summaries and interactive multiple-choice quizzes.
              </p>
            </div>

            {/* TRANSLATE IT */}
            <div className="bg-gradient-to-br from-white/90 to-pink-50/40 dark:from-slate-900/90 dark:to-pink-955/10 rounded-3xl p-6 border border-pink-100 dark:border-pink-950/30 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-pink-300/60 dark:hover:border-pink-800/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-650 dark:text-pink-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">TRANSLATE IT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Multi-language study localizations for international ESL support.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics & Footprint Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Statistics list */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border-l-4 border-l-blue-500 border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5 relative overflow-hidden group hover:scale-[1.01] transition-transform text-left">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                  LECTURES PROCESSED
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
                  {totalLectures}
                </span>
              </div>
            </div>
   
            {/* Stat 2 */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border-l-4 border-l-purple-500 border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5 relative overflow-hidden group hover:scale-[1.01] transition-transform text-left">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center shadow-inner">
                <Languages className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                  LANGUAGES ACCESSED
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
                  {uniqueLangs}
                </span>
              </div>
            </div>
   
            {/* Stat 3 */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border-l-4 border-l-teal-500 border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5 relative overflow-hidden group hover:scale-[1.01] transition-transform text-left">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-teal-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-650 dark:text-teal-400 flex items-center justify-center shadow-inner">
                <Layers className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                  ACCESSIBLE OUTPUTS
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
                  {totalOutputs}
                </span>
              </div>
            </div>
          </div>
  
          {/* Custom SVG Accessibility Footprint Chart */}
          <div className="lg:col-span-4 bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                Inclusion footprint
              </span>
              <h3 className="font-bold text-xs text-slate-750 dark:text-slate-350">Adaptation Preset Usage</h3>
            </div>
            
            <div className="flex items-center justify-center py-2 gap-6">
              {/* SVG Donut Chart */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Ring */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="3" />
                  {/* Segment 1: ADHD (45%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3.5" strokeDasharray="45 55" strokeDashoffset="0" />
                  {/* Segment 2: Dyslexia (30%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="-45" />
                  {/* Segment 3: ESL (25%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14b8a6" strokeWidth="3.5" strokeDasharray="25 75" strokeDashoffset="-75" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-slate-850 dark:text-white leading-none">85%</span>
                  <span className="text-[6.5px] text-slate-450 dark:text-slate-500 uppercase tracking-widest mt-0.5">Coverage</span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-1.5 text-[9.5px] font-bold text-slate-650 dark:text-slate-400 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span>ADHD/Easy Read (45%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span>Dyslexia Font (30%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span>ESL/Translation (25%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Lectures List Area */}
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Lectures
            </h2>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lectures..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold text-slate-750 dark:text-slate-100 transition-all shadow-sm"
              />
            </div>
          </div>
  
          {/* Category Filters row */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200/60 dark:border-slate-850 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-indigo-900 to-purple-900 border-indigo-950 text-white shadow-sm'
                    : 'bg-white/60 border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-450 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
  
          {/* Session cards grid */}
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col justify-between hover:scale-[1.005] hover:shadow-md transition-all group"
                >
                  {/* Upper body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20 text-[9px] font-black uppercase">
                          <Activity className="w-2.5 h-2.5 shrink-0" />
                          <span>{session.category}</span>
                        </span>
                        <h3 className="text-md font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-455 transition-colors">
                          {session.title}
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-955/20 border border-slate-100 dark:border-slate-850 hover:border-rose-200 dark:hover:border-rose-900 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                        aria-label={`Delete session: ${session.title}`}
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
  
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {session.originalText}
                    </p>
                  </div>
  
                  {/* Lower body (features and open button) */}
                  <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-955/20 border-t border-slate-150 dark:border-slate-850/80 flex items-center justify-between gap-4 flex-wrap">
                    {/* Indicators */}
                    <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-450">
                      <span className="flex items-center gap-1"><Languages className="w-3.5 h-3.5 text-purple-500" /> {session.lang.toUpperCase()}</span>
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-teal-500" /> EASY READ</span>
                      <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-pink-500" /> AUDIO</span>
                    </div>
  
                    <button
                      onClick={() => handleOpenSession(session)}
                      className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <span>Open Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center space-y-6 bg-gradient-to-tr from-white to-slate-50/50 dark:from-slate-900/60 dark:to-slate-955/40 rounded-3xl border-2 border-dashed border-slate-205 dark:border-slate-800 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner border border-indigo-500/10">
                <BookOpen className="w-7 h-7" />
              </div>
              
              <div className="space-y-1.5 max-w-md mx-auto px-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Your learning library starts here
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-semibold">
                  Upload your first lecture and SensusAI will transform it into an accessible learning experience.
                </p>
              </div>
  
              <Link
                to="/new-lesson"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Your First Lecture</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
