import { Shield, Zap, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  { icon: Eye, title: "Image Analysis", desc: "CLIP-powered detection of weapons, violence, and harmful visuals" },
  { icon: Zap, title: "Video Analysis", desc: "Frame-by-frame extraction and analysis using OpenCV + CLIP" },
  { icon: FileText, title: "Audio Analysis", desc: "Whisper speech-to-text with NLP toxicity detection" },
  { icon: Shield, title: "Text Analysis", desc: "Detect hate speech, harassment, and violent language" },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-gradient-cyber">MindGuardAI</span>
          </div>
          <Link to="/upload">
            <button className="bg-gradient-cyber text-primary-foreground font-display font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Content Safety</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Protect Your Content
            <br />
            <span className="text-gradient-cyber">Before You Post</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            MindGuardAI analyzes images, videos, audio, and text to detect policy violations 
            and generate AI-powered safety recommendations — before you upload.
          </p>
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-cyber text-primary-foreground font-display font-bold text-lg px-10 py-4 rounded-xl shadow-cyber hover:shadow-glow transition-shadow"
            >
              Start Analyzing
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-gradient-card rounded-xl p-6 glow-border group hover:shadow-cyber transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="container mx-auto px-6 pb-32">
        <h2 className="font-display text-3xl font-bold text-center mb-4">System Architecture</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Multi-layered AI analysis pipeline for comprehensive content safety
        </p>
        <div className="max-w-3xl mx-auto">
          {[
            { step: "01", label: "Upload", desc: "Image, Video, Audio, or Text" },
            { step: "02", label: "AI Analysis Engine", desc: "CLIP · OpenCV · Whisper · NLP" },
            { step: "03", label: "Risk Evaluation", desc: "Aggregate scoring & classification" },
            { step: "04", label: "Safety Report", desc: "Recommendations & action items" },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-6 mb-4 last:mb-0"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
                {s.step}
              </div>
              <div className="flex-1 bg-card rounded-lg p-4 border border-border/50">
                <div className="font-display font-semibold">{s.label}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
              {i < 3 && <div className="w-0.5 h-4 bg-primary/30 absolute ml-6 mt-16" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-gradient-cyber">MindGuardAI</span>
          </div>
          AI-Powered Content Safety Analysis
        </div>
      </footer>
    </div>
  );
};

export default Home;
