import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const isCurrentUser = message.sender === userInfo._id;
  const isAI = message.isAI;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex items-start gap-3 max-w-[80%] ${
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar/Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${isAI ? 'bg-[#00FF9D]/10' : 'bg-gray-700'}`}
        >
          {isAI ? (
            <Bot className="w-5 h-5 text-[#00FF9D]" />
          ) : (
            <User className="w-5 h-5 text-gray-300" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`p-3 rounded-xl ${
            isCurrentUser
              ? 'bg-[#00FF9D]/10 border border-[#00FF9D]/30'
              : 'bg-gray-800/50 border border-gray-700'
          }`}
        >
          <p className="text-gray-200 whitespace-pre-wrap">{message.message || message.content}</p>
          {message.timestamp && (
            <span className="text-xs text-gray-500 mt-1 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 