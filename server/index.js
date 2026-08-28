import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import os from 'os';
import fs from 'fs';
import path from 'path';
import ytdl from '@distube/ytdl-core';
import { YoutubeTranscript } from 'youtube-transcript';
import dns from 'dns';

// Force Node to prefer IPv4 DNS resolution sequence to bypass IPv6 connectivity timeouts/failures
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

// Global fetch interceptor to strip manual Content-Length headers, resolving undici spec compliance crashes during file uploads
const originalFetch = globalThis.fetch;
globalThis.fetch = function (url, options) {
  if (options && options.headers) {
    if (typeof options.headers.delete === 'function') {
      options.headers.delete('content-length');
      options.headers.delete('Content-Length');
    } else if (typeof options.headers === 'object') {
      for (const key of Object.keys(options.headers)) {
        if (key.toLowerCase() === 'content-length') {
          delete options.headers[key];
        }
      }
    }
  }
  return originalFetch(url, options);
};

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend cross-origin requests
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Input validation schema
const ProcessRequestSchema = z.object({
  text: z.string({
    required_error: "Text is required",
    invalid_type_error: "Text must be a string"
  }).min(1, "Text must not be empty"),
  targetLanguage: z.string({
    required_error: "Target language is required",
    invalid_type_error: "Target language must be a string"
  }).min(1, "Target language must not be empty"),
  readingLevel: z.string().optional()
});

// Gemini output validation schema
const GeminiResponseSchema = z.object({
  simplified: z.string({
    required_error: "Simplified text is missing in Gemini response"
  }),
  translated: z.string({
    required_error: "Translated text is missing in Gemini response"
  })
});

// Helper to initialize GoogleGenAI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error("GEMINI_API_KEY is not configured in server/.env file.");
  }
  return new GoogleGenAI({ apiKey });
};

