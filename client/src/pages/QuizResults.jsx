import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores, studentNames } = location.state || {};
  const [studentsWithNames, setStudentsWithNames] = useState({});
  const [sortedStudents, setSortedStudents] = useState([]);
  
  useEffect(() => {
    // Get current user info from localStorage
    const currentUserInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
    
    // Create a mapping of student IDs to names
    const studentNames = {};
    if (scores) {
      Object.keys(scores).forEach(id => {
        if (id === currentUserInfo._id) {
          studentNames[id] = currentUserInfo.username || 'Unknown';
        } else {
          studentNames[id] = `Student ${id.slice(-4)}`;
        }
      });
    }
    
    setStudentsWithNames(studentNames);

    // Sort students by score in descending order
    const sorted = Object.entries(scores || {})
      .map(([id, score]) => ({
        id,
        name: studentNames[id] || `Student ${id.slice(-4)}`,
        score
      }))
      .sort((a, b) => b.score - a.score);
    
    setSortedStudents(sorted);
  }, [scores]);

  const getBadge = (index) => {
    switch(index) {
      case 0: return { emoji: '🏆', color: 'text-yellow-400', label: 'Gold' };
      case 1: return { emoji: '🥈', color: 'text-gray-400', label: 'Silver' };
      case 2: return { emoji: '🥉', color: 'text-orange-400', label: 'Bronze' };
      default: return null;
    }
  };

  const handleExportResults = () => {
    const csvContent = `Rank,Student ID,Name,Score,Badge\n${
      sortedStudents
        .map((student, index) => {
          const badge = getBadge(index);
          return `${index + 1},${student.id},${student.name},${student.score},${badge ? badge.label : ''}`
        })
        .join('\n')
    }`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_results.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto p-8">
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
              <p className="text-gray-400">Congratulations to our top performers!</p>
            </div>
            <Button
              onClick={handleExportResults}
              className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-12 flex justify-center items-end gap-4">
            {sortedStudents.slice(0, 3).map((student, index) => {
              const badge = getBadge(index);
              const podiumHeight = index === 0 ? 'h-32' : index === 1 ? 'h-24' : 'h-20';
              return (
                <motion.div
                  key={student.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-center mb-2">
                    <div className="text-4xl mb-1">{badge.emoji}</div>
                    <div className={`font-bold ${badge.color}`}>{student.name}</div>
                    <div className="text-sm text-gray-400">{student.score} points</div>
                  </div>
                  <motion.div
                    className={`w-24 ${podiumHeight} rounded-t-lg bg-[#00FF9D]/20 border-t-2 border-[#00FF9D]`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Student Name</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => {
                  const badge = getBadge(index);
                  return (
                    <motion.tr
                      key={student.id}
                      className="border-b border-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">#{index + 1}</span>
                          {badge && (
                            <span className={`${badge.color} text-xl`}>
                              {badge.emoji}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">{student.name}</td>
                      <td className="py-4 px-4">{student.score}</td>
                      <td className="py-4 px-4">
                        <span className={
                          student.score >= 7 ? 'text-green-400' :
                          student.score >= 5 ? 'text-yellow-400' :
                          'text-red-400'
                        }>
                          {student.score >= 7 ? 'Excellent' :
                           student.score >= 5 ? 'Good' :
                           'Needs Improvement'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-[#00FF9D]/10 rounded-lg">
            <h3 className="text-[#00FF9D] font-bold mb-2">Achievement Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                  🏆 Gold Medal
                </h4>
                <p className="text-sm text-gray-400">Top performer in the quiz</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <h4 className="text-gray-400 font-bold flex items-center gap-2">
                  🥈 Silver Medal
                </h4>
                <p className="text-sm text-gray-400">Second-best performance</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <h4 className="text-orange-400 font-bold flex items-center gap-2">
                  🥉 Bronze Medal
                </h4>
                <p className="text-sm text-gray-400">Third-best performance</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <h4 className="text-[#00FF9D] font-bold">Speed Demon</h4>
                <p className="text-sm text-gray-400">Answer correctly with {'>'}20s left (+150 points)</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/teacher-dashboard')}
            className="mt-8 flex items-center gap-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults; 