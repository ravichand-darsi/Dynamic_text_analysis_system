# TextDynAI Pro — Advanced Text Analytics Platform

**TextDynAI Pro** is a high-performance, professional-grade AI text analysis platform designed for the **Infosys Springboard Internship 6.0**. It leverages the cutting-edge **Google Gemini 3 Flash** model to provide real-time sentiment, emotional, and structural insights from any text input or document.

---

## 🚀 Key Features

### 1. Multi-Dimensional Sentiment Analysis
- **Core Score**: Dynamic gauge visualizing overall sentiment (Positive, Negative, Neutral).
- **Sentiment Flow**: A chronological line graph showing the emotional "narrative arc" throughout the text.
- **Color-Coded Intelligence**: Strict adherence to semantic color schemes (Green: Positive, Red: Negative, Yellow: Neutral) across all visualizations.

### 2. Advanced Emotional & Topic Modeling
- **Emotional Intensity Radar**: Maps 8+ specific human emotions (Joy, Anger, Fear, etc.) to understand the "mood" of the data.
- **Topic Relevance Bar Chart**: Ranks the primary subjects discussed using weighted relevance scores.
- **Knowledge Category Pie Chart**: Distributes entities into classes like People, Organizations, and Locations.

### 3. Professional NLP Pipeline Simulation
- **Denoising Engine**: Visualizes the removal of stop words and noisy tokens.
- **Morphological Normalization**: Displays lemmatization results to show how the AI simplifies words to their roots.
- **Entity Extraction**: A dedicated knowledge table showing entity hits and types.

### 4. Versatile Input Methods
- **Document Parsing**: Support for `.pdf`, `.docx`, and `.txt` files using client-side processing.
- **Voice Assistant**: Integrated Web Speech API for real-time dictation and analysis.
- **Drag & Drop**: Seamless file importing directly into the workspace.

---

## 🛠️ Technical Stack

- **Frontend**: React 19 (ESM) with Tailwind CSS.
- **AI Engine**: `@google/genai` (Gemini 3 Flash Preview).
- **Data Visualization**: `Recharts` (Area, Bar, Radar, Pie, and Custom SVG Gauges).
- **Document Processing**: `Mammoth.js` (Word) and `PDF.js` (PDF).
- **Design System**: Custom Glassmorphism with "Neon-Glow" aesthetics and "Geist/Inter" typography.

---

## 🏗️ Architecture & Workflow

1.  **Input Layer**: Users provide text via manual input, voice, or file upload.
2.  **Preprocessing Service**: Documents are parsed into raw strings; UI triggers a "Processing" state with shimmer effects.
3.  **Inference Layer**: The `geminiService` calls the Google Generative AI API with a structured JSON schema prompt, ensuring high-fidelity data extraction.
4.  **Visualization Layer**: The `AnalysisReport` component decomposes the JSON response into multiple specialized chart components for a 360-degree view.
5.  **State Management**: React Hooks (`useState`, `useRef`, `useEffect`) manage the analysis history and real-time UI updates.

---

## 🎨 UI/UX Design Principles

- **Aesthetic**: Dark-mode primary with cyan and purple accents.
- **Responsiveness**: Fully adaptive layout for mobile, tablet, and desktop.
- **Accessibility**: ARIA-compliant buttons and semantic HTML structure.
- **Feedback**: Smooth animations (Framer Motion-style transitions) and clear error handling for API or parsing failures.

---

## 📋 How to Use

1.  **Paste or Type**: Enter text directly into the main workspace.
2.  **Upload**: Drag and drop a corporate report or patient summary.
3.  **Analyze**: Click "Analyze ✨" to trigger the Gemini engine.
4.  **Explore**: Scroll through the Intelligence Dashboard to see detailed breakdowns.
5.  **History**: Use the left sidebar to toggle between your last 5 analysis sessions.

---

*This project was developed as part of the Infosys Springboard Internship 6.0 Project: TextDynAI Pro Simulation.*

## 🚢 Deployment

- **Build:** `npm run build` (produces the `dist/` folder).
- **Env:** Set `GEMINI_API_KEY` in your environment or via your host's secret settings. Example in `.env.example`.
- **Static hosts:** Works with Vercel, Netlify, and GitHub Pages (SPA).

Quick host-specific notes:

- **Vercel:** Import the repo, set `GEMINI_API_KEY` in Project Settings → Environment Variables, and Vercel will run `npm run build` automatically.
- **Netlify:** Create a new site, set build command `npm run build` and publish directory `dist`. Add `GEMINI_API_KEY` in Site Settings → Build & deploy → Environment.
- **GitHub Pages (automatic):** This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` which builds and publishes `dist/` to `gh-pages` when you push to `main`. Ensure the repository's Pages source is set to `gh-pages` under Settings → Pages.

If you prefer manual deploys, run `npm run build` locally and upload the `dist/` folder to your static host.

If you'd like, I can also add a Netlify `_redirects` file or a Vercel configuration—tell me which host you plan to use.

Updated by Ravi-Chand