// POST Endpoint for accessibility processing
app.post('/api/accessibility/process', async (req, res) => {
  try {
    // 1. Validate request body parameters
    const bodyResult = ProcessRequestSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        error: "Invalid request payload",
        details: bodyResult.error.flatten().fieldErrors
      });
    }

    const { text, targetLanguage, readingLevel = 'grade8' } = bodyResult.data;

    // 2. Check if GEMINI_API_KEY is configured. If not, run in Mock Mode for easy testing.
    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '';

    if (isMockMode) {
      console.warn("\x1b[33m%s\x1b[0m", "[Processor] WARNING: GEMINI_API_KEY is not configured in server/.env. Running in Mock Mode!");
      
      const mockSimplified = `Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food. They absorb carbon dioxide from the air and water from the soil, combining them using light energy. This process makes sugars (glucose) which plants store as energy to grow and survive. As a useful byproduct, plants release oxygen back into the air, which humans and animals need to breathe. This natural cycle acts as carbon storage, keeping Earth's climate balanced and stable.`;
      
      const translations = {
        'Spanish': "Las plantas, las algas y algunas bacterias utilizan un proceso biológico llamado fotosíntesis para convertir la luz solar en alimento. Absorben dióxido de carbono del aire y agua del suelo, combinándolos mediante la energía de la luz. Este proceso produce azúcares (glucosa) que las plantas almacenan como energía para crecer y sobrevivir. Como subproducto útil, las plantas liberan oxígeno al aire, que los humanos y los animales necesitan para respirar. Este ciclo natural actúa como almacenamiento de carbono, manteniéndolo en las plantas.",
        'Chinese': "植物、藻类和某些细菌利用被称为光合作用的生物过程，将阳光转化为食物。它们从空气中吸收二氧化碳，从土壤中吸收水分，并利用光能将它们结合起来。这个过程产生糖（葡萄糖），植物将其储存为能量以供生长 and 生存。作为一种有用的副产品，植物向空气中释放氧气，这是人类和动物呼吸所必需的。这种自然循环起到了碳储存的作用。",
        'French': "Les plantes, les algues et certaines bactéries utilisent un processus biologique appelé photosynthèse pour transformer la lumière du soleil en nourriture. Ils absorbent le dioxyde de carbone de l'air et l'eau du sol, en les combinant grâce à l'énergie lumineuse. Ce processus fabrique des sucres (glucose) que les plantes stockent sous forme d'énergie pour grandir et survivre. En tant que sous-produit utile, les plantes rejettent de l'oxygène dans l'air, dont nous avons besoin pour respirer.",
        'Arabic': "تستخدم النباتات والطحالب وبعض البكتيريا عملية بيولوجية تسمى البناء الضوئي لتحويل ضوء الشمس إلى غذاء. فهي تمتص ثاني أكسيد الكربون من الهواء والماء من التربة، وتجمعهما معًا باستخدام طاقة الضوء. تنتج هذه العملية السكريات (الجلوكوز) التي تخزنها النباتات كطاقة للنمو والبقاء على قيد الحياة. كناتج ثنائي مفيد، تطلق النباتات الأكسجين مرة أخرى في الهواء.",
        'Telugu': "మొక్కలు, శైవలాలు మరియు కొన్ని బ్యాక్టీరియా సూర్యరశ్మిని ఆహారంగా మార్చడానికి కిరణజన్య సంయోగ క్రియ అనే జీవ ప్రక్రియను ఉపయోగిస్తాయి. అవి గాలి నుండి కార్బన్ డై ఆక్సైడ్‌ను మరియు నేల నుండి నీటిని గ్రహించి, కాంతి శక్తిని ఉపయోగించి వాటిని కలుపుతాయి. ఈ ప్రక్రియ మొక్కలు పెరగడానికి మరియు మనుగడ సాగించడానికి శక్తిగా నిల్వ చేసే చక్కెరలను (గ్లూకోజ్) తయారు చేస్తుంది. ఒక ఉపయోగకరమైన ఉప ఉత్పత్తిగా, మొక్కలు ఆక్సిజన్‌ను తిరిగి గాలిలోకి విడుదల చేస్తాయి, దీనిని మానవులు మరియు జంతువులు శ్వాసించడానికి ఉపయోగిస్తాయి.",
        'Hindi': "पौधे, शैवाल और कुछ बैक्टीरिया सूर्य के प्रकाश को भोजन में बदलने के लिए प्रकाश संश्लेषण नामक एक जैविक प्रक्रिया का उपयोग करते हैं। वे हवा से कार्बन डाइऑक्साइड और मिट्टी से पानी को अवशोषित करते हैं, और प्रकाश ऊर्जा का उपयोग करके उन्हें मिलाते हैं। यह प्रक्रिया शर्करा (ग्लूकोज) बनाती है जिसे पौधे बढ़ने और जीवित रहने के लिए ऊर्जा के रूप में संग्रहीत करते हैं। एक उपयोगी उप-उत्पाद के रूप में, पौधे हवा में ऑक्सीजन छोड़ते हैं, जिसकी मनुष्यों और जानवरों को सांस लेने के लिए आवश्यकता होती है। यह प्राकृतिक चक्र कार्बन भंडारण के रूप में कार्य करता है, कार्बन को लॉक करता है और पृथ्वी की जलवायु को संतुलित और स्थिर रखता है।",
        'English': "Plants, algae, and some bacteria use a biological process called photosynthesis to turn sunlight into food. They absorb carbon dioxide from the air and water from the soil, combining them using light energy. This process makes sugars (glucose) which plants store as energy to grow and survive. As a useful byproduct, plants release oxygen back into the air, which humans and animals need to breathe. This natural cycle acts as carbon storage, locking carbon away and keeping Earth's climate balanced and stable."
      };
      
      const mockTranslated = translations[targetLanguage] || translations['Spanish'];

      // Simulate a network latency of 1 second for realistic load animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Processor] Mock transformation completed successfully!");
      return res.json({
        simplified: mockSimplified,
        translated: mockTranslated
      });
    }

    // 3. Initialize Gemini API Client
    let ai;
    try {
      ai = getGeminiClient();
    } catch (envError) {
      console.error("Configuration Error:", envError.message);
      return res.status(500).json({
        error: "Server configuration issue",
        details: "GEMINI_API_KEY environment variable is missing or empty. Please set it in server/.env"
      });
    }

    console.log(`[Processor] Submitting content to Gemini (Target Language: ${targetLanguage})...`);

    // 3. Assemble prompt and call Google Gen AI API
    const levelPrompt = readingLevel === 'grade4'
      ? "Simplify the provided lecture text to make it extremely easy to read. Use a Grade 4 reading level (very short sentences, extremely simple vocabulary, basic analogies, and explain difficult concepts simply)."
      : (readingLevel === 'grade8'
          ? "Simplify the provided lecture text to make it easy to read. Use a Grade 8 reading level (short sentences, simple vocabulary, explain difficult concepts clearly)."
          : "Keep the original text complexity but format it as structured, easy-to-read academic notes (use bullet points, preserve technical terminology).");

    const systemPrompt = `You are an AI assistant specialized in accessibility and educational inclusion.
Your task is twofold:
1. ${levelPrompt} Preserve all important pedagogical information. Do not lose the core educational takeaways.
2. Faithfully translate the original text into the requested target language.

Text to process:
"${text}"

Target translation language:
"${targetLanguage}"`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            simplified: { type: 'string' },
            translated: { type: 'string' }
          },
          required: ['simplified', 'translated']
        }
      }
    }));

    // 4. Safely extract and parse response text
    const responseText = typeof response.text === 'function' ? response.text() : response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini API");
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", responseText);
      return res.status(502).json({
        error: "Bad Gateway",
        details: "Gemini returned invalid JSON output that could not be parsed."
      });
    }

    // 5. Validate structure with Zod Schema
    const validationResult = GeminiResponseSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      console.error("Gemini output failed Zod validation:", validationResult.error.format());
      return res.status(502).json({
        error: "Bad Gateway",
        details: "Gemini response did not conform to the required JSON schema structure.",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    console.log("[Processor] Transformation successfully completed!");
    return res.json(validationResult.data);

  } catch (error) {
    console.error("Process Endpoint Error:", error);
    
    const isQuotaError = error.message && (
      error.message.includes("quota") || 
      error.message.includes("RESOURCE_EXHAUSTED") || 
      error.message.includes("rate-limits") ||
      error.message.includes("quota has been reached")
    );

    if (isQuotaError) {
      return res.status(429).json({
        error: "Quota Exceeded",
        details: "AI service is temporarily busy or the current API quota has been reached. Please try again later."
      });
    }
    
    // Check if error is related to authentication / API key validation
    if (error.message && (error.message.includes("API key") || error.message.includes("API_KEY_INVALID"))) {
      return res.status(401).json({
        error: "Unauthorized",
        details: "Invalid Gemini API key provided. Please check the GEMINI_API_KEY in your server/.env file."
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message || "An unexpected error occurred during processing."
    });
  }
});

