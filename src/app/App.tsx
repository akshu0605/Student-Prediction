import { motion } from "motion/react";
import { useState } from "react";
import { GraduationCap, TrendingUp, Award, Clock, BookOpen, Target, Calculator, FlaskConical, Landmark, Code, LogOut } from "lucide-react";
import { LineChart } from "./components/LineChart";
import { BarChart } from "./components/BarChart";
import { RadarChart } from "./components/RadarChart";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { PredictForm } from "./components/PredictForm";
import { PredictResult } from "./components/PredictResult";

// Mock data for charts
const performanceData = [
  { id: "jan", month: "Jan", score: 75 },
  { id: "feb", month: "Feb", score: 78 },
  { id: "mar", month: "Mar", score: 82 },
  { id: "apr", month: "Apr", score: 85 },
  { id: "may", month: "May", score: 88 },
  { id: "jun", month: "Jun", score: 96 },
];

const subjectData = [
  { id: "math", subject: "Math", score: 92 },
  { id: "physics", subject: "Physics", score: 88 },
  { id: "chemistry", subject: "Chemistry", score: 95 },
  { id: "biology", subject: "Biology", score: 90 },
  { id: "english", subject: "English", score: 85 },
];

const studentData = {
  name: "Sarah Johnson",
  id: "2024-CS-042",
  program: "Computer Science",
  semester: "6th Semester",
  cgpa: 3.8,
  attendance: 92,
  predictedScore: 96,
  totalCredits: 132,
};

const stats = [
  { label: "Success Rate", value: "95%", icon: Award },
  { label: "Students Tracked", value: "1000+", icon: GraduationCap },
  { label: "Avg Attendance", value: "88%", icon: Clock },
  { label: "Support Available", value: "24/7", icon: BookOpen },
];

const radarData = [
  { subject: "Mathematics", score: 92, icon: Calculator },
  { subject: "Science", score: 88, icon: FlaskConical },
  { subject: "English", score: 85, icon: BookOpen },
  { subject: "History", score: 90, icon: Landmark },
  { subject: "Computer Science", score: 95, icon: Code },
];

const averageGPA = radarData.reduce((acc, curr) => acc + curr.score, 0) / radarData.length;

export default function App() {
  const [view, setView] = useState<"signin" | "signup" | "dashboard" | "form" | "result">("signin");
  const [predictionData, setPredictionData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Authentication handlers
  if (view === "signin") {
    return (
      <SignIn
        onSwitchToSignUp={() => setView("signup")}
        onSignIn={() => setView("dashboard")}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUp
        onSwitchToSignIn={() => setView("signin")}
        onSignUp={() => setView("dashboard")}
      />
    );
  }

  if (view === "form") {
    return (
      <PredictForm 
        onBack={() => setView("dashboard")} 
        onPredict={(result) => {
          setPredictionData(result);
          setView("result");
        }} 
      />
    );
  }

  if (view === "result" && predictionData) {
    return (
      <PredictResult 
        onBack={() => setView("form")}
        result={predictionData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              STDPredict
            </span>
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={() => setView("signin")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-300 hover:text-white hover:border-gray-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </motion.button>
        </div>
      </div>

      {/* Hero Section with Spotlight Effect */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight Effect - More prominent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.25), transparent 70%)`,
          }}
        />

        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* STDPredict Logo and Name */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                STDPredict
              </h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Student Performance Intelligence
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Advanced analytics and machine learning to predict academic success.
              <br />
              Track performance, attendance, and get personalized insights.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex gap-4 justify-center mb-16"
            >
              <button 
                onClick={() => setView("form")}
                className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-medium transition-colors"
              >
                Get Started
              </button>
              <button className="px-8 py-3 border border-gray-700 hover:border-gray-500 rounded font-medium transition-colors">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Spotlight Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="relative mt-20"
          >
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9]">
              {/* Center spotlight beam */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              </div>

              {/* Score display in spotlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-8xl font-bold bg-gradient-to-b from-white to-purple-300 bg-clip-text text-transparent">
                  {studentData.predictedScore}
                </div>
                <div className="text-sm text-gray-500 text-center mt-2">Predicted Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Student Information Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Student Profile
            </h2>
            <p className="text-gray-500 text-lg">Real-time insights and performance metrics</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Student Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl border border-gray-800 bg-gray-950/50"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{studentData.name}</h3>
              <p className="text-gray-500 mb-4">{studentData.id}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Program</span>
                  <span className="text-gray-300">{studentData.program}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Semester</span>
                  <span className="text-gray-300">{studentData.semester}</span>
                </div>
              </div>
            </motion.div>

            {/* CGPA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-xl border border-gray-800 bg-gray-950/50"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {studentData.cgpa}
              </div>
              <p className="text-gray-500">Cumulative GPA</p>
              <p className="text-sm text-gray-600 mt-2">{studentData.totalCredits} Credits Completed</p>
            </motion.div>

            {/* Attendance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-xl border border-gray-800 bg-gray-950/50"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-5xl font-bold mb-2 text-emerald-400">
                {studentData.attendance}%
              </div>
              <p className="text-gray-500">Attendance Rate</p>
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${studentData.attendance}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Radar Chart - Premium Analytics Widget */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Subject Analysis
            </h2>
            <p className="text-gray-500 text-lg">Comprehensive performance across all subjects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl bg-black/30 backdrop-blur-xl border border-orange-500/10"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
              boxShadow: '0 8px 32px rgba(234, 88, 12, 0.15), inset 0 1px 0 rgba(251, 146, 60, 0.05)',
            }}
          >
            <div className="w-full h-[600px]">
              <RadarChart data={radarData} averageScore={averageGPA} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Charts Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Performance Analytics
            </h2>
            <p className="text-gray-500 text-lg">Track your progress over time</p>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-xl border border-gray-800 bg-gray-950/30"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold">Performance Trend</h3>
            </div>

            <div className="w-full h-[450px]">
              <LineChart data={performanceData} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Academic Success
            </h2>
            <p className="text-gray-500 text-lg">Proven results across the platform</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={`stat-${index}-${stat.label}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-800 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-4xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Unlock your potential
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              Get personalized insights and predictions to excel in your academic journey.
            </p>
            <button 
              onClick={() => setView("form")}
              className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-medium transition-colors"
            >
              Start Predicting Performance
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
