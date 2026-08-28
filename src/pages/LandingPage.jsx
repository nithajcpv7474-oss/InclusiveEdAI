import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Volume2, 
  Type, 
  Languages, 
  BrainCircuit, 
  CheckCircle2, 
  FileText, 
  Activity,
  Mic,
  ArrowDown,
  Video
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function LandingPage() {
  const { setFontSize, setDyslexiaMode, setThemeTint } = useAccessibility();
  const [demoTab, setDemoTab] = useState('simple');
  const [activeProfile, setActiveProfile] = useState(null);

  // Ingestion flow diagram hover states
  const [hoveredNode, setHoveredNode] = useState(null);

  const profiles = [
    {
      id: 'dyslexia',
      title: 'Dyslexia Adaptations',
      description: 'Increases letter/word offsets and activates readable Lexend typography.',
      icon: Type,
      color: 'from-amber-400 via-orange-500 to-red-500',
      action: () => {
        setDyslexiaMode(true);
        setFontSize('lg');
        setActiveProfile('dyslexia');
      }
    },
    {
      id: 'adhd',
      title: 'Cognitive & ADHD Support',
      description: 'Applies warm ambient page tints, summaries, and trims cognitive noise.',
      icon: Layers,
      color: 'from-teal-400 via-emerald-500 to-cyan-500',
      action: () => {
        setThemeTint('warm');
        setFontSize('md');
        setDyslexiaMode(false);
        setActiveProfile('adhd');
      }
    },
    {
      id: 'esl',
      title: 'Language & ESL Support',
      description: 'Provides in-context vocabulary tooltips and full text translation options.',
      icon: Languages,
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      action: () => {
        setThemeTint('cool');
        setFontSize('md');
        setDyslexiaMode(false);
        setActiveProfile('esl');
      }
    },
    {
      id: 'vision',
      title: 'Low Vision & Auditory',
      description: 'Maximizes reading scale, applies high-contrast theme, and readies TTS audio.',
      icon: Volume2,
      color: 'from-purple-500 via-pink-500 to-rose-500',
      action: () => {
        setFontSize('xl');
        setThemeTint('dark');
        setDyslexiaMode(false);
        setActiveProfile('vision');
      }
    }
  ];

  const demoContent = {
    original: {
      title: "Introduction to Photosynthesis (Original transcript excerpt)",
      body: "Photosynthesis is the highly intricate biological system used by photoautotrophic organisms to convert light energy, typically derived from solar radiation, into chemical energy. This chemical potential energy is sequestered in the synthetic molecular bonds of carbohydrate compounds, such as glucose and fructose, which are synthesized from simple inorganic carbon dioxide and water molecules. The reaction releases diatomic oxygen as a gaseous metabolic byproduct, driving terrestrial respiration."
    },
    simple: {
      title: "What is Photosynthesis? (Simplified version)",
      body: "Photosynthesis is how plants make food using sunlight. Here is how it works: \n• Plants absorb sunlight, carbon dioxide (from the air), and water (from the soil).\n• They transform these inputs into sugars (called glucose), which plants use for food.\n• During this process, plants release oxygen back into the air, which humans and animals breathe."
    },
    translated: {
      title: "¿Qué es la fotosíntesis? (Spanish translation)",
      body: "La fotosíntesis es el proceso que utilizan las plantas para fabricar su propio alimento usando la luz solar. Así funciona: \n• Las plantas absorben la luz solar, el dióxido de carbono (del aire) y el agua (del suelo).\n• Convierten estos elementos en azúcares (glucosa) que les sirven de alimento.\n• Durante el proceso, liberan oxígeno al aire, que es el que respiramos."
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Gradient Blobs */}
      <div className="glow-blob w-[450px] h-[450px] bg-indigo-400 left-[-150px] top-[10%]" />
      <div className="glow-blob w-[500px] h-[500px] bg-purple-400 right-[-150px] top-[20%]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest animate-pulse-slow">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Inclusive learning, powered by AI</span>
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            One Lecture.<br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Every Learner.
            </span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-650 dark:text-slate-350 font-semibold max-w-3xl mx-auto leading-relaxed">
            Turn every lecture into captions, easy-read notes, translated content, and audio — instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <Link
              to="/signup"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#pipeline-visualizer"
              className="w-full px-8 py-4 bg-white/75 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Workbench Live Mockup Visualizer */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3 sm:p-5 shadow-2xl relative group hover:scale-[1.002] transition-all">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 overflow-hidden shadow-inner flex flex-col min-h-[300px]">
              {/* Header controls */}
              <div className="border-b border-slate-100 dark:border-slate-905 bg-slate-50/50 dark:bg-slate-950/80 p-3 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-1 overflow-x-auto">
                  <span className="px-3 py-1 bg-white dark:bg-slate-900 text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-slate-205/30 shrink-0">Simple Notes</span>
                  <span className="px-3 py-1 text-[9px] font-black uppercase text-slate-400 shrink-0">Original Script</span>
                  <span className="px-3 py-1 text-[9px] font-black uppercase text-slate-400 shrink-0">Translation</span>
                  <span className="px-3 py-1 text-[9px] font-black uppercase text-slate-400 shrink-0">Quiz</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Interactive Live Mockup</span>
                </div>
              </div>
              {/* Split Content Mockup */}
              <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left flex-1">
                {/* Left Column Mockup */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-55 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-505" />
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-450">Audio Reader</span>
                    </div>
                    <div className="h-6 flex items-center gap-1 text-indigo-500">
                      <span className="w-1 bg-current h-4 rounded-full animate-pulse"></span>
                      <span className="w-1 bg-current h-6 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1 bg-current h-3 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      <span className="w-1 bg-current h-5 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
                      <span className="text-[9px] font-black uppercase tracking-widest ml-2">Reading Out Loud</span>
                    </div>
                  </div>
                  <div className="bg-slate-55 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Highlighted Vocab</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block uppercase">PHOTOSYNTHESIS</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">The biochemical process plants use to convert light energy into sugars.</p>
                  </div>
                </div>
                {/* Right Column Mockup */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b pb-1">ADHD Focus Summary</h4>
                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                      <p className="flex items-start gap-1.5">
                        <span className="text-indigo-500 shrink-0">•</span>
                        <span><strong>Pla</strong>nts, <strong>al</strong>gae, <strong>an</strong>d <strong>so</strong>me <strong>bac</strong>teria <strong>us</strong>e a <strong>biol</strong>ogical <strong>proc</strong>ess <strong>cal</strong>led <strong>photos</strong>ynthesis <strong>t</strong>o <strong>tu</strong>rn <strong>sunl</strong>ight <strong>in</strong>to <strong>fo</strong>od.</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <span className="text-indigo-500 shrink-0">•</span>
                        <span><strong>Th</strong>ey <strong>abs</strong>orb <strong>car</strong>bon <strong>dio</strong>xide <strong>fr</strong>om <strong>th</strong>e <strong>ai</strong>r <strong>an</strong>d <strong>wa</strong>ter <strong>fr</strong>om <strong>th</strong>e <strong>so</strong>il.</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <span className="text-indigo-500 shrink-0">•</span>
                        <span><strong>Th</strong>is <strong>cyc</strong>le <strong>kee</strong>ps <strong>Ear</strong>th's <strong>cli</strong>mate <strong>bal</strong>anced <strong>an</strong>d <strong>sta</strong>ble.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer controls mockup */}
              <div className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/80 p-3 flex items-center justify-between gap-4 flex-wrap text-xs">
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">Dyslexia Font: ON</span>
                  <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">Focus Mode: ON</span>
                  <span className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-wider">Text Size: XL</span>
                </div>
                <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-wider text-slate-450 border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg shadow-sm">
                  <span>Certified WCAG 2.2 AA Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-6 text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> DYSLEXIA ADJUSTMENTS</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> VOCAL AUDITORY PLAYBACK</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> CONCEPT SIMPLIFICATION</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> DIVERSE ESL TRANSLATIONS</span>
          </div>
        </div>

        {/* Narrative Banner section */}
        <div className="mt-24 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            "Accessibility should not require a different classroom."
          </h2>
          <p className="text-sm sm:text-base text-slate-650 dark:text-slate-350 leading-relaxed font-medium max-w-2xl mx-auto">
            Traditional lectures create learning gaps. We empower students who cannot hear clearly, struggle with verbose texts, prefer studying in local target languages, or read best via auditory text-to-speech feedback. Learn your way, in the same classroom.
          </p>
        </div>

        {/* Pipeline Visualizer Diagram */}
        <div id="pipeline-visualizer" className="mt-28 border-t border-slate-200/50 dark:border-slate-800/50 pt-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                One Ingestion. Adaptive Outputs.
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-450 max-w-lg mx-auto">
                Trace how the sensusai AI core maps one single educational lecture stream into multiple personalized outputs.
              </p>
            </div>

            {/* Core Diagram Box */}
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border shadow-lg relative overflow-hidden bg-white/50 dark:bg-slate-900/40">
              <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 relative z-10">
                
                {/* Node 1: One Input */}
                <div className="md:col-span-2 space-y-4">
                  <div className="text-center font-black text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    One Input Source
                  </div>
                  <div className="space-y-2">
                    <div 
                      onMouseEnter={() => setHoveredNode('input-link')}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        hoveredNode === 'input-link'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 scale-[1.02]'
                          : 'border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <Video className="w-4.5 h-4.5 text-rose-500" />
                      <span className="text-xs font-bold">YouTube URL Feed</span>
                    </div>
                    <div 
                      onMouseEnter={() => setHoveredNode('input-audio')}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        hoveredNode === 'input-audio'
                          ? 'border-purple-500 bg-purple-500/10 text-purple-650 dark:text-purple-400 scale-[1.02]'
                          : 'border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <Volume2 className="w-4.5 h-4.5 text-blue-500" />
                      <span className="text-xs font-bold">Local File Upload</span>
                    </div>
                    <div 
                      onMouseEnter={() => setHoveredNode('input-text')}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        hoveredNode === 'input-text'
                          ? 'border-pink-500 bg-pink-500/10 text-pink-650 dark:text-pink-400 scale-[1.02]'
                          : 'border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <Mic className="w-4.5 h-4.5 text-indigo-500" />
                      <span className="text-xs font-bold">Live Captions Stream</span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector 1 */}
                <div className="md:col-span-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center rotate-90 md:rotate-0">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Node 2: AI Processor */}
                <div className="md:col-span-2">
                  <div className="relative group p-6 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/15 to-pink-500/10 border border-indigo-500/30 flex flex-col items-center justify-center text-center shadow-lg shadow-indigo-500/5 min-h-48 overflow-hidden">
                    <div className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent animate-spin-slow"></div>
                    
                    <div className="relative z-10 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md animate-float">
                        <BrainCircuit className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI INCLUSION CORE</h3>
                        <p className="text-[9px] text-slate-400 dark:text-slate-555 uppercase font-black tracking-widest mt-0.5">Adaptability pipeline</p>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase">
                        <Activity className="w-2.5 h-2.5 animate-pulse" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector 2 */}
                <div className="md:col-span-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center rotate-90 md:rotate-0">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Node 3: Outputs */}
                <div className="md:col-span-1 space-y-2">
                  <div className="p-2 text-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-800 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    🎧 Hear (Captions)
                  </div>
                  <div className="p-2 text-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-800 text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    🧠 Understand (Easy Read)
                  </div>
                  <div className="p-2 text-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-800 text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    🌎 Connect (Translation)
                  </div>
                  <div className="p-2 text-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-800 text-[9px] font-black text-pink-650 dark:text-pink-400 uppercase tracking-wider">
                    🔊 Listen (TTS Audio)
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Four-Card Feature Section */}
        <div className="mt-28 border-t border-slate-200/50 dark:border-slate-800/50 pt-20">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One Lecture. Four Ways to Learn.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-450 max-w-lg mx-auto">
              Empower every student to interact with classroom lectures based on their specific cognitive preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Live Captions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Hear the lecture through scrolling text. Capture real-time voice transcripts directly inside the classroom.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-650 dark:text-teal-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">AI Easy Read</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Understand clearly. AI transforms verbose transcripts into highly readable, short-sentence notes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Instant Translation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Connect and translate. Faithfully adapts the lecture script into Telugu, Hindi, Spanish, or Arabic.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-650 dark:text-pink-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Text-To-Speech</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Listen at your speed. Highlights active sentences and reads content out loud with multi-language synthesizers.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-28 border-t border-slate-200/50 dark:border-slate-800/50 pt-20">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Try the Live Adaptations
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Toggle between output tabs to see how dense lecture excerpts simplify or translate instantaneously.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
              {/* Tab options */}
              <div className="flex border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-2 gap-1.5">
                <button
                  onClick={() => setDemoTab('original')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                    demoTab === 'original'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Original Excerpt</span>
                </button>
                
                <button
                  onClick={() => setDemoTab('simple')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                    demoTab === 'simple'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Simple Notes</span>
                </button>

                <button
                  onClick={() => setDemoTab('translated')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                    demoTab === 'translated'
                      ? 'bg-purple-650 text-white shadow-md shadow-purple-650/15'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>Translation</span>
                </button>
              </div>

              {/* Excerpt Body */}
              <div className="p-6 sm:p-10 space-y-4 min-h-[250px] flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">
                    {demoContent[demoTab].title}
                  </h3>
                  <p className="text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line text-lg font-medium">
                    {demoContent[demoTab].body}
                  </p>
                </div>
                <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center gap-2 justify-end">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Engineered adaptation complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-28 border-t border-slate-200/50 dark:border-slate-800/50 pt-20 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-450 max-w-lg mx-auto">
              Four simple steps to transform your lecture into a custom inclusive learning space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-2xl font-black text-indigo-600 block">01</span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">Add Lecture</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">Paste script notes, upload media files, or speak directly to compile live speech captions.</p>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-2xl font-black text-indigo-600 block">02</span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">AI Adapts Content</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">Google Gemini processes the content to extract key definitions, simplify vocabulary, and translate text.</p>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-2xl font-black text-indigo-600 block">03</span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">Choose Layout</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">Activate dyslexia font overlays, set warm/dark tints, adjust sizes, and scale reading options on the fly.</p>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-2xl font-black text-indigo-600 block">04</span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">Learn Your Way</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">Interact sentence-by-sentence with active highlighting, speech-synthesizers, and definitions.</p>
            </div>
          </div>
        </div>

        {/* Preset profiles cards */}
        <div className="mt-28 border-t border-slate-200/50 dark:border-slate-800/50 pt-20">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pre-configured Inclusivity Cards
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Select an adaptation profile preset below to apply immediate display configurations to your local workspace environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              const isActive = activeProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={profile.action}
                  className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between h-76 hover:scale-[1.02] ${
                    isActive 
                      ? 'border-indigo-550 dark:border-indigo-500 ring-2 ring-indigo-500 bg-indigo-500/5 shadow-lg' 
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
                  }`}
                  aria-label={`Select accessibility card preset: ${profile.title}`}
                >
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center shadow-md text-white`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{profile.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-2">{profile.description}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 w-full">
                    {isActive ? 'Preset Applied' : 'Apply Preset'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="mt-28 bg-gradient-to-tr from-indigo-900 via-slate-950 to-indigo-950 rounded-3xl p-8 sm:p-14 border border-indigo-950 text-white text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[90px]" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Make your next lecture accessible.
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed font-medium">
              Join thousands of students creating a more inclusive learning space. Design your accessible workbench in less than 30 seconds.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
