import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, User, Bot, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { documentService } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

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

const ChatBot = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.ms-powerpoint')) {
      setFile(droppedFile);
      // Clear chat history when new file is dropped
      setChat([]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Clear chat history when new file is selected
      setChat([]);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    // Clear chat history when file is removed
    setChat([]);
  };

  const handleFileUpload = async (file) => {
    try {
      const response = await documentService.uploadPdf(file);
      useToast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "default",
      });
      return response;
    } catch (error) {
      useToast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    // Add user's question to chat
    setChat(prev => [...prev, { type: 'user', content: question }]);
    
    try {
      // Upload file if present and not already uploaded
      if (file) {
        await handleFileUpload(file);
      }
      
      // Send query to get response
      const response = await documentService.queryDocument(question);
      
      // Add bot's response to chat
      setChat(prev => [...prev, { 
        type: 'bot', 
        content: response.answer
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
      <AnimatedBackground/>
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            PDF/PPT <span className="text-[#00FF9D]">Chatbot</span>
          </h1>
          <p className="text-xl text-gray-400">
            Upload your document and start asking questions
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8 mb-8">
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#00FF9D]/50 transition-colors"
            >
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#00FF9D]" />
                <p className="text-lg mb-2">Drop your PDF or PPT here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#00FF9D]/10 rounded-lg p-4">
              <span className="text-[#00FF9D]">{file.name}</span>
              <Button
                variant="ghost"
                onClick={handleFileRemove}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          )}
        </Card>

        {/* Chat Messages */}
        <div className="space-y-6 mt-8 mb-8">
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
              placeholder="Ask a question about your document..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 
                focus:outline-none focus:border-[#00FF9D]/50 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!file || isLoading}
            />
            <Button
              type="submit"
              disabled={!file || !question.trim() || isLoading}
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

export default ChatBot;