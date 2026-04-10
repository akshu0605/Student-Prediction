import { motion } from "motion/react";
import { AlertCircle, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

interface PredictResultProps {
  onBack: () => void;
  result: {
    prediction: string;
    score: number;
    category: "Good" | "Average" | "At Risk";
    suggestions: string[];
  };
}

export function PredictResult({ onBack, result }: PredictResultProps) {
  // Determine colors based on category
  const isGood = result.category === "Good";
  const isAverage = result.category === "Average";
  
  const themeColors = isGood 
    ? {
        bg: "from-emerald-900/20 via-black to-black",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
        icon: <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
      }
    : isAverage
    ? {
        bg: "from-yellow-900/20 via-black to-black",
        border: "border-yellow-500/20",
        text: "text-yellow-400",
        glow: "shadow-yellow-500/20",
        icon: <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
      }
    : {
        bg: "from-red-900/20 via-black to-black",
        border: "border-red-500/20",
        text: "text-red-400",
        glow: "shadow-red-500/20",
        icon: <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      };

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-6 overflow-hidden">
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${themeColors.bg}`} />
      
      <div className="relative w-full max-w-2xl">
        <motion.button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Predict Again</span>
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-10 rounded-3xl bg-gray-950/80 border ${themeColors.border} backdrop-blur-xl shadow-2xl ${themeColors.glow}`}
        >
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
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800">
              <span className="text-sm text-gray-400">Confidence Score:</span>
              <span className="font-semibold">{result.score}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              Actionable Suggestions
            </h3>
            
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 flex gap-4 items-start"
                >
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                    isGood ? "bg-emerald-500" : isAverage ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <p className="text-gray-300 leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
