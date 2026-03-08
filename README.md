
# 🛡️ MindGuardAI – Multimodal Content Safety Analyzer

MindGuardAI is an AI-powered content moderation system that analyzes **text, images, audio, and video** to detect harmful, violent, or unsafe content before publishing.

It helps creators and platforms ensure that their content follows community guidelines and platform safety policies.

---

## 🚀 Features

- 📝 **Text Analysis**
  - Detects toxic language, threats, and harmful intent using AI models.

- 🎤 **Audio Analysis**
  - Converts speech to text using Whisper
  - Detects harmful or violent speech in audio.

- 🖼 **Image Analysis**
  - Uses CLIP AI model to detect:
    - Weapons
    - Violence
    - Blood
    - Unsafe imagery.

- 🎥 **Video Analysis**
  - Extracts frames from videos
  - Detects harmful visual content
  - Detects aggressive speech in audio track.

---

## 🧠 Technologies Used

Frontend:
- React
- TypeScript
- Tailwind CSS
- Vite

Backend:
- Python
- Flask
- Transformers (HuggingFace)
- OpenAI Whisper
- CLIP Model
- PyTorch
- MoviePy

---

## 🏗 System Architecture
User Upload → Frontend (React) ↓ API Request ↓ Flask Backend ↓ AI Models
Text → ToxicBERT
Audio → Whisper + ToxicBERT
Image → CLIP
Video → Frame Extraction + CLIP + Speech Analysis
↓ Risk Score + Recommendations ↓ Safety Report


---

## 📊 Output Example

MindGuardAI generates:

- Risk Score
- Risk Level (Safe / Low / Medium / High)
- Detected Issues
- Recommendations
- Full Safety Report

Example:
Content Type: Image Risk Score: 52% Risk Level: Medium Risk
Detected Issue: Potential weapon detected
Recommendation: Blur or remove the weapon before publishing


## ⚙️ Installation

### 1️⃣ Clone the repository
git clone https://github.com/varshitha211/safe-creator.git⁠�

### 2️⃣ Install frontend dependencies
npm install

### 3️⃣ Install backend dependencies
cd backend pip install -r requirements.txt

### 4️⃣ Run Backend
python app.py

Backend runs on:
http://127.0.0.1:5000⁠�


### 5️⃣ Run Frontend
npm run dev

Frontend runs on:
http://localhost:5173⁠�


---

## 🎯 Use Cases

- Social media moderation
- Content creator safety checks
- Video platform moderation
- Online community protection
- AI-assisted publishing approval

---

## 🔮 Future Improvements

- Real-time livestream moderation
- Automatic blur for unsafe objects
- Platform policy violation detection
- AI explanation for moderation decisions

---

## 👨‍💻 Author

Krupa Varshitha
