import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, BookOpen, Brain, Clock, Activity, Target, Award, Calendar, Zap, Loader2 } from "lucide-react";

interface PredictFormProps {
  onBack: () => void;
  onPredict: (data: any) => void;
}

export function PredictForm({ onBack, onPredict }: PredictFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    gpa: "",
    attendance: "",
    study_hours: "",
    assignment_rate: "",
    backlogs: "",
    participation: "Yes",
    sleep_hours: "",
    stress_level: "Medium",
    extracurricular: "Yes"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        gpa: parseFloat(formData.gpa),
        attendance: parseFloat(formData.attendance),
        study_hours: parseFloat(formData.study_hours),
        assignment_rate: parseFloat(formData.assignment_rate),
        backlogs: parseInt(formData.backlogs, 10),
        participation: formData.participation,
        sleep_hours: parseFloat(formData.sleep_hours),
        stress_level: formData.stress_level,
        extracurricular: formData.extracurricular
      };

      const response = await fetch("http://localhost:5010/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch prediction from server. Ensure backend is running.");
      }
      
      const result = await response.json();
      onPredict(result);
      
      
    } catch (err: any) {
      if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
        setError("Cannot connect to backend. Please ensure the Python server is running on port 5010.");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-6 py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar pb-10">
        <motion.button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 rounded-3xl bg-gray-950/50 border border-gray-800 backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-4">
              Student Performance Data
            </h1>
            <p className="text-gray-400">Fill in your academic and behavioral details for an accurate prediction.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Academic Inputs */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white/90 border-b border-gray-800 pb-2">Academic Info</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Award className="w-4 h-4" /> CGPA / Percentage
                  </label>
                  <input required type="number" step="0.01" name="gpa" value={formData.gpa} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 3.8 or 85" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Attendance (%)
                  </label>
                  <input required type="number" step="0.1" name="attendance" value={formData.attendance} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 88.5" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Assignment Completion Rate (%)
                  </label>
                  <input required type="number" step="0.1" name="assignment_rate" value={formData.assignment_rate} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 95" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Number of Backlogs
                  </label>
                  <input required type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 0" 
                  />
                </div>
              </div>

              {/* Behavioral Inputs */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white/90 border-b border-gray-800 pb-2">Behavioral Info</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Study Hours / Day
                  </label>
                  <input required type="number" step="0.5" name="study_hours" value={formData.study_hours} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 4.5" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Sleep Hours / Day
                  </label>
                  <input required type="number" step="0.5" name="sleep_hours" value={formData.sleep_hours} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                    placeholder="e.g. 7" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Stress Level
                  </label>
                  <select name="stress_level" value={formData.stress_level} onChange={handleChange} 
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Class Participation</label>
                    <select name="participation" value={formData.participation} onChange={handleChange} 
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Extra-Curricular</label>
                    <select name="extracurricular" value={formData.extracurricular} onChange={handleChange} 
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto min-w-[240px] py-4 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Reveal Prediction
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