const SUPPORTED_MEDIA_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/webm"
];

function getMimeType(filename, providedMimeType) {
  if (providedMimeType === 'audio/x-wav') return 'audio/wav';
  if (providedMimeType === 'audio/x-m4a') return 'audio/mp4';

  if (providedMimeType && providedMimeType !== "application/octet-stream" && providedMimeType.trim() !== '') {
    return providedMimeType;
  }

  const extension = filename
    .split(".")
    .pop()
    .toLowerCase();

  const mimeTypes = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",

    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    aac: "audio/aac",
    ogg: "audio/ogg"
  };

  return mimeTypes[extension] || "application/octet-stream";
}

import { promisify } from 'util';
import { pipeline } from 'stream';
const dnsLookup = promisify(dns.lookup);
const streamPipeline = promisify(pipeline);

async function isSafeUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    
    // Resolve DNS lookup
    const { address } = await dnsLookup(parsed.hostname);
    
    // Block private/loopback IP address ranges to prevent SSRF
    const isPrivate = 
      address === '127.0.0.1' || 
      address === '0.0.0.0' || 
      address === '::1' ||
      address.startsWith('10.') || 
      address.startsWith('192.168.') ||
      address.startsWith('172.16.') ||
      address.startsWith('169.254.');
      
    return !isPrivate;
  } catch (e) {
    return false;
  }
}

