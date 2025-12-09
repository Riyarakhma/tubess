import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SplashScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  const loadingSteps = [
    { text: "Initializing System...", icon: "🚀", duration: 1000 },
    { text: "Connecting GPS Satellites...", icon: "🛰️", duration: 1200 },
    { text: "Loading UNDIP Campus Map...", icon: "🗺️", duration: 1400 },
    { text: "Syncing Bus Fleet Data...", icon: "🚌", duration: 1000 },
    { text: "Activating AI Assistant...", icon: "🤖", duration: 800 },
    { text: "System Ready!", icon: "✨", duration: 600 }
  ]

  useEffect(() => {
    let timer
    let progressTimer

    const runLoadingSequence = (stepIndex) => {
      if (stepIndex >= loadingSteps. length) {
        setShowWelcome(true)
        setTimeout(() => onComplete(), 2000)
        return
      }

      setCurrentStep(stepIndex)
      setProgress(0)

      // Simulate progress
      const step = loadingSteps[stepIndex]
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (step.duration / 50)
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + increment
        })
      }, 50)

      timer = setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => runLoadingSequence(stepIndex + 1), 200)
      }, step.duration)
    }

    runLoadingSequence(0)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[... Array(50)]. map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Bus Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            🚌
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="text-center text-white max-w-lg mx-auto">
          
          {! showWelcome ?  (
            <>
              {/* Main Logo Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 150 }}
                className="mb-8"
              >
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(255,255,255,0.3)",
                        "0 0 40px rgba(138,92,246,0. 5)",
                        "0 0 20px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="text-5xl"
                    >
                      🚌
                    </motion.span>
                  </motion.div>
                  
                  {/* Orbital Elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-lg">⚡</span>
                  </motion.div>
                  
                  <motion. div
                    className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-sm">🗺️</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Title Animation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-8"
              >
                <motion.h1 
                  className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(138,92,246,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Bus Dipyo Tracker
                </motion. h1>
                <motion.p 
                  className="text-xl text-white/90 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  UNDIP Smart Transportation
                </motion.p>
                <motion.p 
                  className="text-sm text-white/70 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Powered by AI & Real-time GPS 🛰️
                </motion.p>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="space-y-6"
              >
                {/* Current Step Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  >
                    <motion.span
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                      className="text-3xl"
                    >
                      {loadingSteps[currentStep]?.icon}
                    </motion.span>
                    <div className="text-left">
                      <div className="text-white font-medium text-lg">
                        {loadingSteps[currentStep]?.text}
                      </div>
                      <div className="text-white/60 text-sm">
                        Step {currentStep + 1} of {loadingSteps.length}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Enhanced Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* Shimmer Effect */}
                    <motion. div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Progress Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold drop-shadow-lg">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Feature Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="grid grid-cols-2 gap-4 mt-8"
                >
                  {[
                    { icon: "📍", text: "Live GPS Tracking", color: "bg-red-500/20" },
                    { icon: "🤖", text: "AI Assistant", color: "bg-purple-500/20" },
                    { icon: "🚏", text: "12 Campus Stops", color: "bg-green-500/20" },
                    { icon: "⚡", text: "Real-time Updates", color: "bg-yellow-500/20" }
                  ]. map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.7 + index * 0.1 }}
                      className={`${feature.color} backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:scale-105 transition-transform`}
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-xs text-white/90 font-medium">{feature.text}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </>
          ) : (
            // Welcome Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Welcome to Bus Dipyo!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-lg mb-6"
              >
                Your smart campus transportation companion is ready! 🚌✨
              </motion.p>
              
              <motion. div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-2 text-green-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-green-400 rounded-full"
                />
                <span className="font-medium">System Online & Ready!</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      {!showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-white/50 text-sm mb-3">Made with 💜 for UNDIP Students</p>
          <div className="flex items-center justify-center gap-4 text-white/60 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>GPS Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SplashScreen