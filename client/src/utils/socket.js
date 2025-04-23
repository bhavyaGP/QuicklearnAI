import { io } from 'socket.io-client';

const corsOptions = {
  origin: [`${import.meta.env.PROXY_API_URL}`, `${import.meta.env.SOCKET_URL}`],
  credentials: true,
  optionsSuccessStatus: 200
};

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
socket.io.opts.query = { cors: corsOptions };

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

export default socket;
