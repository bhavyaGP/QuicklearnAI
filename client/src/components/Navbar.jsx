import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Navbar({ onSignUpClick, onLoginClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const teacherLinks = [
    { to: "/", label: "Home" },
    { to: "/paper-generate", label: "Paper Generate" },
    { to: "/create-quiz", label: "Create Quiz" }
  ];

  const studentLinks = [
    { to: "/", label: "Home" },
    { to: "/chatbot", label: "ChatBot" },
    { to: "/quiz", label: "Chat With QuickLearnAI" },
    { to: "/recommendations", label: "Recommendations" },
    { to: "/doubt/create", label: "Doubt" },
    { to: "/subscription", label: "Subscription"}
  ];

  const adminLinks = [
    { to: "/admin", label: "Admin Dashboard" }
  ];
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

  // Determine which links to show
  const navigationLinks = userType === 'teacher' ? teacherLinks : studentLinks;

  return (
    <nav className="fixed top-8 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/40 backdrop-blur-md rounded-full px-6 border border-white/5">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#00FF9D]/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#00FF9D]" />
              </div>
              <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00FF9D] hover:from-[#00FF9D] hover:to-white transition-all duration-500">
                QuickLearnAI
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="relative text-l font-medium text-white/90 hover:text-[#00FF9D] transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#00FF9D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
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
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <Avatar className="ring-2 ring-[#00FF9D]/30 hover:ring-[#00FF9D] ring-offset-2 ring-offset-black/50 transition-all duration-300">
                        <AvatarImage src={avatar} alt="Profile" className="hover:brightness-110" />
                        <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700">
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