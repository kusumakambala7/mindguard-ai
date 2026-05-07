
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
## 📸 Project Screenshots

### 🏠 Home Page
![Home Page](<img width="1798" height="813" alt="Screenshot 2026-05-07 171716" src="https://github.com/user-attachments/assets/a86accea-11c1-45e8-b5bd-9fd928003275" />
)

### ⚙ Features & Architecture
![Features](<img width="1865" height="897" alt="Screenshot 2026-05-07 171805" src="https://github.com/user-attachments/assets/28ff1ea3-5d8a-4784-a0d8-e038140e18f4" />
)

### 📊 Risk Analysis Report
![Risk Analysis](<img width="1080" height="835" alt="risk" src="https://github.com/user-attachments/assets/dfa250b4-a1c0-4ea9-9777-d99ee1df0ffe" />
)

### 📂 Content Upload & Processing
![Upload Analysis](<img width="1355" height="1161" alt="analyze" src="https://github.com/user-attachments/assets/e23d0090-750b-48e2-ad8a-ec99fba8d3d1" />
)

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


### 5️⃣ Run Frontend
npm run dev

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
Updated by Kusuma Saisri
