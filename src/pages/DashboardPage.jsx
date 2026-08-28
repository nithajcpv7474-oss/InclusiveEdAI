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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-10 border border-indigo-950 text-white relative overflow-hidden shadow-lg shadow-indigo-950/10">
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[90px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Accessibility Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, {user?.name || 'Alex'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
              Ready to learn your way? Load a new classroom lecture verbatim file or recording to generate personalized accessible outputs.
            </p>
          </div>
          
          <Link
            to="/new-lesson"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-650 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-650/10 hover:scale-[1.01] transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>New Lecture</span>
          </Link>
        </div>
      </div>

      {/* Analytics & Footprint Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics list */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                LECTURES PROCESSED
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
                {totalLectures}
              </span>
            </div>
          </div>
 
          {/* Stat 2 */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Languages className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                LANGUAGES ACCESSED
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
                {uniqueLangs}
              </span>
            </div>
          </div>
 
          {/* Stat 3 */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-650 dark:text-teal-400 flex items-center justify-center shadow-inner">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                ACCESSIBLE OUTPUTS CREATED
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
                {totalOutputs}
              </span>
            </div>
          </div>
        </div>

        {/* Custom SVG Accessibility Footprint Chart */}
        <div className="lg:col-span-4 bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">
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
                <span className="text-[6.5px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Coverage</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-1.5 text-[9.5px] font-bold text-slate-600 dark:text-slate-400">
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recent Lectures
          </h2>
          
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lectures..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-750 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Category Filters row */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200/60 dark:border-slate-805 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                activeCategory === cat
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-800 dark:border-slate-800'
                  : 'bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200'
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
                      <h3 className="text-md font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-650 dark:group-hover:text-indigo-455 transition-colors">
                        {session.title}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-955/20 border border-slate-100 dark:border-slate-850 hover:border-rose-200 dark:hover:border-rose-900 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                      aria-label={`Delete session: ${session.title}`}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {session.originalText}
                  </p>
                </div>

                {/* Lower body (features and open button) */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-150 dark:border-slate-850/80 flex items-center justify-between gap-4 flex-wrap">
                  {/* Indicators */}
                  <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-450">
                    <span className="flex items-center gap-1"><Languages className="w-3.5 h-3.5 text-purple-500" /> {session.lang.toUpperCase()}</span>
                    <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-teal-500" /> EASY READ</span>
                    <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-pink-500" /> AUDIO</span>
                  </div>

                  <button
                    onClick={() => handleOpenSession(session)}
                    className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
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
          <div className="py-20 text-center space-y-6 bg-white/60 dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
              <BookOpen className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">
                Your accessible learning library starts here
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 leading-normal">
                There are no processed lectures matched to this category. Ingest your first notes file or microphone lecture.
              </p>
            </div>

            <Link
              to="/new-lesson"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Lecture</span>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
