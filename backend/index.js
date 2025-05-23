import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './services/connectDB.js';
import dotenv from 'dotenv';
import codeRouter from './routes/codeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    // Enable reconnection
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle joining a room
  socket.on('join_room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Send existing code to new user
    socket.to(roomId).emit('request_code');
  });

  // Handle code updates
  socket.on('chatmessage', ({ roomId, message }) => {
    socket.to(roomId).emit('new_message', message);
  });

  // Handle sending code to requesting client
  socket.on('send_code', ({ roomId, code }) => {
    socket.to(roomId).emit('load_code', code);
  });

  // Handle code requests
  socket.on('request_code', () => {
    // You might want to get code from database here
    // and emit it back with 'send_code' event
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/code", codeRouter);
app.use("/ai", aiRouter);

// Start server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.IO ready for connections`);
});