import { joinChannel, leaveChannel, broadcastToChannel } from './channelSubscriptions.js';

export function handleMessage(socket, data) {
  let parsed;

  try {
    parsed = JSON.parse(data);
  } catch {
    socket.send(JSON.stringify({ type: 'ERROR', payload: { message: 'Invalid JSON' } }));
    return;
  }

  const { type, payload } = parsed;
  switch (type) {

    case 'JOIN_CHANNEL': {
      joinChannel(payload.channelId, socket);
      socket.send(JSON.stringify({ type: 'JOINED', payload: { channelId: payload.channelId } }));
      break;
    }

    case 'LEAVE_CHANNEL': {
      leaveChannel(payload.channelId, socket);
      break;
    }

    case 'SEND_MESSAGE': {
      const outgoing = JSON.stringify({
        type: 'NEW_MESSAGE',
        payload: {
          channelId: payload.channelId,
          content: payload.content,
          senderId: payload.senderId,
          timestamp: Date.now()
        }
      });
      broadcastToChannel(payload.channelId, outgoing);
      break;
    }

    case 'TYPING_START': {
      broadcastToChannel(payload.channelId, JSON.stringify({
        type: 'TYPING_UPDATE',
        payload: { channelId: payload.channelId }
      }));
      break;
    }

    default:
      socket.send(JSON.stringify({ type: 'ERROR', payload: { message: `Unknown type: ${type}` } }));
  }
}