import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/database';
import { setupSocketServer } from './sockets/socket.handler';
import { startGenerationWorker } from './workers/generation.worker';

// 1. Configure environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 2. Connect to MongoDB database
    await connectDatabase();

    // 3. Create HTTP Server wrapping Express App instance
    const server = http.createServer(app);

    // 4. Initialize Socket.io WebSockets broker
    setupSocketServer(server);
    console.log('💚 [WebSockets] Server mounted and bound to HTTP server.');

    // 5. Spin up background BullMQ Queue Workers
    startGenerationWorker();

    // 6. Listen on designated Port
    server.listen(PORT, () => {
      console.log(`🚀 ===================================================`);
      console.log(`🚀 VedaAI Platform Backend Server is running!`);
      console.log(`🚀 API Base URL:  http://localhost:${PORT}`);
      console.log(`🚀 WebSockets:    ws://localhost:${PORT}`);
      console.log(`🚀 Environment:   ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 ===================================================`);
    });
  } catch (error) {
    console.error('💥 Backend server failed to start:', error);
    process.exit(1);
  }
};

startServer();
