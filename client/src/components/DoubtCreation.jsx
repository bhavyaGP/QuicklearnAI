import React, { useState } from 'react';
import { Upload, Type, Image as ImageIcon } from 'lucide-react';
import { userService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';

const DoubtCreation = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Selected file:', selectedFile); // Debug log
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate file exists and is of correct type
      if (activeTab === 'image') {
        if (!file) {
          throw new Error('Please select a file');
        }
        
        // Add file type validation if needed
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Please upload a valid image file (JPEG, PNG)');
        }

        // Debug log
        console.log('File being submitted:', file);
      }

      const response = await userService.uploadDoubt(
        activeTab === 'image' ? file : text,
        activeTab
      );
      
      // Store extracted text if available
      if (activeTab === 'image') {
        if (response.file?.extractedText) {
          localStorage.setItem(
            `doubt:${response.doubtId}:text`,
            response.file.extractedText
          );
        }
      } else {
        if (response.extractedText) {
          localStorage.setItem(
            `doubt:${response.doubtId}:text`,
            response.extractedText
          );
        }
      }

      if (response.doubtId) {
        try {
          // Try to match with a teacher first
          const matchResponse = await userService.matchDoubt(response.doubtId);
          
          // Check if there are actually teachers available
          const hasTeachers = matchResponse.onlineteacher && matchResponse.onlineteacher.length > 0;
          
          if (!hasTeachers || matchResponse.message === "No online teacher found, doubt remains pending.") {
            // If no teacher is found, navigate to matched page
            navigate(`/doubt/${response.doubtId}/matched`, {
              state: { 
                matchedData: {
                  ...matchResponse,
                  teachers: matchResponse.onlineteacher
                },
                isAiResponse: true
              }
            });
          } else {
            // If teachers are found, proceed with normal flow
            navigate(`/doubt/${response.doubtId}/matched`, {
              state: { 
                matchedData: {
                  ...matchResponse,
                  teachers: matchResponse.onlineteacher
                }
              }
            });
          }
        } catch (error) {
          console.error('Error in matching:', error);
          setError('Failed to process doubt. Please try again.');
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to create doubt');
      console.error('Error creating doubt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Create <span className="text-[#00FF9D]">Doubt</span>
          </h1>
          <p className="text-xl text-gray-400">
            Share your questions with expert teachers
          </p>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-[#00FF9D]/10 to-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] shadow-lg shadow-[#00FF9D]/5'
                : 'bg-black/40 border border-white/10 text-white/70 hover:border-[#00FF9D]/20 hover:text-[#00FF9D]/70'
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="font-medium">Text</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-[#00FF9D]/10 to-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] shadow-lg shadow-[#00FF9D]/5'
                : 'bg-black/40 border border-white/10 text-white/70 hover:border-[#00FF9D]/20 hover:text-[#00FF9D]/70'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Image</span>
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'text' ? (
              <div className="min-h-[300px] flex">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your doubt here..."
                  className="flex-1 min-h-[300px] bg-black/40 backdrop-blur-md border border-white/10 focus:border-[#00FF9D]/50 focus:ring-[#00FF9D]/20 rounded-xl p-6 text-white/90 placeholder:text-gray-500 resize-none"
                />
              </div>
            ) : (
              <div className="relative group min-h-[300px]">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center group-hover:border-[#00FF9D]/30 transition-all duration-300 h-full flex items-center justify-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    {file ? (
                      <div className="relative w-full max-w-md mx-auto group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="rounded-xl w-full object-cover max-h-[200px] shadow-lg shadow-black/50"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
                          <p className="text-white font-medium">Click to change image</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-[#00FF9D]/10 flex items-center justify-center mb-2">
                          <Upload className="w-8 h-8 text-[#00FF9D]" />
                        </div>
                        <div>
                          <p className="text-[#00FF9D] font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">Supported formats: JPG, PNG, GIF</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00FF9D]/10 to-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] hover:from-[#00FF9D]/20 hover:to-[#00FF9D]/30 h-12 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-[#00FF9D]/5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#00FF9D] border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Doubt'
              )}
            </Button>
          </form>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 backdrop-blur-sm">
            <p className="flex items-center gap-2">
              <span className="text-red-500">•</span>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtCreation;