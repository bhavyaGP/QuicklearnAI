import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { questionBankService } from '../services/api';

const QuestionBankGenerator = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await questionBankService.generateQuestionBank(topic);
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#00FF9D]/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-[#00FF9D]/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1 mb-8 mx-auto"
        >
          <span className="h-2 w-2 bg-[#00FF9D] rounded-full"></span>
          <span className="text-sm">AI-Powered Question Generation</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-4xl font-bold text-center mb-2">
            Question Bank Generator
            <motion.div 
              className="h-1 w-24 bg-[#00FF9D] mx-auto mt-2"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h1>
          
          <p className="text-gray-400 text-center mb-8">
            Get comprehensive practice questions for your exams
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label 
                  htmlFor="topic" 
                  className="block text-lg text-gray-300 mb-3"
                >
                  Enter Your Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-4 bg-white/10 text-white rounded-lg border border-gray-700 
                           focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent transition-all duration-300
                           placeholder-gray-500"
                  placeholder="e.g., Python Programming, Data Structures, Machine Learning"
                  required
                />
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-center bg-red-900/20 rounded-lg p-3"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-8 rounded-lg text-lg font-semibold transition-all duration-300
                ${loading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-[#00FF9D] hover:bg-[#00FF9D]/80 text-black'
                }`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Generating Questions...
                </div>
              ) : (
                'Generate Questions'
              )}
            </motion.button>
          </form>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-12"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#00FF9D]">10+</h3>
              <p className="text-gray-400 mt-1 text-sm">Questions per Topic</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#00FF9D]">3</h3>
              <p className="text-gray-400 mt-1 text-sm">Difficulty Levels</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#00FF9D]">PDF</h3>
              <p className="text-gray-400 mt-1 text-sm">Export Format</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionBankGenerator; 