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