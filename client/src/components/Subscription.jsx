import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import PaymentButton from './PaymentButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubscriptionCard = ({ plan, price, features, isPopular }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-2xl border ${
        isPopular ? 'border-[#00FF9D]/30' : 'border-white/10'
      } bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-500`}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {isPopular && (
        <div className="absolute top-0 right-0 bg-[#00FF9D] text-black text-sm font-medium px-4 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      
      <div className="relative p-8 space-y-6">
        <h3 className="text-2xl font-bold text-white group-hover:text-[#00FF9D] transition-colors duration-300">
          {plan}
        </h3>
        
        <div className="text-3xl font-bold">
          <span className="text-[#00FF9D]">₹{price}</span>
          <span className="text-gray-400 text-lg">/month</span>
        </div>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-[#00FF9D] mt-0.5" />
              <span className="text-gray-400">{feature}</span>
            </div>
          ))}
        </div>
        
        {userData ? (
          <PaymentButton
            membershipType={plan}
            price={parseInt(price)}
            name={userData.name || 'Nandit'}
            email={userData.email || 'nandit@gmail.com'}
            contact={userData.contact || '7990785212'}
          />
        ) : (
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={() => alert('Please login to continue')}
          >
            Login to Subscribe
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const Subscription = () => {
  const plans = [
    {
      plan: "Explorer",
      price: "0",
      features: [
        "Upto 3 video summaries per week",
        "Upto 3 quizzes per week",
        "Gemini / Llama AI Integration"
      ],
      isPopular: false
    },
    {
      plan: "Scholar",
      price: "49",
      features: [
        "Mind Map Generation",
        "AI Recommendations",
        "RAG Bot Integration",
        "Chat with YouTube Videos",
        "Live Teacher Doubt Resolution",
        "Web Searched Question Bank"
      ],
      isPopular: true
    },
    {
      plan: "Achiever",
      price: "99",
      features: [
        "QuickLearn AI Premium Access",
        "All Features Included",
        "Priority Support",
        "Advanced Analytics"
      ],
      isPopular: false
    }
  ];

  return (
    <section className="mt-6 py-24 bg-black">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent"
          >
            Choose Your Learning Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Select the plan that best fits your learning needs and start your journey with QuickLearn AI
          </motion.p>
        </div>

        {/* Subscription Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <SubscriptionCard
              key={index}
              {...plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subscription;