import { useLocation, Link, Navigate } from "react-router-dom";
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info, FileText, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { AnalysisResult, RiskLevel } from "@/lib/analysisEngine";

const riskColors: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  "Safe": { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
  "Low Risk": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
  "Medium Risk": { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" },
  "High Risk": { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
};

const riskIcons: Record<RiskLevel, typeof CheckCircle> = {
  "Safe": CheckCircle,
  "Low Risk": Info,
  "Medium Risk": AlertTriangle,
  "High Risk": XCircle,
};

const severityColors = {
  low: "bg-primary/10 text-primary",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive/20 text-destructive",
};

const ResultsPage = () => {
  const location = useLocation();
  const result = location.state?.result as AnalysisResult | undefined;

  if (!result) return <Navigate to="/upload" replace />;

  const riskStyle = riskColors[result.riskLevel];
  const RiskIcon = riskIcons[result.riskLevel];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-gradient-cyber">MindGuardAI</span>
          </Link>
          <Link to="/upload">
            <button className="bg-gradient-cyber text-primary-foreground font-display font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm">
              New Analysis
            </button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to="/upload" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Upload
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2">Analysis Results</h1>
        {result.fileName && (
          <p className="text-muted-foreground mb-8">Results for: {result.fileName}</p>
        )}

        {/* Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-8 border ${riskStyle.border} ${riskStyle.bg} mb-8`}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <RiskIcon className={`w-10 h-10 ${riskStyle.text}`} />
              <div>
                <div className={`font-display text-2xl font-bold ${riskStyle.text}`}>
                  {result.riskLevel}
                </div>
                <div className="text-sm text-muted-foreground">Content type: {result.contentType}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-display text-5xl font-bold ${riskStyle.text}`}>
                {result.riskScore}%
              </div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
          </div>
          {/* Score bar */}
          <div className="mt-6 w-full h-3 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.riskScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                result.riskScore > 70 ? "bg-gradient-danger" :
                result.riskScore > 45 ? "bg-gradient-warning" :
                result.riskScore > 20 ? "bg-gradient-cyber" : "bg-gradient-safe"
              }`}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Detected Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h2 className="font-display text-lg font-semibold">Detected Issues</h2>
            </div>
            <div className="space-y-3">
              {result.detectedIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityColors[issue.severity]}`}>
                    {issue.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{issue.description}</p>
                    {issue.location && (
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Recommendations</h2>
            </div>
            <div className="space-y-3">
              {result.recommendations.length > 0 ? result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    rec.priority === "high" ? "bg-destructive/10 text-destructive" :
                    rec.priority === "medium" ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {rec.priority}
                  </span>
                  <p className="text-sm">{rec.action}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground p-3">No specific recommendations. Content appears safe.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Full Safety Report</h2>
          </div>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body bg-background/50 rounded-lg p-4 leading-relaxed overflow-x-auto">
            {result.report}
          </pre>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
