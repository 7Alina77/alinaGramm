import { SERVER_URL } from '../constants/config';

interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
  username?: string;
}

export const registerUser = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${SERVER_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data: ApiResponse = await response.json();
    
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Ошибка регистрации' };
    }
  } catch (error) {
    return { success: false, error: 'Не удалось подключиться к серверу' };
  }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data: ApiResponse = await response.json();
    
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Неверное имя или пароль' };
    }
  } catch (error) {
    return { success: false, error: 'Не удалось подключиться к серверу' };
  }
};

// Получение истории сообщений с сервера
export const getMessageHistory = async (user1: string, user2: string) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/messages/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user1, user2 }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.messages;
    }
    return [];
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

// Сохранение push-токена на сервере
export const savePushToken = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/users/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token }),
    });
    return await response.json();
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
  }
};