import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import socket from '../utils/socket.js';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Award, Trophy, ThumbsUp, Plus, CheckCircle, MessageSquare } from 'lucide-react';
import { doubtService } from '../services/api';

const RatingDisplay = ({ rating }) => {
  const getEmoji = (rating) => {
    if (rating >= 4.5) return '🌟';
    if (rating >= 4.0) return '⭐';
    if (rating >= 3.5) return '✨';
    if (rating >= 3.0) return '💫';
    if (rating > 0) return '⚡';
    return '🆕'; // Default emoji for 0 rating
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-yellow-400';
    if (rating >= 4.0) return 'text-yellow-500';
    if (rating >= 3.5) return 'text-emerald-400';
    if (rating >= 3.0) return 'text-blue-400';
    if (rating > 0) return 'text-gray-400';
    return 'text-blue-300'; // Default color for 0 rating
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-2">
        <div className={`text-4xl font-bold ${getRatingColor(rating)}`}>
          {rating || '0.0'}
        </div>
        <div className="text-3xl">{getEmoji(rating)}</div>
      </div>
      
      {/* Rating details on hover */}
      <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-black/90 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">Master Teacher</span>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-gray-300">Top 10%</span>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [newDoubts, setNewDoubts] = useState([]);
  const [solvedDoubts, setSolvedDoubts] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('user-info'));

  useEffect(() => {
    // Fetch teacher's doubts on mount
    const fetchDoubts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/doubt/teacher/${userInfo._id}/doubts`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        
        const doubts = response.data;
        setNewDoubts(doubts.filter(d => d.status !== 'resolved'));
        setSolvedDoubts(doubts.filter(d => d.status === 'resolved'));
      } catch (error) {
        console.error('Error fetching doubts:', error);
      }
    };

    fetchDoubts();

    // Listen for new doubts
    socket.on('new_doubt', (doubt) => {
      setNewDoubts(prev => [...prev, doubt]);
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New Doubt Assigned', {
          body: `New doubt in ${doubt.topic.join(' › ')}`,
        });
      }
    });

    return () => {
      socket.off('new_doubt');
    };
  }, []);

  const handleJoinChat = (doubtId) => {
    // Connect to socket with the specific doubt ID
    socket.emit('join_chat', {
      doubtId,
      userId: userInfo._id,
      role: 'teacher'
    });
    
    navigate(`/doubt/${doubtId}/chat`);
  };

  const handleMarkResolved = async (doubtId) => {
    try {
      await doubtService.markDoubtAsResolved(doubtId);
      
      // Update the local state to move the doubt from newDoubts to solvedDoubts
      setNewDoubts(prevDoubts => {
        const resolvedDoubt = prevDoubts.find(d => d._id === doubtId);
        const updatedDoubts = prevDoubts.filter(d => d._id !== doubtId);
        
        if (resolvedDoubt) {
          setSolvedDoubts(prev => [...prev, { ...resolvedDoubt, status: 'resolved' }]);
        }
        
        return updatedDoubts;
      });

      // Show success message (if you have a toast notification system)
      // toast.success('Doubt marked as resolved');
    } catch (error) {
      console.error('Error marking doubt as resolved:', error);
      // Show error message
      // toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Teacher Profile Card */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo.avatar} />
                <AvatarFallback className="bg-emerald-400/10 text-emerald-400">
                  {userInfo.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold">Namaste {userInfo.username}!</h2>
                <RatingDisplay rating={parseFloat(userInfo.rating)} />
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 rounded-full">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">{userInfo.doubtsSolved} Doubts Solved</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* New Doubts Section */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400">New Doubts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newDoubts.map((doubt) => (
              <div 
                key={doubt._id} 
                className="flex flex-col p-6 rounded-lg border border-white/10 bg-black/20"
              >
                <div className="mb-4">
                  <h4 className="text-lg text-gray-300">{doubt.name}</h4>
                  <p className="text-sm text-gray-500">{doubt.topics.join(' › ')}</p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    onClick={() => handleJoinChat(doubt._id)}
                    className="px-6 py-2 bg-[#00FF9D]/10 text-l font-medium rounded-full border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Join Chat
                  </Button>
                  <Button 
                    onClick={() => handleMarkResolved(doubt._id)}
                    className="px-6 py-2 bg-[#00FF9D]/10 text-l font-medium rounded-full border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Previously Solved Doubts */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400">Solved Doubts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solvedDoubts.map((doubt) => (
                <div 
                  key={doubt._id}
                  className="p-4 rounded-lg border border-white/10 bg-black/20 text-gray-300"
                >
                  <p>{doubt.name}</p>
                  <p className="text-sm text-gray-500">{doubt.topics.join(' › ')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardContent className="flex justify-center p-6">
            <Link to="/create-quiz">
              <button className="px-8 py-3 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium rounded-xl hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Quiz
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
