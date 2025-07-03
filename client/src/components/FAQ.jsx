import { ChevronDown, ChevronUp, HelpCircle, Lightbulb, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const headerRef = useRef()
  const isHeaderInView = useInView(headerRef, { once: true })

  const faqs = [
    {
      question: "What is QuickLearnAI?",
      answer: "QuickLearnAI is an AI-powered educational platform that combines expert teacher support with advanced AI technology. We offer features like instant doubt resolution, smart quiz generation, interactive mind maps, and personalized learning assistance.",
      icon: Lightbulb
    },
    {
      question: "How does the doubt resolution system work?",
      answer: "When you submit a doubt, our platform instantly matches you with qualified teachers in that subject area. If no teachers are immediately available, our AI system provides instant assistance. You can submit doubts as text or upload images of your questions.",
      icon: HelpCircle
    },
    {
      question: "Can I use QuickLearnAI with YouTube videos?",
      answer: "Yes! Our YouTube Learning Assistant allows you to chat with AI about educational videos, get instant summaries, and clarify concepts while watching. Simply paste the video URL and start learning more effectively.",
      icon: Star
    },
    {
      question: "How does the Quiz Generation feature work?",
      answer: "You can generate quizzes in two ways: by providing a topic or concept for the AI to create questions about, or by sharing a YouTube video URL. The system will create personalized questions with varying difficulty levels to test your understanding.",
      icon: Lightbulb
    },
    {
      question: "Are the teachers on the platform verified?",
      answer: "Yes, all teachers undergo thorough verification and background checks. We verify their qualifications, expertise, and teaching experience to ensure high-quality educational support.",
      icon: HelpCircle
    },
    {
      question: "What are Mind Maps and how do they help?",
      answer: "Our AI-powered Mind Maps feature helps visualize complex topics by creating interactive concept maps. This helps in better understanding relationships between different concepts and improves information retention.",
      icon: Star
    },
    {
      question: "Is QuickLearnAI free to use?",
      answer: "QuickLearnAI offers both free and premium features. Basic features like AI assistance and quiz generation are available to all users, while advanced features like teacher consultation and unlimited doubt resolution are part of our premium plans.",
      icon: Lightbulb
    },
    {
      question: "How secure is my learning data?",
      answer: "We prioritize your data security with end-to-end encryption, GDPR compliance, and strict privacy protocols. All your learning interactions, chat histories, and personal information are fully protected.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-[#00FF9D]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isHeaderInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00FF9D]/10 to-purple-500/10 rounded-full px-6 py-3 mb-8 border border-[#00FF9D]/20"
          >
            <HelpCircle className="w-5 h-5 text-[#00FF9D] animate-pulse" />
            <span className="text-sm font-medium text-[#00FF9D]">Got Questions?</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00FF9D] via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="text-white">Questions</span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to know about QuickLearnAI and how it can transform your learning experience
          </motion.p>
        </motion.div>

        {/* Enhanced FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#00FF9D]/50 ${
                  openIndex === index ? 'border-[#00FF9D]/50 shadow-lg shadow-[#00FF9D]/10' : ''
                }`}
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group-hover:bg-[#00FF9D]/5 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-10 h-10 rounded-full bg-[#00FF9D]/10 flex items-center justify-center"
                    >
                      <faq.icon className="w-5 h-5 text-[#00FF9D]" />
                    </motion.div>
                    <span className="text-lg font-semibold text-white group-hover:text-[#00FF9D] transition-colors duration-300">
                      {faq.question}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-[#00FF9D]" />
                  </motion.div>
                </motion.button>
                
                {/* Enhanced Answer with Animation */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="px-8 py-6 bg-gradient-to-r from-[#00FF9D]/5 to-transparent"
                      >
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="flex items-center justify-end mt-4 space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * i, duration: 0.2 }}
                              className="w-2 h-2 bg-[#00FF9D] rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section with additional help */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-[#00FF9D]/10 via-purple-500/10 to-[#00FF9D]/10 rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you 24/7
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px -12px rgba(0, 255, 157, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#00FF9D] to-cyan-400 text-black font-bold py-3 px-8 rounded-full hover:shadow-2xl transition-all duration-300"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FAQ;