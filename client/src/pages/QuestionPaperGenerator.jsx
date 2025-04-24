import { useState } from 'react';
import { Upload, FileText, Loader2, Download, ArrowRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paperService } from '../services/api';
import { UploadLoadingScreen, GeneratingLoadingScreen, DownloadLoadingScreen } from '../components/LoadingScreens';

const QuestionPaperGenerator = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [filePath, setFilePath] = useState('');
    const [numQuestions, setNumQuestions] = useState(20);
    const [numPapers, setNumPapers] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPapers, setGeneratedPapers] = useState([]);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await paperService.uploadPaper(file);
      setFilePath(response.file_path);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await paperService.generatePaper(filePath, numQuestions, numPapers);
      setCurrentStep(3);
      
      // Generate paper URLs based on the response
      const papers = [];
      for (let i = 1; i <= numPapers; i++) {
        const paperUrl = `${import.meta.env.GEN_PROXY}/download/question_paper_set_${i}.pdf`;
        papers.push(paperUrl);
      }
      setGeneratedPapers(papers);
    } catch (err) {
      setError('Failed to generate papers. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url) => {
    try {
      const blob = await paperService.downloadPaper(url);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `question_paper_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download paper. Please try again.');
      console.error('Download error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* Show appropriate loading screen based on the current action */}
      {isLoading && currentStep === 1 && <UploadLoadingScreen />}
      {isLoading && currentStep === 2 && <GeneratingLoadingScreen />}
      {isLoading && currentStep === 3 && <DownloadLoadingScreen />}
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Question Paper <span className="text-[#00FF9D]">Generator</span>
          </h1>
          <p className="text-xl text-gray-400">
            Upload your question set and generate multiple variants
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div 
                className="relative group border-2 border-dashed border-[#00FF9D]/30 rounded-2xl p-12 text-center hover:border-[#00FF9D]/50 transition-all duration-500 bg-gradient-to-b from-black/40 to-[#00FF9D]/5"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <div className="transform-gpu group-hover:scale-105 transition-all duration-500">
                    {/* Animated Upload Icon Container */}
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-[#00FF9D]/20 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                        <Upload className="w-10 h-10 text-[#00FF9D] transform group-hover:translate-y-[-8px] transition-transform duration-500" />
                      </div>
                    </div>

                    {/* File Name or Default Text */}
                    <div className="space-y-4">
                      <div className="text-2xl font-medium text-[#00FF9D] group-hover:scale-105 transition-transform duration-500">
                        {fileName || 'Click to upload question set'}
                      </div>
                      
                      {!fileName && (
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-gray-400">
                            Drag and drop your file here or click to browse
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-3 py-1 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/20">
                              PDF
                            </span>
                            <span className="px-3 py-1 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/20">
                              DOC
                            </span>
                            <span className="px-3 py-1 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/20">
                              DOCX
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF9D]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                  </div>
                </label>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className={`relative w-full h-14 rounded-xl font-medium transition-all duration-500 overflow-hidden
                  ${!file 
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#00FF9D]/10 via-[#00FF9D]/20 to-[#00FF9D]/10 text-[#00FF9D] hover:from-[#00FF9D]/20 hover:via-[#00FF9D]/30 hover:to-[#00FF9D]/20 border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 shadow-lg shadow-[#00FF9D]/5'
                  }`}
              >
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Upload Question Set</span>
                    </>
                  )}
                </div>
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              </Button>

              {/* File Size Limit Note */}
              <p className="text-center text-sm text-gray-500">
                Maximum file size: 10MB
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Configure Your Papers</h3>
                <p className="text-gray-400">Customize the number of questions and papers you want to generate</p>
              </div>

              <div className="grid gap-6">
                {/* Number of Questions Input */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Number of Questions
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full bg-black/40 border-2 border-[#00FF9D]/20 rounded-xl px-6 py-4 text-lg text-white 
                        focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 
                        transition-all duration-300 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button
                        onClick={() => setNumQuestions(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 
                          text-[#00FF9D] flex items-center justify-center transition-all duration-300"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setNumQuestions(prev => Math.min(100, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 
                          text-[#00FF9D] flex items-center justify-center transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="absolute left-0 -bottom-6 text-sm text-gray-500">
                      Recommended: 20-50 questions
                    </div>
                  </div>
                </div>

                {/* Number of Papers Input */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Number of Papers
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={numPapers}
                      onChange={(e) => setNumPapers(Number(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full bg-black/40 border-2 border-[#00FF9D]/20 rounded-xl px-6 py-4 text-lg text-white 
                        focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 
                        transition-all duration-300 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button
                        onClick={() => setNumPapers(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 
                          text-[#00FF9D] flex items-center justify-center transition-all duration-300"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setNumPapers(prev => Math.min(10, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 
                          text-[#00FF9D] flex items-center justify-center transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="absolute left-0 -bottom-6 text-sm text-gray-500">
                      Maximum: 10 papers
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-8">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="relative w-full h-14 rounded-xl font-medium transition-all duration-500 overflow-hidden
                    bg-gradient-to-r from-[#00FF9D]/10 via-[#00FF9D]/20 to-[#00FF9D]/10 
                    hover:from-[#00FF9D]/20 hover:via-[#00FF9D]/30 hover:to-[#00FF9D]/20 
                    border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 
                    text-[#00FF9D] shadow-lg shadow-[#00FF9D]/5"
                >
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Papers...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">Generate Papers</span>
                        <div className="w-6 h-6 rounded-full bg-[#00FF9D]/20 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>

                <div className="mt-4 p-4 rounded-lg bg-[#00FF9D]/5 border border-[#00FF9D]/20">
                  <p className="text-sm text-center text-gray-400">
                    The generated papers will maintain the same difficulty level while ensuring unique question combinations
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#00FF9D]" />
                </div>
                <h3 className="text-2xl font-medium text-white">Generated Papers</h3>
              </div>
              
              <div className="grid gap-4">
                {generatedPapers.map((url, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-6 rounded-xl border border-white/10 bg-black/20 hover:bg-[#00FF9D]/5 hover:border-[#00FF9D]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#00FF9D]/10 flex items-center justify-center">
                        <span className="text-[#00FF9D] font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white group-hover:text-[#00FF9D] transition-colors duration-300">
                          Question Paper Set {index + 1}
                        </h4>
                        <p className="text-sm text-gray-400">Ready for download</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(url)}
                      className="relative overflow-hidden px-6 py-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                        <span className="font-medium">Download PDF</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF9D]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-[#00FF9D]/5 border border-[#00FF9D]/20">
                <p className="text-sm text-center text-gray-400">
                  All papers are generated in PDF format and are ready for immediate use
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuestionPaperGenerator; 