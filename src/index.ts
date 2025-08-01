import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './routes/v2/index.route';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

// Buat server HTTP terpisah
const server = createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Ganti dengan frontend URL saat production
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  (req as any).io = io;
  next();
});


// Routes
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ message: 'bagus aryaaaaaaaaaaaaa' });
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`🧩 Socket ${id} joined ${room}`);
});

app.get('/debug-notif', (req, res) => {
  const io = req.app.get('io');
  io.to('user-2').emit('newNotification', {
    message: 'Tes manual dari backend',
    type: 'like',
    threadId: 99,
  });
  res.send('Notif sent');
});


io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    const room = `user-${userId}`;
    socket.join(room);
    console.log(`✅ ${socket.id} joined room: ${room}`);
  });
  
  socket.on('joinRoom', (roomName) => {
  socket.join(roomName);
  console.log(`✅ ${socket.id} joined room: ${roomName}`);
});


  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
socket.on('joinRoom', (roomName) => {
  socket.join(roomName);
  console.log(`✅ ${socket.id} joined room: ${roomName}`);

  const sockets = io.sockets.adapter.rooms.get(roomName);
  console.log(`👥 Room ${roomName} sekarang berisi:`, sockets ? Array.from(sockets) : []);
});



});


// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
