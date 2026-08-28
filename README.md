# InclusiveEd AI
> **"One Lecture. Every Learner."**

InclusiveEd AI is an intelligent accessibility platform designed to convert classroom lectures into adapted, personalized study workspaces for ADHD, dyslexia, ESL, and auditory learners. 

By leveraging the Google Gemini API, InclusiveEd AI dynamically processes dense transcripts to generate easy-read notes, native translations, vocabulary tooltips, and interactive comprehension quizzes.

---

## ♿ Problem & Solution

Traditional educational lectures create learning barriers:
* **ADHD & Cognitive Learners:** Dense, verbose transcripts cause cognitive overload.
* **Dyslexic Learners:** Standard typography lacks appropriate tracking and character buffers.
* **ESL Learners:** Non-native speakers struggle with advanced technical vocabulary.
* **Auditory Learners:** Prefer speech narration to reinforce retention.

**InclusiveEd AI** solves this by providing:
1. **Verbatim Transcript:** Interactive highlighting synced with audio/video media.
2. **Simplified Notes:** Summary decks broken down into short, bulleted concepts.
3. **Multilingual Localizations:** In-context language translation support.
4. **Readability Deck:** Layout modifiers for font size, line spacing, and tints.
5. **Interactive Assessment:** Dynamic comprehension quizzes to test learning.

---

## 🚀 Key Features

* **Bionic Focus Mode:** Bolds word entry points client-side to improve word tracking.
* **Readability Customization:** Dyslexia-friendly Lexend typography, high-contrast, ambient background page tints (sepia, cool blue, dark), and spacing modifiers.
* **Text-to-Speech (TTS):** Highlight-synced sentence audio readers with adjustable rates.
* **Reading Level Slider:** Simplify lecture summaries to Grade 4, Grade 8, or College reading levels.
* **Comprehension Quizzes:** Google Gemini-generated multiple-choice questions with answer key evaluations and in-depth explanations.
* **Active-Tab Downloads:** Export verbatim scripts, easy-read summaries, or translations to clean text files.
* **Accessibility Footprint:** Visual SVG dashboard displaying preset usage statistics.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, React Router 7.
* **Backend:** Node.js, Express, Zod (Validation), Google Gen AI SDK.
* **AI Model:** `gemini-3.6-flash` (Structured Zod responses for quizzes).

---

## 📁 Repository Structure

```
InclusiveEdAI/
├── src/                      # Frontend React 19 Source Code
│   ├── components/           # Nav headers, footers, readability controls
│   ├── context/              # Accessibility settings state, Auth, and Toasts
│   ├── pages/                # Landing, Dashboard, Workbench, Settings
│   ├── App.jsx               # Routes and providers wrapping
│   └── main.jsx              # DOM bootloader entry point
├── server/                   # Backend Express Daemon
│   ├── index.js              # Server routes, Gemini schemas, and pipeline
│   ├── .env.example          # Environment variable template
│   └── package.json          # Node configuration
├── package.json              # Client dependencies config
├── vite.config.js            # Vite compiler configuration
└── README.md                 # Product documentation
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/InclusiveEdAI.git
cd InclusiveEdAI

# Install client-side dependencies
npm install

# Install server-side dependencies
cd server
npm install
```

### Step 2: Configure Environment Variables

Inside the `/server` folder, copy the example environment file and add your Gemini API key:

```bash
# Navigate to server directory
cd server

# Copy the environment file template
cp .env.example .env
```

Open `server/.env` and enter your configurations:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Run the Application

You need to run both the frontend and backend processes. 

#### Launch Backend Server:
```bash
# From the /server folder
npm run dev
# The API will run on http://localhost:5000
```

#### Launch Frontend Dev Server:
```bash
# From the root folder
npm run dev
# The app will open on http://localhost:5173
```

---

## 📦 Production Builds

To compile and bundle the React client assets for production:

```bash
# From the root folder
npm run build
```
Production assets will be built into the `/dist` directory.
