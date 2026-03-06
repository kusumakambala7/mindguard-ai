import { useState, useCallback } from "react";
import { Upload, Image, Film, Music, Type, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { analyzeImage, analyzeVideo, analyzeAudio, analyzeText, type AnalysisResult, type ContentType } from "@/lib/analysisEngine";

const contentTypes: { type: ContentType; icon: typeof Image; label: string; accept: string; desc: string }[] = [
  { type: "image", icon: Image, label: "Image", accept: "image/*", desc: "JPG, PNG, WEBP" },
  { type: "video", icon: Film, label: "Video", accept: "video/*", desc: "MP4, MOV, AVI" },
  { type: "audio", icon: Music, label: "Audio", accept: "audio/*", desc: "MP3, WAV, M4A" },
  { type: "text", icon: Type, label: "Text", accept: "", desc: "Captions, scripts" },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ContentType>("image");
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90));
    }, 300);

    let result: AnalysisResult;
    try {
      switch (selectedType) {
        case "image":
          result = await analyzeImage(file!);
          break;
        case "video":
          result = await analyzeVideo(file!);
          break;
        case "audio":
          result = await analyzeAudio(file!);
          break;
        case "text":
          result = await analyzeText(textInput);
          break;
      }
      setProgress(100);
      clearInterval(interval);
      
      setTimeout(() => {
        navigate("/results", { state: { result } });
      }, 500);
    } catch {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  const canAnalyze = selectedType === "text" ? textInput.trim().length > 0 : file !== null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-gradient-cyber">MindGuardAI</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2">Analyze Content</h1>
        <p className="text-muted-foreground mb-8">Upload your content or paste text to check for policy violations.</p>

        {/* Content Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {contentTypes.map(ct => (
            <button
              key={ct.type}
              onClick={() => { setSelectedType(ct.type); setFile(null); setTextInput(""); }}
              className={`rounded-xl p-4 border transition-all text-left ${
                selectedType === ct.type
                  ? "border-primary/50 bg-primary/10 shadow-cyber"
                  : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              <ct.icon className={`w-5 h-5 mb-2 ${selectedType === ct.type ? "text-primary" : "text-muted-foreground"}`} />
              <div className="font-display font-semibold text-sm">{ct.label}</div>
              <div className="text-xs text-muted-foreground">{ct.desc}</div>
            </button>
          ))}
        </div>

        {/* Upload Area or Text Input */}
        <AnimatePresence mode="wait">
          {selectedType === "text" ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Paste your caption, script, or comment here..."
                className="w-full h-48 bg-card border border-border/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 focus:shadow-cyber transition-all font-body"
              />
              <p className="text-xs text-muted-foreground mt-2">{textInput.length} characters</p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-success/50 bg-success/5"
                  : "border-border/50 bg-card hover:border-primary/30"
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div>
                  <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-display font-semibold">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-destructive hover:underline mt-3"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-display font-semibold mb-1">Drag & drop your {selectedType} here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                  <input
                    type="file"
                    accept={contentTypes.find(c => c.type === selectedType)?.accept}
                    onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex cursor-pointer bg-secondary text-secondary-foreground font-display font-semibold px-6 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                  >
                    Browse Files
                  </label>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm font-medium">Analyzing content...</span>
              <span className="text-sm text-muted-foreground ml-auto">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-cyber rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Analyze Button */}
        <motion.button
          whileHover={{ scale: canAnalyze && !analyzing ? 1.01 : 1 }}
          whileTap={{ scale: canAnalyze && !analyzing ? 0.99 : 1 }}
          onClick={handleAnalyze}
          disabled={!canAnalyze || analyzing}
          className={`w-full mt-8 py-4 rounded-xl font-display font-bold text-lg transition-all ${
            canAnalyze && !analyzing
              ? "bg-gradient-cyber text-primary-foreground shadow-cyber hover:shadow-glow"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze Content"
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default UploadPage;
