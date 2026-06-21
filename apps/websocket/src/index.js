import { WebSocketServer } from 'ws';
import { handleMessage } from './msghandler.js';
import { leaveAllChannels } from './channelsubscriptions.js';

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`WS server running on ws://localhost:${PORT}`);

wss.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    handleMessage(socket, data.toString());
  });

  socket.on('close', () => {
    console.log('A user disconnected');
    leaveAllChannels(socket);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});