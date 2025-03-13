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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 w-[400px] bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Enter Your Name</h2>
        <p className="text-gray-400 text-sm mb-2">Please enter your name to join the quiz.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/20 border-white/10"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button 
            type="submit"
            className="w-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20"
          >
            Join Quiz
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal; 