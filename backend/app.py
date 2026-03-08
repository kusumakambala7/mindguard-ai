from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, CLIPProcessor, CLIPModel
import whisper
import os
import torch
from PIL import Image
import cv2


app = Flask(__name__)
CORS(app)

# -------------------------
# LOAD AI MODELS
# -------------------------

# Toxicity detection model
toxicity_model = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    truncation=True
)

# Whisper speech-to-text model
speech_model = whisper.load_model("base")

# CLIP image analysis model
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Negation words for context understanding
negation_words = [
    "don't", "do not", "never", "avoid", "stop", "prevent",
    "no one should", "should not", "must not"
]

# -------------------------
# VIDEO ANALYSIS
# -------------------------
@app.route("/analyze-video", methods=["POST"])
def analyze_video():

    if "file" not in request.files:
        return jsonify({"error": "No video uploaded"})

    video_file = request.files["file"]

    filepath = "temp_video.mp4"
    video_file.save(filepath)

    cap = cv2.VideoCapture(filepath)

    labels = [
        "a photo of a gun",
        "a photo of a knife",
        "a violent scene",
        "blood",
        "safe normal scene"
    ]

    dangerous_detected = False
    violent_detected = False
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret or frame_count > 10:
            break

        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        inputs = clip_processor(
            text=labels,
            images=image,
            return_tensors="pt",
            padding=True
        )

        outputs = clip_model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)

        best_index = torch.argmax(probs).item()
        detected = labels[best_index]

        if detected in ["a photo of a gun", "a photo of a knife"]:
            dangerous_detected = True

        if detected in ["a violent scene", "blood"]:
            violent_detected = True

        frame_count += 1

    cap.release()
    os.remove(filepath)

    if dangerous_detected:
        risk = "High"
        issue = "Weapon detected in video frames"
        recommendation = "Blur or remove weapon scenes."

    elif violent_detected:
        risk = "Medium"
        issue = "Violent imagery detected"
        recommendation = "Add graphic content warning."

    else:
        risk = "Low"
        issue = "No harmful content detected"
        recommendation = "Video appears safe."

    return jsonify({
        "risk_level": risk,
        "risk_score": 70 if risk=="High" else 45 if risk=="Medium" else 10,
        "detected_issue": issue,
        "recommendation": recommendation
    })

# -------------------------
# TEXT ANALYSIS
# -------------------------
@app.route("/analyze-text", methods=["POST"])
def analyze_text():

    data = request.json
    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "risk_level": "Low",
            "risk_score": 0,
            "detected_issue": "No text provided",
            "recommendation": "Provide text for analysis."
        })

    text_lower = text.lower()

    result = toxicity_model(text)[0]
    label = result["label"]
    score = result["score"]

    has_negation = any(word in text_lower for word in negation_words)

    if score > 0.7 and not has_negation:
        risk = "High"
        issue = f"Harmful or toxic language detected ({label})"
        recommendation = "Consider modifying violent expressions."
    elif score > 0.4 and not has_negation:
        risk = "Medium"
        issue = f"Potentially unsafe language detected ({label})"
        recommendation = "Review wording carefully."
    else:
        risk = "Low"
        issue = "No harmful intent detected"
        recommendation = "Content appears safe."

    return jsonify({
        "risk_level": risk,
        "risk_score": round(score * 100),
        "detected_issue": issue,
        "recommendation": recommendation
    })



# -------------------------
# AUDIO ANALYSIS
# -------------------------
@app.route("/analyze-audio", methods=["POST"])
def analyze_audio():

    if "file" not in request.files:
        return jsonify({"error": "No audio file uploaded"})

    audio_file = request.files["file"]

    filepath = "temp_audio.wav"
    audio_file.save(filepath)

    result = speech_model.transcribe(filepath)
    transcript = result["text"]

    transcript_lower = transcript.lower()

    toxicity = toxicity_model(transcript)[0]
    label = toxicity["label"]
    score = toxicity["score"]

    has_negation = any(word in transcript_lower for word in negation_words)

    if score > 0.7 and not has_negation:
        risk = "High"
        issue = f"Harmful or violent speech detected ({label})"
        recommendation = "Review audio before publishing."
    elif score > 0.4 and not has_negation:
        risk = "Medium"
        issue = f"Potentially unsafe speech detected ({label})"
        recommendation = "Consider editing the audio."
    else:
        risk = "Low"
        issue = "No harmful speech detected"
        recommendation = "Audio content appears safe."

    os.remove(filepath)

    return jsonify({
        "transcript": transcript,
        "risk_level": risk,
        "risk_score": round(score * 100),
        "detected_issue": issue,
        "recommendation": recommendation
    })


# -------------------------
# IMAGE ANALYSIS
# -------------------------
@app.route("/analyze-image", methods=["POST"])
def analyze_image():

    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"})

    image_file = request.files["file"]

    filepath = "temp_image.jpg"
    image_file.save(filepath)

    image = Image.open(filepath).convert("RGB")

    # Better prompts for CLIP
    labels = [
        "a photo of a gun",
        "a photo of a knife",
        "a violent scene",
        "a bloody scene",
        "a dangerous weapon",
        "a safe normal photo"
    ]

    inputs = clip_processor(
        text=labels,
        images=image,
        return_tensors="pt",
        padding=True
    )

    outputs = clip_model(**inputs)

    logits = outputs.logits_per_image
    probs = logits.softmax(dim=1)

    best_index = torch.argmax(probs).item()
    detected_label = labels[best_index]
    confidence = probs[0][best_index].item()

    confidence_percent = round(confidence * 100)

    # Risk classification
    if detected_label in ["a photo of a gun", "a photo of a knife", "a dangerous weapon"]:
        risk = "High"
        issue = "Weapon detected in image"
        recommendation = "Blur or remove weapon before publishing."

    elif detected_label in ["a violent scene", "a bloody scene"]:
        risk = "Medium"
        issue = "Violent imagery detected"
        recommendation = "Add a graphic content warning."

    else:
        risk = "Low"
        issue = "No harmful objects detected"
        recommendation = "Image appears safe."

    os.remove(filepath)

    return jsonify({
        "detected_object": detected_label,
        "confidence": confidence_percent,
        "risk_level": risk,
        "risk_score": confidence_percent,
        "detected_issue": issue,
        "recommendation": recommendation
    })

# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)