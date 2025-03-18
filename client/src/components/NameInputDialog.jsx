import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NameInputModal = ({ open, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    onSubmit(name);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="relative z-10 w-[400px] bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-glow animate-slide-up">
        <h2 className="text-2xl font-bold mb-4 text-[#00FF9D]">Enter Your Name</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Please enter your name to join the quiz.</p>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/10 focus:border-[#00FF9D]/50 focus:ring-[#00FF9D]/20 h-12 rounded-xl"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#00FF9D]/10 to-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] hover:from-[#00FF9D]/20 hover:to-[#00FF9D]/30 h-12 rounded-xl font-medium transition-all duration-300"
          >
            Join Quiz
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal; 