async function downloadYouTubeAudio(urlStr) {
  console.log(`[URL MEDIA] Resolving YouTube video stream: ${urlStr}`);
  let info;
  try {
    info = await ytdl.getInfo(urlStr);
  } catch (err) {
    console.error("ytdl-core getInfo failure:", err.message);
    throw new Error("We could not access the media stream from this YouTube URL due to YouTube's strict anti-bot and DRM restrictions. Please upload the video/audio file directly using the Media Upload tab.");
  }

  // Filter formats for audio-only
  const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
  if (!format || !format.url) {
    throw new Error("No usable audio-only format available from YouTube for this video.");
  }

  console.log(`[URL MEDIA] Highest quality audio format found: ${format.mimeType}`);
  const cleanMime = format.mimeType.split(';')[0].trim().toLowerCase();

  // Create local temp file
  const filename = `${info.videoDetails.videoId}_audio`;
  const extension = cleanMime.includes('webm') ? 'webm' : 'm4a';
  const tempPath = path.join(os.tmpdir(), `yt-${Date.now()}-${filename}.${extension}`);
  
  console.log(`[URL MEDIA] Downloading audio stream to: ${tempPath}`);
  
  const response = await fetch(format.url);
  if (!response.ok) {
    throw new Error(`Failed to download YouTube audio stream. Status: ${response.status}`);
  }

  const fileStream = fs.createWriteStream(tempPath);
  await streamPipeline(response.body, fileStream);

  const stats = fs.statSync(tempPath);
  console.log(`[URL MEDIA] YouTube audio download complete: Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  return {
    path: tempPath,
    originalname: `${info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`,
    mimetype: cleanMime,
    size: stats.size
  };
}

function getYouTubeId(urlStr) {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();
    
    if (hostname.includes('youtu.be')) {
      return url.pathname.slice(1);
    }
    
    if (hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/')[2];
      }
      return url.searchParams.get('v');
    }
  } catch (e) {}
  return null;
}

async function downloadMediaFromUrl(urlStr) {
  if (!(await isSafeUrl(urlStr))) {
    throw new Error("Security Exception: Access to loopback or private IP ranges is forbidden.");
  }

  // Detect platform URLs (YouTube, Vimeo)
  const parsed = new URL(urlStr);
  const hostname = parsed.hostname.toLowerCase();
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be') || hostname.includes('vimeo.com')) {
    throw new Error("We could not access the media stream from this URL. Please upload the video/audio file directly or provide a supported direct media URL.");
  }

  console.log(`[URL MEDIA] URL submitted: ${urlStr}`);
  console.log(`[URL MEDIA] Source detected: direct-media`);
  console.log(`[URL MEDIA] Resolving redirects...`);

  // Perform request
  const response = await fetch(urlStr, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) sensusaiAI/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to access media from this URL. Server returned status: ${response.status}`);
  }

  const contentTypeHeader = response.headers.get("content-type");
  const contentLengthHeader = response.headers.get("content-length");
  
  // Clean MIME parameters (e.g. video/mp4; charset=binary)
  const mimeType = contentTypeHeader ? contentTypeHeader.split(';')[0].trim().toLowerCase() : '';
  
  console.log(`[URL MEDIA] Content-Type header: ${contentTypeHeader || 'None'}`);
  console.log(`[URL MEDIA] Resolved MIME type: ${mimeType}`);

  // Limit size (e.g., 50MB)
  if (contentLengthHeader && parseInt(contentLengthHeader, 10) > 50 * 1024 * 1024) {
    throw new Error("This file is too large to process. Please upload a smaller file.");
  }

  console.log(`[URL MEDIA] Downloading media...`);

  // Determine a temporary filename
  const filename = parsed.pathname.split('/').pop() || 'media_url_file';
  const tempPath = path.join(os.tmpdir(), `url-${Date.now()}-${filename}`);
  
  // Stream to file
  const responseStream = response.body;
  const fileStream = fs.createWriteStream(tempPath);
  await streamPipeline(responseStream, fileStream);
  
  // Verify size if content-length was missing
  const stats = fs.statSync(tempPath);
  console.log(`[URL MEDIA] Download successful: Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  if (stats.size > 50 * 1024 * 1024) {
    try { fs.unlinkSync(tempPath); } catch (e) {}
    throw new Error("This file is too large to process. Please upload a smaller file.");
  }

  return {
    path: tempPath,
    originalname: filename,
    mimetype: mimeType,
    size: stats.size
  };
}

async function callGeminiWithRetry(apiCallFn, retries = 1, initialDelay = 1500) {
  let attempt = 0;
  while (true) {
    try {
      return await apiCallFn();
    } catch (error) {
      attempt++;
      const isQuotaError = error.message && (
        error.message.includes("quota") || 
        error.message.includes("RESOURCE_EXHAUSTED") || 
        error.message.includes("429") || 
        error.message.includes("rate-limits") ||
        error.status === 429
      );

      if (isQuotaError && attempt <= retries) {
        let delay = initialDelay * Math.pow(2, attempt - 1);
        if (error.retryDelay) {
          const seconds = parseFloat(error.retryDelay);
          if (!isNaN(seconds)) {
            delay = seconds * 1000;
          }
        }
        
        // Limit retry delay to 5 seconds to prevent keeping HTTP requests hanging too long
        if (delay > 5000) {
          console.warn(`[Gemini Retry] Quota delay is too long (${delay}ms). Skipping retry.`);
          throw new Error("AI service is temporarily busy or the current API quota has been reached. Please try again later.");
        }
        
        console.warn(`[Gemini Retry] Hit 429/Quota error. Retrying attempt ${attempt}/${retries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (isQuotaError) {
        throw new Error("AI service is temporarily busy or the current API quota has been reached. Please try again later.");
      }
      
      throw error;
    }
  }
}

