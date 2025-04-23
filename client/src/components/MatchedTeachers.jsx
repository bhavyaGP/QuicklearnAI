import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Star, Send, Bot } from 'lucide-react';
import axios from 'axios';

const MatchedTeachers = () => {
  const navigate = useNavigate();
  const { doubtId } = useParams();
  const location = useLocation();
  const matchedData = location.state?.matchedData;
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to automatically redirect to AI solve if no teachers
  React.useEffect(() => {
    // Check if there's no matched teacher or if the message indicates no online teachers
    if (matchedData?.message === "No online teacher found, doubt remains pending." || 
        !matchedData?.onlineteacher || 
        matchedData?.onlineteacher.length === 0) {
      handleAISolve();
    }
  }, [matchedData]);

  const handleAISolve = async () => {
    setIsLoading(true);
    try {
      const doubtText = localStorage.getItem(`doubt:${doubtId}:text`);
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }
      const { token } = JSON.parse(userInfo);

      let fullResponse = ''; // To store the complete response

      const response = await fetch(`${import.meta.env.PROXY_API_URL}/user/doubt/aisolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: doubtText })
      });

      // Create a reader to read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the stream chunk
        const chunk = decoder.decode(value);
        // Split by data: to handle multiple JSON objects
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.replace('data: ', ''));
              if (jsonData.content) {
                fullResponse += jsonData.content; // Concatenate the content
              }
              if (jsonData.done) {
                break;
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }

      // Navigate to chat with complete response
      navigate(`/doubt/${doubtId}/chat`, {
        state: { 
          isAiResponse: true,
          aiResponse: fullResponse.trim() // Trim any extra whitespace
        }
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      if (error.response?.status === 429) {
        alert('Too many requests. Please wait a moment before trying again.');
      } else {
        alert('Failed to get AI response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the render logic to not show teachers if none are available
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
            AI Detected Subject of Your Doubt
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-12 bg-[#00FF9D]/30"></div>
            <p className="text-lg text-gray-400">
              {matchedData?.topics?.join(' > ')}
            </p>
            <div className="h-[1px] w-12 bg-[#00FF9D]/30"></div>
          </div>
        </div>

        {matchedData?.onlineteacher && matchedData.onlineteacher.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-8 text-center text-[#00FF9D]">
              Available Teachers For You!
            </h3>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <div className="space-y-6">
                {matchedData.onlineteacher.map((teacher) => (
                  <div 
                    key={teacher._id}
                    className="flex items-center justify-between p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-[#00FF9D]/20 flex items-center justify-center text-lg font-medium text-[#00FF9D]">
                        {teacher.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">
                          {teacher.username}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Star className="w-4 h-4 text-[#00FF9D]" />
                          <span>{teacher.rating}/5</span>
                          <span className="text-gray-600">•</span>
                          <span>{teacher.doubtsSolved} doubts solved</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/doubt/${doubtId}/chat`)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#00FF9D]/10 text-[#00FF9D] rounded-lg border border-[#00FF9D]/30 hover:bg-[#00FF9D]/20 transition-all duration-300"
                    >
                      <Send className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <Bot className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-400 mb-4">
              No teachers are currently online. Redirecting to AI assistance...
            </p>
            {isLoading && (
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00FF9D] border-t-transparent mx-auto"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchedTeachers; 