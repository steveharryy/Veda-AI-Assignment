import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const setupSocketServer = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*', // Can be restricted to target frontend origins
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [WebSockets] Client connected. Socket ID: ${socket.id}`);

    // Join a room specifically for this assignment ID
    socket.on('join-assignment-room', (assignmentId: string) => {
      if (assignmentId) {
        socket.join(assignmentId);
        console.log(`🏠 [WebSockets] Socket ${socket.id} joined room for Assignment: ${assignmentId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [WebSockets] Client disconnected. Socket ID: ${socket.id}`);
    });
  });

  return io;
};

// Emits assignment-processing real-time status event with custom logs
export const emitAssignmentProcessing = (assignmentId: string, log?: string): void => {
  if (!io) {
    console.warn('⚠️ [WebSockets] Cannot emit processing: server not initialized.');
    return;
  }
  console.log(`📡 [WebSockets] Emitting processing status with log "${log || 'none'}" to room: ${assignmentId}`);
  io.to(assignmentId).emit('assignment-processing', { 
    assignmentId, 
    status: 'processing',
    log: log || 'Analyzing blueprints and parameters...',
    timestamp: new Date() 
  });
};

// Emits assignment-completed real-time event with paper payload
export const emitAssignmentCompleted = (assignmentId: string, paper: any): void => {
  if (!io) {
    console.warn('⚠️ [WebSockets] Cannot emit completion: server not initialized.');
    return;
  }
  console.log(`📡 [WebSockets] Emitting completion telemetry to room: ${assignmentId}`);
  io.to(assignmentId).emit('assignment-completed', { 
    assignmentId, 
    status: 'completed', 
    paper, 
    timestamp: new Date() 
  });
};

// Emits assignment-failed real-time event
export const emitAssignmentFailed = (assignmentId: string, error: string): void => {
  if (!io) {
    console.warn('⚠️ [WebSockets] Cannot emit failure: server not initialized.');
    return;
  }
  console.log(`📡 [WebSockets] Emitting failure notice to room: ${assignmentId}`);
  io.to(assignmentId).emit('assignment-failed', { 
    assignmentId, 
    status: 'failed', 
    error, 
    timestamp: new Date() 
  });
};
