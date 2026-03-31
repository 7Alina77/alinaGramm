// ⚠️ IP ВАШ!
//export const SERVER_URL = 'http://192.168.1.100:3000';
export const SERVER_URL = 'https://alinagramm-server-production.up.railway.app';

export const STORAGE_KEYS = {
  MESSAGES: (userId: string, contact: string) => `messages_${userId}_${contact}`,
  SAVED_USER: 'savedUser',
};