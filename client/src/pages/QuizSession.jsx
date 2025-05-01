import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CircularTimer from '@/components/CircularTimer';
import { Card } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import socket from '../utils/socket';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QuizSession = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [scores, setScores] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const isTeacher = userInfo?.role === 'teacher';
  const [showResults, setShowResults] = useState(false);
  const studentName = localStorage.getItem('quiz-student-name');

  // Gamification states
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [timeBonus, setTimeBonus] = useState(0);
  const [rank, setRank] = useState(null);
  const [showStreak, setShowStreak] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  // Achievement definitions
  const ACHIEVEMENTS = {
    FIRST_CORRECT: { id: 'first_correct', title: 'First Blood!', description: 'Got your first correct answer', points: 50 },
    STREAK_3: { id: 'streak_3', title: 'On Fire!', description: 'Got 3 correct answers in a row', points: 100 },
    STREAK_5: { id: 'streak_5', title: 'Unstoppable!', description: 'Got 5 correct answers in a row', points: 200 },
    SPEED_DEMON: { id: 'speed_demon', title: 'Speed Demon', description: 'Answered correctly with more than 20s left', points: 150 },
    PERFECT_SCORE: { id: 'perfect_score', title: 'Perfect!', description: 'Got all questions correct', points: 500 },
  };

  // Add new state for quiz completion
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  // Add this near the top of the component with other state declarations
  const [studentNames, setStudentNames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quiz-student-names')) || {};
    } catch {
      return {};
    }
  });

  // Function to trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Function to check and award achievements
  const checkAchievements = (isCorrect, timeLeft) => {
    const newAchievements = [...achievements];
    let pointsToAdd = 0;

    // First correct answer
    if (isCorrect && !achievements.includes(ACHIEVEMENTS.FIRST_CORRECT.id)) {
      newAchievements.push(ACHIEVEMENTS.FIRST_CORRECT.id);
      pointsToAdd += ACHIEVEMENTS.FIRST_CORRECT.points;
      setCurrentAchievement(ACHIEVEMENTS.FIRST_CORRECT);
      setShowAchievement(true);
    }

    // Streak achievements
    if (streak === 2 && !achievements.includes(ACHIEVEMENTS.STREAK_3.id)) {
      newAchievements.push(ACHIEVEMENTS.STREAK_3.id);
      pointsToAdd += ACHIEVEMENTS.STREAK_3.points;
      setCurrentAchievement(ACHIEVEMENTS.STREAK_3);
      setShowAchievement(true);
    }

    if (streak === 4 && !achievements.includes(ACHIEVEMENTS.STREAK_5.id)) {
      newAchievements.push(ACHIEVEMENTS.STREAK_5.id);
      pointsToAdd += ACHIEVEMENTS.STREAK_5.points;
      setCurrentAchievement(ACHIEVEMENTS.STREAK_5);
      setShowAchievement(true);
    }

    // Speed demon achievement
    if (isCorrect && timeLeft > 20 && !achievements.includes(ACHIEVEMENTS.SPEED_DEMON.id)) {
      newAchievements.push(ACHIEVEMENTS.SPEED_DEMON.id);
      pointsToAdd += ACHIEVEMENTS.SPEED_DEMON.points;
      setCurrentAchievement(ACHIEVEMENTS.SPEED_DEMON);
      setShowAchievement(true);
    }

    // Perfect score achievement
    if (currentQuestion === questionsList.length - 1 && 
        isCorrect && 
        !achievements.includes(ACHIEVEMENTS.PERFECT_SCORE.id) &&
        scores[userInfo._id] === questionsList.length) {
      newAchievements.push(ACHIEVEMENTS.PERFECT_SCORE.id);
      pointsToAdd += ACHIEVEMENTS.PERFECT_SCORE.points;
      setCurrentAchievement(ACHIEVEMENTS.PERFECT_SCORE);
      setShowAchievement(true);
    }

    if (pointsToAdd > 0) {
      setPoints(prev => prev + pointsToAdd);
      triggerConfetti();
    }

    setAchievements(newAchievements);
  };

  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => {
        setShowAchievement(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  useEffect(() => {
    if (showStreak) {
      const timer = setTimeout(() => {
        setShowStreak(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showStreak]);

  useEffect(() => {
    console.log("userInfo", userInfo);
    console.log("roomId", roomId);
    if (!userInfo || !roomId) return;

    // Add connection status check
    if (!socket.connected) {
      console.log('Socket connecting...');
      socket.connect();
    }

    // Add connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for quiz completion (teacher only)
    socket.on('quiz_completed', (data) => {
      console.log('Quiz completed event received:', data);
      setQuizCompleted(true);
      setResultsData(data);
    });

    // Listen for waiting state (students only)
    socket.on('waiting_for_results', () => {
      console.log('Waiting for results event received');
      setWaitingForResults(true);
    });

    // Listen for published results
    socket.on('results_published', (data) => {
      console.log('Results published event received:', data);
      navigate('/quiz-results', { state: data });
    });

    // If questions exist in location state, set them
    if (location.state?.questions) {
      console.log("Received questions from state:", location.state.questions);
      
      // Format 1: {questions: {easy/medium/hard: [...questions]}}
      if (location.state.questions.easy || location.state.questions.medium || location.state.questions.hard) {
        const difficulty = location.state.questions.easy ? 'easy' 
                        : location.state.questions.medium ? 'medium'
                        : 'hard';
        setQuestionsList(location.state.questions[difficulty]);
        setQuestions(location.state.questions);
      } 
      // Format 2: {questions: {questions: {easy/medium/hard: [...questions]}}}
      else if (location.state.questions.questions?.easy || 
               location.state.questions.questions?.medium || 
               location.state.questions.questions?.hard) {
        const difficulty = location.state.questions.questions.easy ? 'easy'
                        : location.state.questions.questions.medium ? 'medium'
                        : 'hard';
        setQuestionsList(location.state.questions.questions[difficulty]);
        setQuestions(location.state.questions.questions);
      }
      // Format 3: Direct array of questions
      else if (Array.isArray(location.state.questions)) {
        setQuestionsList(location.state.questions);
        setQuestions({ medium: location.state.questions }); // Default to medium if no difficulty specified
      }
    }

    // Listen for score updates
    socket.on('update_scores', ({ scores, allCompleted, studentNames }) => {
      console.log('Score update received:', scores, 'All completed:', allCompleted);
      console.log('Student names:', studentNames);
      setScores(scores);
      if (studentNames) {
        localStorage.setItem('quiz-student-names', JSON.stringify(studentNames));
      }
      if (allCompleted) {
        setQuizCompleted(true);
      }
    });

    // Listen for final scores
    socket.on('final_scores', ({ scores, studentNames }) => {
      if (isTeacher) {
        setScores(scores);
        setShowResults(true);
        // Redirect to QuizResults page with scores and studentNames
        navigate('/quiz-results', { 
          state: { 
            scores,
            studentNames
          } 
        });
      } else {
        navigate('/student-results', { 
          state: { 
            score: scores[userInfo._id],
            total: questionsList.length 
          }
        });
      }
    });

    // Add student name to any socket emissions
    socket.emit('join_session', {
      roomId,
      userId: userInfo._id,
      role: userInfo.role,
      studentName: studentName
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('quiz_questions');
      socket.off('update_scores');
      socket.off('final_scores');
      socket.off('quiz_completed');
      socket.off('waiting_for_results');
      socket.off('results_published');
    };
  }, [roomId, userInfo, location.state, studentName, navigate]);

  useEffect(() => {
    console.log("questionsList updated:", questionsList);
    console.log("questions updated:", questions);
  }, [questionsList, questions]);

  const handleSubmitAnswer = () => {
    if (!selectedOption || currentQuestion >= questionsList.length) return;
    
    const isCorrect = selectedOption === questionsList[currentQuestion].answer;
    const timeLeft = document.querySelector('.timer-value')?.textContent || 0;
    
    // Calculate time bonus
    const currentTimeBonus = Math.floor(timeLeft * 10); // 10 points per second left
    setTimeBonus(prev => prev + currentTimeBonus);

    // Update streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setShowStreak(true);
      setPoints(prev => prev + 100 + currentTimeBonus); // Base points + time bonus
    } else {
      setStreak(0);
    }

    // Check for achievements
    checkAchievements(isCorrect, timeLeft);
    
    socket.emit('submit_answer', {
      roomId,
      userId: userInfo._id,
      studentName: studentName,
      question: {
        ...questionsList[currentQuestion],
        totalQuestions: questionsList.length,
        answer: questionsList[currentQuestion].answer
      },
      selectedOption,
      points: points + (isCorrect ? 100 + currentTimeBonus : 0)
    });
    
    setSelectedOption(null);
    setCurrentQuestion(prev => prev + 1);
  };

  const handlePublishResults = () => {
    console.log('Publishing results for room:', roomId);
    socket.emit('publish_results', {
      roomId,
      teacherId: userInfo._id
    });
  };

  const handleEndQuiz = () => {
    console.log('Ending quiz for room:', roomId);
    socket.emit('end_quiz', {
      roomId,
      teacherId: userInfo._id
    });
  };

  // Teacher waiting screen with publish button
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto p-8">
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {quizCompleted ? '🎉 Quiz Completed!' : '⌛ Quiz in Progress'}
                </h2>
                <p className="text-gray-400">
                  {quizCompleted 
                    ? 'All students have completed the quiz. You can now declare the results.'
                    : 'Waiting for all students to complete the quiz...'}
                </p>
              </div>
              
              {quizCompleted && (
                <div className="flex items-center gap-2 text-[#00FF9D]">
                  <div className="w-3 h-3 bg-[#00FF9D] rounded-full animate-pulse"></div>
                  Ready to Declare
                </div>
              )}
            </div>

            <div className="bg-black/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Student Progress</h3>
              <div className="space-y-4">
                {Object.entries(scores).map(([studentId, score]) => {
                  // Get the student name from the studentName object
                  const currentStudentName = studentNames[studentId] || `Student ${studentId.slice(-4)}`;
                  
                  return (
                    <div key={studentId} className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          quizCompleted ? 'bg-[#00FF9D]' : 'bg-yellow-400 animate-pulse'
                        }`}></div>
                        <span>{currentStudentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {quizCompleted ? `${score}/${questionsList?.length || 0}` : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!quizCompleted && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEndQuiz}
                className="w-full bg-red-500 text-white font-semibold
                  h-12 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                  hover:bg-red-600 mb-4"
              >
                <span>End Quiz Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}

            {quizCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-[#00FF9D]/10 rounded-lg p-4">
                  <h3 className="text-[#00FF9D] font-semibold mb-2">Ready to Declare Results</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Quiz results will be generated as CSV</li>
                    <li>• Leaderboard will be published to all students</li>
                    <li>• Top performers will receive badges (🥇, 🥈, 🥉)</li>
                    <li>• All students will see their rankings</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePublishResults}
                  className="w-full bg-[#00FF9D] text-black font-semibold
                    h-12 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                    hover:bg-[#00FF9D]/90"
                >
                  <span>Declare Results Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // Student waiting screen
  if (waitingForResults) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Quiz Completed!</h2>
            <p className="text-xl text-gray-400">Results are being finalized by your teacher...</p>
            
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#00FF9D]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#00FF9D] border-t-transparent animate-spin"></div>
            </div>

            <motion.div
              className="space-y-4 text-gray-400 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 justify-center">
                <span className="text-[#00FF9D]">✓</span>
                <p>Your answers have been securely submitted</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-yellow-400">⌛</span>
                <p>Waiting for teacher to declare results</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-orange-400">🏆</span>
                <p>Rankings and achievements coming soon!</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show loading state if no questions
  if (!questionsList || questionsList.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF9D]"></div>
      </div>
    );
  }

  // Show completion state
  if (currentQuestion >= questionsList.length) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
          <p className="text-gray-400">Waiting for final results...</p>
        </div>
      </div>
    );
  }

  // Get the current question from the questionsList array
  const currentQuiz = questionsList[currentQuestion];
  console.log("questionsList", questionsList);
  console.log("currentQuiz", currentQuiz);
  
  // Add safety check for currentQuiz and its properties
  if (!currentQuiz?.question || !Array.isArray(currentQuiz?.options)) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="text-red-500">Error: Invalid question data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto p-8">
        {/* Achievement popup */}
        <AnimatePresence>
          {showAchievement && currentAchievement && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#00FF9D]/20 border border-[#00FF9D] p-4 rounded-lg shadow-lg z-50"
            >
              <h3 className="text-[#00FF9D] font-bold">{currentAchievement.title}</h3>
              <p className="text-sm text-white/80">{currentAchievement.description}</p>
              <p className="text-[#00FF9D] font-bold">+{currentAchievement.points} points!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak indicator */}
        <AnimatePresence>
          {showStreak && streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed top-24 right-8 bg-[#00FF9D]/20 border border-[#00FF9D] p-4 rounded-lg"
            >
              <p className="text-[#00FF9D] font-bold">🔥 {streak}x Streak!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
          {/* Stats bar */}
          <div className="flex justify-between items-center mb-6 p-4 bg-black/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Points</p>
              <p className="text-2xl font-bold text-[#00FF9D]">{points}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Time Bonus</p>
              <p className="text-2xl font-bold text-yellow-400">+{timeBonus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Streak</p>
              <p className="text-2xl font-bold text-orange-400">{streak}x</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Question {currentQuestion + 1} of {questionsList.length}
              </h2>
              <CircularTimer 
                key={currentQuestion}
                duration={30} 
                onComplete={handleSubmitAnswer}
              />
            </div>
            
            <p className="text-lg">{currentQuiz.question}</p>
            
            <div className="space-y-3">
              {currentQuiz.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-300
                    ${selectedOption === option 
                      ? 'border-[#00FF9D] bg-[#00FF9D]/10 text-[#00FF9D]' 
                      : 'border-white/10 hover:bg-white/5'}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className="w-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] 
                hover:bg-[#00FF9D]/20 h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              Submit Answer
            </motion.button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizSession; 