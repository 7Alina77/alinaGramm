import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Message } from '../types';
import { STORAGE_KEYS } from '../constants/config';

const isWeb = Platform.OS === 'web';

export const saveMessages = async (userId: string, contact: string, messages: Message[]): Promise<void> => {
  const key = STORAGE_KEYS.MESSAGES(userId, contact);
  const data = JSON.stringify(messages);
  
  try {
    if (isWeb) {
      localStorage.setItem(key, data);
    } else {
      await AsyncStorage.setItem(key, data);
    }
  } catch (error) {
    console.error('Ошибка сохранения сообщений:', error);
  }
};

export const loadMessages = async (userId: string, contact: string): Promise<Message[]> => {
  const key = STORAGE_KEYS.MESSAGES(userId, contact);
  
  try {
    if (isWeb) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } else {
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    }
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
    return [];
  }
};

export const saveUser = async (username: string, password: string): Promise<void> => {
  const data = JSON.stringify({ username, password });
  
  try {
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS.SAVED_USER, data);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_USER, data);
    }
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
  }
};

export const loadUser = async (): Promise<{ username: string; password: string } | null> => {
  try {
    if (isWeb) {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_USER);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } else {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_USER);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.removeItem(STORAGE_KEYS.SAVED_USER);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_USER);
    }
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
  }
};