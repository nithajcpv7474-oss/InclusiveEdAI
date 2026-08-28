import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UploadCloud, 
  Link2, 
  FileText, 
  Check, 
  Sparkles, 
  Volume2, 
  Type, 
  Layers, 
  Languages, 
  ArrowRight,
  AlertCircle,
  Terminal,
  Activity,
  Mic,
  MicOff,
  Trash2
} from 'lucide-react';

const API_URL = '';

export default function NewLessonPage() {
  const navigate = useNavigate();
  const { addSession } = useAuth();
  
  // Meta Session States
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureCategory, setLectureCategory] = useState('Lecture');

  // Input Source State
  const [sourceTab, setSourceTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Accessibility Preferences
  const [selectedProfiles, setSelectedProfiles] = useState(['adhd']);
  const [translationLanguage, setTranslationLanguage] = useState('es');

  // Loading & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState('');

  // Live Speech Recognition State
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micPermissionError, setMicPermissionError] = useState('');

  const recognitionRef = React.useRef(null);
  const isIntentionalStop = React.useRef(false);
  const isRecordingRef = React.useRef(false);

  // Clean up mic recording on unmount
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        isIntentionalStop.current = true;
        isRecordingRef.current = false;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFormError('Web Speech Recognition is not supported by your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    setMicPermissionError('');
    setFormError('');
    isIntentionalStop.current = false;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsRecording(true);
      isRecordingRef.current = true;
    };

    rec.onresult = (event) => {
      let finalTrans = '';
      let interimTrans = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTrans += event.results[i][0].transcript + ' ';
        } else {
          interimTrans += event.results[i][0].transcript;
        }
      }
      if (finalTrans) {
        setLiveTranscript(prev => prev + finalTrans);
      }
      setInterimTranscript(interimTrans);
    };

    rec.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'not-allowed') {
        setMicPermissionError('Microphone permission blocked. Please allow microphone access in your browser settings.');
        setIsRecording(false);
        isRecordingRef.current = false;
      }
    };

    rec.onend = () => {
      // Auto-restart if we didn't intentionally stop
      if (isRecordingRef.current && !isIntentionalStop.current) {
        try {
          rec.start();
        } catch (err) {
          console.error("Auto restart failed:", err);
        }
      } else {
        setIsRecording(false);
        isRecordingRef.current = false;
      }
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopRecording = () => {
    isIntentionalStop.current = true;
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setInterimTranscript('');
  };

  const clearTranscript = () => {
    setLiveTranscript('');
    setInterimTranscript('');
  };

  const loadingSteps = [
    "Opening ingestion pipe and parsing source headers...",
    "Extracting raw audio phonemes and transcribing text...",
    "Identifying key definitions & advanced pedagogical structures...",
    "Running multi-model summary and syntax simplifier...",
    "Synthesizing native language translation parameters...",
    "Building dyslexia font alignments and typography metrics...",
    "Packaging digital accessibility output assets..."
  ];

  const mediaLoadingSteps = [
    "Uploading media file to secure backend...",
    "Validating MIME types and sizing parameters...",
    "Extracting audio track metadata...",
    "Submitting feed to speech-to-text transcriber...",
    "Simplifying speech semantics into easy read notes...",
    "Synthesizing native language translation parameters...",
    "Finalizing interactive visual captions and synchronizations..."
  ];

  const linkLoadingSteps = [
    "Validating lecture link parameter...",
    "Resolving remote media streaming headers...",
    "Downloading direct media from stream...",
    "Extracting audio track components...",
    "Submitting feed to speech-to-text transcriber...",
    "Simplifying speech semantics into easy read notes...",
    "Synthesizing native language translation parameters...",
    "Finalizing interactive visual captions and synchronizations..."
  ];

  const toggleProfile = (id) => {
    if (selectedProfiles.includes(id)) {
      setSelectedProfiles(selectedProfiles.filter(p => p !== id));
    } else {
      setSelectedProfiles([...selectedProfiles, id]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const langMap = {
      es: 'Spanish',
      zh: 'Chinese',
      fr: 'French',
      ar: 'Arabic',
      te: 'Telugu',
      hi: 'Hindi',
      en: 'English'
    };
    const targetLanguageName = langMap[translationLanguage] || 'Spanish';

    if (sourceTab === 'file') {
      if (!selectedFile) {
        setFormError('Please select an audio or video file to upload.');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setFormError('File exceeds the 50MB size limit. Please upload a smaller file.');
        return;
      }

      setIsSubmitting(true);
      setCurrentStep(0);

      // Start stepping timer
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < mediaLoadingSteps.length - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);
      try {
        console.log("[MEDIA] File selected:", {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        });

        const formData = new FormData();
        formData.append('media', selectedFile, selectedFile.name);
        formData.append('title', lectureTitle || selectedFile.name);
        formData.append('category', lectureCategory || 'Lecture');
        formData.append('language', targetLanguageName);

        const response = await fetch(`${API_URL}/api/media/process`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to process media file.');
        }

        clearInterval(stepTimer);
        setCurrentStep(mediaLoadingSteps.length - 1);

        // Save session to Auth history
        addSession({
          title: data.lecture?.title || lectureTitle || selectedFile.name,
          category: data.lecture?.category || lectureCategory || 'Lecture',
          lang: translationLanguage,
          profiles: selectedProfiles,
          mediaType: data.lecture?.mediaType || 'audio',
          originalText: data.lecture?.transcript?.fullText || data.original,
          simplifiedText: data.lecture?.easyRead || data.simplified,
          translatedText: data.lecture?.translated || data.translated,
          segments: data.lecture?.transcript?.segments || data.segments || [],
          hasMedia: true,
          mediaName: selectedFile.name
        });

        // Transition to Workbench with response state
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/result', {
            state: {
              title: data.lecture?.title || lectureTitle || selectedFile.name,
              category: data.lecture?.category || lectureCategory || 'Lecture',
              originalText: data.lecture?.transcript?.fullText || data.original,
              simplifiedText: data.lecture?.easyRead || data.simplified,
              translatedText: data.lecture?.translated || data.translated,
              profiles: selectedProfiles,
              lang: translationLanguage,
              segments: data.lecture?.transcript?.segments || data.segments || [],
              hasMedia: true,
              mediaFile: selectedFile
            }
          });
        }, 800);

      } catch (err) {
        console.error("Media Ingest Error:", err);
        clearInterval(stepTimer);
        setIsSubmitting(false);
        let friendlyMessage = err.message;
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          friendlyMessage = "Unable to connect to the SensusAI processing service. Please check your connection, ensure your backend server is running locally on port 5000, or perform a Hard Reload (Ctrl+F5 / Cmd+Shift+R) to clear cached files on Vercel.";
        }
        setFormError(friendlyMessage || `Could not connect to backend server. Please verify the server is active at ${API_URL}`);
        if (err.message && (err.message.includes("quota") || err.message.includes("busy") || err.message.includes("limit"))) {
          setIsCooldown(true);
          setTimeout(() => setIsCooldown(false), 10000);
        }
      }
      return;
    }

    if (sourceTab === 'link') {
      if (!inputUrl || !inputUrl.trim()) {
        setFormError('Please enter a valid video or audio URL.');
        return;
      }

      setIsSubmitting(true);
      setCurrentStep(0);

      const isYouTube = inputUrl.toLowerCase().includes('youtube.com') || inputUrl.toLowerCase().includes('youtu.be');
      const stepsLength = isYouTube ? 6 : linkLoadingSteps.length;

      // Start stepping timer
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < stepsLength - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);

      try {
        const formData = new FormData();
        formData.append('url', inputUrl.trim());
        formData.append('title', lectureTitle || 'Lecture Link');
        formData.append('category', lectureCategory || 'Lecture');
        formData.append('language', targetLanguageName);

        const response = await fetch(`${API_URL}/api/media/process`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to process media URL.');
        }

        clearInterval(stepTimer);
        setCurrentStep(stepsLength - 1);

        // Save session to Auth history
        addSession({
          title: data.lecture.title,
          category: data.lecture.category,
          lang: translationLanguage,
          profiles: selectedProfiles,
          mediaType: data.lecture.mediaType,
          originalText: data.lecture.transcript.fullText,
          simplifiedText: data.lecture.easyRead,
          translatedText: data.lecture.translated,
          segments: data.lecture.transcript.segments,
          hasMedia: true,
          mediaName: inputUrl.trim(),
          mediaUrl: inputUrl.trim()
        });

        // Delay so they see the completed state
        setTimeout(() => {
          navigate('/result', {
            state: {
              title: data.lecture.title,
              category: data.lecture.category,
              mediaType: data.lecture.mediaType,
              originalText: data.lecture.transcript.fullText,
              simplifiedText: data.lecture.easyRead,
              translatedText: data.lecture.translated,
              profiles: selectedProfiles,
              lang: translationLanguage,
              segments: data.lecture.transcript.segments,
              hasMedia: true,
              mediaUrl: inputUrl.trim()
            }
          });
        }, 800);

      } catch (err) {
        console.error("Link Media Ingest Error:", err);
        clearInterval(stepTimer);
        setIsSubmitting(false);
        let friendlyMessage = err.message;
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          friendlyMessage = "Unable to connect to the SensusAI processing service. Please check your connection, ensure your backend server is running locally on port 5000, or perform a Hard Reload (Ctrl+F5 / Cmd+Shift+R) to clear cached files on Vercel.";
        }
        setFormError(friendlyMessage || `Could not connect to backend server. Please verify the server is active at ${API_URL}`);
        if (err.message && (err.message.includes("quota") || err.message.includes("busy") || err.message.includes("limit"))) {
          setIsCooldown(true);
          setTimeout(() => setIsCooldown(false), 10000);
        }
      }
      return;
    }

    let textToSend = '';
    if (sourceTab === 'text') {
      textToSend = inputText;
    } else if (sourceTab === 'live') {
      textToSend = liveTranscript;
    }

    if (!textToSend.trim()) {
      if (sourceTab === 'live') {
        setFormError('Please start the microphone and speak to capture a live transcript first.');
      } else {
        setFormError('Please input or paste the lecture notes transcript.');
      }
      return;
    }
    if (selectedProfiles.length === 0) {
      setFormError('Please select at least one accessibility profile.');
      return;
    }

    setIsSubmitting(true);
    setCurrentStep(0);

    // Slowly increment step simulator up to step 5 (out of 6) to show progress while waiting
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    try {
      const response = await fetch(`${API_URL}/api/accessibility/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textToSend,
          targetLanguage: targetLanguageName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to process lecture notes.');
      }

      // Save session to Auth history
      addSession({
        title: lectureTitle || 'Lecture Notes',
        category: lectureCategory || 'Lecture',
        lang: translationLanguage,
        profiles: selectedProfiles,
        originalText: textToSend,
        simplifiedText: data.simplified,
        translatedText: data.translated
      });

      // Success - clear timer and fast-forward to final step
      clearInterval(stepTimer);
      setCurrentStep(loadingSteps.length - 1);

      // Short delay so they see the completed state
      setTimeout(() => {
        navigate('/result', {
          state: {
            title: lectureTitle || 'Lecture Notes',
            originalText: textToSend,
            simplifiedText: data.simplified,
            translatedText: data.translated,
            profiles: selectedProfiles,
            lang: translationLanguage
          }
        });
      }, 600);

    } catch (err) {
      console.error("Ingest Integration Error:", err);
      clearInterval(stepTimer);
      setIsSubmitting(false);
      let friendlyMessage = err.message;
      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        friendlyMessage = "Unable to connect to the SensusAI processing service. Please check your connection, ensure your backend server is running locally on port 5000, or perform a Hard Reload (Ctrl+F5 / Cmd+Shift+R) to clear cached files on Vercel.";
      }
      setFormError(friendlyMessage || `Could not connect to backend server. Please verify the server is active at ${API_URL}`);
      if (err.message && (err.message.includes("quota") || err.message.includes("busy") || err.message.includes("limit"))) {
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 10000);
      }
    }
  };

  const profilesInfo = [
    {
      id: 'dyslexia',
      title: 'Dyslexia Adaptations',
      description: 'Activates specialized typefaces and increases text-row spacing properties.',
      icon: Type,
      bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-455'
    },
    {
      id: 'adhd',
      title: 'ADHD & Cognitive Support',
      description: 'Condenses materials into bulleted summaries and highlights key terms.',
      icon: Layers,
      bg: 'bg-teal-500/10 text-teal-650 dark:bg-teal-500/15 dark:text-teal-400'
    },
    {
      id: 'esl',
      title: 'ESL / Localized Translation',
      description: 'Maps advanced definitions and translates files to selected languages.',
      icon: Languages,
      bg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
    },
    {
      id: 'auditory',
      title: 'Auditory Assistance',
      description: 'Readies transcript segments for active Text-to-Speech voices.',
      icon: Volume2,
      bg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400'
    }
  ];

  if (isSubmitting) {
    const isMedia = sourceTab === 'file';
    const isLink = sourceTab === 'link';
    const isYouTube = inputUrl.toLowerCase().includes('youtube.com') || inputUrl.toLowerCase().includes('youtu.be');
    const youtubeLoadingSteps = [
      "Validating YouTube URL...",
      "Extracting video information...",
      "Checking for available captions...",
      "Generating transcript...",
      "Translating text...",
      "Processing complete."
    ];
    const activeSteps = isMedia 
      ? mediaLoadingSteps 
      : (isLink 
          ? (isYouTube ? youtubeLoadingSteps : linkLoadingSteps) 
          : loadingSteps);
    const progressPercent = Math.round(((currentStep + 1) / activeSteps.length) * 100);

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="glow-blob w-72 h-72 bg-indigo-500/10 -top-10 left-10" />
        
        <div className="w-full text-center space-y-8 relative z-10">
          
          {/* Holographic Loader */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-pulse-slow"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-pink-500 border-l-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-4 rounded-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center shadow-inner">
              <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{progressPercent}%</span>
              <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Processed</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Running Accessibility Translation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-normal">
              Adapting transcript layouts and mapping inclusion parameters...
            </p>
          </div>

          {/* Futuristic Terminal Status Console */}
          <div className="max-w-lg mx-auto bg-slate-950 rounded-3xl p-6 text-left border border-slate-850 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-850 flex items-center px-4 justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Adaptation logs</span>
              </div>
            </div>
            
            <div className="space-y-3 mt-6 font-mono text-[11px] leading-relaxed text-slate-400 min-h-48 pt-2">
              {activeSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                if (!isDone && !isCurrent) return null;
                return (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 animate-in fade-in duration-300"
                  >
                    <span className={isDone ? "text-emerald-500" : "text-indigo-400 animate-pulse"}>
                      {isDone ? "[DONE]" : "[BUSY]"}
                    </span>
                    <span className={isCurrent ? "text-slate-100 font-bold" : "text-slate-400"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/30 dark:bg-slate-950/30 transition-colors duration-300 overflow-hidden pb-16">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 relative z-10">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-tr from-indigo-50/50 via-purple-50/20 to-white dark:from-slate-950 dark:via-indigo-950 dark:to-indigo-900 rounded-3xl p-8 sm:p-10 border border-indigo-100/80 dark:border-slate-800 text-slate-900 dark:text-white relative overflow-hidden shadow-sm text-left">
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create a New Learning Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed max-w-xl font-semibold mt-2">
            Upload classroom files, paste video URLs or paste verbatim transcripts. Let SensusAI transform it into personalized learning content.
          </p>
        </div>

      {formError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-455 text-left font-semibold" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Ingest Error</h3>
            <p className="text-xs mt-1">{formError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Lecture Meta Fields */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-md grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="space-y-1.5">
            <label htmlFor="lecture-title" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
              Lecture / Session Title
            </label>
            <input
              id="lecture-title"
              type="text"
              required
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="e.g. Ecology 101: Photosynthesis"
              className="w-full p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lecture-category" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
              Category
            </label>
            <select
              id="lecture-category"
              value={lectureCategory}
              onChange={(e) => setLectureCategory(e.target.value)}
              className="w-full p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-805 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="Lecture">Lecture</option>
              <option value="Meetings">Meetings</option>
              <option value="Announcements">Announcements</option>
              <option value="Study Notes">Study Notes</option>
            </select>
          </div>
        </div>
        {/* Source selector glass-panel */}
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-md overflow-hidden">
          <div className="flex border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-2 gap-1.5">
            <button
              type="button"
              onClick={() => setSourceTab('text')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                sourceTab === 'text'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Verbatim Script</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('file')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                sourceTab === 'file'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Media Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('link')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                sourceTab === 'link'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-455 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Video Link</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('live')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                sourceTab === 'live'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-455 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Live Classroom</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {sourceTab === 'text' && (
              <div className="space-y-2">
                <label htmlFor="lecture-text" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                  Verbatim Notes / Transcript Text
                </label>
                <textarea
                  id="lecture-text"
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste lecture script, transcription or textbook chapter text here (min 10 words for testing)..."
                  className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed text-slate-800 dark:text-slate-100"
                ></textarea>
              </div>
            )}

            {sourceTab === 'file' && (
              <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-900 bg-gradient-to-tr from-white to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/10 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer relative shadow-sm group">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload lecture audio or video file"
                />
                <UploadCloud className="w-12 h-12 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-4 animate-pulse" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-205">Drag & drop or browse your local files</p>
                    <p className="text-[9px] text-slate-405 dark:text-slate-500 uppercase tracking-widest font-black">Supports MP3, MP4, WAV, M4A up to 50MB</p>
                  </div>
                )}
              </div>
            )}

            {sourceTab === 'link' && (
              <div className="space-y-2">
                <label htmlFor="youtube-url" className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                  YouTube Lecture URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="youtube-url"
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Our pipeline automatically extracts audio streams and runs speech recognition.
                </p>
              </div>
            )}

            {sourceTab === 'live' && (
              <div className="space-y-4">
                {micPermissionError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-455 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{micPermissionError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-550 animate-pulse' : 'bg-slate-350 dark:bg-slate-700'}`} />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-250">
                      {isRecording ? 'LIVE STREAM ACTIVE' : 'Microphone Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Mic</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-500/10 hover:scale-[1.01]"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Mic</span>
                      </button>
                    )}

                    {liveTranscript && (
                      <button
                        type="button"
                        onClick={clearTranscript}
                        className="p-2 hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 rounded-xl transition-all border border-slate-200 dark:border-slate-800"
                        title="Clear captured transcript"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block">
                    Captured Classroom Transcript
                  </label>
                  <div className="w-full p-4 border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 rounded-2xl text-sm leading-relaxed font-medium min-h-[150px] max-h-[300px] overflow-y-auto font-sans shadow-inner select-text">
                    {liveTranscript ? (
                      <div>
                        <span>{liveTranscript}</span>
                        {interimTranscript && (
                          <span className="text-slate-500 italic ml-1 select-none">
                            {interimTranscript}...
                          </span>
                        )}
                      </div>
                    ) : interimTranscript ? (
                      <span className="text-slate-550 italic">{interimTranscript}...</span>
                    ) : (
                      <span className="text-slate-600 select-none italic text-xs">
                        No real-time voice signals detected yet. Click "Start Mic" and speak into your device to capture text captions in real-time.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Adaptations Selection */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Adaptation Presets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select one or more neurodiverse adaptations. The workspace organizes views matching these choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profilesInfo.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedProfiles.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggleProfile(p.id)}
                  className={`p-5 rounded-3xl border text-left flex items-start gap-4 transition-all hover:scale-[1.01] ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-500/5 dark:border-indigo-500 dark:bg-indigo-500/10'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                  aria-label={`Toggle preference ${p.title}`}
                  aria-pressed={isSelected}
                >
                  <div className={`p-3 rounded-2xl ${p.bg} shrink-0`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</span>
                      {isSelected && (
                        <div className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Translation Option Selection */}
        {selectedProfiles.includes('esl') && (
          <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 dark:border-indigo-900/40 rounded-3xl space-y-3.5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Target Translation Language
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Configure primary localized translation output
              </p>
            </div>
            <select
              value={translationLanguage}
              onChange={(e) => setTranslationLanguage(e.target.value)}
              className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-extrabold text-slate-700 dark:text-slate-350"
              aria-label="Select translation language"
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
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
          <button
            type="submit"
            disabled={isCooldown}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:scale-[1.01] active:scale-[0.98] disabled:bg-slate-400 dark:disabled:bg-slate-800 disabled:cursor-not-allowed disabled:scale-100 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/15 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{isCooldown ? 'Quota Reached - Wait...' : 'Generate Learning Experience'}</span>
            {!isCooldown && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
