import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { socketService } from './src/services/socket';
import { loadMessages, saveMessages, loadUser, removeUser } from './src/services/storage';
import { BOT_NAME, getBotResponse } from './src/constants/botResponses';
import { Message } from './src/types';

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
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        isMe: false,
        from: data.from,
        timestamp: data.timestamp,
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
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        isMe: true,
        timestamp: data.timestamp,
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        if (selectedContact) {
          saveMessages(userId, selectedContact, updated);
        }
        return updated;
      });
      
      // Ответ бота
      if (botEnabled && selectedContact === BOT_NAME) {
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
    setUserId(username);
    setIsLoggedIn(true);
    connectToServer(username);
  };

  const handleSelectContact = async (contact: string) => {
    setSelectedContact(contact);
    const savedMessages = await loadMessages(userId, contact);
    setMessages(savedMessages);
  };

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;
    if (!selectedContact) {
      Alert.alert('Нет собеседника', 'Выберите пользователя из списка');
      return;
    }
    
    // Переписка с ботом
    if (selectedContact === BOT_NAME) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isMe: true,
        timestamp: Date.now(),
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        saveMessages(userId, BOT_NAME, updated);
        return updated;
      });
      setInputText('');
      
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
      return;
    }
    
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

  // Экран входа
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        botEnabled={botEnabled}
        setBotEnabled={setBotEnabled}
      />
    );
  }

  // Экран выбора собеседника
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

  // Экран чата
  return (
    <ChatScreen
      selectedContact={selectedContact}
      isConnected={isConnected}
      messages={messages}
      inputText={inputText}
      setInputText={setInputText}
      onSend={handleSendMessage}
      onBack={handleBack}
    />
  );
}