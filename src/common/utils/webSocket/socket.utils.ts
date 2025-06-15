import { Server } from 'socket.io';

/**
 * Broadcasts an event to all clients in a room, including the sender
 * @param server The socket.io server instance
 * @param roomId The room ID to broadcast to
 * @param event The event name
 * @param data The data to send
 */
export function broadcastToRoom<T>(
  server: Server,
  roomId: string,
  event: string,
  data?: T,
): void {
  if (data === undefined) {
    server.to(roomId).emit(event);
    return;
  }
  server.to(roomId).emit(event, data);
}
