import { io } from 'socket.io-client';

console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL); // Debug log

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

export default socket;
