import { io, Socket } from 'socket.io-client';

// Singleton instance to prevent multiple connections
class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  public connect(token: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (!this.socket && !this.isConnecting) {
      this.isConnecting = true;
      // Connects to the same domain in production, or localhost in dev.
      // Adjust the URL if your WebSocket server is on a different domain.
      const SERVER_URL = import.meta.env.VITE_WEBSOCKET_URL || ''; 
      
      this.socket = io(SERVER_URL, {
        auth: { token }, // Pass Firebase Auth token
        transports: ['websocket'], // Prefer native WebSockets
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server:', this.socket?.id);
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('[Socket] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] Connection Error:', error);
        this.isConnecting = false;
      });
    }

    return this.socket!;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
