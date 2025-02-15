import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Security from './components/Security'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import QuizGenerator from './pages/quiz'
import LoginModal from './components/LoginModal'
import SignUpModal from './components/SignUpModal'
import ProfilePage from './components/ProfilePage'
import TeacherDashboard from './components/TeacherDashboard'
import RecommendationPage from './pages/recommendation'
import ChatBot from './pages/ChatBot'
import MindMap from './pages/MindMap'
import DoubtCreation from './components/DoubtCreation'
import ChatRoom from './components/ChatRoom'
import MatchedTeachers from './components/MatchedTeachers'
import CreateQuiz from './pages/CreateQuiz'
import QuizSession from './pages/QuizSession'
import QuizPreview from './pages/QuizPreview'
import QuizPreviewNew from './pages/QuizPreviewNew'
import QuizLobby from './pages/QuizLobby'
import QuizResults from './pages/QuizResults'
import StudentResults from './pages/StudentResults'
import StudentLobby from './pages/StudentLobby'

function Home() {
  const contentRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = contentRef.current.querySelectorAll('section')
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Hero />
      </div>
      <div ref={contentRef} className="space-y-32">
        <section className="opacity-0 transition-opacity duration-1000">
          <Features />
        </section>
        <section className="opacity-0 transition-opacity duration-1000">
          <Security />
        </section>
        <section className="opacity-0 transition-opacity duration-1000">
          <FAQ />
        </section>
      </div>
      <Footer />
    </>
  )
}


function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleLogin = () => {
    setShowLoginModal(false);
  };

  const NavbarWrapper = () => {
    const navigate = useNavigate();

    return (
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
      />
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProfilePage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/quiz" element={<QuizGenerator />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/doubt/create" element={<DoubtCreation />} />
          <Route path="/doubt/:doubtId/chat" element={<ChatRoom/>} />
          <Route path="/doubt/:doubtId/matched" element={<MatchedTeachers />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/quiz-session/:roomId" element={<QuizSession />} />
          <Route path="/quiz-preview" element={<QuizPreview />} />
          <Route path="/quiz-preview-new" element={<QuizPreviewNew />} />
          <Route path="/quiz-lobby/:roomId" element={<QuizLobby />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/student-results" element={<StudentResults />} />
          <Route path="/student-lobby/:roomId" element={<StudentLobby />} />
        </Routes>
        
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onSignUpClick={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          onLogin={handleLogin}
        />
        
        <SignUpModal 
          isOpen={showSignUpModal} 
          onClose={() => setShowSignUpModal(false)}
          onSwitchToLogin={() => {
            setShowSignUpModal(false);
            setShowLoginModal(true);
          }}
        />
      </div>
    </Router>
  );
}

export default App;