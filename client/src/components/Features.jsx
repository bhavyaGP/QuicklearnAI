import { BookOpen, Users, Brain, MessageSquare, Youtube } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
            Empowering Your Learning Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience personalized learning with our AI-powered platform that connects you with expert teachers and innovative study tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Doubt Solving Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Instant Doubt Resolution</h3>
            <p className="text-gray-400">
              Connect with expert teachers in real-time or get instant AI-powered solutions for your academic doubts.
            </p>
          </div>

          {/* Quiz Generation Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <BookOpen className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Smart Quiz Generation</h3>
            <p className="text-gray-400">
              Create personalized quizzes with AI assistance. Perfect for teachers and students to enhance learning.
            </p>
          </div>

          {/* Mind Map Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Interactive Mind Maps</h3>
            <p className="text-gray-400">
              Visualize complex topics with AI-generated mind maps that help you understand and remember better.
            </p>
          </div>

          {/* YouTube Learning Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <Youtube className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">YouTube Learning Assistant</h3>
            <p className="text-gray-400">
              Chat with AI about educational videos, get summaries, and clarify concepts while watching.
            </p>
          </div>

          {/* Teacher Connection Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Expert Teachers Network</h3>
            <p className="text-gray-400">
              Connect with qualified teachers who provide personalized guidance and doubt resolution.
            </p>
          </div>

          {/* AI Assistant Feature */}
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">24/7 AI Support</h3>
            <p className="text-gray-400">
              Get instant help anytime with our AI assistant that provides detailed explanations and guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;