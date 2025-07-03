import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, UserCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const { role } = JSON.parse(userInfo);
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders data
      const ordersData = await adminService.getOrders();
      setOrders(ordersData.orders || []);

      // Fetch stats data
      const statsData = await adminService.getOrderStats();
      setStats(statsData);

      // Fetch pending teachers data
      const teachersData = await adminService.getPendingTeachers();
      console.log('Pending Teachers Response:', teachersData);
      
      if (teachersData && teachersData.pendingTeachers) {
        setPendingTeachers(teachersData.pendingTeachers);
      } else {
        console.error('No pending teachers data:', teachersData);
        setPendingTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setPendingTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherAction = async (teacherId, action) => {
    if (action === 'approve') {
      setSelectedTeacher(teacherId);
      setShowApprovalModal(true);
    } else {
      await processTeacherRequest(teacherId, 'reject', 'Not qualified');
    }
  };

  const processTeacherRequest = async (teacherId, action, reason) => {
    try {
      setIsProcessing(true);
      await adminService.handleTeacherRequest(teacherId, action, reason);
      
      // Update the local state to remove the processed teacher
      setPendingTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
      
      toast.success(`Teacher ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowApprovalModal(false);
      setSelectedTeacher(null);
      setApprovalReason('');
    } catch (error) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdatePlan = (planId) => {
    // Implement plan update logic
    console.log('Updating plan:', planId);
  };

  // Approval Modal Component
  const ApprovalModal = () => {
    const textareaRef = useRef(null);
    
    useEffect(() => {
      if (showApprovalModal && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [showApprovalModal]);
    
    if (!showApprovalModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-semibold text-[#00FF9D] mb-4">
            Approve Teacher
          </h3>
          <textarea
            ref={textareaRef}
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Enter approval reason..."
            className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white mb-4 focus:outline-none focus:border-[#00FF9D]"
            rows="3"
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowApprovalModal(false);
                setSelectedTeacher(null);
                setApprovalReason('');
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={() => processTeacherRequest(selectedTeacher, 'approve', approvalReason)}
              className="px-4 py-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] rounded-lg hover:bg-[#00FF9D]/20"
              disabled={isProcessing || !approvalReason.trim()}
            >
              {isProcessing ? 'Processing...' : 'Approve'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF9D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded p-4 text-red-500">
          {error}
        </div>
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
          <StatCard title="Teacher Requests" value={pendingTeachers.length} icon={UserCheck} />
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
                    <TableHead className="text-[#00FF9D]">Email</TableHead>
                    <TableHead className="text-[#00FF9D]">Qualification</TableHead>
                    <TableHead className="text-[#00FF9D]">Experience</TableHead>
                    <TableHead className="text-[#00FF9D]">Subjects</TableHead>
                    <TableHead className="text-[#00FF9D]">Certifications</TableHead>
                    <TableHead className="text-[#00FF9D]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTeachers && pendingTeachers.length > 0 ? (
                    pendingTeachers.map((teacher) => (
                      <TableRow key={teacher._id} className="border-white/10">
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-3">
                            {teacher.avatar && (
                              <img 
                                src={teacher.avatar} 
                                alt={teacher.username}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span>{teacher.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{teacher.email}</TableCell>
                        <TableCell className="text-gray-300">{teacher.highestQualification}</TableCell>
                        <TableCell className="text-gray-300">{teacher.experience} years</TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(teacher.subject) && teacher.subject.map((sub, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs bg-black/40 rounded-full border border-[#00FF9D]/30"
                              >
                                {sub.field}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {teacher.certification?.map((cert, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs bg-black/40 rounded-full border border-[#00FF9D]/30"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            onClick={() => handleTeacherAction(teacher._id, 'approve')}
                            className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] hover:bg-[#00FF9D]/20"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleTeacherAction(teacher._id, 'reject')}
                            className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-4">
                        No pending teacher requests
                      </TableCell>
                    </TableRow>
                  )}
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

        {/* Orders Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-[#00FF9D]">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-black/50">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-800 hover:bg-black/40">
                        <td className="px-6 py-4">{order._id}</td>
                        <td className="px-6 py-4">{order.user?.email || 'N/A'}</td>
                        <td className="px-6 py-4">₹{order.amount / 100}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {orders.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  No orders found
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Approval Modal */}
      <ApprovalModal />
    </div>
  );
};

export default AdminDashboard;