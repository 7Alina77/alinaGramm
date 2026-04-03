import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { socketService } from './src/services/socket';
import { loadMessages, saveMessages, loadUser, removeUser } from './src/services/storage';
import { BOT_NAME, getBotResponse } from './src/constants/botResponses';
import { Message } from './src/types';
import { getMessageHistory } from './src/services/api';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [botEnabled, setBotEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  // Загрузка сохранённого пользователя
  useEffect(() => {
    const init = async () => {
      const savedUser = await loadUser();
      if (savedUser) {
        setUserId(savedUser.username);
        setIsLoggedIn(true);
        connectToServer(savedUser.username);
      }
    };
    init();
  }, []);

  const connectToServer = (username: string) => {
    const socket = socketService.connect(username);
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    
    socketService.onOnlineUsers((users: string[]) => {
      const otherUsers = users.filter(u => u !== username);
      if (botEnabled && otherUsers.length === 0) {
        setOnlineUsers([BOT_NAME]);
      } else {
        setOnlineUsers(otherUsers);
      }
    });
    
    socketService.onNewMessage((data) => {
      console.log('📩 onNewMessage ПОЛУЧЕНО от сервера:', data);
      
      const newMessage: Message = {
        id: data.id || Date.now().toString(),
        text: data.message || '',
        isMe: false,
        from: data.from,
        timestamp: data.timestamp,
        file: data.file,
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        if (selectedContact && selectedContact === data.from) {
          saveMessages(userId, selectedContact, updated);
        }
        return updated;
      });
    });
    
    socketService.onMessageSent((data) => {
      console.log('📩 onMessageSent ПОЛУЧЕНО от сервера:', data);
      
      const newMessage: Message = {
        id: data.id || Date.now().toString(),
        text: data.message || '',
        isMe: true,
        timestamp: data.timestamp,
        file: data.file,
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        if (selectedContact) {
          saveMessages(userId, selectedContact, updated);
        }
        return updated;
      });
      
      // Ответ бота ТОЛЬКО на текстовые сообщения
      if (botEnabled && selectedContact === BOT_NAME && data.message && data.message.trim()) {
        setTimeout(() => {
          const botResponse = getBotResponse();
          const botMessage: Message = {
            id: Date.now().toString() + 'bot',
            text: botResponse,
            isMe: false,
            from: BOT_NAME,
            timestamp: Date.now(),
          };
          setMessages(prev => {
            const updated = [...prev, botMessage];
            saveMessages(userId, BOT_NAME, updated);
            return updated;
          });
        }, 500);
      }
    });
    
    socketService.onMessageNotDelivered((data) => {
      Alert.alert('Не доставлено', `Сообщение для ${data.to} не доставлено`);
    });
    
    socketService.onDisconnect(() => {
      setIsConnected(false);
    });
  };

  const handleLogin = (username: string) => {
    if (userId === username) return;
    setUserId(username);
    setIsLoggedIn(true);
    connectToServer(username);
    usePushNotifications(userId);
  };

  const handleSelectContact = async (contact: string) => {
    setSelectedContact(contact);
    
    const serverMessages = await getMessageHistory(userId, contact);
    const localMessages = await loadMessages(userId, contact);
    const allMessages = [...serverMessages, ...localMessages];
    const uniqueMessages = allMessages.filter((msg, index, self) => 
      index === self.findIndex(m => m.id === msg.id)
    );
    uniqueMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    setMessages(uniqueMessages);
  };

  const handleSendMessage = (file?: any) => {
    console.log('📨 handleSendMessage вызван, file:', file);
    console.log('📨 selectedContact:', selectedContact);
    console.log('📨 inputText:', inputText);
    
    if (!selectedContact) {
      Alert.alert('Нет собеседника', 'Выберите пользователя из списка');
      return;
    }
    
    // Отправка файла без текста
    if (file && !inputText.trim()) {
      console.log('📨 Отправка только файла');
      const messageData = {
        to: selectedContact,
        from: userId,
        message: '',
        timestamp: Date.now(),
        file: {
          url: file.url,
          type: file.type,
          name: file.name,
        },
      };
      console.log('📨 messageData:', messageData);
      socketService.sendMessage(messageData);
      return;
    }
    
    // Если нет текста и нет файла
    if (inputText.trim().length === 0 && !file) return;
    
    // Переписка с ботом
    if (selectedContact === BOT_NAME) {
      const messageData = {
        to: selectedContact,
        from: userId,
        message: inputText,
        timestamp: Date.now(),
        file: file ? {
          url: file.url,
          type: file.type,
          name: file.name,
        } : undefined,
      };
      socketService.sendMessage(messageData);
      setInputText('');
      return;
    }

    usePushNotifications(userId);
    
    // Отправка реальному пользователю
    if (!isConnected) {
      Alert.alert('Нет подключения', 'Подождите, подключение к серверу...');
      return;
    }

    const messageData = {
      to: selectedContact,
      from: userId,
      message: inputText,
      timestamp: Date.now(),
      file: file ? {
        url: file.url,
        type: file.type,
        name: file.name,
      } : undefined,
    };

    socketService.sendMessage(messageData);
    setInputText('');
  };

  const handleBack = () => {
    setSelectedContact('');
    setMessages([]);
  };

  const handleLogout = async () => {
    socketService.disconnect();
    await removeUser();
    setIsLoggedIn(false);
    setSelectedContact('');
    setMessages([]);
    setOnlineUsers([]);
    setUserId('');
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        botEnabled={botEnabled}
        setBotEnabled={setBotEnabled}
      />
    );
  }

  if (!selectedContact) {
    return (
      <ContactsScreen
        userId={userId}
        isConnected={isConnected}
        onlineUsers={onlineUsers}
        botEnabled={botEnabled}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ChatScreen
      selectedContact={selectedContact}
      isConnected={isConnected}
      messages={messages}
      inputText={inputText}
      setInputText={setInputText}
      onSend={handleSendMessage}
      onBack={handleBack}
      userId={userId}
    />
  );
}