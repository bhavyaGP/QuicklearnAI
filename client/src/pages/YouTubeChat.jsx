import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, User, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import { youtubeChatService } from '../services/api';

const formatBotResponse = (text) => {
  if (!text) return [];
  
  // First clean up the text
  const cleanText = text
    // Remove asterisks
    .replace(/\*+/g, '')
    // Clean up bullet points
    .replace(/•/g, '→')
    // Handle escaped newlines
    .replace(/\\n/g, '\n')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Clean up any markdown list markers
    .replace(/^\s*[-*]\s/gm, '→ ')
    // Remove any remaining special characters
    .replace(/[\\"`]/g, '') 
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n');

  // Split into paragraphs and filter empty lines
  return cleanText
    .split('\n')
    .filter(line => line.trim())
    .map((line, i) => {
      // Check if line is a bullet point
      const isBulletPoint = line.trim().startsWith('→');
      
      return (
        <div 
          key={i} 
          className={`
            ${i > 0 ? 'mt-2' : ''}
            ${isBulletPoint ? 'flex items-start gap-2' : ''}
          `}
        >
          {isBulletPoint && (
            <span className="text-[#00FF9D] flex-shrink-0">→</span>
          )}
          <span className={`
            ${isBulletPoint ? 'flex-1' : ''}
            ${line.includes(':') ? 'text-[#00FF9D]' : ''}
          `}>
            {line.trim().replace(/^→\s*/, '')}
          </span>
        </div>
      );
    });
};

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? 'flex-row-reverse ml-12' : 'mr-12'
      }`}
    >
      {/* Avatar/Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-[#00FF9D]/20' : 'bg-white/20'}
        transform transition-all duration-200 hover:scale-110`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-[#00FF9D]" />
        ) : (
          <Bot className="w-5 h-5 text-white animate-pulse" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 p-4 rounded-2xl ${
        isUser 
          ? 'bg-[#00FF9D]/10 border border-[#00FF9D]/30' 
          : 'bg-white/10 border border-white/10'
      } transition-all duration-200 hover:border-opacity-50`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none space-y-2">
            {formatBotResponse(message.content)}
          </div>
        )}
      </div>
    </div>
  );
};

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const YouTubeChat = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([]);
  
  // Get YouTube URL and model from location state
  const youtubeUrl = location.state?.youtubeUrl;
  const selectedModel = location.state?.model || 'chatgroq';
  const videoTitle = location.state?.title || 'YouTube Video';

  useEffect(() => {
    // Redirect if no YouTube URL is provided
    if (!youtubeUrl) {
      toast({
        title: "Error",
        description: "No YouTube URL provided. Please start from the quiz page.",
        variant: "destructive",
      });
      navigate('/quiz');
    }
  }, [youtubeUrl, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    // Add user's question to chat
    setChat(prev => [...prev, { type: 'user', content: question }]);
    
    try {
      // Send query to get response using the youtubeChatService
      const response = await youtubeChatService.askQuestion(
        youtubeUrl,
        selectedModel,
        question
      );
      
      // Add bot's response to chat
      setChat(prev => [...prev, { 
        type: 'bot', 
        content: response.answer || response.response
      }]);
      
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, I encountered an error processing your request." 
      }]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-4 text-gray-400 hover:text-white"
            onClick={() => navigate('/quiz')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Quiz
          </Button>
          <h1 className="text-3xl font-bold">
            Chat with <span className="text-[#00FF9D]">{videoTitle}</span>
          </h1>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3">
            <Youtube className="w-6 h-6 text-red-500" />
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline truncate"
            >
              {youtubeUrl}
            </a>
          </div>
          {youtubeUrl && (
            <div className="mt-4">
              <img
                src={`https://img.youtube.com/vi/${getYouTubeVideoId(youtubeUrl)}/mqdefault.jpg`}
                alt={videoTitle}
                className="rounded-lg w-full max-w-xs mx-auto"
              />
            </div>
          )}
          <div className="mt-4 text-gray-400">
            <p>Ask questions about this YouTube video. The AI will use the video transcript and context to provide answers.</p>
          </div>
        </Card>

        {/* Chat Messages */}
        <div className="space-y-6 mt-8 mb-8">
          {chat.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-[#00FF9D]/50" />
              <p>Ask a question to start chatting about the video content</p>
            </div>
          )}
          
          {chat.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-[#00FF9D]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the video..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 
                focus:outline-none focus:border-[#00FF9D]/50 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-8 bg-[#00FF9D]/20 text-[#00FF9D] hover:bg-[#00FF9D]/30 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Ask'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YouTubeChat; 