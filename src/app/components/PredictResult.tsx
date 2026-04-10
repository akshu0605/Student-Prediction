import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  AlertCircle, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb,
  Brain, Loader2, ChevronDown, ChevronUp, AlertOctagon, Info, Sparkles
} from "lucide-react";

interface PredictResultProps {
  onBack: () => void;
  result: {
    prediction: string;
    score: number;
    category: "Good" | "Average" | "At Risk";
    suggestions: string[];
  };
  inputData: any;
}

interface InsightData {
  summary: string;
  key_issues: string[];
  why_it_matters: string[];
  actionable_suggestions: string[];
}

export function PredictResult({ onBack, result, inputData }: PredictResultProps) {
  const [insightLoading, setInsightLoading] = useState(false);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [insightOpen, setInsightOpen] = useState(false);

  const isGood = result.category === "Good";
  const isAverage = result.category === "Average";

  const themeColors = isGood
    ? {
        bg: "from-emerald-900/20 via-black to-black",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
        dot: "bg-emerald-500",
        icon: <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />,
      }
    : isAverage
    ? {
        bg: "from-yellow-900/20 via-black to-black",
        border: "border-yellow-500/20",
        text: "text-yellow-400",
        glow: "shadow-yellow-500/20",
        dot: "bg-yellow-500",
        icon: <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />,
      }
    : {
        bg: "from-red-900/20 via-black to-black",
        border: "border-red-500/20",
        text: "text-red-400",
        glow: "shadow-red-500/20",
        dot: "bg-red-500",
        icon: <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />,
      };

  const handleGetInsight = async () => {
    if (insight) {
      setInsightOpen((prev) => !prev);
      return;
    }
    setInsightLoading(true);
    setInsightError(null);
    try {
      const response = await fetch("http://localhost:5010/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });
      if (!response.ok) throw new Error("Failed to fetch insight from server.");
      const data: InsightData = await response.json();
      setInsight(data);
      setInsightOpen(true);
    } catch (err: any) {
      setInsightError("Could not load AI Insight. Make sure the backend is running.");
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-6 overflow-hidden">
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${themeColors.bg}`} />

      <div className="relative w-full max-w-2xl">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
          <span>Predict Again</span>
        </motion.button>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-10 rounded-3xl bg-gray-950/80 border ${themeColors.border} backdrop-blur-xl shadow-2xl ${themeColors.glow}`}
          style={{
            boxShadow: `0 25px 60px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
        >
          {/* Result Header */}
          <div className="flex flex-col items-center text-center border-b border-gray-800/50 pb-8 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {themeColors.icon}
            </motion.div>
            <h2 className="text-xl text-gray-400 mb-2">Prediction Status</h2>
            <div className={`text-5xl font-bold ${themeColors.text} mb-4 tracking-tight`}>
              {result.prediction}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/80 border border-gray-800">
              <span className="text-sm text-gray-400">Confidence Score:</span>
              <span className="font-semibold">{result.score}%</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              Actionable Suggestions
            </h3>

            <div className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/60 hover:border-gray-700/60 flex gap-4 items-start transition-colors"
                >
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${themeColors.dot}`} />
                  <p className="text-gray-300 leading-relaxed text-sm">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insight Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={handleGetInsight}
              disabled={insightLoading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139,92,246,0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-600/30 hover:to-indigo-600/30 text-white font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {insightLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <span className="text-violet-300">Generating AI Insight...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-200">
                    {insight ? (insightOpen ? "Hide AI Insight" : "Show AI Insight") : "Get AI Insight"}
                  </span>
                  <Brain className="w-5 h-5 text-indigo-400 ml-auto" />
                  {insight && (insightOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
                </>
              )}
            </motion.button>

            {insightError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-sm text-red-400"
              >
                {insightError}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* AI Insight Panel */}
        <AnimatePresence>
          {insightOpen && insight && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-6 rounded-3xl bg-gray-950/90 border border-violet-500/20 backdrop-blur-xl overflow-hidden"
              style={{
                boxShadow: `0 20px 60px -10px rgba(139,92,246,0.15), inset 0 1px 0 rgba(139,92,246,0.08)`,
              }}
            >
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Performance Insight</h2>
                    <p className="text-xs text-gray-500">Personalized analysis based on your data</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed bg-violet-500/5 border border-violet-500/10 rounded-xl px-4 py-3">
                  {insight.summary}
                </p>
              </div>

              <div className="p-8 space-y-8">
                {/* Key Issues */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertOctagon className="w-4 h-4 text-orange-400" />
                    <h3 className="text-base font-semibold text-white">Key Issues Identified</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insight.key_issues.map((issue, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium"
                      >
                        {issue}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Why It Matters */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-blue-400" />
                    <h3 className="text-base font-semibold text-white">Why It Matters</h3>
                  </div>
                  <div className="space-y-3">
                    {insight.why_it_matters.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="flex gap-3 items-start p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"
                      >
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-400 shrink-0" />
                        <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actionable Suggestions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base font-semibold text-white">Actionable Suggestions</h3>
                  </div>
                  <div className="space-y-3">
                    {insight.actionable_suggestions.map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.07 }}
                        className="flex gap-3 items-start p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-emerald-400">{i + 1}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-600 pt-2 border-t border-gray-800/50">
                  This insight is generated based on your submitted data using rule-based academic analysis.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
