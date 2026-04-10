import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, GraduationCap } from "lucide-react";

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSignUp: () => void;
}

export function SignUp({ onSwitchToSignIn, onSignUp }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center px-6 py-12 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating 3D orbs */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotateZ: [0, 3, -3, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotateZ: [0, -5, 5, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
        style={{
          transform: `perspective(1000px) rotateY(${mousePosition.x * 0.2}deg) rotateX(${-mousePosition.y * 0.2}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Card with 3D depth */}
        <div
          className="p-8 rounded-2xl bg-gray-950/50 backdrop-blur-xl border border-gray-800"
          style={{
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.05),
              0 20px 50px -12px rgba(0,0,0,0.5),
              0 0 80px rgba(16,185,129,0.05),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-7 h-7"
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
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                STDPredict
              </h1>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Create Account
            </h2>
            <p className="text-gray-500">Join to track your academic performance</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Student ID
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleChange("studentId", e.target.value)}
                  placeholder="2024-CS-042"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded bg-black/50 border-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400">
                I agree to the{" "}
                <button type="button" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <button
              onClick={onSwitchToSignIn}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Developer Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 p-4 rounded-xl bg-gray-950/30 backdrop-blur-sm border border-gray-800/50 text-center"
        >
          <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Developed by</p>
          <div className="flex items-center justify-center gap-6">
            <div>
              <p className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Akshit</p>
              <p className="text-xs text-gray-500">23BCE9259</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Yuvraj</p>
              <p className="text-xs text-gray-500">23BCE8817</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-4">
          © 2026 STDPredict. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
