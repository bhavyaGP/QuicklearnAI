import React, { useState, useEffect } from 'react';
import { Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuizDisplay from '../components/QuizDisplay';
import { quizService } from '../services/api';
import FlashCard from '../components/FlashCard';
import { useToast } from "@/components/ui/use-toast";
import { statisticsService } from '../services/api';
import { Link } from 'react-router-dom'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import socket from '../utils/socket';
import { motion } from "framer-motion";
import NameInputModal from '../components/NameInputDialog';

const QuizGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  
  // Form state
  const [youtubeLink, setYoutubeLink] = useState('');
  const [questionCount, setQuestionCount] = useState(5);

  // Add new state for model dropdown
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  // Add state for recent quizzes
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loadingRecentQuizzes, setLoadingRecentQuizzes] = useState(false);

  // Add navigate hook
  const navigate = useNavigate();

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty.toLowerCase());
    setIsDropdownOpen(false);
  };

  const validateYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!youtubeLink) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYoutubeUrl(youtubeLink)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    if (!selectedDifficulty) {
      setError('Please select a difficulty level');
      return;
    }

    try {
      setLoading(true);
      const response = await quizService.generateQuiz(
        youtubeLink,
        questionCount,
        selectedDifficulty,
        selectedModel
      );
      
      console.log('Quiz Service Response:', response);
      
      if (!response || !response.quiz || !response.summary) {
        throw new Error('Invalid quiz data format');
      }
      
      setQuizData({
        quiz: response.quiz,
        userAnswers: new Array(response.quiz.length).fill(null)
      });
      setSummaryData(response.summary);
      setShowSummary(true);
      
      console.log('Setting Quiz Title:', response.title);
      setQuizTitle(response.title || 'Unknown Topic');
      
    } catch (error) {
      setError(error.message || 'Failed to generate quiz. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setShowSummary(false);
    setShowQuiz(true);
  };

  const handleQuizFinish = async (score, timeSpent, userAnswers) => {
    setQuizStats({
      score,
      totalQuestions: quizData.quiz.length,
      timeSpent,
      questions: quizData.quiz,
      userAnswers: userAnswers
    });

    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      // Create statistics data with the correct user ID
      const statisticsData = {
        pasturl: youtubeLink,
        score: score,
        totalscore: quizData.quiz.length,
        topic: quizTitle || 'Unknown Topic',
      };
      console.log('Sending statistics data:', statisticsData);

      const response = await statisticsService.storeStatistics(statisticsData);
      console.log('Statistics stored successfully:', response);
      
      toast({
        title: "Success",
        description: "Quiz results saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to store quiz statistics:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
    }

    setShowStats(true);
    setShowQuiz(false);
  };

  // Add this function to handle summary regeneration
  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const response = await quizService.generateQuiz(
        youtubeLink,
        questionCount,
        selectedDifficulty,
        selectedModel
      );
      
      if (!response || !response.summary) {
        throw new Error('Invalid summary data format');
      }
      
      setSummaryData(response.summary);
      
    } catch (error) {
      setError(error.message || 'Failed to regenerate summary. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMindMapNavigation = () => {
    if (!youtubeLink) {
        alert("Please enter a YouTube URL first!");
        return;
    }
    
    // Navigate with the encoded URL
    const encodedUrl = encodeURIComponent(youtubeLink);
    window.location.href = `/mindmap?url=${encodedUrl}`; // Using direct navigation
  };

  // Add model selection handler
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
  };

  // Fetch recent quizzes on mount
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      setLoadingRecentQuizzes(true);
      try {
        const response = await statisticsService.getStatistics();
        // Process statistics to show unique recent quizzes
        const uniqueQuizzes = [];
        const seenUrls = new Set();
        
        // Sort by creation date (most recent first) and filter unique URLs
        response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .forEach(stat => {
            if (!seenUrls.has(stat.pasturl) && uniqueQuizzes.length < 5) {
              seenUrls.add(stat.pasturl);
              uniqueQuizzes.push({
                url: stat.pasturl,
                topic: stat.topic,
                score: stat.score,
                totalScore: stat.totalscore,
                date: stat.createdAt
              });
            }
          });
        
        setRecentQuizzes(uniqueQuizzes);
      } catch (error) {
        console.error('Error fetching recent quizzes:', error);
      } finally {
        setLoadingRecentQuizzes(false);
      }
    };

    fetchRecentQuizzes();
  }, []);

  // Show quiz if active
  if (showQuiz && quizData) {
    return <QuizDisplay 
      quizData={quizData}
      onFinish={handleQuizFinish} 
    />;
  }

  // Show summary if available
  if (showSummary && summaryData) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-6xl mx-auto p-8">
          {/* Back Button at Top */}
          <div className="mb-8">
            <motion.button
              onClick={() => setShowSummary(false)}
              className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl hover:border-[#00FF9D]/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#00FF9D] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Back to Generator</span>
            </motion.button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Video <span className="text-[#00FF9D]">Summary</span>
            </h1>
            <p className="text-gray-400">
              Here's what we learned from the video
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {Object.entries(summaryData).map(([key, value]) => (
              <FlashCard 
                key={key}
                title={key}
                content={value}
              />
            ))}
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Start Quiz Card */}
            <motion.div
              className="group relative bg-gradient-to-br from-[#00FF9D]/20 via-[#00FF9D]/10 to-transparent border border-[#00FF9D]/30 rounded-2xl p-6 cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQuiz}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF9D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00FF9D]/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#00FF9D]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00FF9D] transition-colors duration-300">Start Quiz</h3>
                <p className="text-sm text-gray-400">Begin your learning assessment</p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#00FF9D]/10 rounded-full blur-xl group-hover:bg-[#00FF9D]/20 transition-colors duration-500"></div>
            </motion.div>

            {/* Mind Map Card */}
            <motion.div
              className="group relative bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-6 cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMindMapNavigation}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">Mind Map</h3>
                <p className="text-sm text-gray-400">Visualize key concepts</p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
            </motion.div>

            {/* Regenerate Summary Card */}
            <motion.div
              className="group relative bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/30 rounded-2xl p-6 cursor-pointer overflow-hidden"
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -5 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleGenerateSummary}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-400 border-t-transparent"></div>
                  ) : (
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                  {loading ? 'Regenerating...' : 'Regenerate'}
                </h3>
                <p className="text-sm text-gray-400">
                  {loading ? 'Creating new summary' : 'Get a fresh summary'}
                </p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors duration-500"></div>
            </motion.div>

            {/* Solve Doubt Card */}
            <motion.div
              className="group relative bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-6 cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/youtube-chat', { 
                state: { 
                  youtubeUrl: youtubeLink,
                  model: selectedModel,
                  title: quizTitle
                } 
              })}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Solve Doubt</h3>
                <p className="text-sm text-gray-400">Ask AI about the video</p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
            </motion.div>
          </div>

          {/* Quick Stats or Additional Info */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Ready to test your knowledge?</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse"></span>
                <span>Summary generated successfully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show stats if available
  if (showStats && quizStats) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto p-8">
          {/* Back Button at Top */}
          <div className="mb-8">
            <motion.button
              onClick={() => {
                setShowStats(false);
                setQuizData(null);
                setYoutubeLink('');
                setSelectedDifficulty('');
                setQuestionCount(5);
              }}
              className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl hover:border-[#00FF9D]/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#00FF9D] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Back to Generator</span>
            </motion.button>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold mb-4">
              YOUR SCORE: <span className="text-[#00FF9D]">{quizStats.score}/{quizStats.totalQuestions}</span>
            </h2>
            <p className="text-2xl text-gray-400">
              Time utilised: {quizStats.timeSpent}
            </p>
          </div>  

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-4 text-xl font-bold">
              <div>Questions</div>
              <div>Your Answer</div>
              <div>Correct Answer</div>
            </div>
            
            {quizStats.questions.map((question, index) => (
              <div 
                key={index}
                className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${
                  quizStats.userAnswers[index] === question.answer 
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}
              >
                <div>{question.question}</div>
                <div>{quizStats.userAnswers[index] || 'Not answered'}</div>
                <div>{question.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {loading && <LoadingAnimation />}
      <div className="flex flex-col items-center px-4 py-4">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white">
            Quick<span className="text-[#00FF9D]">Learn</span>AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            AI Powered YouTube Quiz Generator
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Card */}
          <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#00FF9D]">
              Create Your Quiz
            </h2>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* YouTube Link Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  YouTube Video Link
                </label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 transition-all duration-300"
                  />
                  <Youtube className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                </div>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Number of Questions
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 transition-all duration-300"
                />
              </div>

              {/* Difficulty Level Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-sm text-gray-400">
                  Difficulty Level
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-left text-white hover:border-[#00FF9D]/50 hover:ring-2 hover:ring-[#00FF9D]/20 transition-all duration-300"
                >
                  {selectedDifficulty || 'Select difficulty'}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-black/90 border border-white/10 rounded-xl overflow-hidden z-10">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => handleDifficultySelect(difficulty)}
                        className="w-full px-4 py-3 text-left hover:bg-[#00FF9D]/10 hover:text-[#00FF9D] transition-all duration-300"
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                )}
              </div>


              {/* Model Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-sm text-gray-400">
                  Select Model
              </label>
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-left text-white hover:border-[#00FF9D]/50 hover:ring-2 hover:ring-[#00FF9D]/20 transition-all duration-300"
              >
                {selectedModel || 'Select model'}
              </button>

              {isModelDropdownOpen && (
                <div className="absolute w-full mt-1 bg-black/90 border border-white/10 rounded-xl overflow-hidden z-10">
                  {[
                    'chatgroq',
                    'gemini'
                  ].map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => handleModelSelect(model)}
                      className="w-full px-4 py-3 text-left hover:bg-[#00FF9D]/10 hover:text-[#00FF9D] transition-all duration-300"
                    >
                      {model}
                      </button>
                  ))}
                </div>
                )}
        </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium py-3 px-4 rounded-xl hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF9D] mr-2"></div>
                    Generating Quiz...
                  </div>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </form>
          </div>

          {/* Join Quiz Section */}
          <div className="w-full">
            <QuizJoinSection />
          </div>
        </div>

        {/* Recent Quizzes Section */}
        <RecentQuizzesSection 
          recentQuizzes={recentQuizzes} 
          loadingRecentQuizzes={loadingRecentQuizzes}
          onSelectQuiz={(url) => setYoutubeLink(url)}
        />
      </div>
    </div>
  );
};

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-[#00FF9D]/30 border-t-[#00FF9D] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-2">
            Creating Your <span className="text-[#00FF9D]">Quiz</span>
          </h2>
          <p className="text-gray-400">
            Analyzing video content and generating questions...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const QuizJoinSection = () => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('user-info'));

  useEffect(() => {
    // Check if socket is connected
    if (!socket.connected) {
      try {
        socket.connect();
      } catch (error) {
        console.error('Socket connection failed:', error);
        setError('Connection to server failed. Please try again.');
        setIsVerifying(false);
      }
    }

    // Listen for room verification response
    socket.on('room_verified', ({ exists }) => {
      setIsVerifying(false);
      if (exists) {
        setShowNameDialog(true); // Show name dialog instead of navigating directly
      } else {
        setError('Invalid quiz code or quiz has expired');
      }
    });

    // Add connection error handler
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Connection to server failed. Please try again.');
      setIsVerifying(false);
    });

    socket.on('error', (error) => {
      setIsVerifying(false);
      setError(error.message || 'Failed to join quiz');
    });

    return () => {
      socket.off('room_verified');
      socket.off('connect_error');
      socket.off('error');
    };
  }, [joinCode, navigate]);

  const handleJoinQuiz = async () => {
    try {
      if (!joinCode.trim()) {
        setError('Please enter a quiz code');
        return;
      }

      if (!userInfo?._id) {
        setError('Please login to join the quiz');
        return;
      }

      // Check socket connection before proceeding
      if (!socket.connected) {
        setError('Not connected to server. Please refresh the page.');
        return;
      }

      setError('');
      setIsVerifying(true);

      // Emit verify_room event
      socket.emit('verify_room', {
        roomId: joinCode,
        userId: userInfo._id,
        role: 'student'
      });

    } catch (error) {
      setIsVerifying(false);
      setError('Failed to join quiz');
      console.error('Quiz join error:', error);
    }
  };

  const handleNameSubmit = (studentName) => {
    // Store name in localStorage for persistence during quiz
    localStorage.setItem('quiz-student-name', studentName);
    // Navigate to lobby with the name
    navigate(`/student-lobby/${joinCode}`);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
      <h2 className="text-2xl font-semibold mb-6">Join a Quiz</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Quiz Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="bg-black/20 border-white/10"
          disabled={isVerifying}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button 
          onClick={handleJoinQuiz}
          className="w-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D]"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF9D] mr-2"></div>
              Verifying...
            </div>
          ) : (
            'Join Quiz'
          )}
        </Button>
      </div>

      <NameInputModal 
        open={showNameDialog}
        onSubmit={handleNameSubmit}
        onClose={() => setShowNameDialog(false)}
      />
    </Card>
  );
};

const RecentQuizzesSection = ({ recentQuizzes, loadingRecentQuizzes, onSelectQuiz }) => {
  if (loadingRecentQuizzes || recentQuizzes.length === 0) {
    return null; // Don't show section if loading or no quizzes
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getScoreColor = (score, totalScore) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-6xl mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Recent <span className="text-[#00FF9D]">Quizzes</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentQuizzes.map((quiz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#00FF9D]/50 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectQuiz(quiz.url)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Quiz Topic */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00FF9D] transition-colors duration-300 line-clamp-2">
                  {quiz.topic}
                </h3>
                <div className={`text-sm font-bold ${getScoreColor(quiz.score, quiz.totalScore)}`}>
                  {quiz.score}/{quiz.totalScore}
                </div>
              </div>

              {/* YouTube URL Preview */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-black/20 rounded-lg">
                <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm truncate">
                  {quiz.url.replace('https://', '').replace('www.', '')}
                </span>
              </div>

              {/* Date and Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDate(quiz.date)}
                </span>
                <div className="flex items-center gap-2 text-[#00FF9D] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Try Again</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF9D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Show more indicator if there are many quizzes */}
        {recentQuizzes.length === 5 && (
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Showing your 5 most recent unique quizzes
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizGenerator;