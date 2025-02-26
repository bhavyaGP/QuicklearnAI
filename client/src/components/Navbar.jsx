import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Navbar({ onSignUpClick, onLoginClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for user-info in localStorage
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    setIsLoggedIn(!!userInfo);
    setUserType(userInfo?.role || null);
  }, []);

  const handleLogout = () => {
    // Simply clear localStorage and update state
    localStorage.removeItem('user-info');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
    // Force a page reload to clear any remaining state
    window.location.reload();
  };

  const avatar = localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info')).avatar : 'https://github.com/shadcn.png';

  return (
    <nav className="fixed top-8 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/40 backdrop-blur-md rounded-full px-6 border border-white/5">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#00FF9D]/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#00FF9D]" />
              </div>
              <Link to="/" className="text-xl font-medium hover:text-[#00FF9D] transition-colors">
                QuickLearnAI
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-l font-medium hover:text-[#00FF9D] transition-colors">Home</Link>
              <Link to="/chatbot" className="text-l font-medium hover:text-[#00FF9D] transition-colors">ChatBot</Link>
              <Link to="/quiz" className="text-l font-medium hover:text-[#00FF9D] transition-colors">Chat With QuickLearnAI</Link>
              <Link to="/recommendations" className="text-l font-medium hover:text-[#00FF9D] transition-colors">Recommendations</Link>
              <Link to="/doubt/create" className="text-l font-medium hover:text-[#00FF9D] transition-colors">Doubt</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={onSignUpClick} 
                    className="px-4 py-2 bg-[#00FF9D]/10 text-l font-medium rounded-full border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300"
                  > 
                    Sign Up
                  </button>
                  <button 
                    onClick={onLoginClick}
                    className="px-4 py-2 bg-[#00FF9D]/10 text-l font-medium rounded-full border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-[#00FF9D]/10 text-l font-medium rounded-full border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300"
                  >
                    Logout
                  </button>
                  <Link to={userType === 'teacher' ? '/teacher-dashboard' : '/dashboard'}>
                    <div className="transition-all duration-300 rounded-full hover:ring-2 hover:ring-[#00FF9D] hover:ring-offset-2 hover:ring-offset-black">
                      <Avatar>
                        <AvatarImage src={avatar} alt="Profile" />
                        <AvatarFallback className="bg-gray-600">
                          {userType === 'teacher' ? 'T' : 'S'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;