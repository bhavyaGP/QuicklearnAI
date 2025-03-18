import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CircularTimer from '@/components/CircularTimer';
import { Card } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import socket from '../utils/socket';

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
    socket.on('update_scores', ({ scores }) => {
      setScores(scores);
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
    };
  }, [roomId, userInfo, location.state, studentName]);

  useEffect(() => {
    console.log("questionsList updated:", questionsList);
    console.log("questions updated:", questions);
  }, [questionsList, questions]);

  const handleSubmitAnswer = () => {
    if (!selectedOption || currentQuestion >= questionsList.length) return;
    
    socket.emit('submit_answer', {
      roomId,
      userId: userInfo._id,
      studentName: studentName,
      question: {
        ...questionsList[currentQuestion],
        totalQuestions: questionsList.length,
        answer: questionsList[currentQuestion].answer
      },
      selectedOption
    });
    
    setSelectedOption(null);
    setCurrentQuestion(prev => prev + 1);
  };

  // Teacher waiting screen
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto p-8">
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
            <h2 className="text-2xl font-semibold mb-4">Quiz in Progress</h2>
            <p className="text-gray-400 mb-6">Waiting for students to complete the quiz...</p>
            <div className="space-y-4">
              {Object.entries(scores).map(([studentId, score]) => (
                <div key={studentId} className="flex justify-between border-b border-white/10 pb-2">
                  <span>Student {studentId}</span>
                  <span>Score: {score}</span>
                </div>
              ))}
            </div>
          </Card>
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
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
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
                <button
                  key={idx}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 text-left rounded-lg border 
                    ${selectedOption === option 
                      ? 'border-[#00FF9D] bg-[#00FF9D]/10 text-[#00FF9D]' 
                      : 'border-white/10 hover:bg-white/5'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className="w-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] 
                hover:bg-[#00FF9D]/20 h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizSession; 