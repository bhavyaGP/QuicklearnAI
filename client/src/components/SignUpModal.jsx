import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Dialog from './Dialog';
import { Tabs, TabsList, TabTrigger, TabContent } from './Tabs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Define subcategories for each subject
  const subcategories = {
    mathematics: [
      { value: "algebra", label: "Algebra" },
      { value: "calculus", label: "Calculus" },
      { value: "geometry", label: "Geometry" },
      { value: "statistics", label: "Statistics" },
      { value: "discrete_math", label: "Discrete Mathematics" },
    ],
    physics: [
      { value: "mechanics", label: "Mechanics" },
      { value: "thermodynamics", label: "Thermodynamics" },
      { value: "electromagnetism", label: "Electromagnetism" },
      { value: "quantum_physics", label: "Quantum Physics" },
      { value: "relativity", label: "Relativity" },
    ],
    chemistry: [
      { value: "organic_chem", label: "Organic Chemistry" },
      { value: "inorganic_chem", label: "Inorganic Chemistry" },
      { value: "physical_chem", label: "Physical Chemistry" },
      { value: "biochemistry", label: "Biochemistry" },
      { value: "analytical_chem", label: "Analytical Chemistry" },
    ],
    biology: [
      { value: "molecular_bio", label: "Molecular Biology" },
      { value: "genetics", label: "Genetics" },
      { value: "ecology", label: "Ecology" },
      { value: "physiology", label: "Physiology" },
      { value: "microbiology", label: "Microbiology" },
    ],
    computer_science: [
      { value: "programming", label: "Programming" },
      { value: "data_structures", label: "Data Structures & Algorithms" },
      { value: "databases", label: "Databases" },
      { value: "web_dev", label: "Web Development" },
      { value: "ai_ml", label: "AI & Machine Learning" },
      { value: "networking", label: "Computer Networking" },
    ],
    english: [
      { value: "literature", label: "Literature" },
      { value: "grammar", label: "Grammar" },
      { value: "composition", label: "Composition & Writing" },
      { value: "language_arts", label: "Language Arts" },
      { value: "public_speaking", label: "Public Speaking" },
    ],
    other: [
      { value: "other_specify", label: "Please Specify in Profile" },
    ],
  };

  // Helper function to convert subject value to proper field name
  const getFieldName = (subjectValue) => {
    const fieldMap = {
      mathematics: "Mathematics",
      physics: "Physics", 
      chemistry: "Chemistry",
      biology: "Biology",
      computer_science: "Computer Science",
      english: "English",
      other: "Other"
    };
    return fieldMap[subjectValue] || subjectValue;
  };

  // Helper function to convert subcategory value to proper label
  const getSubcategoryLabel = (subjectValue, subcategoryValue) => {
    if (subcategories[subjectValue]) {
      const subcategory = subcategories[subjectValue].find(sub => sub.value === subcategoryValue);
      return subcategory ? subcategory.label : subcategoryValue;
    }
    return subcategoryValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.role = activeTab;

    // Generate avatar URL using username
    data.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}`;

   // For teachers, transform subject and subcategory data to match backend format
if (activeTab === 'teacher') {
    const subjectValue = data.subject;
    const subcategoryValue = data.subcategory;
    
    // Transform the subject data to match backend format
    if (subjectValue && subcategoryValue) {
        data.subject = getFieldName(subjectValue);
        data.subcategory = getSubcategoryLabel(subjectValue, subcategoryValue);
    }
}

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (activeTab === 'teacher') {
        // For teachers, show approval message instead of redirecting
        setShowApprovalMessage(true);
        setIsLoading(false);
      } else {
        // For students, store user info and redirect
        localStorage.setItem('user-info', JSON.stringify(response.data));
        onClose();
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {showApprovalMessage ? (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#00FF9D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#00FF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#00FF9D] mb-2">
              Registration Submitted!
            </h2>
            <p className="text-gray-400 mb-4">
              Your teacher registration has been submitted successfully.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>⏳ Pending Approval:</strong> Your account is currently under review by our admin team. 
                You'll receive an email notification once your account is approved and you can start using the platform.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowApprovalMessage(false);
              onClose();
            }}
            className="px-6 py-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 rounded-lg transition-all duration-200 font-medium"
          >
            Got it!
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#00FF9D]">
              Join QuickLearnAI
            </h2>
            <p className="text-gray-400 mt-2">Start your learning journey today</p>
          </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsList className="bg-red/50 p-1 rounded-lg mb-6">
          <TabTrigger 
            value="student" 
            selected={activeTab === 'student'} 
            onClick={setActiveTab}
            className={`flex-1 px-4 py-2 rounded-md transition-all ${
              activeTab === 'student' 
                ? 'bg-[#00FF9D]/20 border border-[#00FF9D]/50 text-[#00FF9D]' 
                : 'text-gray-400 hover:text-[#00FF9D]'
            }`}
          >
            Student
          </TabTrigger>
          <TabTrigger 
            value="teacher" 
            selected={activeTab === 'teacher'} 
            onClick={setActiveTab}
            className={`flex-1 px-4 py-2 rounded-md transition-all ${
              activeTab === 'teacher' 
                ? 'bg-[#00FF9D]/20 border border-[#00FF9D]/50 text-[#00FF9D]' 
                : 'text-gray-400 hover:text-[#00FF9D]'
            }`}
          >
            Teacher
          </TabTrigger>
        </TabsList>

        <TabContent value="student" selected={activeTab === 'student'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                required
              />
            </div>

            {/* Student Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="1234567890"
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                required
              />
            </div>

            {/* Student Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                required
              />
            </div>

            {/* Student Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#00FF9D] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing Up...</span>
                </div>
              ) : (
                'Sign Up as Student'
              )}
            </button>
          </form>
        </TabContent>

        <TabContent value="teacher" selected={activeTab === 'teacher'}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Layout for Teacher Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teacher Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Dr. Jane Smith"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                />
              </div>

              {/* Teacher Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="teacher@example.com"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                />
              </div>

              {/* Teacher Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                />
              </div>

              {/* Highest Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Highest Qualification
                </label>
                <select
                  name="highestQualification"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Teaching Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Teaching Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  max="50"
                  placeholder="5"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Subject and Subcategory Selection (Full Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preferred Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Preferred Subject
                </label>
                <select
                  name="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="english">English</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Subject Subcategory - Dynamic based on selected subject */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg focus:outline-none focus:border-[#00FF9D] focus:ring-1 focus:ring-[#00FF9D] transition-all placeholder-gray-500"
                  required
                  disabled={!selectedSubject}
                >
                  <option value="">
                    {selectedSubject 
                      ? `Select ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1).replace('_', ' ')} Subcategory`
                      : 'Select Subject First'
                    }
                  </option>
                  {selectedSubject && subcategories[selectedSubject]?.map((subcat, idx) => (
                    <option key={idx} value={subcat.value}>
                      {subcat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Certificate Upload (Full Width) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Certificate
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="certificate"
                  name="certificate"
                  required
                />
                <label
                  htmlFor="certificate"
                  className="flex items-center gap-2 w-full px-4 py-2 bg-black/50 border border-gray-800 rounded-lg cursor-pointer hover:border-[#00FF9D] hover:bg-black transition-all"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">
                    {fileName || 'Upload Certificate (PDF, JPG, PNG)'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#00FF9D] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing Up...</span>
                </div>
              ) : (
                'Sign Up as Teacher'
              )}
            </button>
          </form>
        </TabContent>
      </Tabs>
      
      <div className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-[#00FF9D] hover:text-[#00FF9D]/80 font-medium transition-colors"
        >
          Log in
        </button>
      </div>
      </>
      )}
    </Dialog>
  );
};

export default SignUpModal;