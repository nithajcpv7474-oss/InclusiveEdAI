import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  BookOpen, 
  Layers, 
  Languages, 
  BookMarked,
  Sparkles,
  ArrowLeft,
  Info,
  HelpCircle,
  FileQuestion,
  Activity,
  Download
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AccessibilityResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { 
    fontSize, 
    setFontSize, 
    dyslexiaMode, 
    setDyslexiaMode, 
    speechRate,
    setSpeechRate,
    speechVoice,
    setSpeechVoice
  } = useAccessibility();

  // Route parameters or null (triggering empty state illustration)
  const routeState = location.state;
  const targetProfiles = routeState?.profiles || [];
  const targetLang = routeState?.lang || 'es';

  // Tabs: 'original', 'simple', 'translated'
  const [activeTab, setActiveTab] = useState('simple');

  // Translation switching states
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(targetLang);
  const [currentTranslationLang, setCurrentTranslationLang] = useState(targetLang);
  const [dynamicTranslationText, setDynamicTranslationText] = useState(routeState?.translatedText || '');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [translationError, setTranslationError] = useState('');

  // Hackathon Polish Extra States
  const [focusMode, setFocusMode] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [readingLevel, setReadingLevel] = useState('grade8'); // grade4, grade8, college
  const [isLevelLoading, setIsLevelLoading] = useState(false);
  
  // Quiz States
  const [quizData, setQuizData] = useState(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showQuizExplanation, setShowQuizExplanation] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Media playback & synchronization states
  const [videoTime, setVideoTime] = useState(0);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const playerRef = useRef(null);

  const hasMedia = routeState?.hasMedia === true;
  const segments = routeState?.segments || [];
  
  const [mediaUrl] = useState(() => {
    if (routeState?.mediaUrl) {
      return routeState.mediaUrl;
    }
    if (routeState?.mediaFile) {
      return URL.createObjectURL(routeState.mediaFile);
    }
    return null;
  });

  useEffect(() => {
    return () => {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  // Auto-scroll interactive transcript panel to active segment
  useEffect(() => {
    if (activeSegmentId !== null) {
      const activeEl = document.getElementById(`segment-${activeSegmentId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSegmentId]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Vocabulary Hover Definition state
  const [activeVocabWord, setActiveVocabWord] = useState(null);
  
  // Text to Speech States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  
  const utteranceRef = useRef(null);
  const voiceSynthesis = window.speechSynthesis;

  // Realistic mock data
  const lectureData = {
    title: "Ecology 101: Photosynthesis, Carbon Sequestration, and Biosphere Balance",
    originalSentences: [
      "Photosynthesis is the highly intricate biological system used by photoautotrophic organisms to convert light energy, typically derived from solar radiation, into chemical energy.",
      "This chemical potential energy is sequestered in the synthetic molecular bonds of carbohydrate compounds, such as glucose and fructose.",
      "These carbohydrates are synthesized from simple inorganic carbon dioxide and water molecules.",
      "The overall biochemical reaction releases diatomic oxygen as a gaseous metabolic byproduct, which directly drives terrestrial respiration across the entire biosphere.",
      "Without this primary carbon fixing pathway, the atmospheric thermal equilibrium would destabilize, leading to catastrophic runaway greenhouse effects."
    ],
    simpleSentences: [
      "Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food.",
      "They absorb carbon dioxide from the air and water from the soil, combining them using light energy.",
      "This process makes sugars (glucose) which plants store as energy to grow and survive.",
      "As a useful byproduct, plants release oxygen back into the air, which humans and animals need to breathe.",
      "This natural cycle acts as carbon storage, locking carbon away and keeping Earth's climate balanced and stable."
    ],
    translatedSentences: {
      es: [
        "Las plantas, las algas y algunas bacterias utilizan un proceso biológico llamado fotosíntesis para convertir la luz solar en alimento.",
        "Absorben dióxido de carbono del aire y agua del suelo, combinándolos mediante la energía de la luz.",
        "Este proceso produce azúcares (glucosa) que las plantas almacenan como energía para crecer y sobrevivir.",
        "Como subproducto útil, las plantas liberan oxígeno al aire, que los humanos y los animales necesitan para respirar.",
        "Este ciclo natural actúa como almacenamiento de carbono, atrapándolo y manteniendo el clima de la Tierra equilibrado y estable."
      ],
      zh: [
        "植物、藻类和某些细菌利用被称为光合作用的生物过程，将阳光转化为食物。",
        "它们从空气中吸收二氧化碳，从土壤中吸收水分，并利用光能将它们结合起来。",
        "这个过程产生糖（葡萄糖），植物将其储存为能量以供生长和生存。",
        "作为一种有用的副产品，植物向空气中释放氧气，这是人类和动物呼吸所必需的。",
        "这种自然循环起到了碳储存的作用，锁住碳并保持地球气候的平衡与稳定。"
      ],
      fr: [
        "Les plantes, les algues et certaines bactéries utilisent un processus biologique appelé photosynthèse pour transformer la lumière du soleil en nourriture.",
        "Ils absorbent le dioxyde de carbone de l'air et l'eau du sol, en les combinant grâce à l'énergie lumineuse.",
        "Ce processus fabrique des sucres (glucose) que les plantes stockent sous forme d'énergie pour grandir et survivre.",
        "En tant que sous-produit utile, les plantes rejettent de l'oxygène dans l'air, ce dont les humains et les animaux ont besoin pour respirer.",
        "Ce cycle naturel agit comme un stockage de carbone, emprisonnant le carbone et maintenant le climat de la Terre équilibré et stable."
      ],
      ar: [
        "تستخدم النباتات والطحالب وبعض البكتيريا عملية بيولوجية تسمى البناء الضوئي لتحويل ضوء الشمس إلى غذاء.",
        "فهي تمتص ثاني أكسيد الكربون من الهواء والماء من التربة، وتجمعهما معًا باستخدام طاقة الضوء.",
        "تنتج هذه العملية السكريات (الجلوكوز) التي تخزنها النباتات كطاقة للنمو والبقاء على قيد الحياة.",
        "كناتج ثنائي مفيد، تطلق النباتات الأكسجين مرة أخرى في الهواء، وهو ما يحتاجه البشر والحيوانات للتنفس.",
        "تعمل هذه الدورة الطبيعية كمخزن للكربون، حيث تحبس الكربون وتحافظ على توازن واستقرار مناخ الأرض."
      ],
      te: [
        "మొక్కలు, శైవలాలు మరియు కొన్ని బ్యాక్టీరియా సూర్యరశ్మిని ఆహారంగా మార్చడానికి కిరణజన్య సంయోగ క్రియ అనే జీవ ప్రక్రియను ఉపయోగిస్తాయి.",
        "అవి గాలి నుండి కార్బన్ డై ఆక్సైడ్‌ను మరియు నేల నుండి నీటిని గ్రహించి, కాంతి శక్తిని ఉపయోగించి వాటిని కలుపుతాయి.",
        "ఈ ప్రక్రియ మొక్కలు పెరగడానికి మరియు మనుగడ సాగించడానికి శక్తిగా నిల్వ చేసే చక్కెరలను (గ్లూకోజ్) తయారు చేస్తుంది.",
        "ఒక ఉపయోగకరమైన ఉప ఉత్పత్తిగా, మొక్కలు ఆక్సిజన్‌ను తిరిగి గాలిలోకి విడుదల చేస్తాయి, దీనిని మానవులు మరియు జంతువులు శ్వాసించడానికి ఉపయోగిస్తాయి.",
        "ఈ సహజ చక్రం కార్బన్ నిల్వగా పనిచేస్తుంది, కార్బన్‌ను లాక్ చేస్తుంది మరియు భూమి యొక్క వాతావరణాన్ని సమతుల్యంగా మరియు స్థిరంగా ఉంచుతుంది."
      ],
      hi: [
        "पौधे, शैवाल और कुछ बैक्टीरिया सूर्य के प्रकाश को भोजन में बदलने के लिए प्रकाश संश्लेषण नामक एक जैविक प्रक्रिया का उपयोग करते हैं।",
        "वे हवा से कार्बन डाइऑक्साइड और मिट्टी से पानी को अवशोषित करते हैं, और प्रकाश ऊर्जा का उपयोग करके उन्हें मिलाते हैं।",
        "यह प्रक्रिया शर्करा (ग्लूकोज) बनाती है जिसे पौधे बढ़ने और जीवित रहने के लिए ऊर्जा के रूप में संग्रहीत करते हैं।",
        "एक उपयोगी उप-उत्पाद के रूप में, पौधे हवा में ऑक्सीजन छोड़ते हैं, जिसकी मनुष्यों और जानवरों को सांस लेने के लिए आवश्यकता होती है।",
        "यह प्राकृतिक चक्र कार्बन भंडारण के रूप में कार्य करता है, कार्बन को लॉक करता है और पृथ्वी की जलवायु को संतुलित और स्थिर रखता है।"
      ],
      en: [
        "Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food.",
        "They absorb carbon dioxide from the air and water from the soil, combining them using light energy.",
        "This process makes sugars (glucose) which plants store as energy to grow and survive.",
        "As a useful byproduct, plants release oxygen back into the air, which humans and animals need to breathe.",
        "This natural cycle acts as carbon storage, locking carbon away and keeping Earth's climate balanced and stable."
      ]
    },
    vocab: [
      { word: "photoautotrophic", definition: "Organisms (like plants) that make their own food using light energy and inorganic materials." },
      { word: "sequestered", definition: "Isolated, set apart, or stored away. In ecology, this refers to locking carbon carbon dioxide deep in plants or soil." },
      { word: "carbohydrate", definition: "Organic compounds (like sugars and starches) made of carbon, hydrogen, and oxygen, used for storing energy." },
      { word: "diatomic oxygen", definition: "Standard oxygen gas molecules (O₂), consisting of two oxygen atoms bonded together, which we breathe." },
      { word: "biosphere", definition: "The global ecological system integrating all living beings and their relationships; the zone of life on Earth." }
    ]
  };

  const segmentIntoSentences = (text) => {
    if (!text) return [];
    // Matches sentences split by standard punctuation marks (.!?) followed by space or end of line
    return text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map(s => s.trim()) || [text];
  };

  const handleTranslateAgain = async () => {
    const originalText = routeState?.originalText || lectureData.originalSentences.join(' ');
    if (!originalText) {
      setTranslationError('Original lecture content is unavailable.');
      return;
    }

    setIsTranslating(true);
    setTranslationError('');
    handleStop(); // Stop any active TTS voice synthesis before translating

    const langMap = {
      es: 'Spanish',
      zh: 'Chinese',
      fr: 'French',
      ar: 'Arabic',
      te: 'Telugu',
      hi: 'Hindi',
      en: 'English'
    };

    const targetLanguageName = langMap[selectedLanguageCode] || 'Spanish';

    try {
      const response = await fetch(`${API_URL}/api/accessibility/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: originalText,
          targetLanguage: targetLanguageName
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Network response was not ok');
      }

      if (data.translated) {
        setDynamicTranslationText(data.translated);
        setCurrentTranslationLang(selectedLanguageCode);
      } else {
        throw new Error('Failed to retrieve translation');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError(err.message || 'Translation failed. Please try again.');
      if (err.message && (err.message.includes("quota") || err.message.includes("busy") || err.message.includes("limit"))) {
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 10000);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownloadTranscript = () => {
    const title = routeState?.title || "Lecture Notes";
    const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    let originalText = '';
    if (hasMedia && segments.length > 0) {
      originalText = segments.map(s => `[${formatTime(s.start)} - ${formatTime(s.end)}]  ${s.text}`).join('\n');
    } else {
      originalText = routeState?.originalText || lectureData.originalSentences.join(' ');
    }

    if (!originalText) {
      addToast("No lecture content available to download.", "error");
      return;
    }

    let fileContent = '';
    let filename = '';

    if (activeTab === 'simple') {
      const simplifiedText = routeState?.simplifiedText || lectureData.simpleSentences.join(' ');
      filename = `InclusionNotes_EasyRead_${cleanTitle}.txt`;
      fileContent = `INCLUSIVEED AI - ACCESSIBLE STUDY NOTES (EASY READ)
==================================================
LECTURE TITLE: ${title}
TARGET AUDIENCE: ADHD / Cognitive Learning Support
DATE EXPORTED: ${new Date().toLocaleDateString()}
==================================================

${simplifiedText}
`;
    } else if (activeTab === 'translated') {
      const translatedText = dynamicTranslationText || routeState?.translatedText || (lectureData.translatedSentences[currentTranslationLang] || lectureData.translatedSentences['es']).join(' ');
      const langName = currentTranslationLang.toUpperCase();
      filename = `InclusionNotes_Translation_${langName}_${cleanTitle}.txt`;
      fileContent = `INCLUSIVEED AI - ACCESSIBLE TRANSLATED TRANSCRIPT (${langName})
==================================================
LECTURE TITLE: ${title}
LANGUAGE PROFILE: ESL / Non-Native Speaker Mode
DATE EXPORTED: ${new Date().toLocaleDateString()}
==================================================

${translatedText}
`;
    } else {
      filename = `InclusionNotes_Verbatim_${cleanTitle}.txt`;
      fileContent = `INCLUSIVEED AI - ORIGINAL VERBATIM TRANSCRIPT
==================================================
LECTURE TITLE: ${title}
DATE EXPORTED: ${new Date().toLocaleDateString()}
==================================================

${originalText}
`;
    }

    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    addToast(`Successfully downloaded accessible notes for ${activeTab === 'simple' ? 'Simple Notes' : activeTab === 'translated' ? 'Translation' : 'Original Script'}!`, "success");
  };

  const formatBionic = (text) => {
    if (!text) return '';
    return text.split(/\s+/).map((word, wIdx) => {
      const match = word.match(/^([^\w]*)(.*?)([^\w]*)$/);
      if (!match) return word + ' ';
      const leading = match[1];
      const coreWord = match[2];
      const trailing = match[3];

      if (!coreWord) return word + ' ';

      const boldLength = Math.max(1, Math.round(coreWord.length * 0.5));
      const boldPart = coreWord.slice(0, boldLength);
      const normalPart = coreWord.slice(boldLength);

      return (
        <span key={wIdx} className="inline-block mr-1">
          {leading}
          <strong className="font-extrabold text-slate-900 dark:text-white">{boldPart}</strong>
          {normalPart}
          {trailing}
        </span>
      );
    });
  };

  const handleGenerateQuiz = async () => {
    let rawText = '';
    if (hasMedia && segments.length > 0) {
      rawText = segments.map(s => s.text).join(' ');
    } else {
      rawText = routeState?.originalText || lectureData.originalSentences.join(' ');
    }

    if (!rawText || rawText.trim() === '') {
      addToast("No lecture content available to generate a quiz.", "error");
      return;
    }

    setIsQuizLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: rawText
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate quiz');
      }

      if (data.quiz && data.quiz.length > 0) {
        setQuizData(data.quiz);
        setUserAnswers({});
        setShowQuizExplanation({});
        setQuizScore(null);
        setShowQuizResults(false);
        addToast("Interactive comprehension quiz generated successfully!", "success");
      } else {
        throw new Error("No quiz data returned from API");
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to generate quiz. Please try again.", "error");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleReadingLevelChange = async (level) => {
    let rawText = '';
    if (hasMedia && segments.length > 0) {
      rawText = segments.map(s => s.text).join(' ');
    } else {
      rawText = routeState?.originalText || lectureData.originalSentences.join(' ');
    }

    if (!rawText || rawText.trim() === '') {
      addToast("No lecture content available to simplify.", "error");
      return;
    }

    setReadingLevel(level);
    setIsLevelLoading(true);
    try {
      const langMap = {
        es: 'Spanish',
        zh: 'Chinese',
        fr: 'French',
        ar: 'Arabic',
        te: 'Telugu',
        hi: 'Hindi',
        en: 'English'
      };
      const targetLanguageName = langMap[selectedLanguageCode] || 'Spanish';

      const response = await fetch(`${API_URL}/api/accessibility/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: rawText,
          targetLanguage: targetLanguageName,
          readingLevel: level
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to process reading level');
      }

      if (data.simplified) {
        if (routeState) {
          routeState.simplifiedText = data.simplified;
        } else {
          lectureData.simpleSentences = data.simplified.split(/[.!?]+/).filter(s => s.trim().length > 0);
        }
        addToast(`Lecture simplified successfully to ${level === 'grade4' ? 'Grade 4' : level === 'grade8' ? 'Grade 8' : 'Original Complexity'}!`, "success");
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to adjust reading level. Please try again.", "error");
    } finally {
      setIsLevelLoading(false);
    }
  };

  const renderQuizSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div key={n} className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 bg-white/40 dark:bg-slate-900/40">
          <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSummarySkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/4"></div>
      <div className="h-3.5 bg-slate-205 dark:bg-slate-850 rounded w-full"></div>
      <div className="h-3.5 bg-slate-205 dark:bg-slate-850 rounded w-5/6"></div>
      <div className="h-3.5 bg-slate-205 dark:bg-slate-850 rounded w-11/12"></div>
    </div>
  );

  const handleAnswerOptionClick = (qIdx, optIdx) => {
    if (showQuizResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleToggleExplanation = (qIdx) => {
    setShowQuizExplanation((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setShowQuizResults(true);
    if (score === quizData.length) {
      addToast("Perfect score! You're a superstar listener! 🎉", "success");
    } else if (score >= 3) {
      addToast(`Quiz submitted! You got ${score}/${quizData.length} correct. Good job! 👍`, "success");
    } else {
      addToast(`Quiz submitted. You got ${score}/${quizData.length} correct. Let's review the materials! 📚`, "warning");
    }
  };

  const renderQuizPane = () => {
    if (isQuizLoading) {
      return renderQuizSkeleton();
    }

    if (!quizData) {
      return (
        <div className="py-12 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Generate Comprehension Quiz</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Test your understanding of this lecture. Google Gemini will analyze the transcript and generate 5 multiple-choice questions to reinforce your learning.
            </p>
          </div>
          <button
            onClick={handleGenerateQuiz}
            className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
          >
            Start Quiz Generation
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 pb-6">
        <div className="bg-indigo-505/5 border border-indigo-500/10 p-5 rounded-3xl flex items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-sm text-indigo-655 dark:text-indigo-400">Interactive Lecture Quiz</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Complete the questions below to test your memory.</p>
          </div>
          {showQuizResults && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl text-center shadow-sm">
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-black">Score</span>
              <span className={`text-xl font-black ${quizScore >= 4 ? 'text-emerald-500' : quizScore >= 3 ? 'text-amber-500' : 'text-rose-500'}`}>{quizScore} / {quizData.length}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {quizData.map((q, qIdx) => {
            const isCorrect = userAnswers[qIdx] === q.answerIndex;
            const hasAnswered = userAnswers[qIdx] !== undefined;

            return (
              <div key={qIdx} className="border border-slate-205 dark:border-slate-800 p-5 rounded-2xl bg-white/40 dark:bg-slate-950/20 space-y-4">
                <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{qIdx + 1}</span>
                  <span>{q.question}</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[qIdx] === oIdx;
                    const isCorrectOption = q.answerIndex === oIdx;

                    let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80";
                    if (isSelected) {
                      btnClass = "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-805 text-indigo-650 dark:text-indigo-300 ring-2 ring-indigo-500/20";
                    }
                    if (showQuizResults) {
                      if (isCorrectOption) {
                        btnClass = "bg-emerald-50 border-emerald-350 dark:bg-emerald-950/40 dark:border-emerald-805 text-emerald-650 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-rose-50 border-rose-350 dark:bg-rose-950/40 dark:border-rose-805 text-rose-650 dark:text-rose-300 ring-2 ring-rose-500/20";
                      } else {
                        btnClass = "opacity-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerOptionClick(qIdx, oIdx)}
                        disabled={showQuizResults}
                        className={`text-left p-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${btnClass}`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {showQuizResults && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleExplanation(qIdx)}
                      className="text-[10px] font-black text-indigo-655 dark:text-indigo-400 hover:underline uppercase tracking-wider flex items-center gap-1.5 justify-start cursor-pointer"
                    >
                      <span>{showQuizExplanation[qIdx] ? 'Hide Explanation' : 'Show Explanation'}</span>
                    </button>
                    {showQuizExplanation[qIdx] && (
                      <p className="text-xs text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-905/50 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80 leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showQuizResults && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitQuiz}
              disabled={quizData.some((_, idx) => userAnswers[idx] === undefined)}
              className="px-6 py-3 bg-indigo-605 hover:bg-indigo-750 disabled:bg-slate-300 dark:disabled:bg-slate-850 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer"
            >
              Submit Quiz Answers
            </button>
          </div>
        )}
      </div>
    );
  };

  // Get active text sentences array
  const getSentences = () => {
    if (activeTab === 'original') {
      return routeState ? segmentIntoSentences(routeState.originalText) : lectureData.originalSentences;
    }
    if (activeTab === 'simple') {
      return routeState ? segmentIntoSentences(routeState.simplifiedText) : lectureData.simpleSentences;
    }
    if (activeTab === 'translated') {
      if (dynamicTranslationText) {
        return segmentIntoSentences(dynamicTranslationText);
      }
      if (routeState && routeState.translatedText) {
        return segmentIntoSentences(routeState.translatedText);
      }
      return lectureData.translatedSentences[currentTranslationLang] || lectureData.translatedSentences['es'];
    }
    return [];
  };

  // Load browser voices
  useEffect(() => {
    if (!voiceSynthesis) return;

    const loadVoices = () => {
      const availableVoices = voiceSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !speechVoice) {
        const defaultVoice = availableVoices.find(v => v.lang.startsWith(targetLang)) || availableVoices[0];
        setSpeechVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (voiceSynthesis.onvoiceschanged !== undefined) {
      voiceSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (voiceSynthesis) voiceSynthesis.cancel();
    };
  }, [targetLang]);

  // Set default tab based on profiles when hydrating
  useEffect(() => {
    if (routeState) {
      if (targetProfiles.includes('adhd')) {
        setActiveTab('simple');
      } else if (targetProfiles.includes('esl')) {
        setActiveTab('translated');
      } else {
        setActiveTab('original');
      }
    }
  }, [routeState]);

  // Handle sentence-by-sentence reading
  const speakSentence = (index) => {
    if (!voiceSynthesis) return;
    voiceSynthesis.cancel();

    const textArray = getSentences();
    if (index < 0 || index >= textArray.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
      return;
    }

    setCurrentSentenceIndex(index);
    const textToSpeak = textArray[index];
    const cleanText = textToSpeak.replace(/•/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    if (speechVoice) {
      const selectedObj = voices.find(v => v.name === speechVoice);
      if (selectedObj) utterance.voice = selectedObj;
    }

    utterance.rate = speechRate;

    utterance.onend = () => {
      speakSentence(index + 1);
    };

    utterance.onerror = (e) => {
      console.error("Utterance error", e);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
    };

    setIsPlaying(true);
    setIsPaused(false);
    voiceSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!voiceSynthesis) return;

    if (isPlaying) {
      if (isPaused) {
        voiceSynthesis.resume();
        setIsPaused(false);
      } else {
        voiceSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speakSentence(0);
    }
  };

  const handleStop = () => {
    if (!voiceSynthesis) return;
    voiceSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
  };

  const handleSentenceClick = (idx) => {
    speakSentence(idx);
  };

  // Helper to load mock demo from empty state
  const handleLoadDemo = () => {
    navigate('/result', {
      state: {
        originalText: "Photosynthesis is the highly intricate biological system used by photoautotrophic organisms to convert light energy, typically derived from solar radiation, into chemical energy. This chemical potential energy is sequestered in the synthetic molecular bonds of carbohydrate compounds, such as glucose and fructose.",
        simplifiedText: "Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food. They absorb carbon dioxide from the air and water from the soil, combining them using light energy.",
        translatedText: "Las plantas, las algas y algunas bacterias utilizan un proceso biológico llamado fotosíntesis para convertir la luz solar en alimento. Absorben dióxido de carbono del aire y agua del suelo, combinándolos mediante la energía de la luz.",
        profiles: ['adhd', 'dyslexia', 'esl', 'auditory'],
        lang: 'es'
      }
    });
  };

  const renderInteractiveText = (text, idx) => {
    let highlightedElements = [text];

    if (activeTab === 'original') {
      lectureData.vocab.forEach((item) => {
        const word = item.word;
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        
        const tempElements = [];
        highlightedElements.forEach((el) => {
          if (typeof el === 'string') {
            const parts = el.split(regex);
            parts.forEach((part, pIdx) => {
              if (part.toLowerCase() === word.toLowerCase()) {
                tempElements.push(
                  <button
                    key={`${word}-${pIdx}-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering sentence reading
                      setActiveVocabWord(item);
                    }}
                    className="underline decoration-indigo-400 decoration-2 underline-offset-2 hover:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-extrabold transition-colors px-0.5 rounded cursor-help"
                    aria-label={`Vocabulary word: ${word}`}
                  >
                    {part}
                  </button>
                );
              } else {
                tempElements.push(part);
              }
            });
          } else {
            tempElements.push(el);
          }
        });
        highlightedElements = tempElements;
      });
    }

    const isActiveSentence = currentSentenceIndex === idx;

    if (focusMode) {
      highlightedElements = highlightedElements.map((el, eIdx) => {
        if (typeof el === 'string') {
          return formatBionic(el);
        } else if (React.isValidElement(el)) {
          return React.cloneElement(el, {
            key: `${el.key || eIdx}-bionic`,
            children: formatBionic(el.props.children)
          });
        }
        return el;
      });
    }

    return (
      <span
        key={idx}
        onClick={() => handleSentenceClick(idx)}
        className={`block p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
          isActiveSentence 
            ? 'bg-indigo-500/10 border-l-4 border-indigo-600 dark:bg-indigo-500/15 dark:border-indigo-500 font-bold scale-[1.01]' 
            : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-250'
        }`}
        title="Click to hear this sentence read out loud"
      >
        {highlightedElements}
      </span>
    );
  };

  // 1. EMPTY STATE REDESIGN (Holographic/Polished illustration card)
  if (!routeState) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="glow-blob w-80 h-80 bg-purple-500/10 mx-auto" />
        
        <div className="max-w-md mx-auto space-y-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto shadow-lg relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse-slow"></div>
            <FileQuestion className="w-9 h-9 text-indigo-600 dark:text-indigo-400 relative z-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Workbench Empty
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
              It looks like you navigated to the Interactive Workbench without uploading a lecture notes file. Load a pre-structured demo file or ingest notes.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLoadDemo}
              className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/10 hover:scale-[1.01] transition-transform text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load In-Context Demo File</span>
            </button>
            <Link
              to="/new-lesson"
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 font-bold rounded-2xl transition-all text-xs uppercase tracking-wider block"
            >
              Go to Upload Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back to upload details */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/new-lesson"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Transform another lecture</span>
        </Link>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 text-indigo-650 dark:text-indigo-455 border border-indigo-500/25 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ingested Assets Hydrated</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
        {routeState?.title || lectureData.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Column: Speech Controls & Vocab Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Media Player Card (if hasMedia) */}
          {hasMedia && mediaUrl && (
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-4">
              <h2 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                <Activity className="w-4.5 h-4.5 text-indigo-650 dark:text-indigo-400 animate-pulse" />
                Lecture Media Player
              </h2>
              
              {routeState.mediaType === 'video' ? (
                <div className="rounded-2xl overflow-hidden border border-slate-250 dark:border-slate-800 bg-slate-950 aspect-video relative group">
                  <video
                    ref={playerRef}
                    src={mediaUrl}
                    controls
                    onTimeUpdate={(e) => {
                      const currentTime = e.target.currentTime;
                      setVideoTime(currentTime);
                      const active = segments.find(s => currentTime >= s.start && currentTime <= s.end);
                      if (active) {
                        setActiveSegmentId(active.id);
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                  {/* Floating Caption Overlay when playing */}
                  {playerRef.current && !playerRef.current.paused && activeSegmentId !== null && (
                    <div className="absolute bottom-12 left-4 right-4 bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 text-center text-xs font-bold text-white pointer-events-none animate-in fade-in duration-200">
                      {segments.find(s => s.id === activeSegmentId)?.text}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center rounded-xl animate-pulse">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider">Audio Lecture Mode</span>
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-200 block truncate max-w-44">{routeState.mediaName || "lecture_audio.mp3"}</span>
                    </div>
                  </div>
                  <audio
                    ref={playerRef}
                    src={mediaUrl}
                    controls
                    onTimeUpdate={(e) => {
                      const currentTime = e.target.currentTime;
                      setVideoTime(currentTime);
                      const active = segments.find(s => currentTime >= s.start && currentTime <= s.end);
                      if (active) {
                        setActiveSegmentId(active.id);
                      }
                    }}
                    className="w-full focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* TTS Player Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-805/85 shadow-md">
            <h2 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2.5">
              <Volume2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              TTS Sound Controller
            </h2>

            {/* Reading soundwave animation */}
            {isPlaying && !isPaused ? (
              <div className="flex items-center justify-center gap-1.5 h-8 mb-5 text-indigo-605 dark:text-indigo-400">
                <span className="voice-bar"></span>
                <span className="voice-bar"></span>
                <span className="voice-bar"></span>
                <span className="voice-bar"></span>
                <span className="voice-bar"></span>
                <span className="text-[10px] font-black uppercase tracking-wider ml-2">Audio Playback Active</span>
              </div>
            ) : (
              <div className="h-8 mb-5 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-500">
                Audio Reader Idle
              </div>
            )}

            {/* TTS Player Action buttons */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={handlePlayPause}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                  isPlaying && !isPaused
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
                    : 'bg-indigo-600 hover:bg-indigo-755 shadow-indigo-650/15'
                }`}
                title={isPlaying && !isPaused ? "Pause Audio" : "Play/Resume Audio"}
                aria-label={isPlaying && !isPaused ? "Pause transcript reading" : "Read transcript out loud"}
              >
                {isPlaying && !isPaused ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 ml-0.5" />}
              </button>
              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                title="Stop Audio"
                aria-label="Stop reading"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Config Sliders */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Rate Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  <span>Playback Rate Speed</span>
                  <span>{speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  aria-label="Adjust speech playback speed rate"
                />
              </div>

              {/* System Voice Selection */}
              <div className="space-y-1.5">
                <label htmlFor="voice-select" className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                  Auditory Voice Mapping
                </label>
                <select
                  id="voice-select"
                  value={speechVoice}
                  onChange={(e) => setSpeechVoice(e.target.value)}
                  className="w-full p-2.5 border border-slate-250/60 dark:border-slate-750 bg-slate-50 dark:bg-slate-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-700 dark:text-slate-350"
                >
                  {voices.map((v, idx) => (
                    <option key={idx} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                  {voices.length === 0 && (
                    <option>System Default Voice</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Vocabulary Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-md">
            <h2 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-2.5">
              <BookMarked className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              INCLUSION DICTIONARY
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-4">
              Select underlined terms in the original transcript view to show simple in-context explanations.
            </p>

            {activeVocabWord ? (
              <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 p-4.5 rounded-2xl space-y-2 animate-in zoom-in-95 duration-150">
                <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider block">
                  {activeVocabWord.word}
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                  {activeVocabWord.definition}
                </p>
                <button
                  onClick={() => setActiveVocabWord(null)}
                  className="text-[9px] font-black text-slate-455 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest block pt-2"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-450 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl font-bold uppercase tracking-wider">
                Select highlighted terms
              </div>
            )}
          </div>

        </div>

        {/* Right Side Column: Tabbed Content Viewport */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
            
            {/* Tab header buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-2 gap-2">
              <div className="flex flex-1 gap-1.5 overflow-x-auto">
                <button
                  onClick={() => { setActiveTab('simple'); handleStop(); }}
                  className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 ${
                    activeTab === 'simple'
                      ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-455 hover:text-slate-750 dark:hover:text-slate-350'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Simple Notes</span>
                </button>

                <button
                  onClick={() => { setActiveTab('original'); handleStop(); }}
                  className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 ${
                    activeTab === 'original'
                      ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-455 hover:text-slate-750 dark:hover:text-slate-350'
                  }`}
                >
                  <BookOpen className="w-4.5 h-4.5" />
                  <span>Original Script</span>
                </button>

                <button
                  onClick={() => { setActiveTab('translated'); handleStop(); }}
                  className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 ${
                    activeTab === 'translated'
                      ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-455 hover:text-slate-750 dark:hover:text-slate-350'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>Translation</span>
                </button>

                <button
                  onClick={() => { setActiveTab('quiz'); handleStop(); }}
                  className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 ${
                    activeTab === 'quiz'
                      ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-455 hover:text-slate-750 dark:hover:text-slate-350'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Quiz</span>
                </button>
              </div>

              {/* Compare Mode Switcher */}
              {activeTab !== 'quiz' && (
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
                    compareMode
                      ? 'bg-indigo-600 border-transparent text-white shadow-sm hover:bg-indigo-700'
                      : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                  aria-label={`Toggle side-by-side comparison mode: ${compareMode ? 'Active' : 'Inactive'}`}
                >
                  Compare: {compareMode ? 'ON' : 'OFF'}
                </button>
              )}
            </div>

            {/* Workbench Reading Area */}
            <div className="p-6 sm:p-10 space-y-4">
              {translationError && (
                <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-2.5 text-rose-800 dark:text-rose-455 text-xs">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{translationError}</span>
                </div>
              )}

              {/* Viewport Meta / Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-655 dark:text-indigo-400 uppercase tracking-widest block">
                    Viewport: {activeTab === 'translated' ? `Translation (${currentTranslationLang.toUpperCase()})` : activeTab === 'quiz' ? 'Quiz Assessment' : activeTab === 'simple' ? 'Simplified Notes' : 'Original Transcript'}
                  </span>
                  
                  {activeTab === 'translated' && (
                    <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                      <select
                        value={selectedLanguageCode}
                        onChange={(e) => setSelectedLanguageCode(e.target.value)}
                        className="p-1 px-2 border border-slate-205 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-extrabold text-slate-705 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Select translation target language"
                      >
                        <option value="es">Spanish (Español)</option>
                        <option value="zh">Chinese (中文)</option>
                        <option value="fr">French (Français)</option>
                        <option value="ar">Arabic (العربية)</option>
                        <option value="te">Telugu (తెలుగు)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="en">English (English)</option>
                      </select>
                      <button
                        onClick={handleTranslateAgain}
                        disabled={isTranslating || isCooldown}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Translate content again"
                      >
                        <Languages className="w-3 h-3" />
                        <span>{isTranslating ? 'Translating...' : (isCooldown ? 'Quota Limit' : 'Translate')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Simplified reading level slider */}
                {activeTab === 'simple' && !compareMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">Complexity:</span>
                    <div className="flex bg-slate-100 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 gap-1">
                      {['grade4', 'grade8', 'college'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleReadingLevelChange(level)}
                          disabled={isLevelLoading}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            readingLevel === level
                              ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-455 hover:text-slate-800 dark:hover:text-slate-300'
                          }`}
                        >
                          {level === 'grade4' ? 'Grade 4' : level === 'grade8' ? 'Grade 8' : 'College'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab !== 'quiz' && (
                  <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                    Select sentence to read out loud
                  </span>
                )}
              </div>

              {/* Main Reading Viewport Content */}
              {activeTab === 'quiz' ? (
                renderQuizPane()
              ) : compareMode ? (
                /* Split-Pane Compare View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Original Script */}
                  <div className="space-y-4 border-r border-slate-200/60 dark:border-slate-800/80 pr-4">
                    <h4 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-505" />
                      Original Script
                    </h4>
                    
                    <div aria-live="polite" className="space-y-3.5 text-lg leading-relaxed text-slate-750 dark:text-slate-300 font-medium max-h-[50vh] overflow-y-auto pr-2">
                      {hasMedia ? (
                        segments.map((segment) => {
                          const isActive = activeSegmentId === segment.id;
                          return (
                            <div
                              key={segment.id}
                              onClick={() => {
                                if (playerRef.current) {
                                  playerRef.current.currentTime = segment.start;
                                  playerRef.current.play();
                                }
                              }}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                isActive
                                  ? 'bg-indigo-500/10 border-indigo-500/30 text-slate-900 dark:text-white font-bold scale-[1.005] ring-2 ring-indigo-500/20'
                                  : 'bg-white/40 dark:bg-slate-950/20 border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-305'
                              }`}
                            >
                              <span className={`text-xs font-black px-2 py-1 rounded-lg shrink-0 ${
                                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}>
                                {formatTime(segment.start)}
                              </span>
                              <span className="text-sm font-medium leading-relaxed block">
                                {focusMode ? formatBionic(segment.text) : segment.text}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        getSentences().map((sentence, idx) => (
                          renderInteractiveText(sentence, idx)
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Active Adaptation */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-850 pb-2">
                      <h4 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        {activeTab === 'simple' ? <Layers className="w-3.5 h-3.5 text-indigo-500" /> : <Languages className="w-3.5 h-3.5 text-indigo-500" />}
                        {activeTab === 'simple' ? 'Simplified Summary' : `Translation (${currentTranslationLang.toUpperCase()})`}
                      </h4>
                      {activeTab === 'simple' && (
                        <div className="flex bg-slate-100 dark:bg-slate-950/40 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800 gap-1 shrink-0 scale-90 origin-right">
                          {['grade4', 'grade8', 'college'].map((level) => (
                            <button
                              key={level}
                              onClick={() => handleReadingLevelChange(level)}
                              disabled={isLevelLoading}
                              className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                readingLevel === level
                                  ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                                  : 'text-slate-550 dark:text-slate-450 hover:text-slate-850 dark:hover:text-slate-300'
                              }`}
                            >
                              {level === 'grade4' ? 'Gr. 4' : level === 'grade8' ? 'Gr. 8' : 'Coll.'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3.5 text-lg leading-relaxed text-slate-750 dark:text-slate-300 font-medium max-h-[50vh] overflow-y-auto pr-2">
                      {isLevelLoading ? (
                        renderSummarySkeleton()
                      ) : activeTab === 'simple' ? (
                        (routeState?.simplifiedText || lectureData.simpleSentences.join(' ')).split('\n').map((para, pIdx) => (
                          <p key={pIdx} className="text-sm font-medium leading-relaxed block text-slate-700 dark:text-slate-300">
                            {focusMode ? formatBionic(para) : para}
                          </p>
                        ))
                      ) : (
                        (dynamicTranslationText || routeState?.translatedText || (lectureData.translatedSentences[currentTranslationLang] || lectureData.translatedSentences['es']).join(' ')).split('\n').map((para, pIdx) => (
                          <p key={pIdx} className="text-sm font-medium leading-relaxed block text-slate-700 dark:text-slate-300">
                            {focusMode ? formatBionic(para) : para}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : isLevelLoading ? (
                renderSummarySkeleton()
              ) : (
                /* Standard Single Viewport */
                <div aria-live="polite" className="space-y-3.5 text-lg leading-relaxed text-slate-750 dark:text-slate-300 font-medium max-h-[60vh] overflow-y-auto pr-2">
                  {hasMedia && activeTab === 'original' ? (
                    segments.map((segment) => {
                      const isActive = activeSegmentId === segment.id;
                      return (
                        <div
                          key={segment.id}
                          id={`segment-${segment.id}`}
                          onClick={() => {
                            if (playerRef.current) {
                              playerRef.current.currentTime = segment.start;
                              playerRef.current.play();
                            }
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                            isActive
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-slate-900 dark:text-white font-bold scale-[1.005] ring-2 ring-indigo-500/20'
                              : 'bg-white/40 dark:bg-slate-950/20 border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-305'
                          }`}
                        >
                          <span className={`text-xs font-black px-2 py-1 rounded-lg shrink-0 ${
                            isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {formatTime(segment.start)}
                          </span>
                          <span className="text-sm font-medium leading-relaxed block">
                            {focusMode ? formatBionic(segment.text) : segment.text}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    getSentences().map((sentence, idx) => (
                      renderInteractiveText(sentence, idx)
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Quick toggle settings cards */}
          <div className="bg-slate-100/50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                Adaptive controls ready
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                Click the display helper widget in the lower right corner for dyslexia font and tints.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setDyslexiaMode(!dyslexiaMode)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                  dyslexiaMode 
                    ? 'bg-indigo-600 border-transparent text-white shadow-sm' 
                    : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-350'
                }`}
                aria-label={`Toggle Dyslexia font adaptation: ${dyslexiaMode ? 'Active' : 'Inactive'}`}
              >
                Dyslexia Font: {dyslexiaMode ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                  focusMode 
                    ? 'bg-indigo-600 border-transparent text-white shadow-sm' 
                    : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-350'
                }`}
                aria-label={`Toggle Focus mode bionic reading: ${focusMode ? 'Active' : 'Inactive'}`}
              >
                Focus Mode: {focusMode ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setFontSize(fontSize === 'xl' ? 'md' : 'xl')}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-350 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                aria-label={`Toggle font scale size: Currently ${fontSize.toUpperCase()}`}
              >
                Text Size: {fontSize.toUpperCase()}
              </button>
              <button 
                onClick={handleDownloadTranscript}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border bg-slate-900 border-slate-900 hover:bg-indigo-655 text-white flex items-center justify-center gap-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none cursor-pointer"
                aria-label="Download accessible study notes content file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
