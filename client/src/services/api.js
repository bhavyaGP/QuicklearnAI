import axios from 'axios';
import { saveAs } from 'file-saver';

const api = axios.create({
  baseURL: import.meta.env.VITE_GEN_PROXY,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
const url = import.meta.env.VITE_API_URL;
console.log('GEN_PROXY URL:', url);
const api2 = axios.create({
  baseURL: import.meta.env.VITE_PROXY_API_URL ,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Modify the interceptor to handle both token types
api2.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          document.cookie = `authtoken=${token}; path=/`;
        }
      }
    } catch (error) {
      console.error('Error setting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const summaryService = {
  generateSummary: async (link) => {
    try {
      const response = await api2.post('/gen/api/quiz', {
        link,
        qno: 1,  // Default minimum questions since we only need summary
        difficulty: 'easy'  // Default difficulty
      });
      
      if (response.data && response.data.summary) {
        // Convert the summary object into an array of sentences
        const summaryPoints = Object.entries(response.data.summary).map(([topic, content]) => {
          return `${topic}: ${content}`;
        });
        
        return summaryPoints;
      } else {
        throw new Error('Summary not found in response');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to generate summary');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
};

export const quizService = {
  generateQuiz: async (link, qno, difficulty, model) => {
    try {
      const response = await api2.post('/gen/api/quiz', {
        link,
        qno,
        difficulty,
        model
      });
      if (!response.data || !response.data.questions || !response.data.summary) {
        throw new Error('Invalid response format from server');
      }

      // Handle all possible ways to get the topic
      const rawResponse = response.data;
      let topicName = rawResponse.topic_name || rawResponse.topic;
      
      // If no direct topic field, try to extract from summary
      if (!topicName && rawResponse.summary) {
        // Get the first topic key from summary (e.g., "Topic Life Guidance")
        const firstTopicKey = Object.keys(rawResponse.summary)[0];
        // Extract the topic name after "Topic " prefix
        topicName = firstTopicKey?.replace('Topic ', '') || 'Unknown Topic';
      }

      return {
        summary: rawResponse.summary,
        quiz: rawResponse.questions[difficulty],
        title: topicName
      };
    } catch (error) {
      console.error('Error in generateQuiz:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to generate quiz');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  },
};

export const statisticsService = {
  storeStatistics: async (statisticsData) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { _id, token } = JSON.parse(userInfo);
      if (!_id) {
        throw new Error('User ID not found');
      }

      // Added token to headers
      const response = await api2.post('/user/user/statistics', {
        pasturl: statisticsData.pasturl,
        score: statisticsData.score,
        totalscore: statisticsData.totalscore,
        topic: statisticsData.topic
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Store statistics error:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      // Use api2 instance which already handles the auth header
      const response = await api2.get('/user/user/showhistory');
      return response.data;
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  },
};

export const recommendationService = {
  getRecommendations: async () => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Use api2 instance with the correct endpoint
      const response = await api2.get('/gen/api/getonly', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `authtoken=${token}`
        },
        withCredentials: true
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch recommendations');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error(error.message || 'Error setting up request');
      }
    }
  },
};

export const documentService = {
  uploadPdf: async (file) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Get user token
      const userInfo = localStorage.getItem('user-info');
      let token = null;
      if (userInfo) {
        const { token: userToken } = JSON.parse(userInfo);
        token = userToken;
      }

      // Make request using api2 instance (which points to localhost:3000)
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to upload file');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  },
  
  queryDocument: async (query) => {
    try {
      const response = await api.post('/api/query', {
        query: query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to process query');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
};

export const userService = {
  uploadDoubt: async (data, type) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      const formData = new FormData();
      
      if (type === 'image') {
        formData.append('image', data); // Changed from 'file' to 'image'
      } else {
        formData.append('text', data);
      }
      formData.append('type', type);

      // Get the form data headers
      const formHeaders = {};
      if (type === 'image') {
        formHeaders['Content-Type'] = 'multipart/form-data';
      }

      const response = await api2.post('/user/user/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formHeaders
        },
        maxBodyLength: Infinity,
      });

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.error || 'Failed to upload doubt');
    }
  },

  matchDoubt: async (doubtId) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await api2.post(`/user/doubt/match/${doubtId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log(response);
      return {
        doubtId: response.data.doubtId,
        assignedTeacher: response.data.assignedTeacher,
        onlineteacher: response.data.onlineteacher
      };
    } catch (error) {
      console.error('Match doubt error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to match doubt');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  },
};

export const chatService = {
    joinChat: async (doubtId, userId, role) => {
        try {
            if (!doubtId || !userId || !role) {
                throw new Error('Missing required parameters');
            }

            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }

            const { token } = JSON.parse(userInfo);
            const response = await api2.post('/user/chat/join', {
                doubtId,
                userId,
                role
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Join chat error:', error);
            if (error.response) {
                throw new Error(error.response.data.error || 'Failed to join chat');
            }
            throw error;
        }
    },

    sendMessage: async (doubtId, sender, message) => {
        try {
            const userInfo = localStorage.getItem('user-info');
            const { token } = JSON.parse(userInfo);
            const response = await api2.post('/user/chat/send', {
                doubtId,
                sender,
                message
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    },

    getChatHistory: async (doubtId) => {
        try {
            if (!doubtId) {
                throw new Error('Doubt ID is required');
            }
            const userInfo = localStorage.getItem('user-info');
            const { token } = JSON.parse(userInfo);
            const response = await api2.get(`/user/chat/history/${doubtId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get chat history error:', error);
            throw error;
        }
    }
};

export const teacherService = {
    updateRating: async (teacherId, rating) => {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }

            const { token } = JSON.parse(userInfo);
            const response = await api2.post('/user/user/rating', {
                teacherId,
                rating
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Update rating error:', error);
            if (error.response) {
                throw new Error(error.response.data.error || 'Failed to update rating');
            }
            throw error;
        }
    },

    getRating: async (teacherId) => {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }

            const { token } = JSON.parse(userInfo);
            const response = await api2.get(`/user/teacher/${teacherId}/rating`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get rating error:', error);
            throw error;
        }
    }
};

export const quizRoomService = {
  createQuiz: async (topic, numQuestions, difficulty) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      const response = await api.post('/api/llm_quiz', {
        topic,
        num_questions:numQuestions,
        difficulty
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) { 
      console.error('Create quiz error:', error);
      throw error;
    }
  }
};

export const youtubeChatService = {
  askQuestion: async (link, model, question) => {
    try {
      const response = await api.post('/chat_trans', {
        link,
        model,
        question
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to get answer');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
};

export const doubtService = {
  markDoubtAsResolved: async (doubtId) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      const response = await api2.patch(`/user/doubt/${doubtId}/status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Mark doubt resolved error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to mark doubt as resolved');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
};

export const paperService = {
  uploadPaper: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/paper_upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Paper upload error:', error);
      throw error;
    }
  },

  generatePaper: async (filePath, numQuestions, numPapers) => {
    try {
      const response = await api.post(`/api/generate_paper`, {
        file_path: filePath,
        num_questions: numQuestions,
        num_papers: numPapers
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
        // Remove responseType: 'blob' since backend returns JSON
      });
      return response.data;
    } catch (error) {
      console.error('Paper generation error:', error);
      throw error;
    }
  },

  downloadPaper: async (paper, customFilename = null) => {
    try {
      // Extract just the filename from the full path
      const filename = paper.path.split('\\').pop().split('/').pop();
      
      // Download the specific PDF file using just the filename
      const response = await api.get(`/api/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob'
      });
      
      // Create download link for the blob data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = customFilename || paper.filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Paper download error:', error);
      throw error;
    }
  }
};

export const paymentService = {
  createOrder: async (orderData) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await api2.post('/user/user/api/payment', {
        membershipType: orderData.membershipType,
        name: orderData.name,
        email: orderData.email,
        contact: orderData.contact,
        duration: 30 // Default duration in days
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Order Creation Response:', response.data);
      
      // Check if the response has the required fields
      if (!response.data || !response.data.order_id) {
        console.error('Invalid order response structure:', response.data);
        throw new Error('Invalid order response from server');
      }
      
      // Return formatted order data
      return {
        id: response.data.order_id,
        amount: response.data.amount || 0,
        currency: response.data.currency || 'INR',
        description: response.data.description || `${orderData.membershipType} Membership - 30 days`,
        notes: {
          membershipType: orderData.membershipType,
          duration: 30, // Default duration in days
          name: orderData.name,
          email: orderData.email,
          contact: orderData.contact
        }
      };
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Verifying payment with data:', paymentData);

      const response = await api2.post('/user/user/api/verifypayment', {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        membershipType: paymentData.membershipType,
        
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }
};

export const questionBankService = {
  generateQuestionBank: async (topic) => {
    try {
      const response = await api.post('/api/question_bank', 
        { topic },
        { 
          responseType: 'blob', // Important: Set response type to blob for binary data
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Create and save the PDF file
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${topic.replace(/\s+/g, '_')}_Questions.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Question bank generation error:', error);
      if (error.response) {
        // Handle error response
        if (error.response.data instanceof Blob) {
          // If error response is also a blob, try to read it as text
          const text = await error.response.data.text();
          try {
            const errorObj = JSON.parse(text);
            throw new Error(errorObj.error || 'Failed to generate question bank');
          } catch {
            throw new Error('Failed to generate question bank');
          }
        } else {
          throw new Error(error.response.data.error || 'Failed to generate question bank');
        }
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
};

export const youtubeService = {
  getVideoRecommendations: async (topics) => {
    try {
      const response = await api.post(`/api/youtube_videos`, {
        topic: Array.isArray(topics) ? topics : [topics]
      });
      
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Handle different response structures
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.videos) {
        return response.data.videos;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        // If it's a direct object mapping
        return response.data;
      }
    } catch (error) {
      console.error('Error getting video recommendations:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to get video recommendations');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw error;
      }
    }
  }
};

export const adminService = {
    // Create an axios instance for admin requests
    api: axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    }),

    // Method to get all orders
    getOrders: async () => {
        try {
            // Get the auth token from localStorage
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }
            const { token } = JSON.parse(userInfo);

            const response = await axios.get(`${import.meta.env.VITE_PROXY_API_URL}/user/admin/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to fetch orders');
            } else if (error.request) {
                throw new Error('No response from server');
            } else {
                throw new Error('Error setting up request');
            }
        }
    },

    // Add this new method
    getOrderStats: async () => {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }
            const { token } = JSON.parse(userInfo);

            const response = await axios.get(`${import.meta.env.VITE_PROXY_API_URL}/user/admin/orders/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching order stats:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to fetch order statistics');
            } else if (error.request) {
                throw new Error('No response from server');
            } else {
                throw new Error('Error setting up request');
            }
        }
    },

    // Add this new method for pending teachers
    getPendingTeachers: async () => {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }
            const { token } = JSON.parse(userInfo);

            const response = await axios.get(`${import.meta.env.VITE_PROXY_API_URL}/user/admin/teachers/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching pending teachers:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to fetch pending teachers');
            } else if (error.request) {
                throw new Error('No response from server');
            } else {
                throw new Error('Error setting up request');
            }
        }
    },

    handleTeacherRequest: async (teacherId, action, reason) => {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (!userInfo) {
                throw new Error('User not authenticated');
            }
            const { token } = JSON.parse(userInfo);

            const response = await axios.post(
                `${import.meta.env.VITE_PROXY_API_URL}/user/admin/teachers/handle-request`,
                {
                    teacherId,
                    action, // 'approve' or 'reject'
                    reason
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error handling teacher request:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to process teacher request');
            } else if (error.request) {
                throw new Error('No response from server');
            } else {
                throw new Error('Error setting up request');
            }
        }
    }
};