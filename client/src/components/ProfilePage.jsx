import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statisticsService } from '@/services/api';
import { Trophy, Target, BookOpen, Clock, ArrowUp, ArrowDown } from 'lucide-react';

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

  // Retrieve user info from local storage
  const userInfo = localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info')) : {};
  const avatar = userInfo.avatar || '/default-avatar.png';
  const name = String(userInfo.username);

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

  // Prepare data for charts
  const scoreHistory = statistics
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(stat => ({
      date: new Date(stat.createdAt).toLocaleDateString(),
      score: Math.round((stat.score / stat.totalscore) * 100),
      topic: stat.topic
    }));

  const topicDistribution = Array.from(new Set(statistics.map(stat => stat.topic)))
    .map(topic => {
      const topicStats = statistics.filter(stat => stat.topic === topic);
      return {
        topic,
        count: topicStats.length,
        averageScore: Math.round(
          topicStats.reduce((acc, stat) => acc + (stat.score / stat.totalscore * 100), 0) / topicStats.length
        )
      };
    });

  const COLORS = ['#00FF9D', '#00E5FF', '#00BFFF', '#009BFF', '#0077FF'];

  // Get performance trends
  const recentScores = scoreHistory.slice(-2);
  const scoreTrend = recentScores.length > 1
    ? recentScores[1].score - recentScores[0].score
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-4 bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-emerald-400/10 text-emerald-400">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{name}'s Dashboard</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your learning analytics and progress
                  </CardDescription>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{totalQuizzes}</p>
                  <p className="text-sm text-gray-400">Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{averageScore}%</p>
                  <p className="text-sm text-gray-400">Avg. Score</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats Cards */}
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-400/10 rounded-full">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Best Score</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...statistics.map(stat => Math.round((stat.score / stat.totalscore) * 100)), 0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-400/10 rounded-full">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Recent Trend</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">{Math.abs(scoreTrend)}%</p>
                    {scoreTrend !== 0 && (
                      scoreTrend > 0 
                        ? <ArrowUp className="ml-2 h-4 w-4 text-green-500" />
                        : <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-400/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Topics Covered</p>
                  <p className="text-2xl font-bold">{topicDistribution.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-400/10 rounded-full">
                  <Clock className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Quiz</p>
                  <p className="text-2xl font-bold">
                    {statistics.length > 0 
                      ? new Date(statistics[statistics.length - 1].createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Score Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scoreHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="date" stroke="#ffffff50" />
                        <YAxis stroke="#ffffff50" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '1px solid #ffffff20' 
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#00FF9D" 
                          strokeWidth={2}
                          dot={{ fill: '#00FF9D' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Topic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topicDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="topic" stroke="#ffffff50" />
                        <YAxis stroke="#ffffff50" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '1px solid #ffffff20' 
                          }}
                        />
                        <Bar dataKey="averageScore" fill="#00FF9D" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Topic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topicDistribution}
                          dataKey="count"
                          nameKey="topic"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {topicDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '1px solid #ffffff20' 
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Topic Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicDistribution.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{topic.topic}</span>
                          <span className="text-emerald-400">{topic.averageScore}%</span>
                        </div>
                        <Progress 
                          value={topic.averageScore} 
                          className="h-2 bg-black/50"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-black/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-emerald-400">Quiz History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-emerald-400">Date</TableHead>
                      <TableHead className="text-emerald-400">Topic</TableHead>
                      <TableHead className="text-emerald-400">Score</TableHead>
                      <TableHead className="text-emerald-400">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((stat, index, arr) => {
                        const currentScore = Math.round((stat.score / stat.totalscore) * 100);
                        const previousScore = index < arr.length - 1 
                          ? Math.round((arr[index + 1].score / arr[index + 1].totalscore) * 100)
                          : currentScore;
                        const trend = currentScore - previousScore;

                        return (
                          <TableRow key={index} className="border-white/10">
                            <TableCell className="text-gray-300">
                              {new Date(stat.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-gray-300">{stat.topic}</TableCell>
                            <TableCell className="text-gray-300">{currentScore}%</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {trend !== 0 && (
                                  trend > 0 
                                    ? <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                                    : <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                                )}
                                <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
                                  {trend !== 0 ? `${Math.abs(trend)}%` : '-'}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;