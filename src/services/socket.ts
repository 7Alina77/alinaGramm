import io, { Socket } from 'socket.io-client';
import { SERVER_URL } from '../constants/config';
import { MessageData } from '../types';

export class SocketService {
  private socket: Socket | null = null;
  
  connect(username: string): Socket {
    this.socket = io(SERVER_URL);
    this.socket.on('connect', () => {
      console.log('Подключено к серверу');
      this.socket?.emit('register', username);
    });
    return this.socket;
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  getSocket(): Socket | null {
    return this.socket;
  }
  
  sendMessage(data: MessageData): void {
    if (this.socket) {
      this.socket.emit('privateMessage', data);
    }
  }
  
  onOnlineUsers(callback: (users: string[]) => void): void {
    this.socket?.on('onlineUsers', callback);
  }
  
  onNewMessage(callback: (data: any) => void): void {
    this.socket?.on('newMessage', callback);
  }
  
  onMessageSent(callback: (data: any) => void): void {
    this.socket?.on('messageSent', callback);
  }
  
  onMessageNotDelivered(callback: (data: any) => void): void {
    this.socket?.on('messageNotDelivered', callback);
  }
  
  onDisconnect(callback: () => void): void {
    this.socket?.on('disconnect', callback);
  }
}

export const socketService = new SocketService();