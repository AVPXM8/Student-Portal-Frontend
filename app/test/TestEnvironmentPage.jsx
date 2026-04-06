"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Check, X, ChevronLeft, ChevronRight, 
  Clock, Save, Award, EyeOff, Flag, Menu, LogOut, LayoutGrid
} from 'lucide-react';
import api from "@/api";
import MathPreview from '@/components/MathPreview';
import useMathJax from '@/hooks/useMathJax';
import styles from "./TestEnvironmentPage.module.css";

// Dynamically import ReactPlayer to prevent hydration issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// Ordering for sections in palette
const SECTION_ORDER = {
  'MATHEMATICS': 1,
  'ANALYTICAL ABILITY & LOGICAL REASONING': 2,
  'COMPUTER AWARENESS': 3,
  'GENERAL ENGLISH': 4,
};

const EXAM_CONFIGS = {
  'NIMCET': {
    time: 120, // minutes
    marking: 'special',
    sections: ['MATHEMATICS', 'ANALYTICAL ABILITY & LOGICAL REASONING', 'COMPUTER AWARENESS', 'GENERAL ENGLISH']
  },
  'CUET PG': {
    time: 75,
    marking: 'standard',
    correct: 4,
    incorrect: -1
  }
};

const TestEnvironmentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const examName = searchParams.get('exam') || 'NIMCET';
  const subject  = searchParams.get('subject') || '';
  const topic    = searchParams.get('topic') || '';
  const page     = searchParams.get('page') || '1';
  const limit    = searchParams.get('limit') || '20';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Re-typeset MathJax whenever question changes
  useMathJax([currentIndex, questions[currentIndex]?.questionText]);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = { exam: examName, subject, topic, page, limit };
        const res = await api.get('/questions/public', { params });
        const data = res.data?.questions || [];
        setQuestions(data);
        
        const initialStatus = {};
        data.forEach((_, index) => {
          initialStatus[index] = 'unvisited';
        });
        setStatus(initialStatus);
        
        const config = EXAM_CONFIGS[examName.toUpperCase()] || EXAM_CONFIGS['NIMCET'];
        setTimeLeft(config.time * 60);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examName, subject, topic, page, limit]);

  // Timer logic
  useEffect(() => {
    if (!isTestStarted || isTestSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestStarted, isTestSubmitted, timeLeft]);

  const startTest = () => {
    setIsTestStarted(true);
    setStatus(prev => ({ ...prev, [0]: 'visited' }));
  };

  const submitTest = useCallback(() => {
    setIsTestSubmitted(true);
    setIsSidebarOpen(false);
  }, []);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    router.push('/questions');
  };

  const handleOptionSelect = (index, optionIndex) => {
    if (isTestSubmitted) return;
    setAnswers(prev => ({ ...prev, [index]: optionIndex }));
    setStatus(prev => ({ ...prev, [index]: 'answered' }));
  };

  const toggleMarkForReview = (index) => {
    if (isTestSubmitted) return;
    setStatus(prev => ({
      ...prev,
      [index]: prev[index] === 'marked' ? (answers[index] !== undefined ? 'answered' : 'visited') : 'marked'
    }));
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    if (status[index] === 'unvisited') {
      setStatus(prev => ({ ...prev, [index]: 'visited' }));
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const clearResponse = (index) => {
    if (isTestSubmitted) return;
    const newAnswers = { ...answers };
    delete newAnswers[index];
    setAnswers(newAnswers);
    setStatus(prev => ({ ...prev, [index]: 'visited' }));
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick status counts for mobile toolbar
  const statusCounts = useMemo(() => {
    const counts = { answered: 0, marked: 0, visited: 0, unvisited: 0 };
    Object.values(status).forEach(s => { counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [status]);

  // Score Calculation
  const results = useMemo(() => {
    if (!isTestSubmitted) return null;
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      const correctAns = q.correctOption;
      
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === correctAns) {
        correct++;
        if (examName.toUpperCase() === 'NIMCET') {
          const sub = (q.subject || '').toUpperCase();
          if (sub === 'MATHEMATICS') score += 12;
          else if (sub === 'COMPUTER') score += 6;
          else if (sub === 'ENGLISH') score += 4;
          else score += 6;
        } else {
          score += (EXAM_CONFIGS[examName.toUpperCase()]?.correct || 4);
        }
      } else {
        incorrect++;
        if (examName.toUpperCase() === 'NIMCET') {
          const sub = (q.subject || '').toUpperCase();
          if (sub === 'MATHEMATICS') score -= 3;
          else if (sub === 'COMPUTER') score -= 1.5;
          else if (sub === 'ENGLISH') score -= 1;
          else score -= 1.5;
        } else {
          score += (EXAM_CONFIGS[examName.toUpperCase()]?.incorrect || -1);
        }
      }
    });

    return { score, correct, incorrect, unattempted, total: questions.length };
  }, [isTestSubmitted, questions, answers, examName]);

  const maxMarkString = useMemo(() => {
     if (examName.toUpperCase() === 'NIMCET') return "1000";
     return questions.length * (EXAM_CONFIGS[examName.toUpperCase()]?.correct || 4);
  }, [examName, questions.length]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Preparing Exam Environment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>No Questions Found</h2>
        <p>We couldn't find questions for this criteria. Please try another topic.</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  // Question Groups by Subject (for palette)
  const groupedQuestions = questions.reduce((acc, q, idx) => {
    const sub = q.subject || 'General';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push({ ...q, originalIndex: idx });
    return acc;
  }, {});

  const sortedSubjects = Object.keys(groupedQuestions).sort((a, b) => {
    return (SECTION_ORDER[a.toUpperCase()] || 99) - (SECTION_ORDER[b.toUpperCase()] || 99);
  });

  return (
    <div className={styles.testWrapper}>
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className={styles.exitOverlay}>
          <div className={styles.exitModal}>
            <LogOut size={40} className={styles.exitIcon} />
            <h3>Exit Test?</h3>
            <p>Your progress will be lost. Are you sure you want to leave this test?</p>
            <div className={styles.exitActions}>
              <button className={styles.exitCancelBtn} onClick={() => setShowExitConfirm(false)}>
                Continue Test
              </button>
              <button className={styles.exitConfirmBtn} onClick={confirmExit}>
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.testHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.exitBtn} onClick={handleExit} aria-label="Exit test">
            <LogOut size={18} />
            <span className={styles.exitBtnText}>Exit</span>
          </button>
          <div className={styles.examInfo}>
            <h1>{examName.toUpperCase()} Mock Test</h1>
            <span>{topic || subject || 'Full Paper'}</span>
          </div>
        </div>
        
        {isTestStarted && !isTestSubmitted && (
          <div className={`${styles.timer} ${timeLeft < 300 ? styles.timerUrgent : ''}`}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}

        <div className={styles.headerRight}>
          {isTestStarted && !isTestSubmitted && (
            <>
              <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Question palette">
                <LayoutGrid size={20} />
              </button>
              <button className={styles.submitBtn} onClick={submitTest}>Submit</button>
            </>
          )}
        </div>
      </header>

      {!isTestStarted ? (
        <div className={styles.instructionsOverlay}>
          <div className={styles.instructionsContent}>
            <h2>Exam Instructions</h2>
            <div className={styles.statsRow}>
              <div className={styles.infoCard}>
                <span>Duration</span>
                <span>{EXAM_CONFIGS[examName.toUpperCase()]?.time || 120} Min</span>
              </div>
              <div className={styles.infoCard}>
                <span>Total Questions</span>
                <span>{questions.length}</span>
              </div>
              <div className={styles.infoCard}>
                <span>Max Marks</span>
                <span>{maxMarkString}</span>
              </div>
            </div>

            <div className={styles.markingBox}>
               <h3>General Instructions & Marking Scheme</h3>
               <ul>
                 <li>The clock will be set at the server. The countdown timer will help you manage your time.</li>
                 <li>When the timer reaches zero, the examination will end by itself.</li>
                 <li>The Question Palette shows the status of each question using different colors.</li>
                 {examName.toUpperCase() === 'NIMCET' ? (
                   <>
                    <li><strong>Mathematics:</strong> +12 / -3</li>
                    <li><strong>Analytical Ability:</strong> +6 / -1.5</li>
                    <li><strong>Computer Awareness:</strong> +6 / -1.5</li>
                    <li><strong>General English:</strong> +4 / -1</li>
                   </>
                 ) : (
                   <li><strong>Marking:</strong> +{EXAM_CONFIGS[examName.toUpperCase()]?.correct || 4} / {EXAM_CONFIGS[examName.toUpperCase()]?.incorrect || -1}</li>
                 )}
               </ul>
            </div>

            <div className={styles.instructionsBtnRow}>
              <button className={styles.startBtn} onClick={startTest}>Start Examination</button>
              <button className={styles.backBtn} onClick={() => router.back()}>← Go Back</button>
            </div>
          </div>
        </div>
      ) : isTestSubmitted ? (
        <div className={styles.resultsOverlay}>
          <div className={styles.resultsCard}>
            <Award className={styles.awardIcon} size={56} />
            <h2>Test Results</h2>
            <div className={styles.scoreCircle}>
              <span className={styles.finalScore}>{results.score}</span>
              <span className={styles.totalPossible}>/ {maxMarkString}</span>
            </div>
            
            <div className={styles.resultStatsGrid}>
              <div className={styles.resStat}>
                <span className={styles.statLabel}>Correct</span>
                <span className={`${styles.statValue} ${styles.correctText}`}>{results.correct}</span>
              </div>
              <div className={styles.resStat}>
                <span className={styles.statLabel}>Incorrect</span>
                <span className={`${styles.statValue} ${styles.incorrectText}`}>{results.incorrect}</span>
              </div>
              <div className={styles.resStat}>
                <span className={styles.statLabel}>Unattempted</span>
                <span className={styles.statValue}>{results.unattempted}</span>
              </div>
              <div className={styles.resStat}>
                <span className={styles.statLabel}>Accuracy</span>
                <span className={styles.statValue}>
                  {results.total > results.unattempted 
                    ? Math.round((results.correct / (results.total - results.unattempted)) * 100) 
                    : 0}%
                </span>
              </div>
            </div>

            <div className={styles.resultsActions}>
              <button className={styles.primaryBtn} onClick={() => window.location.reload()}>Re-attempt</button>
              <button className={styles.secondaryBtn} onClick={() => router.push('/questions')}>Go to Question Bank</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <main className={styles.mainArea}>
            {/* Question Viewer */}
            <section className={styles.questionSection}>
              <div className={styles.questionHeader}>
                <span className={styles.qNumber}>Q {currentIndex + 1} / {questions.length}</span>
                <div className={styles.qActions}>
                  <button 
                    className={`${styles.actionBtn} ${status[currentIndex] === 'marked' ? styles.actionActive : ''}`}
                    onClick={() => toggleMarkForReview(currentIndex)}
                  >
                    <Flag size={14} /> <span className={styles.actionBtnText}>Mark</span>
                  </button>
                </div>
              </div>

              <div className={styles.questionBody}>
                <div className={styles.questionText}>
                  <MathPreview latexString={questions[currentIndex]?.questionText} />
                </div>

                {questions[currentIndex]?.questionImage && (
                  <div className={styles.qImage}>
                    <img src={questions[currentIndex].questionImage} alt="Question" />
                  </div>
                )}

                <div className={styles.optionsGrid}>
                  {questions[currentIndex]?.options?.map((option, idx) => (
                    <button
                      key={idx}
                      className={`${styles.optionBtn} ${answers[currentIndex] === idx ? styles.selectedOption : ''}`}
                      onClick={() => handleOptionSelect(currentIndex, idx)}
                    >
                      <span className={styles.optionLabel}>{String.fromCharCode(65 + idx)}</span>
                      <div className={styles.optionContent}>
                        <MathPreview latexString={typeof option === 'string' ? option : option?.text || ''} />
                        {option?.imageURL && <img src={option.imageURL} alt="Option" className={styles.optionImage} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.footerNav}>
                <button 
                  className={styles.navBtn} 
                  onClick={prevQuestion} 
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={18} /> <span className={styles.navBtnLabel}>Prev</span>
                </button>
                
                <button className={styles.clearBtn} onClick={() => clearResponse(currentIndex)}>Clear</button>

                {currentIndex === questions.length - 1 ? (
                  <button className={styles.submitBtnInline} onClick={submitTest}>Submit</button>
                ) : (
                  <button className={styles.navBtnPrimary} onClick={nextQuestion}>
                    <span className={styles.navBtnLabel}>Next</span> <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </section>

            {/* Mobile backdrop */}
            {isSidebarOpen && (
              <div className={styles.sidebarBackdrop} onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar / Palette */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
               <div className={styles.sidebarHeader}>
                  <h3>Question Palette</h3>
                  <button className={styles.closeSidebar} onClick={() => setIsSidebarOpen(false)}>
                    <X size={20} />
                  </button>
               </div>

               <div className={styles.paletteScroll}>
                  {sortedSubjects.map(sub => (
                    <div key={sub} className={styles.paletteSection}>
                      <h4>{sub}</h4>
                      <div className={styles.paletteGrid}>
                        {groupedQuestions[sub].map(q => {
                          const idx = q.originalIndex;
                          const qStatus = status[idx];
                          return (
                            <button
                              key={idx}
                              onClick={() => goToQuestion(idx)}
                              className={`${styles.pCell} ${styles[`status-${qStatus}`]} ${currentIndex === idx ? styles.currentPCell : ''}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
               </div>

               <div className={styles.legend}>
                  <div className={styles.legendItem}><span className={`${styles.lBox} ${styles.status_answered}`}></span> Answered</div>
                  <div className={styles.legendItem}><span className={`${styles.lBox} ${styles.status_marked}`}></span> Marked</div>
                  <div className={styles.legendItem}><span className={`${styles.lBox} ${styles.status_visited}`}></span> Not Answered</div>
                  <div className={styles.legendItem}><span className={`${styles.lBox} ${styles.status_unvisited}`}></span> Not Visited</div>
               </div>
            </aside>
          </main>

          {/* Mobile bottom toolbar */}
          <div className={styles.mobileToolbar}>
            <div className={styles.toolbarStats}>
              <span className={styles.toolbarStatItem} style={{color:'#16A34A'}}>{statusCounts.answered} ✓</span>
              <span className={styles.toolbarStatItem} style={{color:'#7C3AED'}}>{statusCounts.marked} ⚑</span>
              <span className={styles.toolbarStatItem} style={{color:'#DC2626'}}>{statusCounts.visited} ○</span>
            </div>
            <button className={styles.toolbarPaletteBtn} onClick={() => setIsSidebarOpen(true)}>
              <LayoutGrid size={18} /> Palette
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestEnvironmentPage;
