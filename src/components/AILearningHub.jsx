import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AILearningHub = () => {
  const [activePhase, setActivePhase] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])

  // Simplified learning phases untuk fix error dulu
  const learningPhases = [
    {
      id: 0,
      title: "🐍 Python Foundations",
      duration: "2-3 months",
      difficulty: "Beginner",
      color: "from-green-500 to-emerald-600",
      description: "Master Python programming for AI/ML",
      lessons: [
        {
          title: "Variables & Data Types",
          explanation: "Learn the basics of Python variables - foundation untuk semua AI/ML!"
        },
        {
          title: "Functions & Loops",
          explanation: "Functions dan loops yang akan jadi core dari ML algorithms!"
        }
      ]
    },
    {
      id: 1,
      title: "📊 Data Science Libraries",
      duration: "1-2 months", 
      difficulty: "Beginner",
      color: "from-blue-500 to-cyan-600",
      description: "NumPy, Pandas, Matplotlib essentials",
      lessons: [
        {
          title: "NumPy Basics",
          explanation: "NumPy untuk numerical computing - heart of all ML operations!"
        },
        {
          title: "Pandas for Data",
          explanation: "Data manipulation seperti Excel tapi 100x lebih powerful!"
        }
      ]
    },
    {
      id: 2,
      title: "🤖 Machine Learning",
      duration: "3-4 months",
      difficulty: "Intermediate", 
      color: "from-purple-500 to-indigo-600",
      description: "Your first ML models",
      lessons: [
        {
          title: "Linear Regression",
          explanation: "Prediksi Bus Dipyo delay menggunakan ML!"
        },
        {
          title: "Classification", 
          explanation: "Prediksi fakultas mahasiswa berdasarkan behavior!"
        }
      ]
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100'
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'Advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleLessonComplete = (phaseId, lessonIndex) => {
    const lessonId = `${phaseId}-${lessonIndex}`
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [... prev, lessonId]
    )
  }

  const getPhaseProgress = (phaseId) => {
    const phase = learningPhases[phaseId]
    const totalLessons = phase.lessons.length
    const completedCount = completedLessons.filter(id => id. startsWith(`${phaseId}-`)).length
    return (completedCount / totalLessons) * 100
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🤖 AI/ML Learning Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master Artificial Intelligence & Machine Learning step by step.  From Python basics to building real AI systems! 
        </p>
        
        {/* Overall Progress */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow-lg border max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-indigo-600 font-bold">
              {Math.round(completedLessons. length / learningPhases.reduce((acc, phase) => acc + phase.lessons. length, 0) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${completedLessons. length / learningPhases.reduce((acc, phase) => acc + phase.lessons. length, 0) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {learningPhases.map((phase, index) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase. id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activePhase === phase.id
                ? `bg-gradient-to-r ${phase.color} text-white shadow-lg`
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {phase.title.split(' ')[0]} {phase.title. split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Active Phase Content */}
      <div className="space-y-6">
        {learningPhases.map((phase) => 
          phase.id === activePhase && (
            <div key={phase.id}>
              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.color} text-white p-6 rounded-2xl shadow-xl mb-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{phase.title}</h2>
                    <p className="text-white/90">{phase.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(phase.difficulty)}`}>
                      {phase.difficulty}
                    </div>
                    <div className="text-white/80 text-sm mt-2">⏱️ {phase.duration}</div>
                  </div>
                </div>
                
                {/* Phase Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                    <span>Phase Progress</span>
                    <span>{Math.round(getPhaseProgress(phase.id))}% Complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getPhaseProgress(phase.id)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="space-y-4">
                {phase. lessons.map((lesson, lessonIndex) => {
                  const lessonId = `${phase.id}-${lessonIndex}`
                  const isCompleted = completedLessons. includes(lessonId)
                  
                  return (
                    <div
                      key={lessonIndex}
                      className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all ${
                        isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            isCompleted ? 'bg-green-500' : 'bg-indigo-500'
                          }`}>
                            {isCompleted ? '✓' : lessonIndex + 1}
                          </span>
                          {lesson.title}
                        </h3>
                        
                        <button
                          onClick={() => toggleLessonComplete(phase.id, lessonIndex)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-indigo-500 text-white hover:bg-indigo-600'
                          }`}
                        >
                          {isCompleted ? '✓ Completed' : 'Mark Complete'}
                        </button>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-gray-700">{lesson.explanation}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Phase Completion */}
              {getPhaseProgress(phase.id) === 100 && (
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl text-center shadow-xl mt-6">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">Phase Completed!</h3>
                  <p className="text-white/90">Congratulations! You've mastered {phase.title}.  Ready for the next challenge? </p>
                  
                  {activePhase < learningPhases.length - 1 && (
                    <button
                      onClick={() => setActivePhase(activePhase + 1)}
                      className="mt-4 bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                      Next Phase: {learningPhases[activePhase + 1].title} →
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Coming Soon Features */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🚀 Coming Soon</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "💻 Interactive Code Editor",
              description: "Run Python code directly in browser"
            },
            {
              title: "📊 Real Projects",
              description: "UNDIP Bus predictor, GPA analyzer, etc"
            },
            {
              title: "🎯 AI Certificates",
              description: "Earn certificates for completed phases"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl border">
              <h4 className="font-bold text-gray-800 mb-2">{feature. title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AILearningHub