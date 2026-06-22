const subscriptions = new Map();

export function joinChannel(channelId, socket) {
  if (!subscriptions.has(channelId)) {
    subscriptions.set(channelId, new Set());
  }
  subscriptions.get(channelId).add(socket);
}

export function leaveChannel(channelId, socket) {
  subscriptions.get(channelId)?.delete(socket);
}

export function leaveAllChannels(socket) {
  subscriptions.forEach((sockets) => sockets.delete(socket));
}

export function broadcastToChannel(channelId, message) {
  const sockets = subscriptions.get(channelId);
  if (!sockets) return;

  sockets.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}