import { useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { savePushToken } from '../services/api';

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = (userId: string) => {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!userId) return;

    registerForPushNotificationsAsync(userId);

    // Слушатель входящих уведомлений
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Уведомление получено:', notification);
    });

    // Слушатель нажатия на уведомление
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Нажатие на уведомление:', response);
      const { data } = response.notification.request.content;
      if (data?.contact) {
        console.log('Переход в чат с:', data.contact);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [userId]);
};

async function registerForPushNotificationsAsync(userId: string) {
  if (!userId) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Сообщения',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  if (!Device.isDevice) {
    Alert.alert('Ошибка', 'Push-уведомления работают только на реальном устройстве');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert('Ошибка', 'Не удалось получить разрешение на отправку уведомлений');
    return;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    let token;
    if (projectId) {
      token = await Notifications.getExpoPushTokenAsync({ projectId });
    } else {
      token = await Notifications.getExpoPushTokenAsync();
    }
    
    console.log('📱 Expo Push Token:', token.data);
    
    await savePushToken(userId, token.data);
  } catch (error) {
    console.error('Ошибка получения push-токена:', error);
  }
}