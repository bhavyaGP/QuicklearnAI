import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../utils/socket';

const StudentLobby = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [students, setStudents] = useState([]);
  const [hostName, setHostName] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
  const studentName = localStorage.getItem('quiz-student-name') || '';

  useEffect(() => {
    if (!userInfo || !roomId) return;

    // Make sure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join quiz room with student name
    socket.emit('join_quiz_room', {
      roomId,
      userId: userInfo._id,
      role: 'student',
      studentName: studentName // Add student name to payload
    });

    // Listen for room updates
    socket.on('room_update', (data) => {
      // Safely handle the data
      if (data && Array.isArray(data.students)) {
        setStudents(data.students);
      }
      
      if (data && data.teacherName) {
        setHostName(data.teacherName);
      }
    });

    // Listen for quiz start
    socket.on('quiz_questions', (questions) => {
      navigate(`/quiz-session/${roomId}`, { state: { questions } });
    });

    return () => {
      socket.off('room_update');
      socket.off('quiz_questions');
    };
  }, [roomId, userInfo, studentName, navigate]);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto p-8">
        {/* Unique Code Display */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-400">QUIZ CODE</h2>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl font-bold text-[#00FF9D] tracking-wider">
                {roomId}
              </span>
            </div>
          </div>
        </Card>

        {/* Students List */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-[#00FF9D]" />
            <h2 className="text-2xl font-semibold">Waiting Room</h2>
          </div>
          
          <div className="space-y-6">
            {/* Host */}
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-3">Host</h3>
              <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#00FF9D]/20 flex items-center justify-center text-[#00FF9D] font-bold">
                  {hostName ? hostName.charAt(0).toUpperCase() : 'T'}
                </div>
                <span>{hostName || 'Teacher'}</span>
              </div>
            </div>
            
            {/* Students */}
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-3">Students ({students.length})</h3>
              <div className="space-y-2">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-[#00FF9D]/20 flex items-center justify-center text-[#00FF9D] font-bold">
                        {student.name ? student.name.charAt(0).toUpperCase() : `S${index + 1}`}
                      </div>
                      <span>{student.name || `Student ${index + 1}`}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    Waiting for students to join...
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-400">
            <p>Waiting for the host to start the quiz...</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentLobby; 