import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Send, Mic, Loader2, Volume2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/components/ui/use-toast";

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

// Message component with speech functionality
const MessageComponent = forwardRef(({ message }, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef(null);

  const handleSpeak = () => {
    // If already speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech synthesis
    window.speechSynthesis.cancel();

    // Create new speech synthesis instance
    const utterance = new SpeechSynthesisUtterance(message.content);
    
    // Configure speech settings
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Handle speech end
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // Handle speech error
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    // Store reference to current utterance
    speechSynthRef.current = utterance;

    // Start speaking
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <Card
        className={`max-w-[80%] p-4 ${
          message.type === 'user'
            ? 'bg-[#00FF9D]/10 border-[#00FF9D]/30 text-white'
            : 'bg-[#1E1E1E] border-white/10 text-white'
        } rounded-xl shadow-lg`}
      >
        <div className="prose prose-invert">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
              code: ({ node, ...props }) => (
                <code className="bg-black/30 rounded px-1" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
          {message.type === 'bot' && (
            <Button
              onClick={handleSpeak}
              className={`mt-2 ${
                isSpeaking 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-[#00FF9D]/10 text-[#00FF9D] hover:bg-[#00FF9D]/20'
              }`}
              size="sm"
            >
              {isSpeaking ? (
                <StopCircle className="w-4 h-4 mr-2" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              {isSpeaking ? 'Stop Speaking' : 'Listen'}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
});

MessageComponent.displayName = 'MessageComponent';

const AIChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle voice recording
  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      return;
    }

    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleSubmit(null, transcript); // Pass the transcript directly
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e, voiceInput = null) => {
    if (e) e.preventDefault();
    
    const messageText = voiceInput || inputMessage.trim();
    if (!messageText || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: messageText }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_GEN_PROXY}/aichat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: messageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
``
      if (data.success) {
        setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            AI <span className="text-[#00FF9D]">Assistant</span>
          </h1>
          <p className="text-gray-400">Ask me anything, I'm here to help!</p>
        </div>

        <div
          ref={chatContainerRef}
          className="h-[calc(100vh-300px)] overflow-y-auto mb-6 px-4 custom-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageComponent 
                key={index} 
                message={message} 
                ref={index === messages.length - 1 ? messagesEndRef : null}
              />
            ))}
          </AnimatePresence>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="relative"
        >
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-[#1E1E1E] border-white/10 text-white placeholder:text-gray-400"
              disabled={isLoading || isRecording}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim() || isRecording}
              className={`px-6 ${
                isLoading
                  ? 'bg-[#1E1E1E] cursor-not-allowed'
                  : 'bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D]'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
            <Button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white ${
                isRecording ? 'bg-red-500/20 text-red-400' : ''
              }`}
            >
              {isRecording ? (
                <StopCircle className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat; 