// POST Endpoint for media transcription & accessibility processing (supporting file upload, remote direct URLs, and YouTube transcripts)
app.post('/api/media/process', upload.single('media'), async (req, res) => {
  let fileToProcess = null;
  let isTempDownload = false;
  let isYouTubeUrl = false;
  let youtubeTranscriptSegments = null;
  let youtubeTitle = 'YouTube Video';
  let ai = null;
  let uploadResult = null;
  let mimeType = null;
  let targetLanguage = 'Spanish';

  try {
    const { title, category, language } = req.body;
    targetLanguage = language || 'Spanish';

    // 1. Detect and parse YouTube/Shorts URLs
    if (req.body.url) {
      const parsedUrl = new URL(req.body.url);
      const hostname = parsedUrl.hostname.toLowerCase();
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const videoId = getYouTubeId(req.body.url);
        if (!videoId) {
          return res.status(400).json({ error: "Bad Request", details: "Invalid YouTube URL format." });
        }

        console.log(`[URL MEDIA] YouTube URL submitted: ${req.body.url}`);
        console.log(`[URL MEDIA] Video ID extracted: ${videoId}`);
        console.log(`[URL MEDIA] Checking for available captions...`);

        try {
          const list = await YoutubeTranscript.fetchTranscript(videoId);
          if (!list || list.length === 0) {
            throw new Error("No accessible transcript or captions are available for this YouTube video.");
          }

          youtubeTranscriptSegments = list.map((item, idx) => ({
            id: idx + 1,
            start: parseFloat((item.offset / 1000).toFixed(2)),
            end: parseFloat(((item.offset + item.duration) / 1000).toFixed(2)),
            text: item.text
          }));

          isYouTubeUrl = true;
          youtubeTitle = title || `YouTube Video (${videoId})`;
          console.log(`[URL MEDIA] Transcribed spoken content successfully from YouTube captions! Segments: ${youtubeTranscriptSegments.length}`);
        } catch (err) {
          console.error("[URL MEDIA] YouTube transcript extraction failed:", err.message);
          return res.status(400).json({
            success: false,
            error: "Transcript unavailable",
            details: "No accessible transcript or captions are available for this YouTube video. Please upload a video/audio file directly to generate a transcription."
          });
        }
      }
    }

    // 2. If not YouTube, download or process the media file
    if (!isYouTubeUrl) {
      if (req.file) {
        fileToProcess = req.file;
      } else if (req.body.url) {
        console.log(`[URL MEDIA] Ingesting from URL: ${req.body.url}`);
        fileToProcess = await downloadMediaFromUrl(req.body.url);
        isTempDownload = true;
      } else {
        return res.status(400).json({ error: "Bad Request", details: "No media file uploaded and no URL provided." });
      }

      // Explicitly determine and log MIME type
      mimeType = getMimeType(fileToProcess.originalname, fileToProcess.mimetype);

      console.log("[MEDIA] Resolved media parameters:", {
        originalName: fileToProcess.originalname,
        uploadedMimeType: fileToProcess.mimetype,
        resolvedMimeType: mimeType
      });

      if (mimeType === "application/octet-stream") {
        try { fs.unlinkSync(fileToProcess.path); } catch (e) {}
        return res.status(400).json({
          success: false,
          error: "Unsupported media format",
          details: "Unsupported media format. Unable to determine file MIME type."
        });
      }

      if (!SUPPORTED_MEDIA_TYPES.includes(mimeType)) {
        try { fs.unlinkSync(fileToProcess.path); } catch (e) {}
        return res.status(400).json({
          success: false,
          error: "Unsupported media format",
          details: `Unsupported media type: ${mimeType}`
        });
      }

      try {
        ai = getGeminiClient();
      } catch (envError) {
        console.error("Configuration Error:", envError.message);
        try { fs.unlinkSync(fileToProcess.path); } catch (e) {}
        return res.status(500).json({
          error: "Server configuration issue",
          details: "GEMINI_API_KEY environment variable is missing or empty."
        });
      }

      try {
        console.log(`[MEDIA] Sending to transcription service: MIME: ${mimeType}`);
        uploadResult = await callGeminiWithRetry(() => ai.files.upload({
          file: fileToProcess.path,
          config: {
            mimeType: mimeType
          }
        }));
        console.log(`[MEDIA] Ingest successful: ${uploadResult.name}`);
      } catch (uploadError) {
        console.error("Gemini File Upload Error:", uploadError);
        try { fs.unlinkSync(fileToProcess.path); } catch (e) {}
        return res.status(502).json({
          success: false,
          error: "Gemini File Upload Failed",
          details: uploadError.message || "Could not upload the media to Google Gemini Files API."
        });
      }

      // Delete local temp file
      try {
        fs.unlinkSync(fileToProcess.path);
        console.log(`[MediaProcessor] Local temporary file deleted: ${fileToProcess.path}`);
      } catch (unlinkError) {
        console.error("Warning: Failed to clean up local temp file:", unlinkError.message);
      }
    } else {
      try {
        ai = getGeminiClient();
      } catch (envError) {
        console.error("Configuration Error:", envError.message);
        return res.status(500).json({
          error: "Server configuration issue",
          details: "GEMINI_API_KEY environment variable is missing or empty."
        });
      }
    }

    // 3. AI Processing Pipeline
    let parsedData;
    if (isYouTubeUrl) {
      const fullTranscriptText = youtubeTranscriptSegments.map(s => s.text).join(' ');
      console.log(`[AI PROCESSING] Generating Easy Read notes from YouTube transcript...`);
      const prompt = `Analyze this lecture transcript. Perform the following operations:
1. Simplify the entire transcript into an Easy Read summary notes version (in English, using short bullet points, clear vocabulary, explanations for complex terms, and a structured format).
2. Translate the entire transcript faithfully into the target language "${targetLanguage}".
3. Auto-detect the spoken language (e.g. "en", "te", "hi", "es", "fr", "zh", "ar").

Return the result as a JSON object matching the requested schema.`;

      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          { text: `Transcript:\n${fullTranscriptText}` },
          { text: prompt }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              detectedLanguage: { type: 'string' },
              simplified: { type: 'string' },
              translated: { type: 'string' }
            },
            required: ['detectedLanguage', 'simplified', 'translated']
          }
        }
      }));

      const responseText = response.text;
      console.log(`[MediaProcessor] Received response from Gemini. Parsing JSON...`);
      const geminiData = JSON.parse(responseText);

      parsedData = {
        segments: youtubeTranscriptSegments,
        fullTranscript: fullTranscriptText,
        detectedLanguage: geminiData.detectedLanguage || 'en',
        simplified: geminiData.simplified,
        translated: geminiData.translated
      };
    } else {
      console.log(`[MediaProcessor] Submitting content to gemini-3.6-flash for unified transcription, simplification and translation...`);
      
      const prompt = `Analyze this audio or video file. Perform the following operations:
1. Transcribe the spoken text in the file. Maintain absolute fidelity. Make sure that the transcription matches the original spoken language. If it is Telugu or Hindi, transcribe in Telugu or Hindi script. Do not translate.
2. Segment the transcription into timestamped sentences. Each segment must have:
   - "id": a unique sequential integer (1, 2, 3...)
   - "start": start time in seconds (e.g. 1.5)
   - "end": end time in seconds (e.g. 5.8)
   - "text": the transcription of that sentence
3. Auto-detect the spoken language (e.g. "en", "te", "hi", "es", "fr", "zh", "ar").
4. Simplify the entire transcript into an Easy Read summary notes version (in English, using short bullet points, clear vocabulary, explanations for complex terms, and a structured format).
5. Translate the entire original transcript faithfully into the target language "${targetLanguage}".

Return the result as a JSON object matching the requested schema.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          fileData: {
            fileUri: uploadResult.uri,
            mimeType: uploadResult.mimeType
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            segments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  start: { type: 'number' },
                  end: { type: 'number' },
                  text: { type: 'string' }
                },
                required: ['id', 'start', 'end', 'text']
              }
            },
            fullTranscript: { type: 'string' },
            detectedLanguage: { type: 'string' },
            simplified: { type: 'string' },
            translated: { type: 'string' }
          },
          required: ['segments', 'fullTranscript', 'detectedLanguage', 'simplified', 'translated']
        }
      }
    }));

    const responseText = response.text;
    console.log(`[MediaProcessor] Received response from Gemini. Parsing JSON...`);
    parsedData = JSON.parse(responseText);

    if (!parsedData.segments || parsedData.segments.length === 0) {
      throw new Error("We found audio, but could not detect clear spoken language.");
    }

    console.log(`[MediaProcessor] Processing complete. Cleaning up Gemini File...`);
    
    try {
      await ai.files.delete({ name: uploadResult.name });
      console.log(`[MediaProcessor] Gemini server file deleted: ${uploadResult.name}`);
    } catch (cleanupError) {
      console.error("Warning: Failed to clean up Gemini server file:", cleanupError.message);
    }
  }

  return res.json({
      success: true,
      lecture: {
        id: `lecture-${Date.now()}`,
        title: isYouTubeUrl ? youtubeTitle : (title || fileToProcess.originalname),
        category: category || 'Lecture',
        mediaType: isYouTubeUrl ? 'video' : (mimeType && mimeType.startsWith('video') ? 'video' : 'audio'),
        duration: parsedData.segments[parsedData.segments.length - 1]?.end || 0,
        detectedLanguage: parsedData.detectedLanguage,
        transcript: {
          fullText: parsedData.fullTranscript,
          segments: parsedData.segments
        },
        easyRead: parsedData.simplified,
        translated: parsedData.translated
      }
    });

  } catch (error) {
    console.error("Media Processing Failure:", error);

    if (fileToProcess && fileToProcess.path) {
      try { fs.unlinkSync(fileToProcess.path); } catch (e) {}
    }

    try {
      if (uploadResult) {
        await ai.files.delete({ name: uploadResult.name });
        console.log(`[MediaProcessor] Cleanup completed after failure for file: ${uploadResult.name}`);
      }
    } catch (e) {}

    const isQuotaError = error.message && (
      error.message.includes("quota") || 
      error.message.includes("RESOURCE_EXHAUSTED") || 
      error.message.includes("rate-limits") ||
      error.message.includes("quota has been reached")
    );

    if (isQuotaError) {
      return res.status(429).json({
        error: "Quota Exceeded",
        details: "AI service is temporarily busy or the current API quota has been reached. Please try again later."
      });
    }

    return res.status(500).json({
      error: "Media processing failed",
      details: error.message || "An unexpected error occurred during transcription."
    });
  }
});

// POST Endpoint for generating comprehension quizzes
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "Bad Request", details: "Text content is required to generate a quiz." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '';

    if (isMockMode) {
      console.log("[Quiz] Running in Mock Mode");
      return res.json({
        quiz: [
          {
            question: "What is the primary role of chlorophyll in photosynthesis?",
            options: [
              "To absorb water from the soil",
              "To capture solar radiation (light energy)",
              "To release carbon dioxide into the air",
              "To produce nitrogen molecules"
            ],
            answerIndex: 1,
            explanation: "Chlorophyll is a pigment that absorbs light energy, primarily from solar radiation, to power the process of photosynthesis."
          },
          {
            question: "Which of the following compounds is a primary product of photosynthesis?",
            options: [
              "Glucose",
              "Nitrogen dioxide",
              "Sulfuric acid",
              "Sodium chloride"
            ],
            answerIndex: 0,
            explanation: "Photosynthesis converts solar energy into chemical energy sequestered in carbohydrate compounds like glucose."
          },
          {
            question: "What type of organisms typically carry out photosynthesis?",
            options: [
              "Carnivorous animals",
              "Fungi species",
              "Photoautotrophic organisms (like plants and algae)",
              "Anaerobic deep-sea bacteria"
            ],
            answerIndex: 2,
            explanation: "Photoautotrophic organisms, such as green plants, algae, and some bacteria, are the main organisms that perform photosynthesis."
          },
          {
            question: "Where does the chemical potential energy produced in photosynthesis get stored?",
            options: [
              "In root water molecules",
              "In the synthetic molecular bonds of carbohydrates",
              "In the soil nitrogen pockets",
              "In the atmosphere's ozone layer"
            ],
            answerIndex: 1,
            explanation: "The energy converted during photosynthesis is stored in the chemical molecular bonds of synthesized carbohydrates like glucose."
          },
          {
            question: "What starting materials are combined by plants during photosynthesis?",
            options: [
              "Carbon dioxide and water",
              "Oxygen and nitrogen",
              "Methane and carbon monoxide",
              "Glucose and soil minerals"
            ],
            answerIndex: 0,
            explanation: "Plants take carbon dioxide from the air and water from the soil, combining them using light energy to form carbohydrates."
          }
        ]
      });
    }

    console.log(`[Quiz] Generating comprehension quiz using Gemini...`);
    const ai = getGeminiClient();

    const systemPrompt = `Analyze the provided lecture transcript and generate 5 multiple-choice questions to test comprehension.
Each question must have:
- "question": the question text
- "options": an array of exactly 4 possible string options
- "answerIndex": the 0-indexed integer of the correct option (0, 1, 2, or 3)
- "explanation": a short clear explanation of why that option is correct.

Return the result strictly as a JSON object matching this schema:
{
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answerIndex": number,
      "explanation": "string"
    }
  ]
}

Text to process:
"${text}"`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            quiz: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  answerIndex: { type: 'number' },
                  explanation: { type: 'string' }
                },
                required: ['question', 'options', 'answerIndex', 'explanation']
              }
            }
          },
          required: ['quiz']
        }
      }
    }));

    const responseText = typeof response.text === 'function' ? response.text() : response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini API");
    }

    const parsedJson = JSON.parse(responseText);
    return res.json(parsedJson);

  } catch (error) {
    console.error("Quiz Generator Endpoint Error:", error);
    
    const isQuotaError = error.message && (
      error.message.includes("quota") || 
      error.message.includes("RESOURCE_EXHAUSTED") || 
      error.message.includes("rate-limits") ||
      error.message.includes("quota has been reached")
    );

    if (isQuotaError) {
      return res.status(429).json({
        error: "Quota Exceeded",
        details: "AI service is temporarily busy or the current API quota has been reached. Please try again later."
      });
    }

    return res.status(500).json({
      error: "Quiz Generation Failed",
      details: error.message || "An unexpected error occurred during quiz generation."
    });
  }
});

// Liveness probe check
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start the Express server only if not in a Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`sensusai AI Backend Running on Port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/accessibility/process`);
    console.log(`=========================================`);
  });
}

export default app;
