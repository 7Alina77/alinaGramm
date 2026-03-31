export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  from?: string;
  timestamp?: number;
}

export interface User {
  username: string;
  password?: string;
}

export interface MessageData {
  to: string;
  from: string;
  message: string;
  timestamp: number;
}