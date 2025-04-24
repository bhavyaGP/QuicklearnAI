const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const db = require('./connection');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const staticRoutes = require('./routes/static.routes');
const storestatisticRoutes = require('./routes/user.routes');
const doubtroutes = require('./routes/doubt.routes');
const chatRoutes = require('./routes/chat.routes');
const redis = require('./redis.connection');
const io = require('./socket.server');
const chatroutes = require('./routes/chat.routes');
const adminRoutes = require('./routes/admin.routes')
const morgan = require('morgan');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

app.get('/', (req, res) => {
    res.send({ message: 'ok' });
});

app.use(morgan("[:date[clf]] :method :url :status :res[content-length] - :response-time ms"));
app.use('/auth', authRoutes);
app.use('/', staticRoutes);
app.use('/user', storestatisticRoutes);
app.use('/doubt', doubtroutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
});