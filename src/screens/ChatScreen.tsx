import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { InputBar } from '../components/InputBar';
import { socketService } from '../services/socket';
import { SERVER_URL } from '../constants/config';
import { BOT_NAME } from '../constants/botResponses';

interface Props {
  selectedContact: string;
  isConnected: boolean;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  onSend: (file?: any) => void;
  onBack: () => void;
  userId: string;
}

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  from?: string;
  timestamp?: number;
  file?: {
    url: string;
    type: string;
    name: string;
  };
}

export const ChatScreen: React.FC<Props> = ({
  selectedContact,
  isConnected,
  messages,
  inputText,
  setInputText,
  onSend,
  onBack,
  userId,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isFirstLoad = useRef(true);

  // Скролл к последнему сообщению
  const scrollToBottom = (animated = false) => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated });
    }
  };

  // Только при первой загрузке чата - скролл без анимации
  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      isFirstLoad.current = false;
      setTimeout(() => {
        scrollToBottom(false);
      }, 150);
    }
  }, []);

  // При новых сообщениях (не при первой загрузке)
  useEffect(() => {
    if (!isFirstLoad.current && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom(true);
      }, 50);
    }
  }, [messages.length]);

  // Отслеживаем позицию скролла для показа кнопки
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
    setShowScrollButton(offsetY > 100 && contentHeight > layoutHeight);
  };

  // Отправка файла
  const handleFileSelected = async (file: any) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    try {
      const response = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Вызываем onSend с данными файла
        onSend(data.file);
        setInputText('');
      } else {
        Alert.alert('Ошибка', 'Не удалось загрузить файл');
      }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      Alert.alert('Ошибка', 'Не удалось отправить файл');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{selectedContact}</Text>
          <Text style={styles.headerSubtitle}>
            {selectedContact === BOT_NAME ? 'онлайн 🤖' : (isConnected ? 'онлайн' : 'подключение...')}
          </Text>
        </View>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageBubble item={item} />}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {showScrollButton && (
        <TouchableOpacity style={styles.scrollButton} onPress={() => scrollToBottom(true)}>
          <Text style={styles.scrollButtonText}>↓</Text>
        </TouchableOpacity>
      )}

      <InputBar
        inputText={inputText}
        setInputText={setInputText}
        onSend={() => onSend()}
        onFileSelected={handleFileSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  scrollButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});