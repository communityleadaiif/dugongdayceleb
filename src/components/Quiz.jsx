import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { quizQuestions } from '../data/eventData'
import './Quiz.css'

const QUIZ_TIME = 15 * 60 // 15 minutes in seconds

export default function Quiz() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [state, setState] = useState('intro') // 'intro' | 'active' | 'review'
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME)

  // Timer
  useEffect(() => {
    if (state !== 'active') return
    if (timeLeft <= 0) {
      setState('review')
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [state, timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startQuiz = () => {
    setState('active')
    setCurrentQ(0)
    setAnswers({})
    setSelected(null)
    setShowResult(false)
    setTimeLeft(QUIZ_TIME)
  }

  const selectAnswer = (optionIdx) => {
    if (showResult) return
    setSelected(optionIdx)
  }

  const confirmAnswer = () => {
    if (selected === null) return
    setShowResult(true)
    setAnswers(prev => ({ ...prev, [currentQ]: selected }))
  }

  const nextQuestion = () => {
    setSelected(null)
    setShowResult(false)
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setState('review')
    }
  }

  const getScore = () => {
    let correct = 0
    Object.entries(answers).forEach(([qIdx, ansIdx]) => {
      if (quizQuestions[parseInt(qIdx)].correct === ansIdx) correct++
    })
    return correct
  }

  const getPercentage = () => Math.round((getScore() / quizQuestions.length) * 100)

  const q = quizQuestions[currentQ]
  const score = getScore()
  const percentage = getPercentage()

  return (
    <section id="quiz" className="section quiz-section" ref={sectionRef}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">🧠 Challenge Yourself</span>
          <h2 className="quiz__main-title" style={{ marginTop: '16px' }}>Marine Conservation Quiz</h2>
          <p style={{ marginTop: '8px', opacity: 0.6 }}>Test your knowledge — {quizQuestions.length} questions on marine conservation, Dugongs, and ocean ecology</p>
          <div className="section-divider" />
        </motion.div>

        <div className="quiz-container glass-card">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {state === 'intro' && (
              <motion.div
                key="intro"
                className="quiz-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="quiz-intro__icon">🐋</div>
                <h3>Ready to Dive In?</h3>
                <p>{quizQuestions.length} Multiple Choice Questions about marine conservation, Dugong ecology, and the legacy of Dr. R. S. Lal Mohan.</p>
                <div className="quiz-intro__details">
                  <div className="quiz-intro__detail">
                    <span>⏱️</span>
                    <span>15 Minutes</span>
                  </div>
                  <div className="quiz-intro__detail">
                    <span>📝</span>
                    <span>{quizQuestions.length} MCQs</span>
                  </div>
                  <div className="quiz-intro__detail">
                    <span>🏆</span>
                    <span>Instant Scoring</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={startQuiz}>
                  🚀 Start Quiz
                </button>
              </motion.div>
            )}

            {/* ACTIVE QUIZ */}
            {state === 'active' && q && (
              <motion.div
                key={`q-${currentQ}`}
                className="quiz-active"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="quiz-header">
                  <div className="quiz-progress">
                    <div className="quiz-progress__bar">
                      <div
                        className="quiz-progress__fill"
                        style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                    <span className="quiz-progress__text">
                      {currentQ + 1} / {quizQuestions.length}
                    </span>
                  </div>
                  <div className={`quiz-timer ${timeLeft < 60 ? 'quiz-timer--danger' : ''}`}>
                    ⏱️ {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question */}
                <div className="quiz-question">
                  <span className="quiz-question__number">Q{currentQ + 1}</span>
                  <h4 className="quiz-question__text">{q.question}</h4>
                </div>

                {/* Options */}
                <div className="quiz-options">
                  {q.options.map((opt, i) => {
                    let cls = 'quiz-option'
                    if (showResult) {
                      if (i === q.correct) cls += ' quiz-option--correct'
                      else if (i === selected && i !== q.correct) cls += ' quiz-option--wrong'
                    } else if (i === selected) {
                      cls += ' quiz-option--selected'
                    }

                    return (
                      <motion.button
                        key={i}
                        className={cls}
                        onClick={() => selectAnswer(i)}
                        whileHover={!showResult ? { scale: 1.015 } : {}}
                        whileTap={!showResult ? { scale: 0.985 } : {}}
                      >
                        <span className="quiz-option__letter">
                          {['A', 'B', 'C', 'D'][i]}
                        </span>
                        <span className="quiz-option__text">{opt}</span>
                        {showResult && i === q.correct && <span className="quiz-option__icon">✓</span>}
                        {showResult && i === selected && i !== q.correct && <span className="quiz-option__icon">✗</span>}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResult && (
                  <motion.div
                    className={`quiz-explanation ${selected === q.correct ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <strong>{selected === q.correct ? '✅ Correct!' : '❌ Not quite!'}</strong>
                    <p>{q.explanation}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="quiz-actions">
                  {!showResult ? (
                    <button
                      className="btn btn-primary"
                      onClick={confirmAnswer}
                      disabled={selected === null}
                    >
                      Confirm Answer
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={nextQuestion}>
                      {currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'View Results 🏆'}
                    </button>
                  )}
                </div>

                {/* Score tracker */}
                <div className="quiz-score-tracker">
                  Score: <span className="quiz-score-tracker__num">{getScore()}</span> / {Object.keys(answers).length} answered
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {state === 'review' && (
              <motion.div
                key="review"
                className="quiz-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="quiz-results__score-circle">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke={percentage >= 70 ? '#00f5d4' : percentage >= 40 ? '#ffd166' : '#ff6b6b'}
                      strokeWidth="8"
                      strokeDasharray={`${percentage * 3.39} 339.3`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                  </svg>
                  <div className="quiz-results__score-text">
                    <span className="quiz-results__percentage">{percentage}%</span>
                    <span className="quiz-results__fraction">{score}/{quizQuestions.length}</span>
                  </div>
                </div>

                <h3>
                  {percentage >= 80 ? '🌟 Outstanding!' :
                   percentage >= 60 ? '👏 Great Job!' :
                   percentage >= 40 ? '💪 Good Effort!' :
                   '🌊 Keep Learning!'}
                </h3>
                <p>You scored <strong>{score}</strong> out of <strong>{quizQuestions.length}</strong> questions correctly.</p>

                <div className="quiz-results__cert glass-card">
                  <span>📜</span>
                  <p>E-Certificate for all participants will be distributed within 7 days after results.</p>
                </div>

                <div className="quiz-results__actions">
                  <button className="btn btn-primary" onClick={() => document.getElementById('pledge')?.scrollIntoView({ behavior: 'smooth' })}>
                    🤝 Take the Conservation Pledge
                  </button>
                  <button className="btn btn-outline" onClick={startQuiz}>
                    🔄 Retry Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
