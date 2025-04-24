import React, { useState } from 'react';
import Dialog from './Dialog';
import { Tabs, TabsList, TabTrigger, TabContent } from './Tabs';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const LoginModalContent = ({ isOpen, onClose, onSignUpClick }) => {
  const [activeTab, setActiveTab] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      role: activeTab
    };

    if(email === 'iamquicklearn.ai@gmail.com' && password === 'Quicklearn@123'){
      data.role = 'admin';
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('Login response:', response.data); // Debug log

      if (response.data && response.data.user) {
        const { user, token } = response.data;
        const userInfo = {
          email: user.email,
          username: user.username,
          token,
          avatar: user.avatar,
          role: data.role, // Use the role from our request data
          _id: user._id
        };
        
        localStorage.setItem('user-info', JSON.stringify(userInfo));
        
        // Close the modal first
        onClose();

        // Then handle navigation
        if(data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const googleAuth = async (code) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/google?code=${code}&role=${activeTab}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        
        if (result.data && result.data.token) {
          const { email, username, avatar, _id } = result.data.user;
          const token = result.data.token;
          const userInfo = { 
            email, 
            username, 
            token, 
            avatar,
            role: activeTab,
            _id
          };
          
          localStorage.setItem('user-info', JSON.stringify(userInfo));
          onClose();
          // Redirect based on role
          if (activeTab === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          throw new Error('No token received from server');
        }
      } else {
        throw new Error('No authorization code present');
      }
    } catch (e) {
      console.error('Error during Google Login:', e);
      setError(e.message || 'Failed to login with Google');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error('Google Login Error:', error);
    },
    flow: "auth-code",
    scope: "email profile",
    redirect_uri: window.location.origin,
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#00FF9D]">
          Welcome to QuickLearnAI
        </h2>
        <p className="text-gray-400 mt-2">Sign in to continue</p>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 gap-2 p-1 mb-6">
          <TabTrigger 
            value="student" 
            selected={activeTab === 'student'} 
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'student' 
                ? 'bg-[#00FF9D] text-black font-medium'
                : 'bg-black/50 text-gray-400 hover:text-white'
            }`}
          >
            Student
          </TabTrigger>
          <TabTrigger 
            value="teacher" 
            selected={activeTab === 'teacher'} 
            onClick={() => setActiveTab('teacher')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'teacher' 
                ? 'bg-[#00FF9D] text-black font-medium'
                : 'bg-black/50 text-gray-400 hover:text-white'
            }`}
          >
            Teacher
          </TabTrigger>
        </TabsList>

        <TabContent value="student" selected={activeTab === 'student'}>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-[#00FF9D] hover:text-[#00FF9D]/80">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
            >
              Login as Student
            </button>
            
            {/* Google Login Button */}
            <div className="text-center">
              <button
                onClick={googleLogin}
                type="button"
                className="w-full py-2 px-4 bg-black/50 border border-gray-800 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-black/70 hover:border-[#00FF9D]/30 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSignUpClick();
                }}
                className="text-[#00FF9D] hover:text-[#00FF9D]/80 font-medium transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>
        </TabContent>

        <TabContent value="teacher" selected={activeTab === 'teacher'}>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="teacher@example.com"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-[#00FF9D] hover:text-[#00FF9D]/80">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
            >
              Login as Teacher
            </button>
            
            {/* Google Login Button */}
            <div className="text-center">
              <button
                onClick={googleLogin}
                type="button"
                className="w-full py-2 px-4 bg-black/50 border border-gray-800 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-black/70 hover:border-[#00FF9D]/30 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSignUpClick();
                }}
                className="text-[#00FF9D] hover:text-[#00FF9D]/80 font-medium transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>
        </TabContent>
      </Tabs>
    </Dialog>
  );
};

// Wrapper component that provides Google OAuth context
const LoginModal = (props) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LoginModalContent {...props} />
    </GoogleOAuthProvider>
  );
};

export default LoginModal;

