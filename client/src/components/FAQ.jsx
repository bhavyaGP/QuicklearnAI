import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is QuickLearnAI?",
      answer: "QuickLearnAI is an AI-powered educational platform that combines expert teacher support with advanced AI technology. We offer features like instant doubt resolution, smart quiz generation, interactive mind maps, and personalized learning assistance."
    },
    {
      question: "How does the doubt resolution system work?",
      answer: "When you submit a doubt, our platform instantly matches you with qualified teachers in that subject area. If no teachers are immediately available, our AI system provides instant assistance. You can submit doubts as text or upload images of your questions."
    },
    {
      question: "Can I use QuickLearnAI with YouTube videos?",
      answer: "Yes! Our YouTube Learning Assistant allows you to chat with AI about educational videos, get instant summaries, and clarify concepts while watching. Simply paste the video URL and start learning more effectively."
    },
    {
      question: "How does the Quiz Generation feature work?",
      answer: "You can generate quizzes in two ways: by providing a topic or concept for the AI to create questions about, or by sharing a YouTube video URL. The system will create personalized questions with varying difficulty levels to test your understanding."
    },
    {
      question: "Are the teachers on the platform verified?",
      answer: "Yes, all teachers undergo thorough verification and background checks. We verify their qualifications, expertise, and teaching experience to ensure high-quality educational support."
    },
    {
      question: "What are Mind Maps and how do they help?",
      answer: "Our AI-powered Mind Maps feature helps visualize complex topics by creating interactive concept maps. This helps in better understanding relationships between different concepts and improves information retention."
    },
    {
      question: "Is QuickLearnAI free to use?",
      answer: "QuickLearnAI offers both free and premium features. Basic features like AI assistance and quiz generation are available to all users, while advanced features like teacher consultation and unlimited doubt resolution are part of our premium plans."
    },
    {
      question: "How secure is my learning data?",
      answer: "We prioritize your data security with end-to-end encryption, GDPR compliance, and strict privacy protocols. All your learning interactions, chat histories, and personal information are fully protected."
    }
  ];

  return (
    <div className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about QuickLearnAI
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-[#00FF9D]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-white">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#00FF9D]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#00FF9D]" />
                )}
              </button>
              
              {/* Answer */}
              <div
                className={`px-6 transition-all duration-300 ${
                  openIndex === index ? 'py-4 border-t border-white/10' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-400">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;