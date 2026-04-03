export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  from?: string;
  timestamp?: number;
  file?: {
    url: string;
    type: 'image' | 'document' | 'audio' | 'video';
    name: string;
    size?: number;
  };
}

export interface FileData {
  uri: string;
  type: string;
  name: string;
  size?: number;
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