import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { statisticsService, youtubeService, questionBankService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RecommendationPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedTopics, setRecommendedTopics] = useState([]);
  const [practiceTopics, setPracticeTopics] = useState([]);
  const [videos, setVideos] = useState({});
  const [generatingQuestions, setGeneratingQuestions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processStatistics = async (statistics) => {
      // Group statistics by topic
      const topicPerformance = statistics.reduce((acc, stat) => {
        const topic = stat.topic;
        const score = (stat.score / stat.totalscore) * 100;
        console.log(score)
        if (!acc[topic]) {
          acc[topic] = {
            scores: [],
            attempts: 0
          };
        }
        
        acc[topic].scores.push(score);
        acc[topic].attempts += 1;
        return acc;
      }, {});

      // Calculate average scores and categorize topics
      const recommendedTopicsArray = [];
      const practiceTopicsArray = [];

      for (const [topic, data] of Object.entries(topicPerformance)) {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;

        // Modified condition: Include topics with high scores OR multiple attempts
        if (avgScore >= 70 || data.attempts >= 2) {
          recommendedTopicsArray.push({
            topic,
            avgScore,
            attempts: data.attempts
          });
        } else {
          practiceTopicsArray.push({
            topic,
            avgScore,
            attempts: data.attempts
          });
        }
      }

  

      // Sort arrays by average score
      recommendedTopicsArray.sort((a, b) => b.avgScore - a.avgScore);
      practiceTopicsArray.sort((a, b) => a.avgScore - b.avgScore);

      setRecommendedTopics(recommendedTopicsArray);
      setPracticeTopics(practiceTopicsArray);

      // Fetch videos for all topics, not just recommended ones
      const allTopics = [...recommendedTopicsArray, ...practiceTopicsArray];
      
      try {
        console.log('Fetching videos for topics:', allTopics.map(t => t.topic)); // Debug log
        const videoData = await youtubeService.getVideoRecommendations(
          allTopics.map(t => t.topic)
        );
        console.log('Video data received:', videoData); // Debug log
        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const statistics = await statisticsService.getStatistics();
        console.log('Fetched statistics:', statistics); // Debug log
        await processStatistics(statistics);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePracticeClick = async (topic) => {
    try {
      setGeneratingQuestions(topic);
      toast.info(`Generating practice questions for ${topic}...`);
      
      await questionBankService.generateQuestionBank(topic);
      
      toast.success(`Practice questions for ${topic} have been generated!`);
    } catch (error) {
      console.error('Error generating practice questions:', error);
      toast.error(error.message || 'Failed to generate practice questions');
    } finally {
      setGeneratingQuestions(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF9D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-24">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#00FF9D] mb-4">Learning Hub</h1>
          <p className="text-xl text-gray-400">Personalized recommendations based on your performance</p>
        </div>

        {/* Debug Information */}
        <div className="text-sm text-gray-500">
          <p>Recommended Topics: {recommendedTopics.length}</p>
          <p>Videos Object Keys: {Object.keys(videos).join(', ')}</p>
        </div>

        {/* Video Recommendations */}
        {recommendedTopics.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00FF9D] mb-6">Recommended Learning</h2>
            {recommendedTopics.map(({ topic }) => {
              console.log('Rendering topic:', topic);
              console.log('Videos for topic:', videos[topic]);
              
              return (
                <div key={topic} className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">{topic}</h3>
                  {videos[topic] && videos[topic].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videos[topic].map((videoUrl, index) => {
                        console.log('Processing video URL:', videoUrl);
                        const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
                        
                        if (!videoId) {
                          console.log('No video ID found for:', videoUrl);
                          return null;
                        }

                        return (
                          <div key={index} className="group hover:scale-105 transition-all duration-300">
                            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                              <div className="bg-black/50 rounded-xl overflow-hidden border border-zinc-800/50">
                                <div className="relative">
                                  <img
                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                    alt={`${topic} video ${index + 1}`}
                                    className="w-full aspect-video object-cover"
                                    onError={(e) => {
                                      e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-[#00FF9D]/10 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                                <div className="p-4">
                                  <h4 className="text-lg font-medium text-gray-200 group-hover:text-[#00FF9D] transition-colors duration-300">
                                    {topic} - Video {index + 1}
                                  </h4>
                                </div>
                              </div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400">No videos available for this topic</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Practice Topics */}
        {practiceTopics.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00FF9D] mb-6">Topics for Practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceTopics.map(({ topic, avgScore, attempts }) => (
                <button
                  key={topic}
                  onClick={() => handlePracticeClick(topic)}
                  disabled={generatingQuestions === topic}
                  className={`bg-black/50 rounded-xl p-6 border border-zinc-800/50 
                    hover:border-[#00FF9D]/30 transition-all duration-300 text-left
                    ${generatingQuestions === topic ? 'opacity-75 cursor-wait' : ''}`}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{topic}</h3>
                  <div className="space-y-2">
                    <p className="text-gray-400">
                      Average Score: <span className="text-[#00FF9D]">{Math.round(avgScore)}%</span>
                    </p>
                    <p className="text-gray-400">
                      Attempts: <span className="text-[#00FF9D]">{attempts}</span>
                    </p>
                    {generatingQuestions === topic && (
                      <div className="flex items-center space-x-2 text-[#00FF9D]">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Generating...</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {recommendedTopics.length === 0 && practiceTopics.length === 0 && (
          <div className="text-center text-gray-400">
            <p>No recommendations available yet. Complete some quizzes to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage; 