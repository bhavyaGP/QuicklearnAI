import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, UserCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, className }) => (
  <Card className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00FF9D]/30 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className="h-12 w-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-[#00FF9D]" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch - replace with actual API calls
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', status: 'active' },
        // Add more users as needed
      ]);
      
      setSubscriptions([
        { id: 1, user: 'John Doe', plan: 'Scholar', amount: 49, date: '2024-03-15' },
        { id: 2, user: 'Alice Brown', plan: 'Achiever', amount: 99, date: '2024-03-14' },
        // Add more subscriptions as needed
      ]);
      
      setTeacherRequests([
        { id: 1, name: 'Mark Wilson', experience: '5 years', subject: 'Mathematics', status: 'pending' },
        { id: 2, name: 'Sarah Lee', experience: '3 years', subject: 'Physics', status: 'pending' },
        // Add more requests as needed
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveTeacher = (id) => {
    // Implement teacher approval logic
    console.log('Approving teacher:', id);
  };

  const handleRejectTeacher = (id) => {
    // Implement teacher rejection logic
    console.log('Rejecting teacher:', id);
  };

  const handleUpdatePlan = (planId) => {
    // Implement plan update logic
    console.log('Updating plan:', planId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF9D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent"
          >
            Admin Dashboard
          </motion.h1>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Active Subscriptions" value={subscriptions.length} icon={DollarSign} />
          <StatCard title="Teacher Requests" value={teacherRequests.length} icon={UserCheck} />
          <StatCard title="Total Revenue" value="₹4,999" icon={DollarSign} />
        </motion.div>

        {/* Users List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#00FF9D]">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-[#00FF9D]">Name</TableHead>
                    <TableHead className="text-[#00FF9D]">Email</TableHead>
                    <TableHead className="text-[#00FF9D]">Role</TableHead>
                    <TableHead className="text-[#00FF9D]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-white/10">
                      <TableCell className="text-gray-300">{user.name}</TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-300">{user.role}</TableCell>
                      <TableCell className="text-gray-300">{user.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teacher Requests */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#00FF9D]">Teacher Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-[#00FF9D]">Name</TableHead>
                    <TableHead className="text-[#00FF9D]">Experience</TableHead>
                    <TableHead className="text-[#00FF9D]">Subject</TableHead>
                    <TableHead className="text-[#00FF9D]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherRequests.map((request) => (
                    <TableRow key={request.id} className="border-white/10">
                      <TableCell className="text-gray-300">{request.name}</TableCell>
                      <TableCell className="text-gray-300">{request.experience}</TableCell>
                      <TableCell className="text-gray-300">{request.subject}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          onClick={() => handleApproveTeacher(request.id)}
                          className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectTeacher(request.id)}
                          className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-[#00FF9D]">Subscription Plans</CardTitle>
              <Button
                onClick={() => handleUpdatePlan()}
                className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Update Plans
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-[#00FF9D]">User</TableHead>
                    <TableHead className="text-[#00FF9D]">Plan</TableHead>
                    <TableHead className="text-[#00FF9D]">Amount</TableHead>
                    <TableHead className="text-[#00FF9D]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-white/10">
                      <TableCell className="text-gray-300">{sub.user}</TableCell>
                      <TableCell className="text-gray-300">{sub.plan}</TableCell>
                      <TableCell className="text-gray-300">₹{sub.amount}</TableCell>
                      <TableCell className="text-gray-300">{sub.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;