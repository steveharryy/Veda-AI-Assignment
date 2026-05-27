import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { message } from 'antd';

export const useAssignmentSocket = (assignmentId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  
  const { 
    setGenerationStatus, 
    addGenerationLog, 
    setGeneratedPaper,
    addAssignment,
    setWizardStep
  } = useAssignmentStore();

  useEffect(() => {
    if (!assignmentId) return;

    console.log(`🔌 [WebSockets Hook] Connecting to backend server for Assignment: ${assignmentId}`);
    
    // Connect to WebSockets port 5000
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    // Join room specifically for this assignment
    socket.emit('join-assignment-room', assignmentId);

    // Event 1: Processing Started & Ticker updates
    socket.on('assignment-processing', (data: { assignmentId: string; status: string; log?: string }) => {
      setGenerationStatus('processing');
      const logMessage = data.log || 'Analyzing blueprints and course parameters...';
      addGenerationLog(logMessage);
    });

    // Event 2: Completion Telemetry (Success)
    socket.on('assignment-completed', (data: { assignmentId: string; status: string; paper: any }) => {
      console.log('📡 [WebSockets Hook] Assignment generation completed successfully!');
      
      setGeneratedPaper(data.paper);
      setGenerationStatus('completed');
      
      // Auto-append to assignments list locally so it displays in the grid immediately
      const parsedDate = data.paper.generatedAt 
        ? new Date(data.paper.generatedAt).toLocaleDateString('en-GB').replace(/\//g, '-')
        : new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
        
      addAssignment({
        id: assignmentId,
        title: data.paper.title.replace(' — AI Assessment Paper', ''),
        assignedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        dueDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-') // Fallback, will sync
      });

      message.success('Assessment successfully synthesized!');
      
      // Auto-redirect step index to Step 3 (Preview)
      setWizardStep(3);
      
      // Clean up room connection
      socket.disconnect();
    });

    // Event 3: Failure Notice (Error)
    socket.on('assignment-failed', (data: { assignmentId: string; status: string; error: string }) => {
      console.error('📡 [WebSockets Hook] Assignment generation encountered an error:', data.error);
      
      setGenerationStatus('failed');
      addGenerationLog(`❌ AI Synthesis Error: ${data.error}`);
      message.error(`Synthesis failed: ${data.error}`);
      
      socket.disconnect();
    });

    // Clean up socket connection on unmount or ID change
    return () => {
      if (socketRef.current) {
        console.log('🔌 [WebSockets Hook] Unmounting. Disconnecting Socket.io connection.');
        socketRef.current.disconnect();
      }
    };
  }, [assignmentId, setGenerationStatus, addGenerationLog, setGeneratedPaper, addAssignment, setWizardStep]);

  return socketRef.current;
};
