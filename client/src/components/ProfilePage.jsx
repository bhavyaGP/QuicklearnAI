import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from 'axios';
import { statisticsService } from '@/services/api';

const ProfilePage = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getStatistics();
        setStatistics(data || []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setStatistics([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Retrieve avatar from local storage
  const avatar = localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info')).avatar : '/default-avatar.png';

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
        <div className="text-red-400 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalQuizzes = statistics.length;
  const averageScore = statistics.length > 0
    ? Math.round(statistics.reduce((acc, stat) => acc + (stat.score / stat.totalscore * 100), 0) / totalQuizzes)
    : 0;

  // Get recent activities (last 5)
  const recentActivity = statistics
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-emerald-400/10 text-emerald-400">US</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Your Learning Journey</CardTitle>
              <CardDescription className="text-gray-400">
                Track your progress and achievements
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-emerald-400">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={averageScore} 
                  className="h-2 bg-black/50"
                />
                <p className="text-sm text-gray-400">
                  Average Score: {averageScore}%
                </p>
                <p className="text-sm text-gray-400">
                  Total Quizzes Completed: {totalQuizzes}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-emerald-400">Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(new Set(statistics.map(stat => stat.topic))).map((topic, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    • {topic}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="text-emerald-400">Recent Activity</CardTitle>
            <CardDescription>Your latest quiz results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-emerald-400">Topic</TableHead>
                  <TableHead className="text-emerald-400">Score</TableHead>
                  <TableHead className="text-emerald-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, index) => (
                  <TableRow key={index} className="border-white/10">
                    <TableCell className="text-gray-300">{activity.topic}</TableCell>
                    <TableCell className="text-gray-300">
                      {Math.round((activity.score / activity.totalscore) * 100)}%
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;