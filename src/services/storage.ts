import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';
import { STORAGE_KEYS } from '../constants/config';

export const saveMessages = async (userId: string, contact: string, messages: Message[]): Promise<void> => {
  try {
    const key = STORAGE_KEYS.MESSAGES(userId, contact);
    await AsyncStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.error('Ошибка сохранения сообщений:', error);
  }
};

export const loadMessages = async (userId: string, contact: string): Promise<Message[]> => {
  try {
    const key = STORAGE_KEYS.MESSAGES(userId, contact);
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
    return [];
  }
};

export const saveUser = async (username: string, password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_USER, JSON.stringify({ username, password }));
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
  }
};

export const loadUser = async (): Promise<{ username: string; password: string } | null> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_USER);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_USER);
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
  }
};