import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function SearchBar() {
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })

  // Placeholder text animation
  const placeholders = [
    "Describe Earth to aliens",
    "Explain quantum computing", 
    "Summarize the theory of relativity",
    "How does photosynthesis work?"
  ]
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setGlowPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleClick = () => {
    navigate('/ai-chat')
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Animated border gradient */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}px ${glowPosition.y}px, rgba(0, 255, 157, 0.3), transparent 50%)`
        }}
      />
      
      <div 
        className="relative flex items-center bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#00FF9D]/50 transition-all duration-300"
        onMouseMove={handleMouseMove}
      >
        <div className="flex items-center space-x-3 flex-1">
          <span className={`text-[#00FF9D] transition-transform duration-300 ${isTyping ? 'scale-110' : ''}`}>
            <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.417 0L12 4.5l2.583-4.5L19.5 2.583 15 5.167l4.5 2.583L17.417 12 15 9.5l-3 5-3-5-2.417 2.5L4.5 7.75 9 5.167 4.5 2.583 9.417 0z"/>
            </svg>
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsTyping(true)
              setTimeout(() => setIsTyping(false), 100)
            }}
            onClick={handleClick}
            placeholder={placeholders[currentPlaceholder]}
            className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isListening 
                ? 'bg-[#00FF9D]/20 text-[#00FF9D] scale-110' 
                : 'hover:bg-white/10 text-gray-400 hover:text-[#00FF9D]'
            }`}
          >
            <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
          <button 
            onClick={handleClick}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group hover:scale-110"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-gray-400 group-hover:text-[#00FF9D] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar